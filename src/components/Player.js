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
const TURN_SPEED = 2.8;
const MODEL_ROTATION = [-Math.PI / 2, 0, 0];
const MODEL_SCALE = 0.32;
const MODEL_URL = '/player.glb';
const movement = new Vector3();

const Player = forwardRef(function Player(_, ref) {
  const playerRef = useRef();
  const movingRef = useRef(false);
  const [isMoving, setIsMoving] = useState(false);
  const keys = useKeyboardControls();

  useImperativeHandle(ref, () => playerRef.current, []);

  useFrame((_, delta) => {
    if (!playerRef.current) {
      return;
    }

    const targetY = getEntityY(
      playerRef.current.position.x,
      playerRef.current.position.z,
      PLAYER_HEIGHT
    );
    playerRef.current.position.y = MathUtils.lerp(
      playerRef.current.position.y,
      targetY,
      0.15
    );

    const player = playerRef.current;
    const pressed = keys.current;
    const turnInput = Number(pressed.right) - Number(pressed.left);
    const driveInput = Number(pressed.forward) - Number(pressed.backward);

    if (turnInput !== 0) {
      player.rotation.y += turnInput * TURN_SPEED * delta;
    }

    if (driveInput === 0) {
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

    const step = MOVE_SPEED * driveInput * delta;
    movement.set(
      Math.sin(player.rotation.y) * step,
      0,
      Math.cos(player.rotation.y) * step
    );

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
      PLAYER_HEIGHT
    );
    player.position.y = MathUtils.lerp(
      player.position.y,
      nextTargetY,
      0.15
    );
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
