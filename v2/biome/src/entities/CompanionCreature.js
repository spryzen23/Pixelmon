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
import {
  COMPANION_HEIGHT,
  getEntityY,
  isWalkablePosition,
} from '../world';

const FOLLOW_SPEED = 5;
const MIN_FOLLOW_DISTANCE = 0.95;
const TRAIL_DISTANCE = 1.6;
const MODEL_SCALE = 0.55;
const MODEL_URL = '/assets/shared/companion.glb';
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
    caveZone,
    modelRotation = [0, 0, -Math.PI / 2],
    playerRef,
    spawnPosition = companionStart,
  },
  ref
) {
  const companionRef = useRef();
  const movingRef = useRef(false);
  const previousY = useRef(spawnPosition[1]);
  const [isMoving, setIsMoving] = useState(false);

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
      currentPathId,
      caveZone
    );

    const distanceToTarget = companion.position.distanceTo(targetPosition);

    if (distanceToTarget > MIN_FOLLOW_DISTANCE) {
      const smoothing = 1 - Math.exp(-FOLLOW_SPEED * delta);
      const nextX =
        companion.position.x + (targetPosition.x - companion.position.x) * smoothing;
      const nextZ =
        companion.position.z + (targetPosition.z - companion.position.z) * smoothing;

      if (isWalkablePosition(nextX, nextZ, 0.35, currentPathId, caveZone)) {
        companion.position.x = nextX;
        companion.position.z = nextZ;
        setMoving(true);
      } else {
        setMoving(false);
      }

      companion.rotation.y = Math.atan2(
        targetPosition.x - companion.position.x,
        targetPosition.z - companion.position.z
      );
    } else {
      setMoving(false);
    }

    const targetY = getEntityY(
      companion.position.x,
      companion.position.z,
      COMPANION_HEIGHT,
      previousY.current,
      currentPathId,
      caveZone
    );
    companion.position.y = targetY;
    previousY.current = targetY;
  });

  return (
    <group
      ref={companionRef}
      position={spawnPosition}
    >
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[0.7, COMPANION_HEIGHT, 0.7]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>

      <ModelErrorBoundary
        resetKey={MODEL_URL}
        fallback={
          <VoxelFallback
            color="#ffd928"
            height={COMPANION_HEIGHT}
            width={0.7}
            depth={0.7}
          />
        }
      >
        <Suspense
          fallback={
            <VoxelFallback
              color="#ffd928"
              height={COMPANION_HEIGHT}
              width={0.7}
              depth={0.7}
            />
          }
        >
          <AnimatedModel
            url={MODEL_URL}
            actionName={isMoving ? 'Walk' : 'Idle'}
            fallbackActionName={isMoving ? ['Run', 'Walk', 'Idle'] : ['Idle', 'Walk']}
            position={[0, -COMPANION_HEIGHT / 2, 0]}
            rotation={modelRotation}
            scale={MODEL_SCALE}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
});

export default CompanionCreature;
