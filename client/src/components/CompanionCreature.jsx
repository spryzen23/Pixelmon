import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  Suspense,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
import { lerpAngle } from '../game/animationUtils';
import useKeyboardControls from '../hooks/useKeyboardControls';
import {
  COMPANION_HEIGHT,
  getEntityY,
  isWalkablePosition,
} from '../game/world';

const FOLLOW_SPEED = 5;
const MIN_FOLLOW_DISTANCE = 0.95;
const TRAIL_DISTANCE = 1.6;
const ROTATION_SMOOTHING = 12;
const DISPLACE_EPSILON = 0.0008;
const MODEL_SCALE = 0.25;
const DEFAULT_MODEL_URL = '/assets/companion.glb';
const companionStart = [
  -8.5,
  getEntityY(-8.5, -6.8, COMPANION_HEIGHT),
  -6.8,
];
const targetPosition = new Vector3();
const playerForward = new Vector3();

const CompanionCreature = forwardRef(function CompanionCreature(
  {
    currentPathId = 0,
    modelRotation = [0, Math.PI / 2, 0],
    modelUrl = DEFAULT_MODEL_URL,
    playerRef,
    spawnPosition = companionStart,
  },
  ref
) {
  const companionRef = useRef();
  const movingRef = useRef(false);
  const previousY = useRef(spawnPosition[1]);
  const vy = useRef(0);
  const animInputRef = useRef({
    forwardInput: 0,
    strafeInput: 0,
    isJumping: false,
    isCrouching: false,
    moveSpeedFactor: 1,
  });
  const [isMoving, setIsMoving] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isCrouching, setIsCrouching] = useState(false);
  const keys = useKeyboardControls();

  useImperativeHandle(ref, () => companionRef.current, []);

  const setMoving = (moving) => {
    if (movingRef.current === moving) {
      return;
    }

    movingRef.current = moving;
    setIsMoving(moving);
  };

  useFrame((_, delta) => {
    const player = playerRef.current;
    const companion = companionRef.current;

    if (!player || !companion) {
      return;
    }

    const pressed = keys.current;
    const crouchActive = !!pressed.crouch;
    setIsCrouching(crouchActive);
    animInputRef.current.isCrouching = crouchActive;

    const groundY = getEntityY(
      companion.position.x,
      companion.position.z,
      COMPANION_HEIGHT,
      previousY.current,
      currentPathId
    );

    if (companion.position.y <= groundY + 0.05) {
      if (pressed.jump && !isJumping && player.position.y > groundY + 0.1) {
        vy.current = 4.2;
        setIsJumping(true);
        animInputRef.current.isJumping = true;
      } else {
        companion.position.y = groundY;
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    } else {
      vy.current -= 14 * delta;
      companion.position.y += vy.current * delta;
      animInputRef.current.isJumping = true;

      if (companion.position.y <= groundY) {
        companion.position.y = groundY;
        vy.current = 0;
        setIsJumping(false);
        animInputRef.current.isJumping = false;
      }
    }

    playerForward
      .set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y))
      .normalize();

    targetPosition
      .copy(player.position)
      .addScaledVector(playerForward, -TRAIL_DISTANCE);
    targetPosition.y = getEntityY(
      targetPosition.x,
      targetPosition.z,
      COMPANION_HEIGHT,
      undefined,
      currentPathId
    );

    const distanceToTarget = companion.position.distanceTo(targetPosition);
    const prevX = companion.position.x;
    const prevZ = companion.position.z;

    if (distanceToTarget > MIN_FOLLOW_DISTANCE) {
      const smoothing = 1 - Math.exp(-FOLLOW_SPEED * delta);
      const nextX =
        companion.position.x + (targetPosition.x - companion.position.x) * smoothing;
      const nextZ =
        companion.position.z + (targetPosition.z - companion.position.z) * smoothing;

      if (isWalkablePosition(nextX, nextZ, 0.35, currentPathId)) {
        companion.position.x = nextX;
        companion.position.z = nextZ;

        const dx = nextX - prevX;
        const dz = nextZ - prevZ;
        const moved = Math.hypot(dx, dz) > DISPLACE_EPSILON;

        if (moved) {
          const targetYaw = Math.atan2(dx, dz);
          const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING * delta);
          companion.rotation.y = lerpAngle(
            companion.rotation.y,
            targetYaw,
            rotationAlpha
          );
          animInputRef.current.forwardInput = 1;
        }

        setMoving(moved);
      } else {
        setMoving(false);
        animInputRef.current.forwardInput = 0;
      }
    } else {
      setMoving(false);
      animInputRef.current.forwardInput = 0;
    }

    animInputRef.current.strafeInput =
      Number(pressed.right) - Number(pressed.left);
    animInputRef.current.moveSpeedFactor = movingRef.current
      ? FOLLOW_SPEED / 4.5
      : 1;

    if (!movingRef.current) {
      animInputRef.current.forwardInput =
        Number(pressed.forward) - Number(pressed.backward);
    }

    if (!isMoving && vy.current === 0) {
      const targetY = getEntityY(
        companion.position.x,
        companion.position.z,
        COMPANION_HEIGHT,
        previousY.current,
        currentPathId
      );
      companion.position.y = targetY;
    }

    previousY.current = companion.position.y;
  });

  const modelYOffset = -COMPANION_HEIGHT / 2 + (isCrouching ? -0.12 : 0);
  const fallbackProps = {
    color: '#ffd928',
    height: COMPANION_HEIGHT,
    width: 0.7,
    depth: 0.7,
    position: [0, modelYOffset, 0],
    rotation: modelRotation,
    scale: MODEL_SCALE,
  };

  return (
    <group ref={companionRef} position={spawnPosition}>
      <Box args={[0.7, COMPANION_HEIGHT, 0.7]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary resetKey={modelUrl} fallback={<VoxelFallback {...fallbackProps} />}>
        <Suspense fallback={<VoxelFallback {...fallbackProps} />}>
          <AnimatedModel
            url={modelUrl}
            actionName={isMoving ? 'Walk' : 'Idle'}
            fallbackActionName={isMoving ? ['Run', 'Walk', 'Idle'] : ['Idle', 'Walk']}
            position={[0, modelYOffset, 0]}
            rotation={modelRotation}
            scale={MODEL_SCALE}
            inputRef={animInputRef}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
});

export default CompanionCreature;
