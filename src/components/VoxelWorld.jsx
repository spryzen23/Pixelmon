import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { BoxGeometry, Object3D } from "three";
import { createProceduralVoxelMaterials } from "../game/proceduralVoxelMaterials";
import {
  VOXEL_SIZE,
  CAVE_ZONES,
  getBiomeChunksAround,
  getBiomeMap,
  getBiomeRenderDistance,
  getChunkCoordsForPosition,
  WORLD_PATHS,
} from "../game/world";

const dummy = new Object3D();

function ChunkBucket({ blocks, geometry, material, type }) {
  const meshRef = useRef();
  const isLiquid = type === "water" || type === "lava";

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

  if (blocks.length === 0 || !material) {
    return null;
  }

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, blocks.length]}
      castShadow={!isLiquid}
      receiveShadow={!isLiquid}
      renderOrder={isLiquid ? 1 : 0}
    />
  );
}

function ChunkMesh({ chunk, geometry, materials }) {
  const buckets = useMemo(() => {
    const grouped = {};
    chunk.blocks.forEach((block) => {
      if (!grouped[block.type]) {
        grouped[block.type] = [];
      }
      grouped[block.type].push(block);
    });
    return Object.entries(grouped);
  }, [chunk]);

  return (
    <group>
      {buckets.map(([type, blocks]) => (
        <ChunkBucket
          key={`${chunk.key}-${type}`}
          blocks={blocks}
          geometry={geometry}
          material={materials[type]}
          type={type}
        />
      ))}
    </group>
  );
}

export default function VoxelWorld({
  caveZone = CAVE_ZONES.EXTERIOR,
  currentBiome = 0,
  onBiomeReady = () => {},
  playerRef,
}) {
  const [centerChunk, setCenterChunk] = useState(() =>
    getChunkCoordsForPosition(0, 0)
  );
  const activeChunks = useMemo(() => {
    return getBiomeChunksAround(
      currentBiome,
      centerChunk.cx,
      centerChunk.cz,
      getBiomeRenderDistance(currentBiome),
      caveZone
    );
  }, [caveZone, centerChunk.cx, centerChunk.cz, currentBiome]);

  const geometry = useMemo(() => {
    return new BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
  }, []);

  useEffect(() => {
    setCenterChunk(getChunkCoordsForPosition(0, 0));
  }, [caveZone, currentBiome]);

  useFrame(() => {
    const player = playerRef?.current;

    if (!player) {
      return;
    }

    const nextChunk = getChunkCoordsForPosition(
      player.position.x,
      player.position.z
    );

    if (nextChunk.cx !== centerChunk.cx || nextChunk.cz !== centerChunk.cz) {
      setCenterChunk(nextChunk);
    }
  });

  const materials = useMemo(() => {
    const nextMaterials = createProceduralVoxelMaterials();
    const biome = WORLD_PATHS.find((path) => path.id === currentBiome);

    if (biome?.biome === "volcanic" && nextMaterials.lava) {
      nextMaterials.water = nextMaterials.lava;
    }

    return nextMaterials;
  }, [currentBiome]);

  const activeChunkSummary = useMemo(() => {
    return {
      activeBlockCount: activeChunks.reduce(
        (total, chunk) => total + chunk.blocks.length,
        0
      ),
      activeChunkCount: activeChunks.length,
    };
  }, [activeChunks]);

  useLayoutEffect(() => {
    onBiomeReady({
      ...activeChunkSummary,
      biomeMap: getBiomeMap(currentBiome, caveZone),
    });
  }, [activeChunkSummary, caveZone, currentBiome, onBiomeReady]);

  return (
    <group key={`biome-${currentBiome}-${caveZone}`}>
      {activeChunks.map((chunk) => (
        <ChunkMesh
          key={`${currentBiome}-${caveZone}-${chunk.key}`}
          chunk={chunk}
          geometry={geometry}
          materials={materials}
        />
      ))}
    </group>
  );
}
