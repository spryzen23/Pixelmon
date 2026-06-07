import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import AimIndicator from '../../systems/AimIndicator';
import Ashfall from '../../biomes/volcanic/Ashfall';
import CaptureBurst from '../../systems/CaptureBurst';
import CaveEntrance from '../../biomes/cave/CaveEntrance';
import CaveInteriorEffects from '../../biomes/cave/CaveInteriorEffects';
import CompanionCreature from '../../entities/CompanionCreature';
import CompanionRecallEffect from '../../systems/CompanionRecallEffect';
import DistortionRealmLandmarks from '../../biomes/distortion/DistortionRealmLandmarks';
import DistantSkyIsland from '../../biomes/sky/DistantSkyIsland';
import IceMountainLandmarks, {
  IceKyuremRoomInterior,
} from '../../biomes/icy/IceMountainLandmarks';
import MoonlitLandmarks from '../../biomes/moonlit/MoonlitLandmarks';
import OceanHorizon from '../../environment/OceanHorizon';
import Player from '../../entities/Player';
import Projectile from '../../systems/Projectile';
import Sandstorm from '../../biomes/desert/Sandstorm';
import SkyBelowVista from '../../biomes/sky/SkyBelowVista';
import SkyBiomeLandmarks from '../../biomes/sky/SkyBiomeLandmarks';
import Snowstorm from '../../biomes/icy/Snowstorm';
import ThirdPersonCamera from '../../systems/ThirdPersonCamera';
import VolcanoCrater from '../../biomes/volcanic/VolcanoCrater';
import VoxelWorld from '../../world/VoxelWorld';
import WildCreature from '../../entities/WildCreature';
import {
  WILD_CREATURE_HEIGHT,
  CAVE_BIOME_ID,
  CAVE_ZONES,
  COMPANION_HEIGHT,
  getIceRoomSpawnPosition,
  getAlphaCreatureAsset,
  getEntityY,
  getOrdinaryCreatureAssets,
  getPathSpawnPoint,
  getRandomGrassPosition,
  isWalkablePosition,
  setActivePathId,
  WORLD_PATHS,
} from '../../world';
import { DEFAULT_BALL } from '../../game/balls';
import {
  getParallaxThrowVector,
} from '../../game/projectilePhysics';

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
const DEFAULT_CREATURE_MODEL_URL = '/assets/shared/wild_creature.glb';
const ALPHA_SPAWN_RADIUS = 1.4;
const ALPHA_SPAWN_DISTANCES = [16, 18, 20, 22, 24, 14, 12];
const MIN_ORDINARY_SPAWNS = 8;
const MAX_ORDINARY_SPAWNS = 12;

function getBiomeType(currentBiome) {
  return (WORLD_PATHS.find((path) => path.id === currentBiome) || WORLD_PATHS[0])
    .biome;
}

function createWildCreatures(pathId = 0, caveZone) {
  const assetPool = getOrdinaryCreatureAssets(pathId);
  const count = Math.min(
    MAX_ORDINARY_SPAWNS,
    Math.max(MIN_ORDINARY_SPAWNS, assetPool.length * 2)
  );
  const mixedAssets = [...assetPool].sort(() => Math.random() - 0.5);
  const spawnZone = pathId === CAVE_BIOME_ID
    ? CAVE_ZONES.INTERIOR
    : caveZone;
  const spawn = getPathSpawnPoint(pathId, WILD_CREATURE_HEIGHT, spawnZone);

  return Array.from({ length: count }, (_, index) => {
    const asset = mixedAssets[index % mixedAssets.length] || assetPool[0];

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
        pathId,
        spawnZone
      ),
      status: 'active',
    };
  });
}

function getAlphaSpawnPosition(player, camera, currentBiome, caveZone) {
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
        currentBiome,
        caveZone
      )
    ) {
      return [
        alphaSpawnTarget.x,
        getEntityY(
          alphaSpawnTarget.x,
          alphaSpawnTarget.z,
          WILD_CREATURE_HEIGHT,
          undefined,
          currentBiome,
          caveZone
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
    currentBiome,
    caveZone
  );
}

export default function GameScene({
  caveZone = CAVE_ZONES.EXTERIOR,
  currentBiome = 0,
  equippedBall = DEFAULT_BALL,
  iceRoomId = null,
  onEnterCave = () => {},
  onEnterIceRoom = () => {},
  onExitIceRoom = () => {},
  onBiomeReady = () => {},
  onCreatureCaught = () => {},
  onOrdinaryCountChange = () => {},
  spawnPositionOverride = null,
  throwPower,
}) {
  const { camera } = useThree();
  const biomeType = getBiomeType(currentBiome);
  const isCaveInterior =
    currentBiome === CAVE_BIOME_ID && caveZone === CAVE_ZONES.INTERIOR;
  const isCaveExterior =
    currentBiome === CAVE_BIOME_ID && caveZone === CAVE_ZONES.EXTERIOR;
  const isIceRoomInterior = biomeType === 'icy' && Boolean(iceRoomId);
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
    if (isIceRoomInterior) {
      return getIceRoomSpawnPosition(iceRoomId);
    }

    if (spawnPositionOverride) {
      return spawnPositionOverride;
    }

    return getPathSpawnPoint(currentBiome, undefined, caveZone);
  }, [
    caveZone,
    currentBiome,
    iceRoomId,
    isIceRoomInterior,
    spawnPositionOverride,
  ]);
  const [ordinaryCreatures, setOrdinaryCreatures] = useState(() =>
    createWildCreatures(currentBiome, caveZone)
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
      setOrdinaryCreatures(
        isIceRoomInterior ? [] : createWildCreatures(currentBiome, caveZone)
      );
      biomeResetRef.current = false;
    }, 0);

    return () => {
      window.clearTimeout(resetTimer);
    };
  }, [caveZone, currentBiome, isIceRoomInterior]);

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
    const position = getAlphaSpawnPosition(player, camera, currentBiome, caveZone);
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
  }, [alphaSpawned, camera, caveZone, currentBiome, ordinaryCreatures.length]);

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
            currentBiome,
            caveZone
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
    caveZone,
    currentBiome,
    equippedBall,
    isCompanionOut,
    throwPower,
  ]);

  return (
    <>
      <Suspense fallback={null}>
        {!isCaveInterior &&
          !isIceRoomInterior &&
          biomeType !== 'sky' &&
          biomeType !== 'distortion' &&
          biomeType !== 'moonlit' && (
          <OceanHorizon biomeType={biomeType} />
        )}
        {!isCaveInterior &&
          !isIceRoomInterior &&
          biomeType !== 'sky' &&
          biomeType !== 'distortion' &&
          biomeType !== 'moonlit' && (
          <DistantSkyIsland currentBiome={currentBiome} />
        )}
        {!isIceRoomInterior && (
          <VoxelWorld
            caveZone={caveZone}
            currentBiome={currentBiome}
            onBiomeReady={onBiomeReady}
            playerRef={playerRef}
          />
        )}
        {isCaveExterior && !isIceRoomInterior && (
          <CaveEntrance
            onEnterCave={onEnterCave}
            playerRef={playerRef}
          />
        )}
        {biomeType === 'volcanic' && !isIceRoomInterior && (
          <VolcanoCrater currentBiome={currentBiome} />
        )}
        {biomeType === 'moonlit' && !isIceRoomInterior && (
          <MoonlitLandmarks />
        )}
        {biomeType === 'distortion' && !isIceRoomInterior && (
          <DistortionRealmLandmarks />
        )}
        {biomeType === 'sky' && !isIceRoomInterior && (
          <>
            <SkyBiomeLandmarks />
            <SkyBelowVista />
          </>
        )}
        {biomeType === 'icy' && !isIceRoomInterior && (
          <IceMountainLandmarks
            onEnterRoom={onEnterIceRoom}
            playerRef={playerRef}
          />
        )}
        {isIceRoomInterior && (
          <IceKyuremRoomInterior
            activeRoomId={iceRoomId}
            onExitRoom={onExitIceRoom}
            playerRef={playerRef}
          />
        )}
      </Suspense>
      {isCaveInterior && <CaveInteriorEffects playerRef={playerRef} />}
      <Suspense fallback={null}>
        <Player
          key={`player-${currentBiome}-${caveZone}-${iceRoomId || 'outside'}`}
          caveZone={caveZone}
          currentPathId={currentBiome}
          ref={playerRef}
          modelRotation={MODEL_ROTATIONS.player}
          spawnPosition={playerSpawnPosition}
        />
      </Suspense>
      <AimIndicator
        ball={equippedBall}
        caveZone={caveZone}
        currentBiome={currentBiome}
        playerRef={playerRef}
        throwPower={throwPower}
      />
      {biomeType === 'desert' && !isIceRoomInterior && (
        <Sandstorm playerRef={playerRef} />
      )}
      {biomeType === 'volcanic' && !isIceRoomInterior && (
        <Ashfall playerRef={playerRef} />
      )}
      {biomeType === 'icy' && !isIceRoomInterior && (
        <Snowstorm playerRef={playerRef} />
      )}
      {isCompanionOut && !isIceRoomInterior && (
        <CompanionCreature
          key={`companion-${currentBiome}`}
          currentPathId={currentBiome}
          caveZone={caveZone}
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

      {!isCaveExterior && !isIceRoomInterior && ordinaryCreatures.filter(Boolean).map((wild) => (
        <Suspense key={`${currentBiome}-${wild.id}`} fallback={null}>
          <WildCreature
            caveZone={caveZone}
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

      {!isCaveExterior && !isIceRoomInterior && alphaCreature && (
        <Suspense key={`${currentBiome}-${alphaCreature.id}`} fallback={null}>
          <WildCreature
            caveZone={caveZone}
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
          caveZone={caveZone}
          currentBiome={currentBiome}
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
