import { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import GameScene from './components/GameScene';
import Hotbar from './components/Hotbar';
import { BALL_TYPES, DEFAULT_BALL } from './game/balls';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
} from './game/projectilePhysics';
import './App.css';

function App() {
  const [caughtCount, setCaughtCount] = useState(0);
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const equippedBall = useMemo(() => {
    return BALL_TYPES.find((ball) => ball.id === equippedBallId) || DEFAULT_BALL;
  }, [equippedBallId]);
  const handleCreatureCaught = useCallback((amount = 1) => {
    setCaughtCount((current) => current + amount);
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
          gl.toneMappingExposure = 1.05;
        }}
      >
        <color attach="background" args={['#87CEEB']} />
        <fog attach="fog" args={['#87CEEB', 10, 50]} />
        <GameScene
          equippedBall={equippedBall}
          onCreatureCaught={handleCreatureCaught}
          throwPower={throwPower}
        />
      </Canvas>

      <div className="hud">
        <strong>Voxel Legends Prototype</strong>
        <span>Move with WASD or Arrow Keys</span>
        <span>Recall/send companion with E</span>
        <span>Throw with Spacebar</span>
        <span>Adjust power with Q/R or Mouse Wheel</span>
        <span>Ball: {equippedBall.name}</span>
        <span>Creatures Caught: {caughtCount}</span>
      </div>

      <Hotbar equippedBallId={equippedBallId} throwPower={throwPower} />
    </main>
  );
}

export default App;
