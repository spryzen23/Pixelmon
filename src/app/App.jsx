import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import Atmosphere, { SUN_POSITION } from '../environment/Atmosphere';
import BattleRoyaleShell from '../scenes/battleRoyale/BattleRoyaleShell';
import GameScene from '../scenes/normal/GameScene';
import Hotbar from '../ui/Hotbar';
import LoadingOverlay from '../ui/LoadingOverlay';
import ModeSelectScreen from './ModeSelectScreen';
import SafePointerLockControls from '../systems/SafePointerLockControls';
import { BALL_TYPES, DEFAULT_BALL } from '../game/balls';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from '../game/projectilePhysics';
import {
  CAVE_BIOME_ID,
  CAVE_ZONES,
  WORLD_PATHS,
  getBiomeCacheSummary,
  getIceRoomExitSpawnPosition,
  preloadBiome,
} from '../world';
import {
  clearBiomeLoadMetrics,
  downloadBiomeLoadMetrics,
  recordBiomeLoadMetric,
} from '../game/biomeLoadMetrics';
import './App.css';

const BIOME_SCENE_THEMES = {
  cave: {
    background: '#1d2428',
    fog: '#2f3538',
    fogNear: 25,
    fogFar: 150,
    ambient: 0.48,
    sun: 0.85,
  },
  moonlit: {
    background: '#071126',
    fog: '#0f1834',
    fogNear: 16,
    fogFar: 105,
    ambient: 0.34,
    sun: 0.18,
  },
  crystal_blossom: {
    background: '#071126',
    fog: '#0f1834',
    fogNear: 16,
    fogFar: 105,
    ambient: 0.34,
    sun: 0.18,
  },
  desert: {
    background: '#9ed8f2',
    fog: '#e7d8b3',
    fogNear: 45,
    fogFar: 240,
    ambient: 0.76,
    sun: 1.38,
  },
  distortion: {
    background: '#03020b',
    fog: '#160829',
    fogNear: 10,
    fogFar: 82,
    ambient: 0.26,
    sun: 0.08,
  },
  grass: {
    background: '#87ceeb',
    fog: '#d8eefb',
    fogNear: 60,
    fogFar: 320,
    ambient: 0.72,
    sun: 1.35,
  },
  icy: {
    background: '#d9edf8',
    fog: '#eaf7ff',
    fogNear: 35,
    fogFar: 210,
    ambient: 0.82,
    sun: 1.05,
  },
  mossy: {
    background: '#8bc8d7',
    fog: '#c6e5d9',
    fogNear: 48,
    fogFar: 250,
    ambient: 0.68,
    sun: 1.18,
  },
  ruins: {
    background: '#92c8d8',
    fog: '#d5ddc8',
    fogNear: 48,
    fogFar: 260,
    ambient: 0.68,
    sun: 1.18,
  },
  sky: {
    background: '#8fc6ff',
    fog: '#dff5ff',
    fogNear: 20,
    fogFar: 120,
    ambient: 0.88,
    sun: 1.28,
  },
  volcanic: {
    background: '#4c3433',
    fog: '#6a3d35',
    fogNear: 32,
    fogFar: 190,
    ambient: 0.44,
    sun: 0.92,
  },
};

function getMetricNow() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

function NormalGame() {
  const pendingBiomeLoadRef = useRef({
    biomeId: WORLD_PATHS[0].id,
    biomeName: WORLD_PATHS[0].name,
    biomeType: WORLD_PATHS[0].biome,
    cacheBefore: getBiomeCacheSummary(WORLD_PATHS[0].id),
    startMs: getMetricNow(),
    trigger: 'initial_mount',
  });
  const [caughtCount, setCaughtCount] = useState(0);
  const [caveZone, setCaveZone] = useState(CAVE_ZONES.EXTERIOR);
  const [isCaveTransitioning, setIsCaveTransitioning] = useState(false);
  const [currentBiome, setCurrentBiome] = useState(0);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [iceRoomId, setIceRoomId] = useState(null);
  const [iceSpawnOverride, setIceSpawnOverride] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ordinaryLeft, setOrdinaryLeft] = useState(0);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const activeBiome = WORLD_PATHS.find((biome) => biome.id === currentBiome) ||
    WORLD_PATHS[0];
  const sceneTheme = iceRoomId
    ? {
      background: '#07111c',
      fog: '#0b1724',
      fogNear: 3,
      fogFar: 34,
      ambient: 0.2,
      sun: 0.08,
    }
    : currentBiome === CAVE_BIOME_ID &&
    caveZone === CAVE_ZONES.INTERIOR
    ? {
      background: '#081018',
      fog: '#101a24',
      fogNear: 4,
      fogFar: 55,
      ambient: 0.18,
      sun: 0.15,
    }
    : currentBiome === CAVE_BIOME_ID
      ? BIOME_SCENE_THEMES.mossy
    : BIOME_SCENE_THEMES[activeBiome.biome] ||
    BIOME_SCENE_THEMES.grass;
  const equippedBall = useMemo(() => {
    return BALL_TYPES.find((ball) => ball.id === equippedBallId) || DEFAULT_BALL;
  }, [equippedBallId]);
  const handleCreatureCaught = useCallback((amount = 1) => {
    setCaughtCount((current) => current + amount);
  }, []);
  const beginBiomeLoadMetric = useCallback((biomeId, trigger) => {
    const biome = WORLD_PATHS.find((path) => path.id === biomeId) ||
      WORLD_PATHS[0];

    pendingBiomeLoadRef.current = {
      biomeId,
      biomeName: biome.name,
      biomeType: biome.biome,
      cacheBefore: getBiomeCacheSummary(
        biomeId,
        biomeId === CAVE_BIOME_ID ? CAVE_ZONES.EXTERIOR : caveZone
      ),
      startMs: getMetricNow(),
      trigger,
    };
  }, [caveZone]);
  const handleBiomeSwitch = useCallback((biomeId) => {
    if (biomeId === currentBiome) {
      return;
    }

    setIsLoading(true);
    setCaveZone(CAVE_ZONES.EXTERIOR);
    setIceRoomId(null);
    setIceSpawnOverride(null);
    beginBiomeLoadMetric(biomeId, 'biome_switch');
    setCurrentBiome(biomeId);
  }, [beginBiomeLoadMetric, currentBiome]);
  const handleBiomeReady = useCallback((loadSummary = {}) => {
    const pending = pendingBiomeLoadRef.current;

    if (pending && pending.biomeId === currentBiome) {
      const cacheAfter = getBiomeCacheSummary(currentBiome, caveZone);
      const cacheHit = pending.cacheBefore.chunkCount > 0;
      const activeBlockCount =
        loadSummary.activeBlockCount ?? cacheAfter.blockCount;
      const activeChunkCount =
        loadSummary.activeChunkCount ?? cacheAfter.chunkCount;
      const generatedChunkCountThisLoad = Math.max(
        0,
        cacheAfter.chunkCount - pending.cacheBefore.chunkCount
      );
      const durationMs = getMetricNow() - pending.startMs;

      recordBiomeLoadMetric({
        activeBlockCount,
        activeChunkCount,
        biomeId: currentBiome,
        biomeName: pending.biomeName,
        biomeType: pending.biomeType,
        blockCount: activeBlockCount,
        cacheHit,
        cachedChunkCount: cacheAfter.chunkCount,
        chunkCount: activeChunkCount,
        durationMs: Number(durationMs.toFixed(2)),
        firstLoad: !cacheHit,
        generatedChunkCountThisLoad,
        hydratedChunkCount: activeChunkCount,
        trigger: pending.trigger,
      });
      pendingBiomeLoadRef.current = null;
    }

    window.setTimeout(() => {
      setIsLoading(false);
    }, 220);
  }, [caveZone, currentBiome]);

  useEffect(() => {
    preloadBiome(currentBiome, caveZone);
  }, [caveZone, currentBiome]);

  const handleEnterCave = useCallback(() => {
    if (currentBiome !== CAVE_BIOME_ID || caveZone === CAVE_ZONES.INTERIOR) {
      return;
    }

    setIsCaveTransitioning(true);

    window.setTimeout(() => {
      setCaveZone(CAVE_ZONES.INTERIOR);
      window.setTimeout(() => {
        setIsCaveTransitioning(false);
      }, 260);
    }, 220);
  }, [caveZone, currentBiome]);

  const handleExitCave = useCallback(() => {
    if (currentBiome !== CAVE_BIOME_ID || caveZone !== CAVE_ZONES.INTERIOR) {
      return;
    }

    setIsCaveTransitioning(true);

    window.setTimeout(() => {
      setCaveZone(CAVE_ZONES.EXTERIOR);
      window.setTimeout(() => {
        setIsCaveTransitioning(false);
      }, 260);
    }, 220);
  }, [caveZone, currentBiome]);

  const handleEnterIceRoom = useCallback((roomId) => {
    setIsCaveTransitioning(true);
    setIceSpawnOverride(null);

    window.setTimeout(() => {
      setIceRoomId(roomId);
      window.setTimeout(() => {
        setIsCaveTransitioning(false);
      }, 260);
    }, 220);
  }, []);

  const handleExitIceRoom = useCallback((roomId) => {
    setIsCaveTransitioning(true);

    window.setTimeout(() => {
      setIceSpawnOverride(getIceRoomExitSpawnPosition(roomId));
      setIceRoomId(null);
      window.setTimeout(() => {
        setIsCaveTransitioning(false);
      }, 260);
    }, 220);
  }, []);

  useEffect(() => {
    const updateThrowPower = (direction) => {
      setThrowPower((current) => {
        const nextPower = current + direction * THROW_POWER_STEP;

        return Math.max(MIN_THROW_POWER, Math.min(MAX_THROW_POWER, nextPower));
      });
    };

    const handleKeyDown = (event) => {
      const selectedBall = BALL_TYPES.find((ball) => ball.key === event.key);

      if (selectedBall) {
        setEquippedBallId(selectedBall.id);
      }

      if (event.code === 'KeyR') {
        updateThrowPower(1);
      }

      if (event.code === 'KeyQ') {
        updateThrowPower(-1);
      }
    };

    const handleWheel = (event) => {
      event.preventDefault();
      updateThrowPower(event.deltaY < 0 ? 1 : -1);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      const targetTag = event.target?.tagName?.toLowerCase();

      if (
        event.repeat ||
        targetTag === 'input' ||
        targetTag === 'textarea' ||
        targetTag === 'select' ||
        event.code !== 'KeyX'
      ) {
        return;
      }

      if (iceRoomId) {
        event.preventDefault();
        handleExitIceRoom(iceRoomId);
        return;
      }

      if (currentBiome === CAVE_BIOME_ID && caveZone === CAVE_ZONES.INTERIOR) {
        event.preventDefault();
        handleExitCave();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [
    caveZone,
    currentBiome,
    handleExitCave,
    handleExitIceRoom,
    iceRoomId,
  ]);

  return (
    <main className="game-shell">
      <Canvas
        shadows
        camera={{ position: [0, 8, 10], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFSoftShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <color attach="background" args={[sceneTheme.background]} />
        <fog
          attach="fog"
          args={[sceneTheme.fog, sceneTheme.fogNear, sceneTheme.fogFar]}
        />
        {!iceRoomId &&
          activeBiome.biome !== 'distortion' &&
          !(currentBiome === CAVE_BIOME_ID &&
          caveZone === CAVE_ZONES.INTERIOR) && (
          <Atmosphere biomeType={activeBiome.biome} />
        )}
        <ambientLight intensity={sceneTheme.ambient} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={sceneTheme.sun}
          position={SUN_POSITION}
        />
        <SafePointerLockControls pointerSpeed={0.65} />
        <GameScene
          caveZone={caveZone}
          currentBiome={currentBiome}
          equippedBall={equippedBall}
          onBiomeReady={handleBiomeReady}
          onCreatureCaught={handleCreatureCaught}
          onEnterCave={handleEnterCave}
          onEnterIceRoom={handleEnterIceRoom}
          onExitIceRoom={handleExitIceRoom}
          onOrdinaryCountChange={setOrdinaryLeft}
          iceRoomId={iceRoomId}
          spawnPositionOverride={iceSpawnOverride}
          throwPower={throwPower}
        />
      </Canvas>

      <div className="hud">
        <strong>Voxel Legends Prototype</strong>
        <span>Click game window to lock mouse</span>
        <span>Move with WASD or Arrow Keys</span>
        <span>Recall/send companion with E</span>
        <span>Throw with Spacebar</span>
        <span>Adjust power with Q/R or Mouse Wheel</span>
        <span>Exit caves / rooms with X</span>
        <span>Ball: {equippedBall.name}</span>
        <span>Spawns before Alpha: {ordinaryLeft}</span>
        <span>Creatures Caught: {caughtCount}</span>
      </div>

      <div className="crosshair" aria-hidden="true">
        <span className="crosshair-line crosshair-line-horizontal" />
        <span className="crosshair-line crosshair-line-vertical" />
        <span className="crosshair-dot" />
      </div>

      <Hotbar equippedBallId={equippedBallId} throwPower={throwPower} />

      <div className="path-menu">
        <div className="path-list">
          {WORLD_PATHS.map((biome) => (
            <button
              key={biome.id}
              className={biome.id === currentBiome ? 'active' : ''}
              disabled={isLoading}
              type="button"
              onClick={() => handleBiomeSwitch(biome.id)}
            >
              <span>{biome.id + 1}</span>
              {biome.name}
            </button>
          ))}
        </div>

        <div className="analytics-actions">
          <button type="button" onClick={downloadBiomeLoadMetrics}>
            Export Metrics
          </button>
          <button type="button" onClick={clearBiomeLoadMetrics}>
            Clear Metrics
          </button>
        </div>
      </div>

      <LoadingOverlay
        currentPathId={currentBiome}
        isLoading={isLoading}
      />

      <div
        className={`cave-fade-overlay ${
          isCaveTransitioning ? 'visible' : ''
        }`}
      />
    </main>
  );
}

function App() {
  const [gameMode, setGameMode] = useState(null);

  if (gameMode === 'normal') {
    return <NormalGame />;
  }

  if (gameMode === 'battleRoyale') {
    return <BattleRoyaleShell onBackToMenu={() => setGameMode(null)} />;
  }

  return <ModeSelectScreen onSelectMode={setGameMode} />;
}

export default App;
