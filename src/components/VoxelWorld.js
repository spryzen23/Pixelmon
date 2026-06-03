import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BoxGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NearestFilter,
  Object3D,
  SRGBColorSpace,
} from 'three';
import { useTexture } from '@react-three/drei';
import {
  VOXEL_SIZE,
  getBiomeMap,
  preloadBiome,
} from '../game/world';

const BLOCK_TYPES = ['dirt', 'grass', 'desert', 'stone', 'snow', 'water'];
const dummy = new Object3D();
const WATER_COLOR = '#45b7e8';
const DESERT_COLOR = '#d8bd68';
const DIRT_COLOR = '#7a512e';
const STONE_COLOR = '#737a82';
const SNOW_COLOR = '#f2fbff';

function ChunkBucket({ blocks, geometry, material, type }) {
  const meshRef = useRef();
  const isWater = type === 'water';

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return undefined;
    }

    mesh.count = blocks.length;
    blocks.forEach((block, index) => {
      dummy.position.set(block.x, block.y, block.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();

    return () => {
      mesh.count = 0;
      mesh.instanceMatrix.needsUpdate = true;
    };
  }, [blocks]);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, blocks.length]}
      castShadow={!isWater}
      receiveShadow={!isWater}
      renderOrder={isWater ? 1 : 0}
    />
  );
}

function ChunkMesh({ chunk, geometry, materials }) {
  const buckets = useMemo(() => {
    const grouped = BLOCK_TYPES.reduce((nextGrouped, type) => {
      nextGrouped[type] = [];
      return nextGrouped;
    }, {});

    chunk.blocks.forEach((block) => {
      grouped[block.type].push(block);
    });

    return grouped;
  }, [chunk]);

  return (
    <group>
      {BLOCK_TYPES.map((type) => (
        <ChunkBucket
          key={`${chunk.key}-${type}`}
          blocks={buckets[type]}
          geometry={geometry}
          material={materials[type]}
          type={type}
        />
      ))}
    </group>
  );
}

export default function VoxelWorld({
  currentBiome = 0,
  onBiomeReady = () => {},
}) {
  const [grassTexture, dirtTexture] = useTexture([
    '/grass.png',
    '/dirt.png',
  ]);
  const biomeMap = useMemo(() => {
    return preloadBiome(currentBiome);
  }, [currentBiome]);
  const geometry = useMemo(() => {
    return new BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
  }, []);

  useEffect(() => {
    [grassTexture, dirtTexture].forEach((texture) => {
      texture.minFilter = NearestFilter;
      texture.magFilter = NearestFilter;
      texture.colorSpace = SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    });
  }, [dirtTexture, grassTexture]);

  const materials = useMemo(() => {
    return {
      desert: new MeshStandardMaterial({
        color: DESERT_COLOR,
        roughness: 0.92,
        metalness: 0,
      }),
      dirt: new MeshStandardMaterial({
        color: DIRT_COLOR,
        map: dirtTexture,
        roughness: 0.9,
        metalness: 0,
      }),
      grass: new MeshStandardMaterial({
        color: '#ffffff',
        map: grassTexture,
        roughness: 0.85,
        metalness: 0,
      }),
      snow: new MeshStandardMaterial({
        color: SNOW_COLOR,
        roughness: 0.86,
        metalness: 0,
      }),
      stone: new MeshStandardMaterial({
        color: STONE_COLOR,
        roughness: 0.88,
        metalness: 0,
      }),
      water: new MeshBasicMaterial({
        color: WATER_COLOR,
        depthWrite: false,
        fog: true,
        transparent: true,
        opacity: 0.42,
      }),
    };
  }, [dirtTexture, grassTexture]);

  useLayoutEffect(() => {
    onBiomeReady(getBiomeMap(currentBiome));
  }, [currentBiome, onBiomeReady]);

  return (
    <group key={`biome-${currentBiome}`}>
      {biomeMap.chunks.map((chunk) => (
        <ChunkMesh
          key={`${currentBiome}-${chunk.key}`}
          chunk={chunk}
          geometry={geometry}
          materials={materials}
        />
      ))}
    </group>
  );
}
