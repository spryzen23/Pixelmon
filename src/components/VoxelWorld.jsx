import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { BoxGeometry } from 'three';
import { getProceduralVoxelMaterials } from '../game/proceduralVoxelMaterials';
import {
  VOXEL_SIZE,
  CAVE_ZONES,
  getBiomeChunksAround,
  getBiomeMap,
  getBiomeRenderDistance,
  getChunkCoordsForPosition,
  getSpawnChunkCoords,
  SPAWN_RENDER_DISTANCE,
  WORLD_PATHS,
} from '../game/world';

const MATRIX_BATCH_SIZE = 192;
const CHUNKS_MOUNT_BATCH = 2;
const EXPAND_COOLDOWN_MS = 2000;
/** One ring around the player (~9 surface chunks) — avoids 25-chunk GPU spikes. */
const STREAMING_RADIUS_CAP = 1;

function chunkDistanceFromCenter(chunk, centerChunk) {
  const [cx, cz] = chunk.key.split(',').map(Number);
  return Math.max(
    Math.abs(cx - centerChunk.cx),
    Math.abs(cz - centerChunk.cz)
  );
}

function scheduleIdleWork(fn) {
  if (typeof requestIdleCallback !== 'undefined') {
    return requestIdleCallback(fn, { timeout: 48 });
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

  useEffect(() => {
    const mesh = meshRef.current;

    if (!mesh || blocks.length === 0) {
      return undefined;
    }

    let cancelled = false;
    let cursor = 0;
    const matrixArray = mesh.instanceMatrix.array;
    mesh.count = blocks.length;

    const uploadBatch = () => {
      if (cancelled || !meshRef.current) {
        return;
      }

      const end = Math.min(cursor + MATRIX_BATCH_SIZE, blocks.length);

      for (let index = cursor; index < end; index += 1) {
        const block = blocks[index];
        const offset = index * 16;
        matrixArray[offset] = 1;
        matrixArray[offset + 1] = 0;
        matrixArray[offset + 2] = 0;
        matrixArray[offset + 3] = 0;
        matrixArray[offset + 4] = 0;
        matrixArray[offset + 5] = 1;
        matrixArray[offset + 6] = 0;
        matrixArray[offset + 7] = 0;
        matrixArray[offset + 8] = 0;
        matrixArray[offset + 9] = 0;
        matrixArray[offset + 10] = 1;
        matrixArray[offset + 11] = 0;
        matrixArray[offset + 12] = block.x;
        matrixArray[offset + 13] = block.y;
        matrixArray[offset + 14] = block.z;
        matrixArray[offset + 15] = 1;
      }

      cursor = end;
      mesh.instanceMatrix.needsUpdate = true;

      if (cursor < blocks.length) {
        requestAnimationFrame(uploadBatch);
        return;
      }

      requestAnimationFrame(() => {
        if (!cancelled && meshRef.current === mesh) {
          mesh.computeBoundingSphere();
        }
      });
    };

    requestAnimationFrame(uploadBatch);

    return () => {
      cancelled = true;
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
      castShadow={false}
      receiveShadow={false}
      frustumCulled
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
  spawnPosition = null,
}) {
  const maxRadius = Math.min(
    getBiomeRenderDistance(currentBiome),
    STREAMING_RADIUS_CAP
  );
  const [centerChunk, setCenterChunk] = useState(() =>
    getSpawnChunkCoords(spawnPosition)
  );
  const [loadedRadius, setLoadedRadius] = useState(SPAWN_RENDER_DISTANCE);
  const [spawnReady, setSpawnReady] = useState(false);
  const completeReadyRef = useRef(false);
  const radiusExpandIdleRef = useRef(null);
  const neededRadiusRef = useRef(SPAWN_RENDER_DISTANCE);
  const spawnAnchorRef = useRef(getSpawnChunkCoords(spawnPosition));
  const lastExpandMsRef = useRef(0);
  const mountedChunkKeysRef = useRef(new Set());
  const chunkMountIdleRef = useRef(null);
  const [mountedChunkKeys, setMountedChunkKeys] = useState([]);
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

  useEffect(() => () => geometry.dispose(), [geometry]);

  useEffect(() => {
    completeReadyRef.current = false;
    lastExpandMsRef.current = 0;
    mountedChunkKeysRef.current = new Set();
    setMountedChunkKeys([]);
    if (chunkMountIdleRef.current != null) {
      cancelIdleWork(chunkMountIdleRef.current);
      chunkMountIdleRef.current = null;
    }
    if (radiusExpandIdleRef.current != null) {
      cancelIdleWork(radiusExpandIdleRef.current);
      radiusExpandIdleRef.current = null;
    }
    mountMsRef.current = performance.now();
    setLoadedRadius(SPAWN_RENDER_DISTANCE);
    setSpawnReady(false);
    const spawn = getSpawnChunkCoords(spawnPosition);
    spawnAnchorRef.current = spawn;
    setCenterChunk(spawn);
  }, [caveZone, currentBiome, spawnPosition]);

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

  const visibleChunks = useMemo(() => {
    if (mountedChunkKeys.length === 0) {
      return activeChunks.slice(0, 1);
    }

    const mounted = new Set(mountedChunkKeys);
    return activeChunks.filter((chunk) => mounted.has(chunk.key));
  }, [activeChunks, mountedChunkKeys]);

  useEffect(() => {
    const activeKeys = new Set(activeChunks.map((chunk) => chunk.key));
    mountedChunkKeysRef.current = new Set(
      [...mountedChunkKeysRef.current].filter((key) => activeKeys.has(key))
    );

    const missing = activeChunks
      .filter((chunk) => !mountedChunkKeysRef.current.has(chunk.key))
      .sort(
        (a, b) =>
          chunkDistanceFromCenter(a, centerChunk) -
          chunkDistanceFromCenter(b, centerChunk)
      );

    if (missing.length === 0) {
      const pruned = Array.from(mountedChunkKeysRef.current);
      if (pruned.length !== mountedChunkKeys.length) {
        setMountedChunkKeys(pruned);
      }
      return undefined;
    }

    if (chunkMountIdleRef.current != null) {
      return undefined;
    }

    const pumpMounts = () => {
      const pending = activeChunks
        .filter((chunk) => !mountedChunkKeysRef.current.has(chunk.key))
        .sort(
          (a, b) =>
            chunkDistanceFromCenter(a, centerChunk) -
            chunkDistanceFromCenter(b, centerChunk)
        );

      if (pending.length === 0) {
        chunkMountIdleRef.current = null;
        return;
      }

      pending.slice(0, CHUNKS_MOUNT_BATCH).forEach((chunk) => {
        mountedChunkKeysRef.current.add(chunk.key);
      });
      setMountedChunkKeys(Array.from(mountedChunkKeysRef.current));

      chunkMountIdleRef.current = scheduleIdleWork(() => {
        chunkMountIdleRef.current = null;
        pumpMounts();
      });
    };

    pumpMounts();

    return () => {
      if (chunkMountIdleRef.current != null) {
        cancelIdleWork(chunkMountIdleRef.current);
        chunkMountIdleRef.current = null;
      }
    };
  }, [activeChunks, centerChunk.cx, centerChunk.cz, loadedRadius, maxRadius]);

  useEffect(() => {
    if (
      spawnReady ||
      loadedRadius !== SPAWN_RENDER_DISTANCE ||
      activeChunks.length === 0
    ) {
      return;
    }

    const signalMs = performance.now() - mountMsRef.current;
    setSpawnReady(true);
    onBiomeReady({
      ...activeChunkSummary,
      biomeMap: getBiomeMap(currentBiome, caveZone),
      durationMs: signalMs,
      phase: 'spawn',
    });
  }, [
    activeChunkSummary,
    activeChunks,
    caveZone,
    currentBiome,
    loadedRadius,
    onBiomeReady,
    spawnReady,
  ]);

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

    if (!spawnReady || loadedRadius >= maxRadius) {
      return;
    }

    const travel = Math.max(
      Math.abs(nextChunk.cx - spawnAnchorRef.current.cx),
      Math.abs(nextChunk.cz - spawnAnchorRef.current.cz)
    );
    const neededRadius =
      travel > loadedRadius
        ? Math.min(maxRadius, loadedRadius + 1)
        : loadedRadius;

    if (
      neededRadius <= loadedRadius ||
      radiusExpandIdleRef.current != null ||
      performance.now() - lastExpandMsRef.current < EXPAND_COOLDOWN_MS
    ) {
      return;
    }

    neededRadiusRef.current = neededRadius;
    radiusExpandIdleRef.current = scheduleIdleWork(() => {
      radiusExpandIdleRef.current = null;
      lastExpandMsRef.current = performance.now();
      setLoadedRadius((radius) => {
        const next = Math.min(
          maxRadius,
          neededRadiusRef.current,
          radius + 1
        );
        return next;
      });
    });
  });

  const materials = useMemo(() => {
    const nextMaterials = getProceduralVoxelMaterials();
    const biome = WORLD_PATHS.find((path) => path.id === currentBiome);

    if (biome?.biome === 'volcanic' && nextMaterials.lava) {
      nextMaterials.water = nextMaterials.lava;
    }

    return nextMaterials;
  }, [currentBiome]);

  useLayoutEffect(() => {
    const payload = {
      ...activeChunkSummary,
      biomeMap: getBiomeMap(currentBiome, caveZone),
      durationMs: performance.now() - mountMsRef.current,
    };

    if (
      loadedRadius >= maxRadius &&
      !completeReadyRef.current &&
      spawnReady
    ) {
      completeReadyRef.current = true;
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
    spawnReady,
  ]);

  return (
    <group key={`biome-${currentBiome}-${caveZone}`}>
      {visibleChunks.map((chunk) => (
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
