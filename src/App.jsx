import { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import Atmosphere, { SUN_POSITION } from './components/Atmosphere';
import GameScene from './components/GameScene';
import Hotbar from './components/Hotbar';
import LoadingOverlay from './components/LoadingOverlay';
import SafePointerLockControls from './components/SafePointerLockControls';
import { BALL_TYPES, DEFAULT_BALL } from './game/balls';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from './game/projectilePhysics';
import { WORLD_PATHS, clearAllBiomeCaches, preloadBiome } from './game/world';
import './App.css';

function App() {
  const [caughtCount, setCaughtCount] = useState(0);
  const [currentBiome, setCurrentBiome] = useState(0);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [isLoading, setIsLoading] = useState(false);
  const [ordinaryLeft, setOrdinaryLeft] = useState(0);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const equippedBall = useMemo(() => {
    return BALL_TYPES.find((ball) => ball.id === equippedBallId) || DEFAULT_BALL;
  }, [equippedBallId]);
  const handleCreatureCaught = useCallback((amount = 1) => {
    setCaughtCount((current) => current + amount);
  }, []);
  const handleBiomeSwitch = useCallback((biomeId) => {
    if (biomeId === currentBiome) {
      return;
    }

    setIsLoading(true);
    clearAllBiomeCaches();
    preloadBiome(biomeId);
    setCurrentBiome(biomeId);
  }, [currentBiome]);
  const handleBiomeReady = useCallback(() => {
    window.setTimeout(() => {
      setIsLoading(false);
    }, 220);
  }, []);

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
        <color attach="background" args={['#87ceeb']} />
        <fog attach="fog" args={['#d8eefb', 60, 320]} />
        <Atmosphere />
        <ambientLight intensity={0.72} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={1.35}
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

      <LoadingOverlay
        currentPathId={currentBiome}
        isLoading={isLoading}
      />
    </main>
  );
}

export default App;
