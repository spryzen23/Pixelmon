export const VOXEL_SIZE = 0.75;
export const CHUNK_SIZE = 32;
export const CHUNK_WORLD_SIZE = CHUNK_SIZE * VOXEL_SIZE;
export const BIOME_CHUNK_MIN = -18;
export const BIOME_CHUNK_MAX = 17;
export const BIOME_CHUNKS_PER_AXIS = BIOME_CHUNK_MAX - BIOME_CHUNK_MIN + 1;
export const BIOME_CHUNK_RADIUS = 1;
export const BIOME_BOUNDARY =
  (CHUNK_SIZE * BIOME_CHUNKS_PER_AXIS * VOXEL_SIZE) / 2 - VOXEL_SIZE * 2;
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
export const MAP_SIZE = CHUNK_SIZE * BIOME_CHUNKS_PER_AXIS;
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
export const RENDER_DISTANCE = 2;
export const MOUNT_CORONET_X = 0;
export const MOUNT_CORONET_Z = -16;
export const MOUNT_CORONET_PEAK_HEIGHT = 80;
export const MOUNT_CORONET_SLOPE = 1.2;
export const VOLCANO_CENTER_X = 0;
export const VOLCANO_CENTER_Z = -42;
export const VOLCANO_RIM_Y = VOXEL_SIZE * 24;
export const VOLCANO_LAVA_Y = VOXEL_SIZE * 17;

export const BIOMES = {
  CAVE: 'cave',
  DESERT: 'desert',
  GRASS: 'grass',
  ICY: 'icy',
  MOSSY: 'mossy',
  VOLCANIC: 'volcanic',
};

export const WORLD_PATHS = [
  {
    id: 0,
    name: 'Grass Biome',
    assetFolder: 'Fieldlands Trail',
    biome: BIOMES.GRASS,
    seed: 3.1,
  },
  {
    id: 1,
    name: 'Desert Biome',
    assetFolder: 'Sandglass Flats',
    biome: BIOMES.DESERT,
    seed: 18.6,
  },
  {
    id: 2,
    name: 'Volcanic Biome',
    assetFolder: 'Frostpine Pass',
    biome: BIOMES.VOLCANIC,
    seed: 42.2,
  },
  {
    id: 3,
    name: 'Mossy Biome',
    assetFolder: 'Coastal Run',
    biome: BIOMES.MOSSY,
    seed: 75.4,
  },
  {
    id: 4,
    name: 'Cave Biome',
    assetFolder: 'Crimson Mire',
    biome: BIOMES.CAVE,
    seed: 103.9,
  },
  {
    id: 5,
    name: 'Icy Biome',
    assetFolder: 'Coronet Approach',
    biome: BIOMES.ICY,
    seed: 160.3,
  },
];

export const CREATURE_ASSET_MANIFEST = {
  0: {
    ordinary: [
      { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
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
    ],
    alpha: { file: 'alpha.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] },
  },
};

const GRID_EPSILON = 0.000001;
const TERRAIN_GENERATION_VERSION = 9;
const BLOCK_TYPES = [
  'basalt',
  'cave',
  'desert',
  'dirt',
  'grass',
  'lava',
  'moss',
  'snow',
  'stone',
  'water',
];
const SPAWN_PAD_RADIUS = 9;
const SPAWN_APPROACH_RADIUS = 17;
const VOLCANO_CENTER_TILE_X = Math.round(VOLCANO_CENTER_X / VOXEL_SIZE);
const VOLCANO_CENTER_TILE_Z = Math.round(VOLCANO_CENTER_Z / VOXEL_SIZE);
export const VOLCANO_BASE_RADIUS_TILES = 112;
export const VOLCANO_CRATER_RADIUS_TILES = 18;
export const VOLCANO_LAVA_RADIUS_TILES = 9;
const VOLCANO_LAVA_FLOW_DIRECTIONS = [
  -Math.PI * 0.52,
  Math.PI * 0.12,
  Math.PI * 0.78,
];

export const MapCache = {
  biomes: {},
  landmarks: {},
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
  delete MapCache.landmarks[currentBiome];
}

export function clearAllBiomeCaches() {
  MapCache.biomes = {};
  MapCache.landmarks = {};
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

  return encodeURI(`/assets/${biome.assetFolder || biome.name}/${file}`);
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
  const tileIndex = getVoxelIndex(snapToVoxel(value));

  return (
    Math.floor((tileIndex + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
    BIOME_CHUNK_MIN
  );
}

export function getChunkCoordsForPosition(x, z) {
  return {
    cx: getChunkCoord(x),
    cz: getChunkCoord(z),
  };
}

function isChunkInsideBiome(cx, cz) {
  return (
    cx >= BIOME_CHUNK_MIN &&
    cx <= BIOME_CHUNK_MAX &&
    cz >= BIOME_CHUNK_MIN &&
    cz <= BIOME_CHUNK_MAX
  );
}

function getChunkCoordsForTile(tileIndexX, tileIndexZ) {
  return {
    cx:
      Math.floor((tileIndexX + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
      BIOME_CHUNK_MIN,
    cz:
      Math.floor((tileIndexZ + MAP_HALF_BLOCKS) / CHUNK_SIZE) +
      BIOME_CHUNK_MIN,
  };
}

export function getSurroundingChunks(
  centerX = 0,
  centerZ = 0,
  radius = RENDER_DISTANCE
) {
  const chunks = [];
  const minCx = Math.max(BIOME_CHUNK_MIN, centerX - radius);
  const maxCx = Math.min(BIOME_CHUNK_MAX, centerX + radius);
  const minCz = Math.max(BIOME_CHUNK_MIN, centerZ - radius);
  const maxCz = Math.min(BIOME_CHUNK_MAX, centerZ + radius);

  for (let cz = minCz; cz <= maxCz; cz += 1) {
    for (let cx = minCx; cx <= maxCx; cx += 1) {
      chunks.push({
        cx,
        cz,
        key: getChunkKey(cx, cz),
      });
    }
  }

  return chunks;
}

function getVolcanoDistance(tileIndexX, tileIndexZ) {
  return Math.hypot(
    tileIndexX - VOLCANO_CENTER_TILE_X,
    tileIndexZ - VOLCANO_CENTER_TILE_Z
  );
}

function getAngleDelta(angle, targetAngle) {
  return Math.atan2(
    Math.sin(angle - targetAngle),
    Math.cos(angle - targetAngle)
  );
}

function getVolcanoSurfaceY(tileIndexX, tileIndexZ, baseSurfaceY) {
  const distance = getVolcanoDistance(tileIndexX, tileIndexZ);

  if (distance > VOLCANO_BASE_RADIUS_TILES) {
    return baseSurfaceY;
  }

  const normalizedDistance = distance / VOLCANO_BASE_RADIUS_TILES;
  const coneHeightVoxels = Math.round(
    Math.pow(1 - normalizedDistance, 1.7) *
      (VOLCANO_RIM_Y / VOXEL_SIZE)
  );
  const climbableConeY =
    VOXEL_SIZE + Math.max(0, coneHeightVoxels) * VOXEL_SIZE;

  if (distance <= VOLCANO_LAVA_RADIUS_TILES) {
    return VOLCANO_LAVA_Y;
  }

  if (distance <= VOLCANO_CRATER_RADIUS_TILES) {
    const craterBlend =
      (distance - VOLCANO_LAVA_RADIUS_TILES) /
      (VOLCANO_CRATER_RADIUS_TILES - VOLCANO_LAVA_RADIUS_TILES);
    const craterWallY = VOLCANO_LAVA_Y +
      Math.round(
        craterBlend *
          Math.max(1, (climbableConeY - VOLCANO_LAVA_Y) / VOXEL_SIZE)
      ) * VOXEL_SIZE;

    return Math.max(craterWallY, baseSurfaceY + VOXEL_SIZE);
  }

  return Math.max(climbableConeY, baseSurfaceY);
}

function isVolcanoLavaTile(tileIndexX, tileIndexZ) {
  return getVolcanoDistance(tileIndexX, tileIndexZ) <= VOLCANO_LAVA_RADIUS_TILES;
}

function isVolcanoOverflowLavaTile(tileIndexX, tileIndexZ) {
  const offsetX = tileIndexX - VOLCANO_CENTER_TILE_X;
  const offsetZ = tileIndexZ - VOLCANO_CENTER_TILE_Z;
  const distance = Math.hypot(offsetX, offsetZ);

  if (
    distance <= VOLCANO_LAVA_RADIUS_TILES ||
    distance >= VOLCANO_BASE_RADIUS_TILES * 0.78
  ) {
    return false;
  }

  const angle = Math.atan2(offsetZ, offsetX);

  return VOLCANO_LAVA_FLOW_DIRECTIONS.some((direction, index) => {
    const wobble =
      Math.sin(distance * 0.12 + index * 2.9) * 0.09 +
      Math.sin(distance * 0.035 + index * 6.1) * 0.05;
    const flowWidth =
      0.055 +
      (1 - distance / (VOLCANO_BASE_RADIUS_TILES * 0.78)) * 0.13;
    const brokenEdge =
      seededRandom(tileIndexX, tileIndexZ, 91 + index) > 0.08;

    return (
      Math.abs(getAngleDelta(angle, direction + wobble)) < flowWidth &&
      brokenEdge
    );
  });
}

export function getVolcanoPrimalPosition() {
  return [
    VOLCANO_CENTER_X,
    VOLCANO_LAVA_Y + 0.18,
    VOLCANO_CENTER_Z,
  ];
}

function getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome) {
  const biome = getBiomeDefinition(currentBiome);
  const isIcy = biome.biome === BIOMES.ICY;
  const isVolcanic = biome.biome === BIOMES.VOLCANIC;
  const isCave = biome.biome === BIOMES.CAVE;
  const rollingHill =
    Math.sin(tileIndexX * 0.22 + biome.seed) * 0.95 +
    Math.cos(tileIndexZ * 0.2 - biome.seed * 0.5) * 0.8 +
    Math.sin((tileIndexX + tileIndexZ) * 0.11 + biome.seed) * 0.55;
  const biomeLift = isIcy || isVolcanic || isCave ? 2.4 : 1.4;
  const desertFlatten = biome.biome === BIOMES.DESERT ? -0.6 : 0;
  const caveLowering = isCave ? -0.75 : 0;
  const centerLift =
    Math.max(0, 1 - Math.hypot(tileIndexX, tileIndexZ) / MAP_HALF_BLOCKS) *
    biomeLift;
  const mountainLift =
    isIcy
      ? Math.max(0, 32 - Math.hypot(tileIndexX, tileIndexZ + 12) * 1.5)
      : 0;
  const edgeDrop =
    Math.max(
      0,
      (Math.max(Math.abs(tileIndexX), Math.abs(tileIndexZ)) -
        MAP_HALF_BLOCKS * 0.88) /
        (MAP_HALF_BLOCKS * 0.12)
    ) * 5;

  let rawHeight = Math.round(
    rollingHill + centerLift + desertFlatten + caveLowering + mountainLift - edgeDrop
  ) * VOXEL_SIZE;

  if (isVolcanic) {
    rawHeight = getVolcanoSurfaceY(tileIndexX, tileIndexZ, rawHeight);
  }
  const spawnBaseY = isIcy || isVolcanic || isCave ? VOXEL_SIZE : 0;
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
  const biome = getBiomeDefinition(currentBiome).biome;

  if (biome === BIOMES.VOLCANIC) {
    return surfaceY >= STONE_LINE_Y ? 'stone' : 'basalt';
  }

  if (biome === BIOMES.CAVE) {
    return surfaceY >= STONE_LINE_Y ? 'stone' : 'cave';
  }

  if (biome === BIOMES.MOSSY) {
    return 'moss';
  }

  if (biome === BIOMES.ICY || surfaceY >= SNOW_LINE_Y) {
    return 'snow';
  }

  if (surfaceY >= STONE_LINE_Y) {
    return 'stone';
  }

  if (biome === BIOMES.DESERT) {
    return 'desert';
  }

  return 'grass';
}

function getGeneratedTileInfo(tileIndexX, tileIndexZ, currentBiome) {
  const rawSurfaceY = getBiomeSurfaceY(tileIndexX, tileIndexZ, currentBiome);
  const waterNoise =
    Math.sin((tileIndexX + currentBiome * 7) * 0.19) +
    Math.cos((tileIndexZ - currentBiome * 5) * 0.17);
  const biomeType = getBiomeDefinition(currentBiome).biome;
  const spawnDistance = Math.hypot(tileIndexX, tileIndexZ);
  const isVolcanic = biomeType === BIOMES.VOLCANIC;
  const coastalWater =
    biomeType === BIOMES.MOSSY &&
    spawnDistance > SPAWN_APPROACH_RADIUS &&
    (tileIndexZ < -18 || waterNoise < -1.18);
  const mireWater =
    biomeType === BIOMES.CAVE &&
    spawnDistance > SPAWN_APPROACH_RADIUS * 1.35 &&
    waterNoise < -1.5;
  const lavaPool = isVolcanic && isVolcanoLavaTile(tileIndexX, tileIndexZ);
  const lavaOverflow =
    isVolcanic && isVolcanoOverflowLavaTile(tileIndexX, tileIndexZ);
  const terrainWater =
    rawSurfaceY <= WATER_LEVEL &&
    (
      biomeType === BIOMES.DESERT ||
      biomeType === BIOMES.MOSSY ||
      biomeType === BIOMES.CAVE
    );
  const isLava = lavaPool || lavaOverflow;
  const isLiquid =
    spawnDistance > SPAWN_APPROACH_RADIUS &&
    (terrainWater || coastalWater || mireWater || isLava);
  const surfaceY = isLava ? rawSurfaceY : isLiquid ? WATER_LEVEL : rawSurfaceY;

  return {
    biome: biomeType,
    isWater: isLiquid,
    liquidType: isLava ? 'lava' : 'water',
    rawSurfaceY,
    surfaceType: getSurfaceBlockType(currentBiome, surfaceY),
    surfaceY,
  };
}

function getGeneratedTileInfoAtWorld(x, z, currentBiome = activeBiome) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);

  return getGeneratedTileInfo(tileIndexX, tileIndexZ, currentBiome);
}

function addGeneratedBlock(blocks, counts, x, topY, z, type, height = BLOCK_HEIGHT) {
  blocks.push({
    x,
    y: snapToVoxel(topY) - height / 2,
    z,
    type,
  });
  counts[type] += 1;
}

function addExposedColumnShell(
  blocks,
  counts,
  x,
  z,
  surfaceY,
  lowestNeighborY,
  currentBiome = activeBiome
) {
  const biomeType = getBiomeDefinition(currentBiome).biome;

  for (
    let topY = surfaceY - VOXEL_SIZE;
    topY > lowestNeighborY + GRID_EPSILON && topY >= WATER_LEVEL - GRID_EPSILON;
    topY -= VOXEL_SIZE
  ) {
    const snappedTopY = snapToVoxel(topY);
    const type = biomeType === BIOMES.VOLCANIC
      ? 'basalt'
      : snappedTopY >= STONE_LINE_Y
        ? 'stone'
        : 'dirt';

    addGeneratedBlock(blocks, counts, x, snappedTopY, z, type);
  }
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
  const startX = (cx - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;

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
        biome: BIOMES.MOSSY,
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
  const startX = (cx - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const startZ = (cz - BIOME_CHUNK_MIN) * CHUNK_SIZE - MAP_HALF_BLOCKS;
  const tileInfos = new Map();

  for (let lx = 0; lx < CHUNK_SIZE; lx += 1) {
    const tileIndexX = startX + lx;
    const x = snapToVoxel(tileIndexX * VOXEL_SIZE);

    for (let lz = 0; lz < CHUNK_SIZE; lz += 1) {
      const tileIndexZ = startZ + lz;
      const z = snapToVoxel(tileIndexZ * VOXEL_SIZE);
      const tile = getGeneratedTileInfo(tileIndexX, tileIndexZ, currentBiome);

      heightLookup.set(toTileKey(x, z), {
        biome: tile.biome,
        isWater: tile.isWater,
        surfaceY: tile.surfaceY,
      });
      tileInfos.set(`${tileIndexX}:${tileIndexZ}`, {
        ...tile,
        tileIndexX,
        tileIndexZ,
        x,
        z,
      });
    }
  }

  tileInfos.forEach((tile) => {
    if (tile.isWater) {
      addGeneratedBlock(
        blocks,
        counts,
        tile.x,
        tile.surfaceY,
        tile.z,
        tile.liquidType,
        WATER_BLOCK_HEIGHT
      );

      return;
    }

    addGeneratedBlock(
      blocks,
      counts,
      tile.x,
      tile.surfaceY,
      tile.z,
      tile.surfaceType
    );

    const neighborHeights = [
      getGeneratedTileInfo(tile.tileIndexX + 1, tile.tileIndexZ, currentBiome).surfaceY,
      getGeneratedTileInfo(tile.tileIndexX - 1, tile.tileIndexZ, currentBiome).surfaceY,
      getGeneratedTileInfo(tile.tileIndexX, tile.tileIndexZ + 1, currentBiome).surfaceY,
      getGeneratedTileInfo(tile.tileIndexX, tile.tileIndexZ - 1, currentBiome).surfaceY,
    ];
    const lowestNeighborY = Math.min(...neighborHeights);

    if (tile.surfaceY > lowestNeighborY + VOXEL_SIZE * 0.5) {
      addExposedColumnShell(
        blocks,
        counts,
        tile.x,
        tile.z,
        tile.surfaceY,
        lowestNeighborY,
        currentBiome
      );
    }
  });

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
  if (
    MapCache.biomes[currentBiome] &&
    MapCache.biomes[currentBiome].generationVersion === TERRAIN_GENERATION_VERSION
  ) {
    return MapCache.biomes[currentBiome];
  }

  MapCache.biomes[currentBiome] = {
    ...getBiomeDefinition(currentBiome),
    generationVersion: TERRAIN_GENERATION_VERSION,
    bounds: {
      minX: -BIOME_BOUNDARY,
      maxX: BIOME_BOUNDARY,
      minZ: -BIOME_BOUNDARY,
      maxZ: BIOME_BOUNDARY,
    },
    chunkMap: {},
    chunks: [],
    counts: createEmptyCounts(),
    heightLookup: new Map(),
  };

  return MapCache.biomes[currentBiome];
}

export function ensureBiomeChunk(currentBiome = activeBiome, cx = 0, cz = 0) {
  if (!isChunkInsideBiome(cx, cz)) {
    return null;
  }

  const biomeMap = generateBiomeMap(currentBiome);
  const key = getChunkKey(cx, cz);

  if (biomeMap.chunkMap[key]) {
    return biomeMap.chunkMap[key];
  }

  const chunk = generateBiomeChunk(currentBiome, cx, cz);

  biomeMap.chunkMap[key] = chunk;
  biomeMap.chunks = Object.values(biomeMap.chunkMap);
  Object.keys(biomeMap.counts).forEach((type) => {
    biomeMap.counts[type] += chunk.counts[type];
  });
  chunk.heightLookup.forEach((tile, tileKey) => {
    biomeMap.heightLookup.set(tileKey, tile);
  });

  return chunk;
}

export function getBiomeChunksAround(
  currentBiome = activeBiome,
  centerCx = 0,
  centerCz = 0,
  radius = RENDER_DISTANCE
) {
  return getSurroundingChunks(centerCx, centerCz, radius)
    .map((chunkCoord) =>
      ensureBiomeChunk(currentBiome, chunkCoord.cx, chunkCoord.cz)
    )
    .filter(Boolean);
}

export function preloadBiome(currentBiome = activeBiome) {
  generateBiomeMap(currentBiome);
  getBiomeChunksAround(currentBiome, 0, 0, RENDER_DISTANCE);

  return MapCache.biomes[currentBiome];
}

export function getBiomeMap(currentBiome = activeBiome) {
  return generateBiomeMap(currentBiome);
}

export function getBiomeCacheSummary(currentBiome = activeBiome) {
  const biomeMap = MapCache.biomes[currentBiome];
  const biome = getBiomeDefinition(currentBiome);
  const counts = biomeMap?.counts || createEmptyCounts();
  const chunkCount = biomeMap?.chunks?.length || 0;
  const blockCount = Object.values(counts).reduce(
    (total, count) => total + count,
    0
  );

  return {
    biomeId: currentBiome,
    biomeName: biome.name,
    biomeType: biome.biome,
    blockCount,
    chunkCount,
    counts: { ...counts },
    isCached: chunkCount > 0,
  };
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
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const { cx, cz } = getChunkCoordsForTile(tileIndexX, tileIndexZ);

  ensureBiomeChunk(currentBiome, cx, cz);

  const biomeMap = generateBiomeMap(currentBiome);
  const tile = biomeMap.heightLookup.get(toTileKey(gridX, gridZ));

  return tile ? tile.surfaceY : WATER_LEVEL;
}

export function isWaterTile(x, z, currentBiome = activeBiome) {
  const { gridX, gridZ } = worldToGrid(x, z);
  const tileIndexX = getVoxelIndex(gridX);
  const tileIndexZ = getVoxelIndex(gridZ);
  const { cx, cz } = getChunkCoordsForTile(tileIndexX, tileIndexZ);

  ensureBiomeChunk(currentBiome, cx, cz);

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

export function isLandmarkCollision() {
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
    !isWaterCollision(x, z, radius, currentBiome) &&
    !isLandmarkCollision(x, z, radius, currentBiome)
  );
}

function isSafeSpawnTile(x, z, currentBiome = activeBiome) {
  const center = getGeneratedTileInfoAtWorld(x, z, currentBiome);
  const centerY = center.surfaceY;

  if (
    !Number.isFinite(centerY) ||
    centerY <= WATER_LEVEL ||
    center.isWater ||
    isLandmarkCollision(x, z, PLAYER_RADIUS, currentBiome) ||
    !isInsideWorld(x, z, PLAYER_RADIUS)
  ) {
    return false;
  }

  for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
    for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
      const sampleX = x + offsetX * VOXEL_SIZE;
      const sampleZ = z + offsetZ * VOXEL_SIZE;
      const sample = getGeneratedTileInfoAtWorld(sampleX, sampleZ, currentBiome);
      const sampleY = sample.surfaceY;

      if (
        !Number.isFinite(sampleY) ||
        sample.isWater ||
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
  const { cx, cz } = getChunkCoordsForPosition(centerX, centerZ);

  const searchChunks = getBiomeChunksAround(currentBiome, cx, cz, 2);
  const candidates = [];

  searchChunks
    .flatMap((chunk) => [...chunk.heightLookup.entries()])
    .forEach(([key, tile]) => {
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

export function getBiomeLandmarks() {
  return [];
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
