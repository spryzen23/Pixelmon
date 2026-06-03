import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
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
const DEFAULT_MODEL_URL = '/assets/wild_creature.glb';
const direction = new Vector3();

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
  const modelRef = useRef();
  const fleeTimer = useRef(0);
  const activeAction = useRef(null);
  const previousY = useRef(initialPosition[1]);
  const start = useMemo(() => new Vector3(...initialPosition), [initialPosition]);
  const gltf = useGLTF(modelUrl);
  const gltfScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const visualScale = modelScale * (isAlpha ? DEFAULT_ALPHA_MULTIPLIER : 1);
  const { actions, names } = useAnimations(gltf.animations, modelRef);
  const ai = useRef({
    mode: 'pause',
    pauseTimer: randomPause(),
    target: start.clone(),
  });

  useEffect(() => {
    gltfScene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [gltfScene]);

  useEffect(() => {
    const clipName =
      ['Idle', 'Walk']
        .map((preferredName) =>
          names.find((name) => name.toLowerCase() === preferredName.toLowerCase())
        )
        .find(Boolean) || names[0];

    if (!clipName || !actions[clipName]) {
      return undefined;
    }

    const nextAction = actions[clipName];

    if (activeAction.current === nextAction) {
      return undefined;
    }

    nextAction.reset().fadeIn(0.2).play();

    if (activeAction.current) {
      activeAction.current.crossFadeTo(nextAction, 0.25, false);
    }

    activeAction.current = nextAction;

    return undefined;
  }, [actions, names]);

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
      previousY.current,
      currentPathId
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

        if (isWalkablePosition(nextX, nextZ, 0.45, currentPathId)) {
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
        ai.current.target.copy(randomNearbyTarget(creature.position, currentPathId));
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

    if (isWalkablePosition(nextX, nextZ, 0.45, currentPathId)) {
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
    } else {
      ai.current.mode = 'pause';
      ai.current.pauseTimer = randomPause();
    }
  });

  return (
    <group
      ref={creatureRef}
      position={initialPosition}
    >
      <group
        ref={modelRef}
        position={[0, -WILD_CREATURE_HEIGHT / 2, 0]}
        scale={visualScale}
        visible={status !== 'capturing'}
      >
        <group rotation={modelRotation}>
          <primitive object={gltfScene} />
        </group>
      </group>

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

useGLTF.preload(DEFAULT_MODEL_URL);
