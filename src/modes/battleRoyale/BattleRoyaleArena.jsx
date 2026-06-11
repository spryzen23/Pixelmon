import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, PCFShadowMap, MathUtils, Vector3 } from 'three';
import AimIndicator from '../../components/AimIndicator';
import AnimatedModel from '../../components/AnimatedModel';
import Ashfall from '../../components/biomes/volcanic/Ashfall';
import Atmosphere, { SUN_POSITION } from '../../components/Atmosphere';
import CaveEntrance from '../../components/biomes/cave/CaveEntrance';
import CaveInteriorEffects from '../../components/biomes/cave/CaveInteriorEffects';
import DistortionRealmLandmarks from '../../components/biomes/distortion/DistortionRealmLandmarks';
import DistantSkyIsland from '../../components/biomes/sky/DistantSkyIsland';
import Hotbar from '../../components/Hotbar';
import IceMountainLandmarks from '../../components/biomes/icy/IceMountainLandmarks';
import MoonlitLandmarks from '../../components/biomes/moonlit/MoonlitLandmarks';
import OceanHorizon from '../../components/OceanHorizon';
import Projectile from '../../components/Projectile';
import Sandstorm from '../../components/Sandstorm';
import SkyBelowVista from '../../components/biomes/sky/SkyBelowVista';
import SkyBiomeLandmarks from '../../components/biomes/sky/SkyBiomeLandmarks';
import Snowstorm from '../../components/Snowstorm';
import VolcanoCrater from '../../components/biomes/volcanic/VolcanoCrater';
import VoxelWorld from '../../components/VoxelWorld';
import WildCreature from '../../components/WildCreature';
import { BALL_TYPES, DEFAULT_BALL } from '../../game/balls';
import {
  DEFAULT_THROW_POWER,
  MAX_THROW_POWER,
  MIN_THROW_POWER,
  THROW_POWER_STEP,
  getParallaxThrowVector,
} from '../../game/projectilePhysics';
import useKeyboardControls from '../../hooks/useKeyboardControls';
import {
  CAVE_BIOME_ID,
  CAVE_ZONES,
  PLAYER_HEIGHT,
  DISTORTION_BIOME_ID,
  SKY_BIOME_ID,
  WILD_CREATURE_HEIGHT,
  WORLD_PATHS,
  getBiomeBoundary,
  getEntityY,
  getOrdinaryCreatureAsset,
  isWalkablePosition,
  setActivePathId,
} from '../../game/world';

const PLAYER_COLORS = ['#4db3ff', '#ffdb4d', '#ff6b6b', '#9cff75'];
const MOVE_SPEED = 5;
const MOUSE_SENSITIVITY = 0.0024;
const CAMERA_DISTANCE = 7;
const CAMERA_HEIGHT = 3.2;
const CAMERA_SHOULDER_OFFSET = 1.4;
const PLAYER_MODEL_URL = '/assets/player.glb';
const PLAYER_MODEL_SCALE = 1.1;
const PLAYER_MODEL_OFFSET = [0, -PLAYER_HEIGHT / 2, 0];
const PLAYER_MODEL_ROTATION = [0, 0, 0];
const dropVector = new Vector3();
const cameraForward = new Vector3();
const cameraRight = new Vector3();
const desiredCameraPosition = new Vector3();
const cameraLookTarget = new Vector3();
const throwOrigin = new Vector3();
const throwForward = new Vector3();

function getDropPointPosition(
  dropPoint,
  currentBiome,
  caveZone = CAVE_ZONES.EXTERIOR
) {
  const x = dropPoint?.x || 0;
  const z = dropPoint?.z || 0;

  return [
    x,
    getEntityY(x, z, PLAYER_HEIGHT, undefined, currentBiome, caveZone),
    z,
  ];
}

function BattleRoyaleLocalPlayer({
  caveZone,
  currentBiome,
  dropPoint,
  onPositionChange,
  playerRef,
}) {
  const { gl } = useThree();
  const keys = useKeyboardControls();
  const lastEmitRef = useRef(0);
  const pitchRef = useRef(-0.12);
  const yawRef = useRef(0);
  const startPosition = useMemo(
    () => getDropPointPosition(dropPoint, currentBiome, caveZone),
    [caveZone, currentBiome, dropPoint]
  );

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.userData.didSpawn = false;
    }
  }, [playerRef, startPosition]);

  useEffect(() => {
    const canvas = gl.domElement;

    const handleCanvasClick = () => {
      if (document.pointerLockElement === canvas) {
        return;
      }

      canvas.requestPointerLock?.();
    };

    const handleMouseMove = (event) => {
      if (document.pointerLockElement !== canvas) {
        return;
      }

      yawRef.current += event.movementX * MOUSE_SENSITIVITY;
      const minPitch =
        currentBiome === SKY_BIOME_ID ||
          currentBiome === DISTORTION_BIOME_ID
          ? -1.08
          : -0.58;
      pitchRef.current = MathUtils.clamp(
        pitchRef.current - event.movementY * MOUSE_SENSITIVITY,
        minPitch,
        0.38
      );
    };

    canvas.addEventListener('click', handleCanvasClick);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentBiome, gl]);

  useFrame((state, delta) => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    if (!player.userData.didSpawn) {
      player.position.set(startPosition[0], startPosition[1], startPosition[2]);
      player.userData.didSpawn = true;
    }

    dropVector.set(0, 0, 0);
    cameraForward
      .set(Math.sin(yawRef.current), 0, -Math.cos(yawRef.current))
      .normalize();
    cameraRight
      .set(Math.cos(yawRef.current), 0, Math.sin(yawRef.current))
      .normalize();
    player.rotation.y = Math.atan2(cameraForward.x, cameraForward.z);

    if (keys.current.forward) {
      dropVector.add(cameraForward);
    }

    if (keys.current.backward) {
      dropVector.sub(cameraForward);
    }

    if (keys.current.left) {
      dropVector.sub(cameraRight);
    }

    if (keys.current.right) {
      dropVector.add(cameraRight);
    }

    if (dropVector.lengthSq() > 0) {
      dropVector.normalize();
      const biomeBoundary = getBiomeBoundary(currentBiome);
      const nextX = MathUtils.clamp(
        player.position.x + dropVector.x * MOVE_SPEED * delta,
        -biomeBoundary,
        biomeBoundary
      );
      const nextZ = MathUtils.clamp(
        player.position.z + dropVector.z * MOVE_SPEED * delta,
        -biomeBoundary,
        biomeBoundary
      );

      if (isWalkablePosition(nextX, nextZ, 0.38, currentBiome, caveZone)) {
        player.position.x = nextX;
        player.position.z = nextZ;
      }
    }

    const targetY = getEntityY(
      player.position.x,
      player.position.z,
      PLAYER_HEIGHT,
      player.position.y,
      currentBiome,
      caveZone
    );

    player.position.y = MathUtils.lerp(player.position.y, targetY, 0.2);
    desiredCameraPosition
      .copy(player.position)
      .addScaledVector(cameraForward, -CAMERA_DISTANCE)
      .addScaledVector(cameraRight, CAMERA_SHOULDER_OFFSET);
    desiredCameraPosition.y += CAMERA_HEIGHT;
    cameraLookTarget.set(
      player.position.x + cameraForward.x * 8,
      player.position.y + 1 + Math.sin(pitchRef.current) * 8,
      player.position.z + cameraForward.z * 8
    );
    state.camera.position.lerp(desiredCameraPosition, 0.12);
    state.camera.lookAt(cameraLookTarget);

    if (state.clock.elapsedTime - lastEmitRef.current > 0.15) {
      lastEmitRef.current = state.clock.elapsedTime;
      onPositionChange({
        x: Number(player.position.x.toFixed(2)),
        y: Number(player.position.y.toFixed(2)),
        z: Number(player.position.z.toFixed(2)),
      });
    }
  });

  return (
    <group ref={playerRef}>
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[0.65, PLAYER_HEIGHT, 0.65]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <Suspense
        fallback={
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.65, PLAYER_HEIGHT, 0.65]} />
            <meshStandardMaterial color="#4db3ff" roughness={0.7} />
          </mesh>
        }
      >
        <AnimatedModel
          url={PLAYER_MODEL_URL}
          actionName="Idle"
          fallbackActionName={['Walk', 'Run']}
          position={PLAYER_MODEL_OFFSET}
          rotation={PLAYER_MODEL_ROTATION}
          scale={PLAYER_MODEL_SCALE}
        />
      </Suspense>
    </group>
  );
}

function RemotePlayerMarker({ caveZone, currentBiome, dropPoint, index, player }) {
  const position = player.position
    ? [player.position.x, player.position.y, player.position.z]
    : getDropPointPosition(dropPoint, currentBiome, caveZone);

  return (
    <group position={position}>
      <mesh castShadow={false} receiveShadow={false}>
        <boxGeometry args={[0.62, PLAYER_HEIGHT, 0.62]} />
        <meshBasicMaterial
          colorWrite={false}
          depthWrite={false}
          opacity={0}
          transparent
        />
      </mesh>
      <Suspense
        fallback={
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.62, PLAYER_HEIGHT, 0.62]} />
            <meshStandardMaterial
              color={PLAYER_COLORS[(index + 1) % PLAYER_COLORS.length]}
              roughness={0.7}
            />
          </mesh>
        }
      >
        <AnimatedModel
          url={PLAYER_MODEL_URL}
          actionName="Idle"
          fallbackActionName={['Walk', 'Run']}
          position={PLAYER_MODEL_OFFSET}
          rotation={PLAYER_MODEL_ROTATION}
          scale={PLAYER_MODEL_SCALE}
        />
      </Suspense>
      <mesh position={[0, PLAYER_HEIGHT * 0.72, 0]}>
        <boxGeometry args={[0.84, 0.12, 0.84]} />
        <meshBasicMaterial color="#fff3a8" />
      </mesh>
    </group>
  );
}

function BattleRoyaleCatchLayer({
  ball,
  caveZone,
  creatures = [],
  currentBiome,
  onCreatureCaught,
  playerRef,
  throwPower,
}) {
  const { camera } = useThree();
  const projectileId = useRef(0);
  const wildRefs = useRef(new Map());
  const wildStatusRef = useRef(new Map());
  const projectileRefs = useRef(new Map());
  const [projectiles, setProjectiles] = useState([]);
  const shouldShowCreatures =
    currentBiome !== CAVE_BIOME_ID || caveZone === CAVE_ZONES.INTERIOR;

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

  useEffect(() => {
    wildStatusRef.current.clear();
    creatures.forEach((creature) => {
      wildStatusRef.current.set(creature.id, 'active');
    });
  }, [creatures]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.repeat || event.code !== 'Space' || !playerRef.current) {
        return;
      }

      event.preventDefault();
      getParallaxThrowVector(camera, playerRef.current, throwOrigin, throwForward);
      projectileId.current += 1;
      setProjectiles((current) => [
        ...current,
        {
          direction: [throwForward.x, throwForward.y, throwForward.z],
          id: `br-projectile-${projectileId.current}`,
          ball,
          position: [throwOrigin.x, throwOrigin.y, throwOrigin.z],
          throwPower,
        },
      ]);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ball, camera, playerRef, throwPower]);

  return (
    <>
      <AimIndicator
        ball={ball}
        caveZone={caveZone}
        currentBiome={currentBiome}
        playerRef={playerRef}
        throwPower={throwPower}
      />

      {shouldShowCreatures && creatures.map((creature, index) => {
        const asset = getOrdinaryCreatureAsset(
          currentBiome,
          creature.assetIndex ?? index
        );
        const x = creature.x || 0;
        const z = creature.z || 0;
        const position = [
          x,
          getEntityY(
            x,
            z,
            WILD_CREATURE_HEIGHT,
            undefined,
            currentBiome,
            caveZone
          ),
          z,
        ];

        return (
          <Suspense key={creature.id} fallback={null}>
            <WildCreature
              caveZone={caveZone}
              currentPathId={currentBiome}
              id={creature.id}
              initialPosition={position}
              isStatic
              modelRotation={asset.rotation || [0, Math.PI / 2, 0]}
              modelScale={asset.scale ?? 0.35}
              modelUrl={asset.url || '/assets/wild_creature.glb'}
              playerRef={playerRef}
              registerRef={registerWildRef}
              status="active"
              onFleeComplete={() => { }}
            />
          </Suspense>
        );
      })}

      {projectiles.map((projectile) => (
        <Projectile
          key={projectile.id}
          id={projectile.id}
          ball={projectile.ball}
          caveZone={caveZone}
          currentBiome={currentBiome}
          direction={projectile.direction}
          initialPosition={projectile.position}
          onCaptureFail={() => { }}
          onCaptureStart={() => { }}
          onCaptureSuccess={(creatureId) => {
            onCreatureCaught(creatureId);
          }}
          onExpire={removeProjectile}
          registerRef={registerProjectileRef}
          throwPower={projectile.throwPower}
          wildRefs={wildRefs}
          wildStatusRef={wildStatusRef}
        />
      ))}
    </>
  );
}

export default function BattleRoyaleArena({
  creatures = [],
  currentBiome = 0,
  dropPoints = [],
  localPlayerId = '',
  onCreatureCaught = () => { },
  onPositionChange = () => { },
  players = [],
}) {
  const [equippedBallId, setEquippedBallId] = useState(DEFAULT_BALL.id);
  const [caveZone, setCaveZone] = useState(CAVE_ZONES.EXTERIOR);
  const [isCaveTransitioning, setIsCaveTransitioning] = useState(false);
  const [throwPower, setThrowPower] = useState(DEFAULT_THROW_POWER);
  const localPlayerRef = useRef();
  const activeBiome = WORLD_PATHS.find((biome) => biome.id === currentBiome) ||
    WORLD_PATHS[0];
  const localPlayer = players.find((player) => player.id === localPlayerId);
  const localDropPoint = dropPoints.find(
    (point) => point.id === localPlayer?.dropPointId
  ) || dropPoints[2] || dropPoints[0];
  const equippedBall = useMemo(() => {
    return BALL_TYPES.find((ball) => ball.id === equippedBallId) ||
      DEFAULT_BALL;
  }, [equippedBallId]);

  useEffect(() => {
    setActivePathId(currentBiome);
    setCaveZone(CAVE_ZONES.EXTERIOR);
  }, [currentBiome]);

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
    <>
      <Canvas
        shadows
        camera={{ position: [4, 6, 8], fov: 58 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = PCFShadowMap;
          gl.toneMapping = ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
        }}
      >
        <color
          attach="background"
          args={[activeBiome.biome === 'distortion' ? '#03020b' : '#87ceeb']}
        />
        <fog
          attach="fog"
          args={[
            activeBiome.biome === 'distortion' ? '#160829' : '#d8eefb',
            activeBiome.biome === 'distortion' ? 10 : 60,
            activeBiome.biome === 'distortion' ? 82 : 320,
          ]}
        />
        {caveZone !== CAVE_ZONES.INTERIOR &&
          activeBiome.biome !== 'distortion' && (
            <Atmosphere biomeType={activeBiome.biome} />
          )}
        <ambientLight intensity={activeBiome.biome === 'distortion' ? 0.26 : 0.7} />
        <directionalLight
          castShadow
          color="#ffffff"
          intensity={activeBiome.biome === 'distortion' ? 0.08 : 1.25}
          position={SUN_POSITION}
        />
        {caveZone !== CAVE_ZONES.INTERIOR &&
          activeBiome.biome !== 'sky' &&
          activeBiome.biome !== 'distortion' &&
          activeBiome.biome !== 'moonlit' && (
            <OceanHorizon biomeType={activeBiome.biome} />
          )}
        {caveZone !== CAVE_ZONES.INTERIOR &&
          activeBiome.biome !== 'sky' &&
          activeBiome.biome !== 'distortion' &&
          activeBiome.biome !== 'moonlit' && (
            <DistantSkyIsland currentBiome={currentBiome} />
          )}
        <VoxelWorld
          caveZone={caveZone}
          currentBiome={currentBiome}
          onBiomeReady={() => { }}
          playerRef={localPlayerRef}
        />
        {currentBiome === CAVE_BIOME_ID &&
          caveZone === CAVE_ZONES.EXTERIOR && (
            <CaveEntrance
              onEnterCave={handleEnterCave}
              playerRef={localPlayerRef}
            />
          )}
        {currentBiome === CAVE_BIOME_ID &&
          caveZone === CAVE_ZONES.INTERIOR && (
            <CaveInteriorEffects playerRef={localPlayerRef} />
          )}
        {activeBiome.biome === 'volcanic' && (
          <VolcanoCrater currentBiome={currentBiome} />
        )}
        {activeBiome.biome === 'moonlit' && (
          <MoonlitLandmarks />
        )}
        {activeBiome.biome === 'distortion' && (
          <DistortionRealmLandmarks />
        )}
        {activeBiome.biome === 'sky' && (
          <>
            <SkyBiomeLandmarks />
            <SkyBelowVista />
          </>
        )}
        {activeBiome.biome === 'icy' && <IceMountainLandmarks />}
        {activeBiome.biome === 'desert' && (
          <Sandstorm playerRef={localPlayerRef} />
        )}
        {activeBiome.biome === 'volcanic' && (
          <Ashfall playerRef={localPlayerRef} />
        )}
        {activeBiome.biome === 'icy' && (
          <Snowstorm playerRef={localPlayerRef} />
        )}
        <BattleRoyaleLocalPlayer
          caveZone={caveZone}
          currentBiome={currentBiome}
          dropPoint={localDropPoint}
          onPositionChange={onPositionChange}
          playerRef={localPlayerRef}
        />
        <BattleRoyaleCatchLayer
          ball={equippedBall}
          caveZone={caveZone}
          creatures={creatures}
          currentBiome={currentBiome}
          onCreatureCaught={onCreatureCaught}
          playerRef={localPlayerRef}
          throwPower={throwPower}
        />
        {players
          .filter((player) => player.id !== localPlayerId)
          .map((player, index) => {
            const dropPoint = dropPoints.find(
              (point) => point.id === player.dropPointId
            );

            return (
              <RemotePlayerMarker
                key={player.id}
                caveZone={caveZone}
                currentBiome={currentBiome}
                dropPoint={dropPoint}
                index={index}
                player={player}
              />
            );
          })}
      </Canvas>
      <Hotbar
        equippedBallId={equippedBallId}
        throwPower={throwPower}
      />
      <div
        className={`cave-fade-overlay ${isCaveTransitioning ? 'visible' : ''
          }`}
      />
    </>
  );
}
