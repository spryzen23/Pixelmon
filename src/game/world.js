export const VOXEL_SIZE = 0.75;
export const CHUNK_SIZE = 32;
export const CHUNK_WORLD_SIZE = CHUNK_SIZE * VOXEL_SIZE;
export const BIOME_CHUNK_RADIUS = 1;
export const BIOME_BOUNDARY = 35;
export const BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_BLOCK_HEIGHT = VOXEL_SIZE;
export const WATER_SURFACE_Y = -VOXEL_SIZE;
export const WATER_LEVEL = WATER_SURFACE_Y;
export const STONE_LINE_Y = 18;
export const SNOW_LINE_Y = 40;
export const ENTITY_FOOT_CLEARANCE = 0.025;
export const PLAYER_HEIGHT = 1;
export const PLAYER_RADIUS = 0.38;
export const COMPANION_HEIGHT = 0.8;
export const WILD_CREATURE_HEIGHT = 0.8;
export const TREE_RADIUS = 0.58;
export const CACTUS_RADIUS = 0.45;
export const MAP_SIZE = CHUNK_SIZE * 3;
export const MAP_HALF_BLOCKS = MAP_SIZE / 2;
export const MAP_HALF_WORLD_SIZE = MAP_HALF_BLOCKS * VOXEL_SIZE;
export const TERRAIN_RADIUS = MAP_HALF_WORLD_SIZE;
export const WORLD_SIZE = MAP_SIZE;
export const WORLD_HALF = Math.floor(WORLD_SIZE / 2);
export const PATH_COUNT = 6;
export const PATH_GRID_SIZE = MAP_SIZE;
export const PATH_HALF_BLOCKS = MAP_HALF_BLOCKS;
export const PATH_WORLD_SIZE = MAP_SIZE * VOXEL_SIZE;
export const PATH_HALF_WORLD_SIZE = PATH_WORLD_SIZE / 2;
export const RENDER_DISTANCE = 1;
export const MOUNT_CORONET_X = 0;
export const MOUNT_CORONET_Z = -16;
export const MOUNT_CORONET_PEAK_HEIGHT = 80;
export const MOUNT_CORONET_SLOPE = 1.2;

export const BIOMES = {
  DESERT: 'desert',
  PLAINS: 'plains',
  SNOW: 'snow',
};

export const WORLD_PATHS = [
  { id: 0, name: 'Fieldlands Trail', biome: BIOMES.PLAINS, seed: 3.1 },
  { id: 1, name: 'Sandglass Flats', biome: BIOMES.DESERT, seed: 18.6 },
  { id: 2, name: 'Frostpine Pass', biome: BIOMES.SNOW, seed: 42.2 },
  { id: 3, name: 'Coastal Run', biome: BIOMES.PLAINS, seed: 75.4 },
  { id: 4, name: 'Crimson Mire', biome: BIOMES.PLAINS, seed: 103.9 },
  { id: 5, name: 'Coronet Approach', biome: BIOMES.SNOW, seed: 160.3 },
];

export const CREATURE_ASSET_MANIFEST = {
  0: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
      { file: 'ordinary/creature_02.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
  },
  1: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
      { file: 'ordinary/creature_02.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  2: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  3: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  4: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
  5: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
      { file: 'ordinary/creature_02.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
};

const GRID_EPSILON = 0.000001;
const BLOCK_TYPES = ['desert', 'dirt', 'grass', 'snow', 'stone', 'water'];
const SPAWN_PAD_RADIUS = 9;
const SPAWN_APPROACH_RADIUS = 17;

export const MapCache = {
  biomes: {},
};

export const WORLD_MAPS = MapCache.biomes;

let activeBiome = 0;

export function setActivePathId(pathId) {
  activeBiome = Number(pathId) || 0;
}

export function getActivePathId() {
  return activeBiome;
}

export function clearBiomeCache(currentBiome = activeBiome) {
  delete MapCache.biomes[currentBiome];
}

export function clearAllBiomeCaches() {
  MapCache.biomes = {};
}

export function snapToVoxel(value) {
  const snapped = Math.floor((value + GRID_EPSILON) / VOXEL_SIZE) * VOXEL_SIZE;

  return Number(snapped.toFixed(6));
}

export function getVoxelIndex(value) {
  return Math.floor((value + GRID_EPSILON) / VOXEL_SIZE);
}

export function getTileCoord(value) {
  return snapToVoxel(value);
}

export function worldToGrid(x, z) {
  return {
    gridX: snapToVoxel(x),
    gridZ: snapToVoxel(z),
  };
}

export function toTileKey(x, z) {
  return `${snapToVoxel(x)}:${snapToVoxel(z)}`;
}

function seededRandom(x, z = 0, seed = 0) {
  const value = Math.sin(x * 127.1 + z * 311.7 + seed * 41.9) * 43758.5453123;

  return value - Math.floor(value);
}

function getBiomeDefinition(currentBiome = activeBiome) {
  return WORLD_PATHS.find((path) => path.id === currentBiome) || WORLD_PATHS[0];
}

function getCreatureAssetManifest(currentBiome = activeBiome) {
  return CREATURE_ASSET_MANIFEST[currentBiome] || CREATURE_ASSET_MANIFEST[0];
}

function getCreatureAssetUrl(currentBiome, file) {
  const biome = getBiomeDefinition(currentBiome);

  return encodeURI(`/assets/${biome.name}/${file}`);
}

export function getOrdinaryCreatureAsset(
  currentBiome = activeBiome,
  spawnIndex = 0
) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const ordinary = manifest.ordinary.length > 0
    ? manifest.ordinary
    : [{ file: 'ordinary.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] }];
  const asset = ordinary[spawnIndex % ordinary.length];

  return {
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  };
}

export function getAlphaCreatureAsset(currentBiome = activeBiome) {
  const manifest = getCreatureAssetManifest(currentBiome);
  const asset = manifest.alpha || {
    file: 'alpha.glb',
    scale: 0.95,
    rotation: [0, Math.PI / 2, 0],
  };

  return {
    ...asset,
    url: getCreatureAssetUrl(currentBiome, asset.file),
  };
}

export function getCreatureModelUrl(
  currentBiome = activeBiome,
  isAlpha = false,
  spawnIndex = 0
) {
  return isAlpha
    ? getAlphaCreatureAsset(currentBiome).url
    : getOrdinaryCreatureAsset(currentBiome, spawnIndex).url;
}

function createEmptyCounts() {
  return BLOCK_TYPES.reduce((counts, type) => {
    counts[type] = 0;
    return counts;
  }, {});
}

export function getChunkKey(cx, cz) {
  return `${cx},${cz}`;
}

export function getChunkCoord(value) {
  return Math.floor(value / CHUNK_WORLD_SIZE);
}

export function getChunkCoordsForPosition(x, z) {
  return {
    cx: getChunkCoord(x),
    cz: getChunkCoord(z),
  };
}

export function getSurroundingChunks(centerX = 0, centerZ = 0) {
  const chunks = [];

  for (let cz = -BIOME_CHUNK_RADIUS; cz <= BIOME_CHUNK_RADIUS; cz += 1) {
    for (let cx = -BIOME_CHUNK_RADIUS; cx <= BIOME_CHUNK_RADIUS; cx += 1) {
      chunks.push({
        cx,
        cz,
        key: getChunkKey(cx, cz),
      });
    }
  }

  return chunks;
}

function getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome) {
  const biome = getBiomeDefinition(currentBiome);
  const rollingHill =
    Math.sin(tileIndexX * 0.22 + biome.seed) * 0.95 +
    Math.cos(tileIndexZ * 0.2 - biome.seed * 0.5) * 0.8 +
    Math.sin((tileIndexX + tileIndexZ) * 0.11 + biome.seed) * 0.55;
  const biomeLift = currentBiome === 2 || currentBiome === 5 ? 2.4 : 1.4;
  const desertFlatten = currentBiome === 1 ? -0.6 : 0;
  const centerLift =
    Math.max(0, 1 - Math.hypot(tileIndexX, tileIndexZ) / MAP_HALF_BLOCKS) *
    biomeLift;
  const mountainLift =
    currentBiome === 5
      ? Math.max(0, 32 - Math.hypot(tileIndexX, tileIndexZ + 12) * 1.5)
      : 0;
  const edgeDrop =
    Math.max(
      0,
      (Math.max(Math.abs(tileIndexX), Math.abs(tileIndexZ)) -
        MAP_HALF_BLOCKS * 0.88) /
        (MAP_HALF_BLOCKS * 0.12)
    ) * 5;

  const rawHeight = Math.round(
    rollingHill + centerLift + desertFlatten + mountainLift - edgeDrop
  ) * VOXEL_SIZE;
  const spawnBaseY = currentBiome === 2 || currentBiome === 5 ? VOXEL_SIZE : 0;
  const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);

  if (spawnDistance <= SPAWN_PAD_RADIUS) {
    return spawnBaseY;
  }

  if (spawnDistance <= SPAWN_APPROACH_RADIUS) {
    const blend =
      (spawnDistance - SPAWN_PAD_RADIUS) /
      (SPAWN_APPROACH_RADIUS - SPAWN_PAD_RADIUS);
    const blendedY = spawnBaseY + (rawHeight - spawnBaseY) * blend;

    return Math.round(blendedY / VOXEL_SIZE) * VOXEL_SIZE;
  }

  return rawHeight;
}

function getSurfaceBlockType(currentBiome, surfaceY) {
  if (surfaceY >= SNOW_LINE_Y || currentBiome === 2 || currentBiome === 5) {
    return 'snow';
  }

  if (surfaceY >= STONE_LINE_Y) {
    return 'stone';
  }

  if (currentBiome === 1) {
    return 'desert';
  }

  return 'grass';
}

export function generateBiomeChunk(currentBiome, cx, cz) {
  try {
    return createBiomeChunk(currentBiome, cx, cz);
  } catch (error) {
    if (currentBiome === 3) {
      return createCoastalFallbackChunk(cx, cz);
    }

    throw error;
  }
}

function createCoastalFallbackChunk(cx, cz) {
  const blocks = [];
  const counts = createEmptyCounts();
  const heightLookup = new Map();
  const startX = (cx + BIOME_CHUNK_RADIUS) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz + BIOME_CHUNK_RADIUS) * CHUNK_SIZE - MAP_HALF_BLOCKS;

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const shoreline = Math.sin(tileIndexX * 0.12) * 5 + Math.cos(tileIndexZ * 0.08) * 3;
      const isWater = tileIndexZ + shoreline < -10;
      const surfaceY = isWater ? WATER_LEVEL : 0;
      const type = isWater ? 'water' : 'desert';

      heightLookup.set(toTileKey(x, z), {
        biome: BIOMES.PLAINS,
        isWater,
        surfaceY,
      });
      blocks.push({
        x,
        y: surfaceY - VOXEL_SIZE / 2,
        z,
        type,
      });
      counts[type] += 1;
    }
  }

  return {
    blocks,
    counts,
    cx,
    cz,
    heightLookup,
    key: getChunkKey(cx, cz),
  };
}

function createBiomeChunk(currentBiome, cx, cz) {
  const blocks = [];
  const counts = createEmptyCounts();
  const heightLookup = new Map();
  const startX = (cx + BIOME_CHUNK_RADIUS) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz + BIOME_CHUNK_RADIUS) * CHUNK_SIZE - MAP_HALF_BLOCKS;

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const rawSurfaceY = getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome);
      const waterNoise =
        Math.sin((tileIndexX + currentBiome * 7) * 0.19) +
        Math.cos((tileIndexZ - currentBiome * 5) * 0.17);
      const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);
      const coastalWater =
        currentBiome === 3 &&
        spawnDistance > SPAWN_APPROACH_RADIUS &&
        (tileIndexZ < -18 || waterNoise < -1.18);
      const isWater =
        spawnDistance > SPAWN_APPROACH_RADIUS &&
        (rawSurfaceY <= WATER_LEVEL ||
          coastalWater ||
          (currentBiome === 4 && waterNoise < -1.45) ||
          seededRandom(tileIndexX, tileIndexZ, currentBiome) < 0.004);
      const surfaceY = isWater ? WATER_LEVEL : rawSurfaceY;

      heightLookup.set(toTileKey(x, z), {
        biome: getBiomeDefinition(currentBiome).biome,
        isWater,
        surfaceY,
      });

      if (isWater) {
        const waterBottomY = Math.min(rawSurfaceY, WATER_LEVEL);

        for (
          let topY = WATER_LEVEL;
          topY >= waterBottomY - GRID_EPSILON;
          topY -= VOXEL_SIZE
        ) {
          const snappedTopY = snapToVoxel(topY);

          blocks.push({
            x,
            y: snappedTopY - WATER_BLOCK_HEIGHT / 2,
            z,
            type: 'water',
          });
          counts.water += 1;
        }

        continue;
      }

      for (
        let topY = surfaceY;
        topY >= WATER_LEVEL - GRID_EPSILON;
        topY -= VOXEL_SIZE
      ) {
        const snappedTopY = snapToVoxel(topY);
        const isSurface = snappedTopY === surfaceY;
        const type = isSurface
          ? currentBiome === 3
            ? 'desert'
            : getSurfaceBlockType(currentBiome, surfaceY)
          : snappedTopY >= STONE_LINE_Y
            ? 'stone'
            : 'dirt';

        blocks.push({
          x,
          y: snappedTopY - BLOCK_HEIGHT / 2,
          z,
          type,
        });
        counts[type] += 1;
      }
    }
  }

  return {
    blocks,
    counts,
    cx,
    cz,
    heightLookup,
    key: getChunkKey(cx, cz),
  };
}

export function generateBiomeMap(currentBiome = activeBiome) {
  if (MapCache.biomes[currentBiome]) {
    return MapCache.biomes[currentBiome];
  }

  const chunks = [];
  const heightLookup = new Map();
  const counts = createEmptyCounts();

  for (let cx = -1; cx <= 1; cx += 1) {
    for (let cz = -1; cz <= 1; cz += 1) {
      const chunk = generateBiomeChunk(currentBiome, cx, cz);

      chunks.push(chunk);
      Object.keys(counts).forEach((type) => {
        counts[type] += chunk.counts[type];
      });
      chunk.heightLookup.forEach((tile, key) => {
        heightLookup.set(key, tile);
      });
    }
  }

  MapCache.biomes[currentBiome] = {
    ...getBiomeDefinition(currentBiome),
    bounds: {
      minX: -BIOME_BOUNDARY,
      maxX: BIOME_BOUNDARY,
      minZ: -BIOME_BOUNDARY,
      maxZ: BIOME_BOUNDARY,
    },
    chunks,
    counts,
    heightLookup,
  };

  return MapCache.biomes[currentBiome];
}

export function preloadBiome(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function getBiomeMap(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function getRawTerrainSurfaceY(x, z) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);

  return getBiomeSurfaceY(tileIndexX, tileIndexZ, activeBiome);
}

export function getBiomeValue(x, z) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const value =
    Math.sin(tileIndexX * 0.045 + 12.3) * 0.35 +
    Math.cos(tileIndexZ * 0.052 - 3.1) * 0.35 +
    seededRandom(tileIndexX, tileIndexZ, activeBiome) * 0.3;

  return Math.max(0, Math.min(1, value * 0.5 + 0.5));
}

export function getBiomeForTile() {
  return getBiomeDefinition(activeBiome).biome;
}

export function getTerrainSurfaceY(x, z, currentBiome = activeBiome) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const biomeMap = generateBiomeMap(currentBiome);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.surfaceY : WATER_LEVEL;
}

export function isWaterTile(x, z, currentBiome = activeBiome) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const biomeMap = generateBiomeMap(currentBiome);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.isWater : true;
}

export function getTerrainBlockCenterY(x, z, currentBiome = activeBiome) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome);
  const height = isWaterTile(x, z, currentBiome)
    ? WATER_BLOCK_HEIGHT
    : BLOCK_HEIGHT;

  return surfaceY - height / 2;
}

export function getEntityY(
  x,
  z,
  entityHeight,
  previousY = undefined,
  currentBiome = activeBiome
) {
  const surfaceY = getTerrainSurfaceY(x, z, currentBiome);

  if (!Number.isFinite(surfaceY)) {
    return Number.isFinite(previousY) ? previousY : entityHeight / 2;
  }

  return surfaceY + entityHeight / 2 + ENTITY_FOOT_CLEARANCE;
}

export function isInsideWorld(x = 0, z = 0, radius = 0) {
  return (
    x >= -BIOME_BOUNDARY + radius &&
    x <= BIOME_BOUNDARY - radius &&
    z >= -BIOME_BOUNDARY + radius &&
    z <= BIOME_BOUNDARY - radius
  );
}

export function isWaterCollision(x, z, radius = PLAYER_RADIUS, currentBiome = activeBiome) {
  const minX = snapToVoxel(x - radius);
  const maxX = snapToVoxel(x + radius);
  const minZ = snapToVoxel(z - radius);
  const maxZ = snapToVoxel(z + radius);

  for (let tileX = minX; tileX <= maxX + GRID_EPSILON; tileX += VOXEL_SIZE) {
    for (let tileZ = minZ; tileZ <= maxZ + GRID_EPSILON; tileZ += VOXEL_SIZE) {
      if (isWaterTile(tileX, tileZ, currentBiome)) {
        return true;
      }
    }
  }

  return false;
}

export function isWalkablePosition(
  x,
  z,
  radius = PLAYER_RADIUS,
  currentBiome = activeBiome
) {
  return (
    isInsideWorld(x, z, radius) &&
    !isWaterCollision(x, z, radius, currentBiome)
  );
}

function isSafeSpawnTile(x, z, currentBiome = activeBiome) {
  const centerY = getTerrainSurfaceY(x, z, currentBiome);

  if (
    !Number.isFinite(centerY) ||
    centerY <= WATER_LEVEL ||
    isWaterTile(x, z, currentBiome) ||
    !isInsideWorld(x, z, PLAYER_RADIUS)
  ) {
    return false;
  }

  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
      const sampleX = x + offsetX * VOXEL_SIZE;
      const sampleZ = z + offsetZ * VOXEL_SIZE;
      const sampleY = getTerrainSurfaceY(sampleX, sampleZ, currentBiome);

      if (
        !Number.isFinite(sampleY) ||
        isWaterTile(sampleX, sampleZ, currentBiome) ||
        Math.abs(sampleY - centerY) > VOXEL_SIZE
      ) {
        return false;
      }
    }
  }

  return true;
}

export function clampToWorld(value, radius = 0) {
  return Math.max(
    -BIOME_BOUNDARY + radius,
    Math.min(BIOME_BOUNDARY - radius, value)
  );
}

export function getSafeSpawnPosition({
  centerX = 0,
  centerZ = 0,
  entityHeight = PLAYER_HEIGHT,
  lift = 2,
  currentBiome = activeBiome,
} = {}) {
  const biomeMap = generateBiomeMap(currentBiome);
  const candidates = [];

  biomeMap.heightLookup.forEach((tile, key) => {
    if (tile.isWater || tile.surfaceY <= WATER_LEVEL) {
      return;
    }

    const [x, z] = key.split(':').map(Number);

    if (!isSafeSpawnTile(x, z, currentBiome)) {
      return;
    }

    candidates.push({
      distance: Math.hypot(x - centerX, z - centerZ),
      surfaceY: tile.surfaceY,
      x,
      z,
    });
  });

  if (candidates.length === 0) {
    return [0, 10, 0];
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const safe = candidates[0];
  const safeLift = Math.max(
    lift,
    entityHeight / 2 + ENTITY_FOOT_CLEARANCE
  );

  return [
    safe.x,
    safe.surfaceY + safeLift,
    safe.z,
  ];
}

export function getPathSpawnPoint(
  currentBiome = activeBiome,
  entityHeight = PLAYER_HEIGHT
) {
  return getSafeSpawnPosition({
    centerX: 0,
    centerZ: 0,
    currentBiome,
    entityHeight,
    lift: entityHeight / 2 + ENTITY_FOOT_CLEARANCE,
  });
}

export const PLAYER_START = [0, 10, 0];

export function getRandomGrassPosition(
  radius = 0.45,
  entityHeight = 1,
  centerX = PLAYER_START[0],
  centerZ = PLAYER_START[2],
  spawnRadius = 7,
  currentBiome = activeBiome
) {
  for (let attempts = 0; attempts < 120; attempts += 1) {
    const x = getTileCoord(centerX + Math.random() * spawnRadius * 2 - spawnRadius);
    const z = getTileCoord(centerZ + Math.random() * spawnRadius * 2 - spawnRadius);

    if (isWalkablePosition(x, z, radius, currentBiome)) {
      return [x, getEntityY(x, z, entityHeight, undefined, currentBiome), z];
    }
  }

  return getSafeSpawnPosition({
    centerX,
    centerZ,
    entityHeight,
    currentBiome,
  });
}

export function generateStaticPathData(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function ensurePathInCache(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function preloadPath(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function getPathMap(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}
