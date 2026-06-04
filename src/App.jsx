import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import Atmosphere, { SUN_POSITION } from './components/Atmosphere';
import BattleRoyaleShell from './components/BattleRoyaleShell';
import GameScene from './components/GameScene';
import Hotbar from './components/Hotbar';
import LoadingOverlay from './components/LoadingOverlay';
import ModeSelectScreen from './components/ModeSelectScreen';
import SafePointerLockControls from './components/SafePointerLockControls';
import { BALL_TYPES, DEFAULT_BALL } from './game/balls';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from './game/projectilePhysics';
import {
  WORLD_PATHS,
  getBiomeCacheSummary,
  preloadBiome,
} from './game/world';
import {
  clearBiomeLoadMetrics,
  downloadBiomeLoadMetrics,
  recordBiomeLoadMetric,
} from './game/biomeLoadMetrics';
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
  desert: {
    background: '#9ed8f2',
    fog: '#e7d8b3',
    fogNear: 45,
    fogFar: 240,
    ambient: 0.76,
    sun: 1.38,
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
  const [currentBiome, setCurrentBiome] = useState(0);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [isLoading, setIsLoading] = useState(false);
  const [ordinaryLeft, setOrdinaryLeft] = useState(0);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const activeBiome = WORLD_PATHS.find((biome) => biome.id === currentBiome) ||
    WORLD_PATHS[0];
  const sceneTheme = BIOME_SCENE_THEMES[activeBiome.biome] ||
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
      cacheBefore: getBiomeCacheSummary(biomeId),
      startMs: getMetricNow(),
      trigger,
    };
  }, []);
  const handleBiomeSwitch = useCallback((biomeId) => {
    if (biomeId === currentBiome) {
      return;
    }

    setIsLoading(true);
    beginBiomeLoadMetric(biomeId, 'biome_switch');
    setCurrentBiome(biomeId);
  }, [beginBiomeLoadMetric, currentBiome]);
  const handleBiomeReady = useCallback((loadSummary = {}) => {
    const pending = pendingBiomeLoadRef.current;

    if (pending && pending.biomeId === currentBiome) {
      const cacheAfter = getBiomeCacheSummary(currentBiome);
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
  }, [currentBiome]);

  useEffect(() => {
    preloadBiome(currentBiome);
  }, [currentBiome]);

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
        <Atmosphere biomeType={activeBiome.biome} />
        <ambientLight intensity={sceneTheme.ambient} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={sceneTheme.sun}
          position={SUN_POSITION}
        />
        <SafePointerLockControls pointerSpeed={0.65} />
        <GameScene
          currentBiome={currentBiome}
          equippedBall={equippedBall}
          onBiomeReady={handleBiomeReady}
          onCreatureCaught={handleCreatureCaught}
          onOrdinaryCountChange={setOrdinaryLeft}
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

      <LoadingOverlay
        currentPathId={currentBiome}
        isLoading={isLoading}
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
