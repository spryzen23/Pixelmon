import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import AimIndicator from './AimIndicator';
import Atmosphere, { SUN_POSITION } from './Atmosphere';
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
import { getTypeAnimProfile } from '../game/pokemonData';
import { getSpawnCandidates, pickRandomSpawn, isAlphaEligible } from '../game/spawnController';
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
const MODEL_ROTATIONS = {
  player: [0, 0, 0],
  wildCreature: [0, Math.PI / 2, 0],
  companion: [0, 0, 0],
};

function entryToWild(entry, position) {
  if (!entry) return null;
  return {
    ...entry,
    id: WILD_ID,
    position,
    status: 'active',
    modelUrl: entry.modelUrl || '/assets/wild_creature.glb',
    modelScale: entry.isAlpha ? 0.35 * 2.5 : 0.35,
    modelRotation: MODEL_ROTATIONS.wildCreature,
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
}) {
  const currentBiome = session.pathId;
  const playerRef = useRef();
  const companionRef = useRef();
  const wildRefs = useRef(new Map());
  const wildStatusRef = useRef(new Map());
  const projectileRefs = useRef(new Map());
  const projectileId = useRef(0);
  const burstId = useRef(0);
  const effectId = useRef(0);
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

  const spawnWild = useCallback(() => {
    const state = gameRuntime.spawnState;
    const byLevel = gameRuntime.byLevel;
    if (!state || !byLevel) return;

    const pos = getRandomGrassPosition(
      0.5,
      WILD_CREATURE_HEIGHT,
      playerRef.current?.position.x ?? 0,
      playerRef.current?.position.z ?? 0,
      14,
      currentBiome
    );

    let entry = null;
    if (isAlphaEligible(state) && !state.alphaCaught && Math.random() < 0.3) {
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

    const mapped = entryToWild(entry, pos);
    setWild(mapped);
    wildStatusRef.current.set(WILD_ID, mapped ? 'active' : 'idle');
    onSpawnProgress?.(state);
  }, [gameRuntime, currentBiome, onSpawnProgress]);

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

  const addCompanionEffect = useCallback((position) => {
    effectId.current += 1;
    setCompanionEffects((current) => [
      ...current,
      { id: `companion-effect-${effectId.current}`, position },
    ]);
  }, []);

  const removeCompanionEffect = useCallback((id) => {
    setCompanionEffects((current) => current.filter((e) => e.id !== id));
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
      <OceanHorizon />
      <VoxelWorld currentBiome={currentBiome} />
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
      <Atmosphere />
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

      {currentBiome === 1 && <Sandstorm playerRef={playerRef} />}
      {(currentBiome === 2 || currentBiome === 5) && <Snowstorm playerRef={playerRef} />}

      {isCompanionOut && (
        <CompanionCreature
          key={`companion-${currentBiome}`}
          currentPathId={currentBiome}
          ref={companionRef}
          modelRotation={MODEL_ROTATIONS.companion}
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
            onFleeComplete={() => {
              setWild(null);
              spawnWild();
            }}
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
