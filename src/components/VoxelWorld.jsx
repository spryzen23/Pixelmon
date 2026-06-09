import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry, Object3D } from 'three';
import { createProceduralVoxelMaterials } from '../game/proceduralVoxelMaterials';
import {
  VOXEL_SIZE,
  CAVE_ZONES,
  getBiomeChunksAround,
  getBiomeMap,
  getBiomeRenderDistance,
  getChunkCoordsForPosition,
  SPAWN_RENDER_DISTANCE,
  WORLD_PATHS,
} from '../game/world';

const dummy = new Object3D();

function scheduleIdleWork(fn) {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(fn, { timeout: 32 });
  }
  return setTimeout(fn, 0);
}

function cancelIdleWork(id) {
  if (typeof cancelIdleCallback !== 'undefined') {
    cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

function ChunkBucket({ blocks, geometry, material, type }) {
  const meshRef = useRef();
  const isLiquid = type === 'water' || type === 'lava';

  useLayoutEffect(() => {
    const mesh = meshRef.current;

    if (!mesh) {
      return undefined;
    }

    const count = blocks.length;
    mesh.count = count;
    const matrixArray = mesh.instanceMatrix.array;

    for (let index = 0; index < count; index += 1) {
      const block = blocks[index];
      dummy.position.set(block.x, block.y, block.z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      dummy.matrix.toArray(matrixArray, index * 16);
    }

    mesh.instanceMatrix.needsUpdate = true;
    requestAnimationFrame(() => {
      if (meshRef.current === mesh) {
        mesh.computeBoundingSphere();
      }
    });

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
  onBiomeReady = () => { },
  playerRef,
}) {
  const maxRadius = getBiomeRenderDistance(currentBiome);
  const [centerChunk, setCenterChunk] = useState(() =>
    getChunkCoordsForPosition(0, 0)
  );
  const [loadedRadius, setLoadedRadius] = useState(SPAWN_RENDER_DISTANCE);
  const spawnReadyRef = useRef(false);
  const completeReadyRef = useRef(false);
  const mountMsRef = useRef(
    typeof performance !== 'undefined' ? performance.now() : 0
  );

  const activeChunks = useMemo(() => {
    return getBiomeChunksAround(
      currentBiome,
      centerChunk.cx,
      centerChunk.cz,
      loadedRadius,
      caveZone
    );
  }, [caveZone, centerChunk.cx, centerChunk.cz, currentBiome, loadedRadius]);

  const geometry = useMemo(() => {
    return new BoxGeometry(VOXEL_SIZE, VOXEL_SIZE, VOXEL_SIZE);
  }, []);

  useEffect(() => {
    spawnReadyRef.current = false;
    completeReadyRef.current = false;
    mountMsRef.current = performance.now();
    setLoadedRadius(SPAWN_RENDER_DISTANCE);
    setCenterChunk(getChunkCoordsForPosition(0, 0));
  }, [caveZone, currentBiome]);

  useEffect(() => {
    if (loadedRadius >= maxRadius) {
      return undefined;
    }

    const idleId = scheduleIdleWork(() => {
      setLoadedRadius((radius) => Math.min(maxRadius, radius + 1));
    });

    return () => cancelIdleWork(idleId);
  }, [loadedRadius, maxRadius]);

  useFrame(() => {
    const player = playerRef?.current;

    if (!player) {
      return;
    }

    const nextChunk = getChunkCoordsForPosition(
      player.position.x,
      player.position.z
    );

    if (
      nextChunk.cx !== centerChunk.cx ||
      nextChunk.cz !== centerChunk.cz
    ) {
      setCenterChunk(nextChunk);
    }
  });

  const materials = useMemo(() => {
    const nextMaterials = createProceduralVoxelMaterials();
    const biome = WORLD_PATHS.find((path) => path.id === currentBiome);

    if (biome?.biome === 'volcanic' && nextMaterials.lava) {
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
      loadedRadius,
      maxRadius,
    };
  }, [activeChunks, loadedRadius, maxRadius]);

  useLayoutEffect(() => {
    const payload = {
      ...activeChunkSummary,
      biomeMap: getBiomeMap(currentBiome, caveZone),
      durationMs: performance.now() - mountMsRef.current,
    };

    if (
      !spawnReadyRef.current &&
      loadedRadius === SPAWN_RENDER_DISTANCE &&
      activeChunks.length > 0
    ) {
      spawnReadyRef.current = true;
      // #region agent log
      fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4125de' },
        body: JSON.stringify({
          sessionId: '4125de',
          runId: 'chunk-stream',
          hypothesisId: 'H1',
          location: 'VoxelWorld.jsx:spawn-ready',
          message: 'Spawn chunk painted',
          data: {
            biome: currentBiome,
            chunks: activeChunkSummary.activeChunkCount,
            blocks: activeChunkSummary.activeBlockCount,
            durationMs: payload.durationMs,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
      onBiomeReady({ ...payload, phase: 'spawn' });
      return;
    }

    if (
      loadedRadius >= maxRadius &&
      !completeReadyRef.current &&
      spawnReadyRef.current
    ) {
      completeReadyRef.current = true;
      // #region agent log
      fetch('http://127.0.0.1:7494/ingest/f6ae2fc6-304a-4fe4-bc2e-1432ec00b765', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '4125de' },
        body: JSON.stringify({
          sessionId: '4125de',
          runId: 'chunk-stream',
          hypothesisId: 'H2',
          location: 'VoxelWorld.jsx:complete',
          message: 'Full chunk radius loaded',
          data: {
            biome: currentBiome,
            chunks: activeChunkSummary.activeChunkCount,
            loadedRadius,
            maxRadius,
            durationMs: payload.durationMs,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
      onBiomeReady({ ...payload, phase: 'complete' });
    }
  }, [
    activeChunkSummary,
    activeChunks.length,
    caveZone,
    currentBiome,
    loadedRadius,
    maxRadius,
    onBiomeReady,
  ]);

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
