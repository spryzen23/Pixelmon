import { Box } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Vector3 } from 'three';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';
import { lerpAngle } from '../game/animationUtils';
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
const DEFAULT_MODEL_SCALE = 0.35;
const DEFAULT_ALPHA_MULTIPLIER = 2.5;
const DEFAULT_MODEL_URL = '/wild_creature.glb';
const ROTATION_SMOOTHING = 10;
const DISPLACE_EPSILON = 0.0008;
const direction = new Vector3();
const modelOffset = [0, -WILD_CREATURE_HEIGHT / 2, 0];

function WildFallback({ rotation = [0, 0, 0], scale = DEFAULT_MODEL_SCALE }) {
  return (
    <VoxelFallback
      color="#dc2f32"
      height={WILD_CREATURE_HEIGHT}
      width={0.75}
      depth={0.75}
      position={modelOffset}
      rotation={rotation}
      scale={scale}
    />
  );
}

function randomPause() {
  return 1.5 + Math.random() * 2.5;
}

function randomNearbyTarget(origin, pathId) {
  for (let attempts = 0; attempts < 30; attempts += 1) {
    const angle = Math.random() * Math.PI * 2;
    const distance = 1 + Math.random() * WANDER_RADIUS;
    const x = origin.x + Math.cos(angle) * distance;
    const z = origin.z + Math.sin(angle) * distance;

    if (isWalkablePosition(x, z, 0.45, pathId)) {
      return new Vector3(
        x,
        getEntityY(x, z, WILD_CREATURE_HEIGHT, undefined, pathId),
        z
      );
    }
  }

  return origin.clone();
}

export default function WildCreature({
  currentPathId = 0,
  id,
  initialPosition,
  isAlpha = false,
  modelScale = DEFAULT_MODEL_SCALE,
  modelUrl = DEFAULT_MODEL_URL,
  modelRotation = [Math.PI / 2, 0, 0],
  onFleeComplete,
  playerRef,
  registerRef,
  status = 'active',
}) {
  const creatureRef = useRef();
  const fleeTimer = useRef(0);
  const previousY = useRef(initialPosition[1]);
  const movingRef = useRef(false);
  const visualScale = modelScale * (isAlpha ? DEFAULT_ALPHA_MULTIPLIER : 1);
  const animInputRef = useRef({
    forwardInput: 0,
    strafeInput: 0,
    isJumping: false,
    isCrouching: false,
    moveSpeedFactor: 1,
  });
  const [isMoving, setIsMoving] = useState(false);
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

  const setMoving = (moving) => {
    if (movingRef.current === moving) {
      return;
    }

    movingRef.current = moving;
    setIsMoving(moving);
  };

  const applyDisplacement = (creature, prevX, prevZ, nextX, nextZ, delta) => {
    const dx = nextX - prevX;
    const dz = nextZ - prevZ;
    const moved = Math.hypot(dx, dz) > DISPLACE_EPSILON;

    if (moved) {
      const targetYaw = Math.atan2(dx, dz);
      const rotationAlpha = 1 - Math.exp(-ROTATION_SMOOTHING * delta);
      creature.rotation.y = lerpAngle(creature.rotation.y, targetYaw, rotationAlpha);
      animInputRef.current.forwardInput = 1;
      animInputRef.current.strafeInput = 0;
    }

    return moved;
  };

  useFrame((_, delta) => {
    const creature = creatureRef.current;

    if (!creature) {
      return;
    }

    creature.position.y = getEntityY(
      creature.position.x,
      creature.position.z,
      WILD_CREATURE_HEIGHT,
      previousY.current,
      currentPathId
    );
    previousY.current = creature.position.y;

    if (status === 'capturing') {
      setMoving(false);
      return;
    }

    if (status === 'fleeing') {
      const player = playerRef.current;
      fleeTimer.current += delta;
      animInputRef.current.moveSpeedFactor = FLEE_SPEED / WANDER_SPEED;

      if (player) {
        direction.copy(creature.position).sub(player.position);
        direction.y = 0;

        if (direction.lengthSq() < 0.001) {
          direction.set(Math.random() - 0.5, 0, Math.random() - 0.5);
        }

        direction.normalize();

        const prevX = creature.position.x;
        const prevZ = creature.position.z;
        const nextX = prevX + direction.x * FLEE_SPEED * delta;
        const nextZ = prevZ + direction.z * FLEE_SPEED * delta;

        if (isWalkablePosition(nextX, nextZ, 0.45, currentPathId)) {
          const moved = applyDisplacement(creature, prevX, prevZ, nextX, nextZ, delta);
          creature.position.x = nextX;
          creature.position.y = getEntityY(
            nextX,
            nextZ,
            WILD_CREATURE_HEIGHT,
            previousY.current,
            currentPathId
          );
          previousY.current = creature.position.y;
          creature.position.z = nextZ;
          setMoving(moved);
        } else {
          setMoving(false);
        }
      } else {
        setMoving(false);
      }

      if (fleeTimer.current >= FLEE_DURATION) {
        onFleeComplete(id);
      }

      return;
    }

    animInputRef.current.moveSpeedFactor = 1;

    if (ai.current.mode === 'pause') {
      ai.current.pauseTimer -= delta;
      setMoving(false);
      animInputRef.current.forwardInput = 0;
      animInputRef.current.strafeInput = 0;

      if (ai.current.pauseTimer <= 0) {
        ai.current.target.copy(randomNearbyTarget(creature.position, currentPathId));
        ai.current.mode = 'walk';
      }

      return;
    }

    direction.copy(ai.current.target).sub(creature.position);

    if (direction.length() <= ARRIVAL_DISTANCE) {
      ai.current.mode = 'pause';
      ai.current.pauseTimer = randomPause();
      setMoving(false);
      return;
    }

    direction.normalize();

    const prevX = creature.position.x;
    const prevZ = creature.position.z;
    const nextX = prevX + direction.x * WANDER_SPEED * delta;
    const nextZ = prevZ + direction.z * WANDER_SPEED * delta;

    if (isWalkablePosition(nextX, nextZ, 0.45, currentPathId)) {
      const moved = applyDisplacement(creature, prevX, prevZ, nextX, nextZ, delta);
      creature.position.x = nextX;
      creature.position.y = getEntityY(
        nextX,
        nextZ,
        WILD_CREATURE_HEIGHT,
        previousY.current,
        currentPathId
      );
      previousY.current = creature.position.y;
      creature.position.z = nextZ;
      setMoving(moved);
    } else {
      ai.current.mode = 'pause';
      ai.current.pauseTimer = randomPause();
      setMoving(false);
    }
  });

  return (
    <group
      ref={creatureRef}
      position={initialPosition}
      visible={status !== 'capturing'}
    >
      <Box args={[0.75, WILD_CREATURE_HEIGHT, 0.75]} visible={false}>
        <meshBasicMaterial transparent opacity={0} />
      </Box>

      <ModelErrorBoundary
        resetKey={modelUrl}
        fallback={<WildFallback rotation={modelRotation} scale={visualScale} />}
      >
        <Suspense fallback={<WildFallback rotation={modelRotation} scale={visualScale} />}>
          <AnimatedModel
            url={modelUrl}
            actionName={isMoving ? 'Walk' : 'Idle'}
            fallbackActionName={isMoving ? ['Run', 'Walk', 'Idle'] : ['Idle', 'Walk']}
            position={modelOffset}
            rotation={modelRotation}
            scale={visualScale}
            inputRef={animInputRef}
          />
        </Suspense>
      </ModelErrorBoundary>

      {isAlpha && (
        <pointLight
          color="red"
          distance={5}
          intensity={2}
          position={[0, 2, 0]}
        />
      )}
    </group>
  );
}
