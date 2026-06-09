import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useThree } from '@react-three/fiber';
import AimIndicator from './AimIndicator';
import Atmosphere, { SUN_POSITION } from './Atmosphere';
import BiomeLandmarks from './BiomeLandmarks';
import BiomeProps from './BiomeProps';
import CaptureBurst from './CaptureBurst';
import CompanionCreature from './CompanionCreature';
import CompanionRecallEffect from './CompanionRecallEffect';
import FantasyBiomeProps from './FantasyBiomeProps';
import { FantasyGltfProvider } from './FantasyGltfProvider';
import OceanHorizon from './OceanHorizon';
import PlantGltfPreloader from './PlantGltfPreloader';
import Player from './Player';
import Projectile from './Projectile';
import Sandstorm from './Sandstorm';
import Snowstorm from './Snowstorm';
import SafePointerLockControls from './SafePointerLockControls';
import ThirdPersonCamera from './ThirdPersonCamera';
import VillageBiomeProps from './VillageBiomeProps';
import { VillageGltfProvider } from './VillageGltfProvider';
import VoxelWorld from './VoxelWorld';
import WildCreature from './WildCreature';
import { DEFAULT_BALL } from '../game/balls';
import { getTypeAnimProfile, getFitToHeightForPokemon, getRotationForPokemon } from '../game/pokemonData';
import { resolveWildModel } from '../game/assetResolver';
import { getBiomeDisplayInfo } from '../game/biomeDisplay';
import { getSpawnCandidates, pickRandomSpawn, isAlphaEligible } from '../game/spawnController';
import { getAlphaSpawnPosition } from '../game/spawnPlacement';
import { useGameInput } from '../hooks/useGameInput';
import { FANTASY_BIOME_ID } from '../game/fantasyAssets';
import { VILLAGE_BIOME_ID } from '../game/villageAssets';
import {
  COMPANION_HEIGHT,
  WILD_CREATURE_HEIGHT,
  getEntityY,
  getPathSpawnPoint,
  getRandomGrassPosition,
  setActivePathId,
} from '../game/world';

const WILD_ID = 'wild-0';

function displayFantasyBiome(pathId) {
  return getBiomeDisplayInfo(pathId).fantasyBiome;
}
const MODEL_ROTATIONS = {
  player: [0, 0, 0],
  wildCreature: [0, Math.PI / 2, 0],
  companion: [0, 0, 0],
};

function entryToWild(entry, position, pathId = 0) {
  if (!entry) return null;
  const resolved = resolveWildModel(entry, pathId);
  const baseHeight = getFitToHeightForPokemon(entry);
  const fitHeight = baseHeight * (entry.isAlpha ? 2.5 : 1.0);
  const rot = getRotationForPokemon(entry);

  return {
    ...entry,
    id: WILD_ID,
    position,
    status: 'active',
    modelUrl: resolved.modelUrl,
    modelScale: fitHeight,
    fitToHeight: fitHeight,
    modelRotation: rot,
    primaryType: entry.types?.[0] || 'normal',
    animProfile: getTypeAnimProfile(entry.types?.[0]),
    isAlpha: Boolean(entry.isAlpha),
  };
}

export function GameScene({
  session,
  player,
  gameRuntime,
  equippedBall = DEFAULT_BALL,
  throwPower,
  onCatchResult,
  paused,
  onSpawnProgress,
  onBiomeReady = () => { },
  caveZone,
  iceRoomId = null,
  onEnterCave = () => { },
  onEnterIceRoom = () => { },
  onExitIceRoom = () => { },
  gameMode = 'campaign',
  _multiWildCount = 1,
}) {
  const currentBiome = session.pathId;
  const fantasyBiome = session.fantasyBiome || displayFantasyBiome(currentBiome);
  const playerRef = useRef();
  const companionRef = useRef();
  const wildRefs = useRef(new Map());
  const wildStatusRef = useRef(new Map());
  const projectileRefs = useRef(new Map());
  const projectileId = useRef(0);
  const burstId = useRef(0);
  const { camera } = useThree();

  const playerSpawnPosition = useMemo(
    () => getPathSpawnPoint(currentBiome),
    [currentBiome]
  );

  const [wild, setWild] = useState(null);
  const [projectiles, setProjectiles] = useState([]);
  const [captureBursts, setCaptureBursts] = useState([]);
  const [isCompanionOut, setIsCompanionOut] = useState(true);
  const [companionSpawnPosition, setCompanionSpawnPosition] = useState(null);
  const [companionEffects, setCompanionEffects] = useState([]);

  useEffect(() => {
    setActivePathId(currentBiome);
  }, [currentBiome]);

  const prevCompanionIdRef = useRef(player?.companion?.entryId);

  const addCompanionEffect = useCallback((position) => {
    const id = `companion-effect-${uuidv4()}`;
    setCompanionEffects((current) => [...current, { id, position }]);
  }, []);

  const removeCompanionEffect = useCallback((id) => {
    setCompanionEffects((current) => current.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    const currentId = player?.companion?.entryId;
    if (currentId && prevCompanionIdRef.current && currentId !== prevCompanionIdRef.current) {
      const oldPosition = companionRef.current
        ? [companionRef.current.position.x, companionRef.current.position.y, companionRef.current.position.z]
        : playerSpawnPosition;

      const newSpawnPos = playerRef.current
        ? [playerRef.current.position.x, playerRef.current.position.y, playerRef.current.position.z]
        : playerSpawnPosition;

      setCompanionSpawnPosition(newSpawnPos);
      setCompanionEffects((current) => [
        ...current,
        { id: `companion-effect-${uuidv4()}`, position: oldPosition },
        { id: `companion-effect-${uuidv4()}`, position: newSpawnPos },
      ]);
      setIsCompanionOut(true);
    }
    prevCompanionIdRef.current = currentId;
  }, [player?.companion?.entryId, addCompanionEffect, playerSpawnPosition]);

  const spawnWild = useCallback(() => {
    const state = gameRuntime.spawnState;
    const byLevel = gameRuntime.byLevel;
    if (!state || !byLevel) return;

    let entry = null;
    let isAlphaSpawn = false;
    const alphaRoll =
      gameMode === 'sandbox' ? Math.random() < 0.3 : isAlphaEligible(state) && !state.alphaCaught;
    if (alphaRoll && !state.alphaCaught) {
      isAlphaSpawn = true;
      const lastLevel = String(state.levels[state.levels.length - 1]);
      const pool = byLevel[lastLevel] || [];
      entry = pool.find((p) => p.isLegendary) || pool[0];
      if (entry) entry = { ...entry, isAlpha: true };
    } else {
      const candidates = getSpawnCandidates(state, byLevel, {
        eggGroups: state.activeEggGroups,
        maxFormTier: 1,
      });
      entry = pickRandomSpawn(candidates);
      if (entry) entry = { ...entry, isAlpha: false };
    }

    let pos;
    if (
      isAlphaSpawn &&
      entry &&
      playerRef.current
    ) {
      pos = getAlphaSpawnPosition(playerRef.current, camera, currentBiome);
    } else {
      pos = getRandomGrassPosition(
        0.5,
        WILD_CREATURE_HEIGHT,
        playerRef.current?.position.x ?? 0,
        playerRef.current?.position.z ?? 0,
        14,
        currentBiome
      );
    }

    const mapped = entryToWild(entry, pos, currentBiome);
    setWild(mapped);
    wildStatusRef.current.set(WILD_ID, mapped ? 'active' : 'idle');
    onSpawnProgress?.(state);
  }, [gameRuntime, currentBiome, onSpawnProgress, camera, gameMode]);

  useEffect(() => {
    spawnWild();
  }, [spawnWild, gameRuntime.spawnState?.maxUnlockedSpawnLevel]);

  const registerWildRef = useCallback((id, ref) => {
    if (ref) wildRefs.current.set(id, ref);
    else wildRefs.current.delete(id);
  }, []);

  const registerProjectileRef = useCallback((id, ref) => {
    if (ref) projectileRefs.current.set(id, ref);
    else projectileRefs.current.delete(id);
  }, []);

  const removeProjectile = useCallback((id) => {
    projectileRefs.current.delete(id);
    setProjectiles((current) => current.filter((p) => p.id !== id));
  }, []);

  const addCaptureBurst = useCallback((position) => {
    burstId.current += 1;
    setCaptureBursts((current) => [
      ...current,
      { id: `burst-${burstId.current}`, position },
    ]);
  }, []);

  const removeCaptureBurst = useCallback((id) => {
    setCaptureBursts((current) => current.filter((b) => b.id !== id));
  }, []);

  const handleThrow = useCallback(
    ({ position, direction, ball, throwPower: power }) => {
      if (paused || !wild || projectiles.length > 0) return;
      projectileId.current += 1;
      setProjectiles([
        {
          id: `projectile-${projectileId.current}`,
          ball,
          direction,
          position,
          throwPower: power,
        },
      ]);
    },
    [paused, wild, projectiles.length]
  );

  useGameInput({
    playerRef,
    companionRef,
    camera,
    currentBiome,
    equippedBall,
    throwPower,
    isCompanionOut,
    setIsCompanionOut,
    setCompanionSpawnPosition,
    addCompanionEffect,
    getEntityY,
    COMPANION_HEIGHT,
    onThrow: handleThrow,
  });

  const handleCaptureStart = useCallback(() => {
    setWild((w) => (w ? { ...w, status: 'capturing' } : w));
    wildStatusRef.current.set(WILD_ID, 'capturing');
  }, []);

  const handleCaptureFail = useCallback(() => {
    setWild((w) => (w ? { ...w, status: 'fleeing' } : w));
    wildStatusRef.current.set(WILD_ID, 'fleeing');
  }, []);

  const handleFleeComplete = useCallback(() => {
    setWild((w) => (w ? { ...w, status: 'active' } : w));
    wildStatusRef.current.set(WILD_ID, 'active');
  }, []);

  const handleCaptureSuccess = useCallback(
    (_wildId, position) => {
      if (!wild) return;
      addCaptureBurst(position);
      onCatchResult(wild, wild.isAlpha);
      setWild(null);
      wildStatusRef.current.delete(WILD_ID);
      window.setTimeout(spawnWild, 1500);
    },
    [wild, onCatchResult, addCaptureBurst, spawnWild]
  );

  const companionModelUrl = player?.companion?.modelUrl || '/assets/companion.glb';

  const worldContent = (
    <Suspense fallback={null}>
      <OceanHorizon biomeType={fantasyBiome} />
      <VoxelWorld
        caveZone={caveZone}
        currentBiome={currentBiome}
        onBiomeReady={onBiomeReady}
        playerRef={playerRef}
      />
      <BiomeLandmarks
        caveZone={caveZone}
        currentBiome={currentBiome}
        fantasyBiome={fantasyBiome}
        iceRoomId={iceRoomId}
        onEnterCave={onEnterCave}
        onEnterIceRoom={onEnterIceRoom}
        onExitIceRoom={onExitIceRoom}
        playerRef={playerRef}
      />
      <BiomeProps currentBiome={currentBiome} />
      {currentBiome === FANTASY_BIOME_ID && <FantasyBiomeProps />}
      {currentBiome === VILLAGE_BIOME_ID && <VillageBiomeProps />}
    </Suspense>
  );

  let wrappedWorld = worldContent;
  if (currentBiome === VILLAGE_BIOME_ID) {
    wrappedWorld = <VillageGltfProvider>{worldContent}</VillageGltfProvider>;
  } else if (currentBiome === FANTASY_BIOME_ID) {
    wrappedWorld = <FantasyGltfProvider>{worldContent}</FantasyGltfProvider>;
  }

  return (
    <>
      <Atmosphere biomeType={fantasyBiome} />
      <PlantGltfPreloader />
      {wrappedWorld}

      <Suspense fallback={null}>
        <Player
          key={`player-${currentBiome}`}
          currentPathId={currentBiome}
          characterStyle={player?.characterStyle}
          ref={playerRef}
          modelRotation={MODEL_ROTATIONS.player}
          spawnPosition={playerSpawnPosition}
        />
      </Suspense>

      <AimIndicator ball={equippedBall} playerRef={playerRef} throwPower={throwPower} />

      {(currentBiome === 1 || fantasyBiome === 'desert') && (
        <Sandstorm playerRef={playerRef} />
      )}
      {(currentBiome === 2 || currentBiome === 5 || fantasyBiome === 'icy') && (
        <Snowstorm playerRef={playerRef} />
      )}

      {isCompanionOut && (
        <CompanionCreature
          key={`companion-${currentBiome}-${player?.companion?.entryId || 'default'}`}
          companion={player?.companion}
          currentPathId={currentBiome}
          ref={companionRef}
          modelRotation={getRotationForPokemon(player?.companion)}
          modelUrl={companionModelUrl}
          playerRef={playerRef}
          spawnPosition={companionSpawnPosition || playerSpawnPosition}
        />
      )}

      <ThirdPersonCamera targetRef={playerRef} />
      <SafePointerLockControls />

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

      {wild && (
        <Suspense key={`${currentBiome}-${wild.id}`} fallback={null}>
          <WildCreature
            currentPathId={currentBiome}
            id={wild.id}
            initialPosition={wild.position}
            isAlpha={wild.isAlpha}
            modelScale={wild.modelScale}
            modelUrl={wild.modelUrl}
            modelRotation={wild.modelRotation}
            primaryType={wild.primaryType}
            animProfile={wild.animProfile}
            playerRef={playerRef}
            registerRef={registerWildRef}
            status={wild.status}
            onFleeComplete={handleFleeComplete}
            fitToHeight={wild.fitToHeight}
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

export { SUN_POSITION };
