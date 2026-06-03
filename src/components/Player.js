import { Box } from '@react-three/drei';
import {
  Suspense,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
import { lerpAngle } from '../game/animationUtils';
import useKeyboardControls from '../hooks/useKeyboardControls';
import {
  PLAYER_HEIGHT,
  PLAYER_RADIUS,
  PLAYER_START,
  clampToWorld,
  getEntityY,
  isWalkablePosition,
} from '../game/world';

const MOVE_SPEED = 4.5;
const SPRINT_SPEED = 9.0;
const ROTATION_SMOOTHING = 14;
const DISPLACE_EPSILON = 0.0008;
const MODEL_ROTATION = [0, 0, 0];
const MODEL_SCALE = 0.32;
const MODEL_URL = '/player.glb';
const movement = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();

const Player = forwardRef(function Player(_, ref) {
  const playerRef = useRef();
  const movingRef = useRef(false);
  const previousY = useRef(PLAYER_START[1]);
  const previousXZ = useRef({ x: PLAYER_START[0], z: PLAYER_START[2] });
  const [isMoving, setIsMoving] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const keys = useKeyboardControls();

  const vy = useRef(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const animInputRef = useRef({
    forwardInput: 0,
    strafeInput: 0,
    isJumping: false,
    isCrouching: false,
    moveSpeedFactor: 1,
  });

  useImperativeHandle(ref, () => playerRef.current, []);

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
    setIsCrouching(crouchActive);
    animInputRef.current.isCrouching = crouchActive;
    animInputRef.current.moveSpeedFactor = crouchActive
      ? 0.45
      : sprintActive
        ? 2.0
        : 1;

    const groundY = getEntityY(
      player.position.x,
      player.position.z,
      PLAYER_HEIGHT,
      previousY.current
    );

    if (player.position.y <= groundY + 0.05) {
      if (pressed.jump && !isJumping) {
        vy.current = 5.2;
        setIsJumping(true);
        animInputRef.current.isJumping = true;
      } else {
        player.position.y = groundY;
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    } else {
      vy.current -= 14 * delta;
      player.position.y += vy.current * delta;
      animInputRef.current.isJumping = true;

      if (player.position.y <= groundY) {
        player.position.y = groundY;
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    }

    previousY.current = player.position.y;

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
    const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING * delta);

    if (
      animInputRef.current.forwardInput === 0 &&
      animInputRef.current.strafeInput === 0
    ) {
      player.rotation.y = lerpAngle(
        player.rotation.y,
        cameraYaw,
        rotationAlpha * 0.25
      );

      if (movingRef.current) {
        movingRef.current = false;
        setIsMoving(false);
      }

      if (isSprinting) {
        setIsSprinting(false);
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
    }

    const currentMoveSpeed = crouchActive
      ? MOVE_SPEED * 0.45
      : sprintActive
        ? SPRINT_SPEED
        : MOVE_SPEED;
    movement.multiplyScalar(currentMoveSpeed * delta);

    const prevX = player.position.x;
    const prevZ = player.position.z;
    const nextX = clampToWorld(prevX + movement.x, PLAYER_RADIUS);
    const nextZ = clampToWorld(prevZ + movement.z, PLAYER_RADIUS);

    let actuallyMoved = false;

    if (isWalkablePosition(nextX, nextZ, PLAYER_RADIUS)) {
      player.position.x = nextX;
      player.position.z = nextZ;
      actuallyMoved =
        Math.hypot(nextX - prevX, nextZ - prevZ) > DISPLACE_EPSILON;
    }

    const nextTargetY = getEntityY(
      player.position.x,
      player.position.z,
      PLAYER_HEIGHT,
      previousY.current
    );

    if (vy.current === 0 && !isJumping) {
      player.position.y = nextTargetY;
    }

    previousY.current = player.position.y;
    previousXZ.current.x = player.position.x;
    previousXZ.current.z = player.position.z;

    if (actuallyMoved !== movingRef.current) {
      movingRef.current = actuallyMoved;
      setIsMoving(actuallyMoved);
    }

    if (sprintActive !== isSprinting) {
      setIsSprinting(sprintActive);
    }
  });

  const modelYOffset = -PLAYER_HEIGHT / 2 + (isCrouching ? -0.22 : 0);
  const fallbackProps = {
    color: '#2364ff',
    height: PLAYER_HEIGHT,
    width: 0.65,
    depth: 0.65,
    position: [0, modelYOffset, 0],
    rotation: MODEL_ROTATION,
    scale: MODEL_SCALE,
  };

  return (
    <group ref={playerRef} position={PLAYER_START}>
      <Box args={[0.65, PLAYER_HEIGHT, 0.65]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary resetKey={MODEL_URL} fallback={<VoxelFallback {...fallbackProps} />}>
        <Suspense fallback={<VoxelFallback {...fallbackProps} />}>
          <AnimatedModel
            url={MODEL_URL}
            actionName={
              isMoving ? (isSprinting ? 'Run' : 'Walk') : 'Idle'
            }
            fallbackActionName={isMoving ? ['Run', 'Walk', 'Idle'] : ['Idle', 'Walk']}
            position={[0, modelYOffset, 0]}
            rotation={MODEL_ROTATION}
            scale={MODEL_SCALE}
            inputRef={animInputRef}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
});

export default Player;
