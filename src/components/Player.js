import { Box } from '@react-three/drei';
import {
  Suspense,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
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
const ROTATION_SMOOTHING = 14;
const MODEL_ROTATION = [-Math.PI / 2, 0, 0];
const MODEL_SCALE = 0.32;
const MODEL_URL = '/player.glb';
const movement = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();

function lerpAngle(from, to, alpha) {
  const angleDelta =
    MathUtils.euclideanModulo(to - from + Math.PI, Math.PI * 2) - Math.PI;

  return MathUtils.lerp(from, from + angleDelta, alpha);
}

const Player = forwardRef(function Player(_, ref) {
  const playerRef = useRef();
  const movingRef = useRef(false);
  const previousY = useRef(PLAYER_START[1]);
  const [isMoving, setIsMoving] = useState(false);
  const keys = useKeyboardControls();

  useImperativeHandle(ref, () => playerRef.current, []);

  useFrame(({ camera }, delta) => {
    if (!playerRef.current) {
      return;
    }

    const targetY = getEntityY(
      playerRef.current.position.x,
      playerRef.current.position.z,
      PLAYER_HEIGHT,
      previousY.current
    );
    playerRef.current.position.y = targetY;
    previousY.current = targetY;

    const player = playerRef.current;
    const pressed = keys.current;
    const forwardInput = Number(pressed.forward) - Number(pressed.backward);
    const strafeInput = Number(pressed.right) - Number(pressed.left);

    camera.getWorldDirection(cameraForward);
    cameraForward.y = 0;

    if (cameraForward.lengthSq() < 0.0001) {
      cameraForward.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
    }

    cameraForward.normalize();
    const cameraYaw = Math.atan2(cameraForward.x, cameraForward.z);
    const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING * delta);
    player.rotation.y = lerpAngle(player.rotation.y, cameraYaw, rotationAlpha);

    if (forwardInput === 0 && strafeInput === 0) {
      if (movingRef.current) {
        movingRef.current = false;
        setIsMoving(false);
      }
      return;
    }

    if (!movingRef.current) {
      movingRef.current = true;
      setIsMoving(true);
    }

    cameraRight.set(1, 0, 0).applyQuaternion(camera.quaternion);
    cameraRight.y = 0;

    if (cameraRight.lengthSq() < 0.0001) {
      cameraRight.set(cameraForward.z, 0, -cameraForward.x);
    }

    cameraRight.normalize();

    movement
      .copy(cameraForward)
      .multiplyScalar(forwardInput)
      .addScaledVector(cameraRight, strafeInput);

    if (movement.lengthSq() > 1) {
      movement.normalize();
    }

    movement.multiplyScalar(MOVE_SPEED * delta);

    const nextX = clampToWorld(
      player.position.x + movement.x,
      PLAYER_RADIUS
    );
    const nextZ = clampToWorld(
      player.position.z + movement.z,
      PLAYER_RADIUS
    );

    if (isWalkablePosition(nextX, nextZ, PLAYER_RADIUS)) {
      player.position.x = nextX;
      player.position.z = nextZ;
    }

    const nextTargetY = getEntityY(
      player.position.x,
      player.position.z,
      PLAYER_HEIGHT,
      previousY.current
    );
    player.position.y = nextTargetY;
    previousY.current = nextTargetY;
  });

  return (
    <group
      ref={playerRef}
      position={PLAYER_START}
    >
      <Box args={[0.65, PLAYER_HEIGHT, 0.65]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary
        resetKey={MODEL_URL}
        fallback={
          <VoxelFallback
            color="#2364ff"
            height={PLAYER_HEIGHT}
            width={0.65}
            depth={0.65}
          />
        }
      >
        <Suspense
          fallback={
            <VoxelFallback
              color="#2364ff"
              height={PLAYER_HEIGHT}
              width={0.65}
              depth={0.65}
            />
          }
        >
          <AnimatedModel
            url={MODEL_URL}
            actionName={isMoving ? 'Walk' : 'Idle'}
            fallbackActionName={isMoving ? ['Run', 'Walk', 'Idle'] : ['Idle', 'Walk']}
            position={[0, -PLAYER_HEIGHT / 2, 0]}
            rotation={MODEL_ROTATION}
            scale={MODEL_SCALE}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
});

export default Player;
