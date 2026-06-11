import { Box } from '@react-three/drei';
import {
  Suspense,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
import { lerpAngle } from '../game/animationUtils';
import {
  getPlayerActionFallbacks,
  getPlayerGroundY,
  getPlayerModelYOffset,
  resolvePlayerAction,
} from '../game/playerAnimation';
import { normalizePlayerStyle } from '../game/playerStyles';
import useKeyboardControls from '../hooks/useKeyboardControls';
import {
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_START,
  BIOME_BOUNDARY,
  VOXEL_SIZE,
  WATER_LEVEL,
  getEntityY,
  getTerrainSurfaceY,
  isWaterTile,
  isWalkablePosition,
} from '../game/world';

const MOVE_SPEED = 4.5;
const SPRINT_SPEED = 9.0;
const WATER_MOVE_MULTIPLIER = 0.72;
const WATER_BUOYANCY_SPEED = 5.5;
const HEIGHT_LERP_FACTOR = 0.32;
const HEIGHT_SNAP_EPSILON = 0.06;
const STEP_SAFETY_OFFSET = 0.05;
const ROTATION_SMOOTHING = 14;
const DISPLACE_EPSILON = 0.0008;
const MODEL_SCALE = 1;
const movement = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();

const Player = forwardRef(function Player(
  {
    currentPathId = 0,
    characterStyle = null,
    modelRotation = [0, 0, 0],
    spawnPosition = PLAYER_START,
  },
  ref
) {
  const playerRef = useRef();
  const movingRef = useRef(false);
  const previousY = useRef(PLAYER_START[1]);
  const previousXZ = useRef({ x: PLAYER_START[0], z: PLAYER_START[2] });
  const [isSprinting, setIsSprinting] = useState(false);
  const [actionName, setActionName] = useState('Idle');
  const actionNameRef = useRef('Idle');
  const selectedStyle = normalizePlayerStyle(characterStyle);
  const modelUrl = selectedStyle.modelUrl;
  const modelScale = selectedStyle.modelScale ?? MODEL_SCALE;
  const modelFitHeight = selectedStyle.fitHeight ?? PLAYER_HEIGHT * 0.92;
  const keys = useKeyboardControls();

  const vy = useRef(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const isCrouchingRef = useRef(false);
  const animInputRef = useRef({
    forwardInput: 0,
    strafeInput: 0,
    isJumping: false,
    isCrouching: false,
    isMoving: false,
    moveSpeedFactor: 1,
    lookAngle: 0,
    lookPitch: 0,
    vy: 0,
    actionName: 'Idle',
  });
  useImperativeHandle(ref, () => playerRef.current, []);

  const resolveGroundY = (x, z, previousY = playerRef.current?.position.y) =>
    getPlayerGroundY(x, z, modelFitHeight, previousY, currentPathId, getEntityY);

  useEffect(() => {
    if (!playerRef.current) {
      return;
    }

    const spawnX = spawnPosition[0];
    const spawnZ = spawnPosition[2];
    const spawnY = resolveGroundY(spawnX, spawnZ);

    playerRef.current.position.set(spawnX, spawnY, spawnZ);
    previousY.current = spawnY;
    previousXZ.current = { x: spawnX, z: spawnZ };
    vy.current = 0;
    setIsJumping(false);
  }, [spawnPosition, currentPathId]);

  useFrame(({ camera }, delta) => {
    if (!playerRef.current) {
      return;
    }

    const player = playerRef.current;
    const pressed = keys.current;

    const crouchActive = !!pressed.crouch;
    const sprintActive =
      !!pressed.sprint &&
      !crouchActive &&
      (pressed.forward || pressed.backward || pressed.left || pressed.right);
    if (crouchActive !== isCrouchingRef.current) {
      isCrouchingRef.current = crouchActive;
      setIsCrouching(crouchActive);
    }
    animInputRef.current.isCrouching = crouchActive;
    animInputRef.current.moveSpeedFactor = crouchActive
      ? 0.45
      : sprintActive
        ? 2.0
        : 1;

    const groundY = resolveGroundY(
      player.position.x,
      player.position.z,
      previousY.current
    );

    const airborne = isJumping || vy.current !== 0;

    if (!airborne && player.position.y <= groundY + 0.05) {
      if (pressed.jump) {
        vy.current = 5.2;
        setIsJumping(true);
        animInputRef.current.isJumping = true;
      } else {
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    }

    if (airborne || vy.current !== 0) {
      vy.current -= 14 * delta;
      player.position.y += vy.current * delta;
      animInputRef.current.isJumping = true;

      if (player.position.y <= groundY) {
        player.position.y = groundY;
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    } else {
      const surfaceY = getTerrainSurfaceY(
        player.position.x,
        player.position.z,
        currentPathId
      );
      const isInWater = isWaterTile(
        player.position.x,
        player.position.z,
        currentPathId
      );
      const isSubmerged = player.position.y < WATER_LEVEL;
      const targetY = resolveGroundY(
        player.position.x,
        player.position.z,
        previousY.current
      );

      if (isInWater || isSubmerged || surfaceY <= WATER_LEVEL) {
        const buoyantY = WATER_LEVEL + PLAYER_HEIGHT / 2;
        player.position.y = MathUtils.lerp(
          player.position.y,
          Math.max(targetY, buoyantY),
          Math.min(1, WATER_BUOYANCY_SPEED * delta)
        );
      } else if (Math.abs(player.position.y - targetY) <= HEIGHT_SNAP_EPSILON) {
        player.position.y = targetY;
      } else {
        player.position.y = MathUtils.lerp(
          player.position.y,
          targetY,
          HEIGHT_LERP_FACTOR
        );
      }

      previousY.current = targetY;
    }

    player.position.x = MathUtils.clamp(
      player.position.x,
      -BIOME_BOUNDARY,
      BIOME_BOUNDARY
    );
    player.position.z = MathUtils.clamp(
      player.position.z,
      -BIOME_BOUNDARY,
      BIOME_BOUNDARY
    );

    animInputRef.current.forwardInput =
      Number(pressed.forward) - Number(pressed.backward);
    animInputRef.current.strafeInput =
      Number(pressed.right) - Number(pressed.left);

    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;

    if (cameraForward.lengthSq() < 0.0001) {
      cameraForward.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
    }

    cameraForward.normalize();
    const cameraYaw = Math.atan2(cameraForward.x, cameraForward.z);

    // Relative look yaw and pitch for head tracking
    const camDir = new Vector3();
    camera.getWorldDirection(camDir);
    const cameraPitch = Math.asin(camDir.y);
    const lookAngle = MathUtils.euclideanModulo(cameraYaw - player.rotation.y + Math.PI, Math.PI * 2) - Math.PI;

    animInputRef.current.lookAngle = lookAngle;
    animInputRef.current.lookPitch = cameraPitch;
    animInputRef.current.vy = vy.current;

    const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING * delta);

    if (
      animInputRef.current.forwardInput === 0 &&
      animInputRef.current.strafeInput === 0
    ) {
      player.rotation.y = lerpAngle(
        player.rotation.y,
        cameraYaw,
        rotationAlpha * 0.7
      );
      player.rotation.y =
        MathUtils.euclideanModulo(player.rotation.y + Math.PI, Math.PI * 2) -
        Math.PI;

      if (movingRef.current) {
        movingRef.current = false;
      }

      if (isSprinting) {
        setIsSprinting(false);
      }

      const idleAction = resolvePlayerAction({
        jumping: isJumping,
        crouching: crouchActive,
        moving: false,
        hasMoveInput: false,
        sprinting: false,
      });
      animInputRef.current.isMoving = false;
      animInputRef.current.actionName = idleAction;
      if (idleAction !== actionNameRef.current) {
        actionNameRef.current = idleAction;
        setActionName(idleAction);
      }

      previousXZ.current.x = player.position.x;
      previousXZ.current.z = player.position.z;
      return;
    }

    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    cameraRight.y = 0;

    if (cameraRight.lengthSq() < 0.0001) {
      cameraRight.set(cameraForward.z, 0, -cameraForward.x);
    }

    cameraRight.normalize();

    movement
      .copy(cameraForward)
      .multiplyScalar(animInputRef.current.forwardInput)
      .addScaledVector(cameraRight, animInputRef.current.strafeInput);

    if (movement.lengthSq() > 1) {
      movement.normalize();
    }

    if (movement.lengthSq() > DISPLACE_EPSILON * 10) {
      const movementYaw = Math.atan2(movement.x, movement.z);
      player.rotation.y = lerpAngle(
        player.rotation.y,
        movementYaw,
        rotationAlpha
      );
      player.rotation.y =
        MathUtils.euclideanModulo(player.rotation.y + Math.PI, Math.PI * 2) -
        Math.PI;
    }

    const isInWater = isWaterTile(
      player.position.x,
      player.position.z,
      currentPathId
    );
    const isSubmerged = player.position.y < WATER_LEVEL;

    const currentMoveSpeed = crouchActive
      ? MOVE_SPEED * 0.45
      : sprintActive
        ? SPRINT_SPEED
        : MOVE_SPEED;

    movement.multiplyScalar(
      currentMoveSpeed *
      (isInWater || isSubmerged ? WATER_MOVE_MULTIPLIER : 1) *
      delta
    );

    const prevX = player.position.x;
    const prevZ = player.position.z;
    const nextX = MathUtils.clamp(
      prevX + movement.x,
      -BIOME_BOUNDARY,
      BIOME_BOUNDARY
    );
    const nextZ = MathUtils.clamp(
      prevZ + movement.z,
      -BIOME_BOUNDARY,
      BIOME_BOUNDARY
    );

    const currentGroundHeight = getTerrainSurfaceY(
      player.position.x,
      player.position.z,
      currentPathId
    );
    const nextGroundHeight = getTerrainSurfaceY(nextX, nextZ, currentPathId);
    const stepDelta = nextGroundHeight - currentGroundHeight;
    const canStepUp = stepDelta <= VOXEL_SIZE + STEP_SAFETY_OFFSET;
    const canEscapeWater =
      (isInWater || isSubmerged) &&
      nextGroundHeight <= currentGroundHeight + VOXEL_SIZE * 1.5;

    let actuallyMoved = false;

    if (
      canStepUp &&
      (isWalkablePosition(nextX, nextZ, PLAYER_RADIUS, currentPathId) ||
        canEscapeWater)
    ) {
      player.position.x = nextX;
      player.position.z = nextZ;
      actuallyMoved =
        Math.hypot(nextX - prevX, nextZ - prevZ) > DISPLACE_EPSILON;
    }

    if (!airborne && vy.current === 0) {
      const nextTargetY = resolveGroundY(
        player.position.x,
        player.position.z,
        previousY.current
      );

      if (isWaterTile(player.position.x, player.position.z, currentPathId)) {
        player.position.y = MathUtils.lerp(
          player.position.y,
          Math.max(nextTargetY, WATER_LEVEL + PLAYER_HEIGHT / 2 + VOXEL_SIZE),
          Math.min(1, WATER_BUOYANCY_SPEED * delta)
        );
      } else if (Math.abs(player.position.y - nextTargetY) <= HEIGHT_SNAP_EPSILON) {
        player.position.y = nextTargetY;
      } else {
        player.position.y = MathUtils.lerp(
          player.position.y,
          nextTargetY,
          HEIGHT_LERP_FACTOR
        );
      }

      previousY.current = nextTargetY;
    } else {
      previousY.current = player.position.y;
    }

    previousXZ.current.x = player.position.x;
    previousXZ.current.z = player.position.z;

    if (actuallyMoved !== movingRef.current) {
      movingRef.current = actuallyMoved;
    }

    if (sprintActive !== isSprinting) {
      setIsSprinting(sprintActive);
    }

    const hasMoveInput =
      animInputRef.current.forwardInput !== 0 ||
      animInputRef.current.strafeInput !== 0;
    const nextAction = resolvePlayerAction({
      jumping: isJumping || vy.current > 0.15,
      crouching: crouchActive,
      moving: actuallyMoved,
      hasMoveInput,
      sprinting: sprintActive && hasMoveInput,
    });
    animInputRef.current.isMoving = actuallyMoved;
    animInputRef.current.actionName = nextAction;
    if (nextAction !== actionNameRef.current) {
      actionNameRef.current = nextAction;
      setActionName(nextAction);
    }

  });

  const modelYOffset = getPlayerModelYOffset(modelFitHeight, isCrouching);
  const fallbackProps = {
    color: '#2364ff',
    height: PLAYER_HEIGHT,
    width: 0.65,
    depth: 0.65,
    position: [0, modelYOffset, 0],
    rotation: modelRotation,
    scale: 0.32,
  };

  return (
    <group ref={playerRef} position={spawnPosition}>
      <Box args={[0.65, PLAYER_HEIGHT, 0.65]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary resetKey={modelUrl} fallback={<VoxelFallback {...fallbackProps} />}>
        <Suspense fallback={<VoxelFallback {...fallbackProps} />}>
          <AnimatedModel
            key={modelUrl}
            url={modelUrl}
            actionName={actionName}
            fallbackActionName={getPlayerActionFallbacks(actionName)}
            fitToHeight={modelFitHeight}
            position={[0, modelYOffset, 0]}
            rotation={modelRotation}
            scale={modelScale}
            inputRef={animInputRef}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
});

export default Player;
