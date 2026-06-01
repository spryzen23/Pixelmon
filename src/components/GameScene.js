import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Vector3 } from 'three';
import AimIndicator from './AimIndicator';
import CaptureBurst from './CaptureBurst';
import CompanionCreature from './CompanionCreature';
import CompanionRecallEffect from './CompanionRecallEffect';
import Player from './Player';
import Projectile from './Projectile';
import Terrain from './Terrain';
import ThirdPersonCamera from './ThirdPersonCamera';
import WildCreature from './WildCreature';
import {
  WILD_CREATURE_HEIGHT,
  COMPANION_HEIGHT,
  PLAYER_START,
  getEntityY,
  getRandomGrassPosition,
} from '../game/world';
import { DEFAULT_BALL } from '../game/balls';
import {
  getParallaxThrowVector,
} from '../game/projectilePhysics';

const throwForward = new Vector3();
const throwOrigin = new Vector3();

function createWildCreatures() {
  const count = 3 + Math.floor(Math.random() * 3);

  return Array.from({ length: count }, (_, index) => ({
    id: `wild-${index}`,
    // Absolute world positions, biased into the starting camera/player area.
    position: getRandomGrassPosition(
      0.45,
      WILD_CREATURE_HEIGHT,
      PLAYER_START[0],
      PLAYER_START[2] + 6,
      7
    ),
    status: 'active',
  }));
}

export default function GameScene({
  equippedBall = DEFAULT_BALL,
  onCreatureCaught = () => {},
  throwPower,
}) {
  const { camera } = useThree();
  const playerRef = useRef();
  const companionRef = useRef();
  const wildRefs = useRef(new Map());
  const wildStatusRef = useRef(new Map());
  const projectileRefs = useRef(new Map());
  const projectileId = useRef(0);
  const effectId = useRef(0);
  const captureBurstId = useRef(0);
  const [wildCreatures, setWildCreatures] = useState(createWildCreatures);
  const [projectiles, setProjectiles] = useState([]);
  const [captureBursts, setCaptureBursts] = useState([]);
  const [isCompanionOut, setIsCompanionOut] = useState(true);
  const [companionSpawnPosition, setCompanionSpawnPosition] = useState(null);
  const [companionEffects, setCompanionEffects] = useState([]);

  useEffect(() => {
    wildStatusRef.current.clear();
    wildCreatures.forEach((wild) => {
      wildStatusRef.current.set(wild.id, wild.status);
    });
  }, [wildCreatures]);

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
    setWildCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'capturing' } : wild
      )
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
    setWildCreatures((current) =>
      current.filter((wild) => wild.id !== wildId)
    );
    onCreatureCaught(1);
  }, [onCreatureCaught]);

  const handleCaptureFail = useCallback((wildId) => {
    setWildCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'fleeing' } : wild
      )
    );
  }, []);

  const handleFleeComplete = useCallback((wildId) => {
    setWildCreatures((current) =>
      current.map((wild) =>
        wild.id === wildId ? { ...wild, status: 'active' } : wild
      )
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
          getEntityY(player.position.x, player.position.z, COMPANION_HEIGHT),
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
  }, [addCompanionEffect, camera, equippedBall, isCompanionOut, throwPower]);

  return (
    <>
      <Sky
        distance={450000}
        inclination={0.42}
        azimuth={0.24}
        rayleigh={3.2}
        turbidity={6.5}
        mieCoefficient={0.006}
        mieDirectionalG={0.78}
        sunPosition={[12, 16, 8]}
      />

      <hemisphereLight
        args={['#b9e8ff', '#6f8759', 0.75]}
      />
      <ambientLight intensity={0.22} />
      <directionalLight
        castShadow
        intensity={2.15}
        position={[12, 18, 9]}
        shadow-bias={-0.00025}
        shadow-normalBias={0.03}
        shadow-radius={5}
        shadow-mapSize={[4096, 4096]}
        shadow-camera-near={1}
        shadow-camera-far={45}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
      />

      <Suspense fallback={null}>
        <Terrain playerRef={playerRef} />
      </Suspense>
      <Player ref={playerRef} />
      <AimIndicator
        ball={equippedBall}
        playerRef={playerRef}
        throwPower={throwPower}
      />
      {isCompanionOut && (
        <CompanionCreature
          ref={companionRef}
          playerRef={playerRef}
          spawnPosition={companionSpawnPosition || undefined}
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

      {wildCreatures.map((wild) => (
        <WildCreature
          key={wild.id}
          id={wild.id}
          initialPosition={wild.position}
          playerRef={playerRef}
          registerRef={registerWildRef}
          status={wild.status}
          onFleeComplete={handleFleeComplete}
        />
      ))}

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
