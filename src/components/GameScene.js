import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import AimIndicator from './AimIndicator';
import Ashfall from './Ashfall';
import CaptureBurst from './CaptureBurst';
import CompanionCreature from './CompanionCreature';
import CompanionRecallEffect from './CompanionRecallEffect';
import OceanHorizon from './OceanHorizon';
import Player from './Player';
import Projectile from './Projectile';
import Sandstorm from './Sandstorm';
import Snowstorm from './Snowstorm';
import ThirdPersonCamera from './ThirdPersonCamera';
import VolcanoCrater from './VolcanoCrater';
import VoxelWorld from './VoxelWorld';
import WildCreature from './WildCreature';
import {
  WILD_CREATURE_HEIGHT,
  COMPANION_HEIGHT,
  getAlphaCreatureAsset,
  getEntityY,
  getOrdinaryCreatureAsset,
  getPathSpawnPoint,
  getRandomGrassPosition,
  isWalkablePosition,
  setActivePathId,
  WORLD_PATHS,
} from '../game/world';
import { DEFAULT_BALL } from '../game/balls';
import {
  getParallaxThrowVector,
} from '../game/projectilePhysics';

const throwForward = new Vector3();
const throwOrigin = new Vector3();
const alphaForward = new Vector3();
const alphaSpawnTarget = new Vector3();

const MODEL_ROTATIONS = {
  player: [0, 0, 0],
  wildCreature: [0, Math.PI / 2, 0],
  companion: [0, Math.PI / 2, 0],
};
const CREATURE_MODEL_SCALES = {
  0: 0.25,
  1: 0.45,
  2: 0.45,
  3: 0.45,
  4: 0.45,
  5: 0.45,
};
const DEFAULT_CREATURE_MODEL_URL = '/assets/wild_creature.glb';
const ALPHA_SPAWN_RADIUS = 1.4;
const ALPHA_SPAWN_DISTANCES = [16, 18, 20, 22, 24, 14, 12];

function getBiomeType(currentBiome) {
  return (WORLD_PATHS.find((path) => path.id === currentBiome) || WORLD_PATHS[0])
    .biome;
}

function createWildCreatures(pathId = 0) {
  const count = 3 + Math.floor(Math.random() * 3);
  const spawn = getPathSpawnPoint(pathId, WILD_CREATURE_HEIGHT);

  return Array.from({ length: count }, (_, index) => {
    const asset = getOrdinaryCreatureAsset(pathId, index);

    return {
      id: `wild-${index}`,
      isAlpha: false,
      modelRotation: asset.rotation || MODEL_ROTATIONS.wildCreature,
      modelScale: asset.scale ?? CREATURE_MODEL_SCALES[pathId] ?? 0.35,
      modelUrl: asset.url || DEFAULT_CREATURE_MODEL_URL,
      // Absolute world positions, biased into the active path's spawn area.
      position: getRandomGrassPosition(
        0.45,
        WILD_CREATURE_HEIGHT,
        spawn[0],
        spawn[2] + 6,
        7,
        pathId
      ),
      status: 'active',
    };
  });
}

function getAlphaSpawnPosition(player, camera, currentBiome) {
  camera.getWorldDirection(alphaForward);
  alphaForward.y = 0;

  if (alphaForward.lengthSq() < 0.0001) {
    alphaForward.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y));
  }

  alphaForward.normalize();

  for (const distance of ALPHA_SPAWN_DISTANCES) {
    alphaSpawnTarget.set(
      player.position.x + alphaForward.x * distance,
      0,
      player.position.z + alphaForward.z * distance
    );

    if (
      isWalkablePosition(
        alphaSpawnTarget.x,
        alphaSpawnTarget.z,
        ALPHA_SPAWN_RADIUS,
        currentBiome
      )
    ) {
      return [
        alphaSpawnTarget.x,
        getEntityY(
          alphaSpawnTarget.x,
          alphaSpawnTarget.z,
          WILD_CREATURE_HEIGHT,
          undefined,
          currentBiome
        ),
        alphaSpawnTarget.z,
      ];
    }
  }

  return getRandomGrassPosition(
    ALPHA_SPAWN_RADIUS,
    WILD_CREATURE_HEIGHT,
    player.position.x + alphaForward.x * ALPHA_SPAWN_DISTANCES[0],
    player.position.z + alphaForward.z * ALPHA_SPAWN_DISTANCES[0],
    8,
    currentBiome
  );
}

export default function GameScene({
  currentBiome = 0,
  equippedBall = DEFAULT_BALL,
  onBiomeReady = () => {},
  onCreatureCaught = () => {},
  onOrdinaryCountChange = () => {},
  throwPower,
}) {
  const { camera } = useThree();
  const biomeType = getBiomeType(currentBiome);
  const playerRef = useRef();
  const companionRef = useRef();
  const wildRefs = useRef(new Map());
  const wildStatusRef = useRef(new Map());
  const projectileRefs = useRef(new Map());
  const projectileId = useRef(0);
  const effectId = useRef(0);
  const captureBurstId = useRef(0);
  const biomeResetRef = useRef(false);
  const playerSpawnPosition = useMemo(() => {
    return getPathSpawnPoint(currentBiome);
  }, [currentBiome]);
  const [ordinaryCreatures, setOrdinaryCreatures] = useState(() =>
    createWildCreatures(currentBiome)
  );
  const [alphaCreature, setAlphaCreature] = useState(null);
  const [alphaSpawned, setAlphaSpawned] = useState(false);
  const [projectiles, setProjectiles] = useState([]);
  const [captureBursts, setCaptureBursts] = useState([]);
  const [isCompanionOut, setIsCompanionOut] = useState(true);
  const [companionSpawnPosition, setCompanionSpawnPosition] = useState(null);
  const [companionEffects, setCompanionEffects] = useState([]);

  useEffect(() => {
    biomeResetRef.current = true;
    setActivePathId(currentBiome);
    wildRefs.current.clear();
    wildStatusRef.current.clear();
    projectileRefs.current.clear();
    setProjectiles([]);
    setCaptureBursts([]);
    setCompanionEffects([]);
    setCompanionSpawnPosition(null);
    setIsCompanionOut(true);
    setOrdinaryCreatures([]);
    setAlphaCreature(null);
    setAlphaSpawned(false);

    const resetTimer = window.setTimeout(() => {
      setOrdinaryCreatures(createWildCreatures(currentBiome));
      biomeResetRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [currentBiome]);

  useEffect(() => {
    wildStatusRef.current.clear();
    ordinaryCreatures.forEach((wild) => {
      wildStatusRef.current.set(wild.id, wild.status);
    });
    if (alphaCreature) {
      wildStatusRef.current.set(alphaCreature.id, alphaCreature.status);
    }
    onOrdinaryCountChange(ordinaryCreatures.length);
  }, [alphaCreature, onOrdinaryCountChange, ordinaryCreatures]);

  useEffect(() => {
    if (
      biomeResetRef.current ||
      ordinaryCreatures.length > 0 ||
      alphaSpawned ||
      !playerRef.current
    ) {
      return;
    }

    const player = playerRef.current;
    const position = getAlphaSpawnPosition(player, camera, currentBiome);
    const asset = getAlphaCreatureAsset(currentBiome);

    setAlphaCreature({
      id: `alpha-${currentBiome}`,
      isAlpha: true,
      modelRotation: asset.rotation || MODEL_ROTATIONS.wildCreature,
      modelScale: asset.scale ?? CREATURE_MODEL_SCALES[currentBiome] ?? 0.35,
      modelUrl: asset.url || DEFAULT_CREATURE_MODEL_URL,
      position,
      status: 'active',
    });
    setAlphaSpawned(true);
  }, [alphaSpawned, camera, currentBiome, ordinaryCreatures.length]);

  const registerWildRef = useCallback((id, ref) => {
    if (ref) {
      wildRefs.current.set(id, ref);
    } else {
      wildRefs.current.delete(id);
    }
  }, []);

  const registerProjectileRef = useCallback((id, ref) => {
    if (ref) {
      projectileRefs.current.set(id, ref);
    } else {
      projectileRefs.current.delete(id);
    }
  }, []);

  const removeProjectile = useCallback((id) => {
    projectileRefs.current.delete(id);
    setProjectiles((current) =>
      current.filter((projectile) => projectile.id !== id)
    );
  }, []);

  const addCompanionEffect = useCallback((position) => {
    effectId.current += 1;
    setCompanionEffects((current) => [
      ...current,
      {
        id: `companion-effect-${effectId.current}`,
        position,
      },
    ]);
  }, []);

  const removeCompanionEffect = useCallback((id) => {
    setCompanionEffects((current) =>
      current.filter((effect) => effect.id !== id)
    );
  }, []);

  const handleCaptureStart = useCallback((wildId) => {
    setOrdinaryCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'capturing' } : wild
      )
    );
    setAlphaCreature((current) =>
      current && current.id === wildId
        ? { ...current, status: 'capturing' }
        : current
    );
  }, []);

  const removeCaptureBurst = useCallback((id) => {
    setCaptureBursts((current) => current.filter((burst) => burst.id !== id));
  }, []);

  const handleCaptureSuccess = useCallback((wildId, position) => {
    captureBurstId.current += 1;
    setCaptureBursts((current) => [
      ...current,
      {
        id: `capture-burst-${captureBurstId.current}`,
        position,
      },
    ]);
    wildRefs.current.delete(wildId);
    setOrdinaryCreatures((current) =>
      current.filter((wild) => wild.id !== wildId)
    );
    setAlphaCreature((current) =>
      current && current.id === wildId ? null : current
    );
    onCreatureCaught(1);
  }, [onCreatureCaught]);

  const handleCaptureFail = useCallback((wildId) => {
    setOrdinaryCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'fleeing' } : wild
      )
    );
    setAlphaCreature((current) =>
      current && current.id === wildId
        ? { ...current, status: 'fleeing' }
        : current
    );
  }, []);

  const handleFleeComplete = useCallback((wildId) => {
    setOrdinaryCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'active' } : wild
      )
    );
    setAlphaCreature((current) =>
      current && current.id === wildId
        ? { ...current, status: 'active' }
        : current
    );
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!playerRef.current || event.repeat) {
        return;
      }

      const player = playerRef.current;

      if (event.code === 'KeyE') {
        event.preventDefault();

        if (isCompanionOut) {
          const source = companionRef.current || player;
          addCompanionEffect([
            source.position.x,
            source.position.y,
            source.position.z,
          ]);
          setIsCompanionOut(false);
          return;
        }

        const spawnPosition = [
          player.position.x,
          getEntityY(
            player.position.x,
            player.position.z,
            COMPANION_HEIGHT,
            undefined,
            currentBiome
          ),
          player.position.z,
        ];

        setCompanionSpawnPosition(spawnPosition);
        addCompanionEffect(spawnPosition);
        setIsCompanionOut(true);
        return;
      }

      if (event.code !== 'Space') {
        return;
      }

      event.preventDefault();

      getParallaxThrowVector(camera, player, throwOrigin, throwForward);

      const position = [
        throwOrigin.x,
        throwOrigin.y,
        throwOrigin.z,
      ];

      projectileId.current += 1;

      setProjectiles((current) => [
        ...current,
        {
          id: `projectile-${projectileId.current}`,
          ball: equippedBall,
          direction: [throwForward.x, throwForward.y, throwForward.z],
          position,
          throwPower,
        },
      ]);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    addCompanionEffect,
    camera,
    currentBiome,
    equippedBall,
    isCompanionOut,
    throwPower,
  ]);

  return (
    <>
      <Suspense fallback={null}>
        <OceanHorizon biomeType={biomeType} />
        <VoxelWorld
          currentBiome={currentBiome}
          onBiomeReady={onBiomeReady}
          playerRef={playerRef}
        />
        {biomeType === 'volcanic' && (
          <VolcanoCrater currentBiome={currentBiome} />
        )}
      </Suspense>
      <Suspense fallback={null}>
        <Player
          key={`player-${currentBiome}`}
          currentPathId={currentBiome}
          ref={playerRef}
          modelRotation={MODEL_ROTATIONS.player}
          spawnPosition={playerSpawnPosition}
        />
      </Suspense>
      <AimIndicator
        ball={equippedBall}
        playerRef={playerRef}
        throwPower={throwPower}
      />
      {biomeType === 'desert' && <Sandstorm playerRef={playerRef} />}
      {biomeType === 'volcanic' && <Ashfall playerRef={playerRef} />}
      {biomeType === 'icy' && <Snowstorm playerRef={playerRef} />}
      {isCompanionOut && (
        <CompanionCreature
          key={`companion-${currentBiome}`}
          currentPathId={currentBiome}
          ref={companionRef}
          modelRotation={MODEL_ROTATIONS.companion}
          playerRef={playerRef}
          spawnPosition={companionSpawnPosition || playerSpawnPosition}
        />
      )}
      <ThirdPersonCamera targetRef={playerRef} />

      {companionEffects.map((effect) => (
        <CompanionRecallEffect
          key={effect.id}
          id={effect.id}
          position={effect.position}
          onComplete={removeCompanionEffect}
        />
      ))}

      {captureBursts.map((burst) => (
        <CaptureBurst
          key={burst.id}
          id={burst.id}
          position={burst.position}
          onComplete={removeCaptureBurst}
        />
      ))}

      {ordinaryCreatures.filter(Boolean).map((wild) => (
        <Suspense key={`${currentBiome}-${wild.id}`} fallback={null}>
          <WildCreature
            currentPathId={currentBiome}
            id={wild.id}
            initialPosition={wild.position}
            isAlpha={wild.isAlpha}
            modelScale={wild.modelScale}
            modelUrl={wild.modelUrl}
            modelRotation={wild.modelRotation || MODEL_ROTATIONS.wildCreature}
            playerRef={playerRef}
            registerRef={registerWildRef}
            status={wild.status}
            onFleeComplete={handleFleeComplete}
          />
        </Suspense>
      ))}

      {alphaCreature && (
        <Suspense key={`${currentBiome}-${alphaCreature.id}`} fallback={null}>
          <WildCreature
            currentPathId={currentBiome}
            id={alphaCreature.id}
            initialPosition={alphaCreature.position}
            isAlpha
            modelScale={alphaCreature.modelScale}
            modelUrl={alphaCreature.modelUrl}
            modelRotation={alphaCreature.modelRotation || MODEL_ROTATIONS.wildCreature}
            playerRef={playerRef}
            registerRef={registerWildRef}
            status={alphaCreature.status}
            onFleeComplete={handleFleeComplete}
          />
        </Suspense>
      )}

      {projectiles.map((projectile) => (
        <Projectile
          key={projectile.id}
          id={projectile.id}
          ball={projectile.ball}
          direction={projectile.direction}
          initialPosition={projectile.position}
          onExpire={removeProjectile}
          onCaptureFail={handleCaptureFail}
          onCaptureStart={handleCaptureStart}
          onCaptureSuccess={handleCaptureSuccess}
          registerRef={registerProjectileRef}
          throwPower={projectile.throwPower}
          wildRefs={wildRefs}
          wildStatusRef={wildStatusRef}
        />
      ))}
    </>
  );
}
