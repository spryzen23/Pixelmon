import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap } from 'three';
import Ashfall from '../../components/biomes/volcanic/Ashfall';
import Atmosphere, { SUN_POSITION } from '../../components/Atmosphere';
import CaveEntrance from '../../components/biomes/cave/CaveEntrance';
import DistortionRealmLandmarks from '../../components/biomes/distortion/DistortionRealmLandmarks';
import IceMountainLandmarks from '../../components/biomes/icy/IceMountainLandmarks';
import OceanHorizon from '../../components/OceanHorizon';
import Sandstorm from '../../components/Sandstorm';
import Snowstorm from '../../components/Snowstorm';
import VolcanoCrater from '../../components/biomes/volcanic/VolcanoCrater';
import VoxelWorld from '../../components/VoxelWorld';
import {
  CAVE_BIOME_ID,
  CAVE_ZONES,
  WORLD_PATHS,
  setActivePathId,
} from '../../game/world';

function BlockyPlane() {
  const planeRef = useRef();
  const propellerRef = useRef();

  useFrame((state) => {
    const plane = planeRef.current;

    if (!plane) {
      return;
    }

    const progress = (state.clock.elapsedTime * 0.08) % 1;
    plane.position.x = -42 + progress * 84;
    plane.position.y = 20 + Math.sin(state.clock.elapsedTime * 1.6) * 0.35;
    plane.position.z = -10;

    const bank = Math.sin(state.clock.elapsedTime * 1.15) * 0.08;
    plane.rotation.set(0, Math.PI / 2, bank);

    if (propellerRef.current) {
      propellerRef.current.rotation.z += 0.9;
    }
  });

  return (
    <group ref={planeRef} rotation={[0, Math.PI / 2, 0]}>
      {/* Fuselage: local +Z is the nose, then the group yaw points it along world +X. */}
      <mesh castShadow>
        <boxGeometry args={[1.8, 1.25, 9.6]} />
        <meshStandardMaterial color="#d7dde4" roughness={0.52} />
      </mesh>
      <mesh position={[0, 0.05, 5.15]} castShadow>
        <boxGeometry args={[1.35, 0.95, 1.1]} />
        <meshStandardMaterial color="#eef2f7" roughness={0.48} />
      </mesh>
      <mesh position={[0, 0.62, 1.45]} castShadow>
        <boxGeometry args={[1.25, 0.58, 1.65]} />
        <meshStandardMaterial color="#7fb3d8" roughness={0.34} />
      </mesh>

      {/* Main wing, slightly stepped so it still reads as voxel/block-built. */}
      <mesh position={[0, 0.02, 0.15]} castShadow>
        <boxGeometry args={[13.5, 0.34, 2]} />
        <meshStandardMaterial color="#f4f7fb" roughness={0.46} />
      </mesh>
      <mesh position={[-4.65, -0.04, -0.35]} castShadow>
        <boxGeometry args={[3.2, 0.28, 1.45]} />
        <meshStandardMaterial color="#cbd3dc" roughness={0.52} />
      </mesh>
      <mesh position={[4.65, -0.04, -0.35]} castShadow>
        <boxGeometry args={[3.2, 0.28, 1.45]} />
        <meshStandardMaterial color="#cbd3dc" roughness={0.52} />
      </mesh>

      {/* Engines under the wings. */}
      <mesh position={[-3.4, -0.72, 0.55]} castShadow>
        <boxGeometry args={[1.2, 0.72, 1.25]} />
        <meshStandardMaterial color="#8f9aa6" roughness={0.58} />
      </mesh>
      <mesh position={[3.4, -0.72, 0.55]} castShadow>
        <boxGeometry args={[1.2, 0.72, 1.25]} />
        <meshStandardMaterial color="#8f9aa6" roughness={0.58} />
      </mesh>

      {/* Tail and stabilizers. */}
      <mesh position={[0, 1.12, -4.25]} castShadow>
        <boxGeometry args={[1.15, 2.25, 1.2]} />
        <meshStandardMaterial color="#aeb8c3" roughness={0.56} />
      </mesh>
      <mesh position={[0, 0.32, -4.35]} castShadow>
        <boxGeometry args={[5.1, 0.3, 1.15]} />
        <meshStandardMaterial color="#e7edf3" roughness={0.5} />
      </mesh>

      {/* Tiny landing skid blocks add scale and read well from the flyover camera. */}
      <mesh position={[-0.72, -0.9, -1.15]} castShadow>
        <boxGeometry args={[0.26, 0.22, 3.15]} />
        <meshStandardMaterial color="#58616b" roughness={0.62} />
      </mesh>
      <mesh position={[0.72, -0.9, -1.15]} castShadow>
        <boxGeometry args={[0.26, 0.22, 3.15]} />
        <meshStandardMaterial color="#58616b" roughness={0.62} />
      </mesh>

      {/* Nose propeller: simple spinning cross, intentionally blocky. */}
      <group ref={propellerRef} position={[0, 0, 5.85]}>
        <mesh>
          <boxGeometry args={[0.22, 3.1, 0.18]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[3.1, 0.22, 0.18]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.42, 0.42, 0.3]} />
          <meshStandardMaterial color="#f4c542" roughness={0.42} />
        </mesh>
      </group>
    </group>
  );
}

function DropCamera() {
  useFrame(({ camera }) => {
    camera.position.set(0, 28, 44);
    camera.lookAt(0, 2, -8);
  });

  return null;
}

export default function BattleRoyaleDropScene({ currentBiome = 0 }) {
  const activeBiome = useMemo(() => {
    return WORLD_PATHS.find((biome) => biome.id === currentBiome) ||
      WORLD_PATHS[0];
  }, [currentBiome]);

  useEffect(() => {
    setActivePathId(currentBiome);
  }, [currentBiome]);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 28, 44], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = PCFSoftShadowMap;
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
          activeBiome.biome === 'distortion' ? 18 : 70,
          activeBiome.biome === 'distortion' ? 125 : 360,
        ]}
      />
      {activeBiome.biome !== 'distortion' && (
        <Atmosphere biomeType={activeBiome.biome} />
      )}
      <ambientLight intensity={activeBiome.biome === 'distortion' ? 0.28 : 0.78} />
      <directionalLight
        castShadow
        color="#ffffff"
        intensity={activeBiome.biome === 'distortion' ? 0.14 : 1.25}
        position={SUN_POSITION}
      />
      {activeBiome.biome !== 'moonlit' &&
        activeBiome.biome !== 'distortion' && (
        <OceanHorizon biomeType={activeBiome.biome} />
      )}
      <VoxelWorld
        caveZone={CAVE_ZONES.EXTERIOR}
        currentBiome={currentBiome}
        onBiomeReady={() => {}}
      />
      {currentBiome === CAVE_BIOME_ID && <CaveEntrance />}
      {activeBiome.biome === 'volcanic' && (
        <VolcanoCrater currentBiome={currentBiome} />
      )}
      {activeBiome.biome === 'icy' && <IceMountainLandmarks />}
      {activeBiome.biome === 'distortion' && <DistortionRealmLandmarks />}
      {activeBiome.biome === 'desert' && <Sandstorm />}
      {activeBiome.biome === 'volcanic' && <Ashfall />}
      {activeBiome.biome === 'icy' && <Snowstorm />}
      <BlockyPlane />
      <DropCamera />
    </Canvas>
  );
}
