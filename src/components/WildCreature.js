import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
import {
  WILD_CREATURE_HEIGHT,
  getEntityY,
  isWalkablePosition,
} from '../game/world';

const WANDER_RADIUS = 4;
const WANDER_SPEED = 1.35;
const FLEE_SPEED = 5.5;
const FLEE_DURATION = 2;
const ARRIVAL_DISTANCE = 0.08;
const MODEL_ROTATION = [-Math.PI / 2, 0, 0];
const MODEL_SCALE = 0.25;
const MODEL_URL = '/wild_creature.glb';
const direction = new Vector3();

function WildFallback() {
  return (
    <VoxelFallback
      color="#dc2f32"
      height={WILD_CREATURE_HEIGHT}
      width={0.75}
      depth={0.75}
    />
  );
}

function randomPause() {
  return 1.5 + Math.random() * 2.5;
}

function randomNearbyTarget(origin) {
  for (let attempts = 0; attempts < 30; attempts += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 1 + Math.random() * WANDER_RADIUS;
    const x = origin.x + Math.cos(angle) * distance;
    const z = origin.z + Math.sin(angle) * distance;

    if (isWalkablePosition(x, z, 0.45)) {
      return new Vector3(x, getEntityY(x, z, WILD_CREATURE_HEIGHT), z);
    }
  }

  return origin.clone();
}

export default function WildCreature({
  id,
  initialPosition,
  onFleeComplete,
  playerRef,
  registerRef,
  status = 'active',
}) {
  const creatureRef = useRef();
  const fleeTimer = useRef(0);
  const previousY = useRef(initialPosition[1]);
  const start = useMemo(() => new Vector3(...initialPosition), [initialPosition]);
  const ai = useRef({
    mode: 'pause',
    pauseTimer: randomPause(),
    target: start.clone(),
  });

  useEffect(() => {
    registerRef(id, creatureRef.current);

    return () => registerRef(id, null);
  }, [id, registerRef]);

  useEffect(() => {
    if (status === 'fleeing') {
      fleeTimer.current = 0;
    }
  }, [status]);

  useFrame((_, delta) => {
    const creature = creatureRef.current;

    if (!creature) {
      return;
    }

    creature.position.y = getEntityY(
      creature.position.x,
      creature.position.z,
      WILD_CREATURE_HEIGHT,
      previousY.current
    );
    previousY.current = creature.position.y;

    if (status === 'capturing') {
      return;
    }

    if (status === 'fleeing') {
      const player = playerRef.current;
      fleeTimer.current += delta;

      if (player) {
        direction.copy(creature.position).sub(player.position);
        direction.y = 0;

        if (direction.lengthSq() < 0.001) {
          direction.set(Math.random() - 0.5, 0, Math.random() - 0.5);
        }

        direction.normalize();
        creature.rotation.y = Math.atan2(direction.x, direction.z);

        const nextX = creature.position.x + direction.x * FLEE_SPEED * delta;
        const nextZ = creature.position.z + direction.z * FLEE_SPEED * delta;

        if (isWalkablePosition(nextX, nextZ, 0.45)) {
          creature.position.x = nextX;
          creature.position.y = getEntityY(
            nextX,
            nextZ,
            WILD_CREATURE_HEIGHT,
            previousY.current
          );
          previousY.current = creature.position.y;
          creature.position.z = nextZ;
        }
      }

      if (fleeTimer.current >= FLEE_DURATION) {
        onFleeComplete(id);
      }

      return;
    }

    if (ai.current.mode === 'pause') {
      ai.current.pauseTimer -= delta;

      if (ai.current.pauseTimer <= 0) {
        ai.current.target.copy(randomNearbyTarget(creature.position));
        ai.current.mode = 'walk';
      }

      return;
    }

    direction.copy(ai.current.target).sub(creature.position);

    if (direction.length() <= ARRIVAL_DISTANCE) {
      ai.current.mode = 'pause';
      ai.current.pauseTimer = randomPause();
      return;
    }

    direction.normalize();
    creature.rotation.y = Math.atan2(direction.x, direction.z);

    const nextX = creature.position.x + direction.x * WANDER_SPEED * delta;
    const nextZ = creature.position.z + direction.z * WANDER_SPEED * delta;

    if (isWalkablePosition(nextX, nextZ, 0.45)) {
      creature.position.x = nextX;
      creature.position.y = getEntityY(
        nextX,
        nextZ,
        WILD_CREATURE_HEIGHT,
        previousY.current
      );
      previousY.current = creature.position.y;
      creature.position.z = nextZ;
    } else {
      ai.current.mode = 'pause';
      ai.current.pauseTimer = randomPause();
    }
  });

  return (
    <group
      ref={creatureRef}
      position={initialPosition}
      visible={status !== 'capturing'}
    >
      {/* Absolute world-space physics root: do not nest this under the player. */}
      <Box args={[0.75, WILD_CREATURE_HEIGHT, 0.75]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary
        resetKey={MODEL_URL}
        fallback={<WildFallback />}
      >
        <Suspense fallback={<WildFallback />}>
          <AnimatedModel
            url={MODEL_URL}
            actionName="Idle"
            fallbackActionName="Walk"
            position={[0, -WILD_CREATURE_HEIGHT / 2, 0]}
            rotation={MODEL_ROTATION}
            scale={MODEL_SCALE}
          />
        </Suspense>
      </ModelErrorBoundary>
    </group>
  );
}
