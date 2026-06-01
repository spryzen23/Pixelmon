export const WORLD_SIZE = 21;
export const WORLD_HALF = Math.floor(WORLD_SIZE / 2);
export const TERRAIN_RADIUS = 15;
export const BLOCK_HEIGHT = 0.35;
export const WATER_BLOCK_HEIGHT = 0.18;
export const WATER_SURFACE_Y = -0.1;
export const PLAYER_HEIGHT = 1;
export const PLAYER_RADIUS = 0.38;
export const COMPANION_HEIGHT = 0.8;
export const WILD_CREATURE_HEIGHT = 0.8;
export const TREE_RADIUS = 0.58;
export const CACTUS_RADIUS = 0.45;
export const BIOMES = {
  DESERT: 'desert',
  PLAINS: 'plains',
  SNOW: 'snow',
};

const ORIGIN_WATER_COORDS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [2, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [0, 2],
];

const ORIGIN_WATER_KEYS = new Set(
  ORIGIN_WATER_COORDS.map(([x, z]) => toTileKey(x, z))
);

export function toTileKey(x, z) {
  return `${x}:${z}`;
}

export function getTileCoord(value) {
  return Math.round(value);
}

function seededRandom(x, z = 0) {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123;

  return value - Math.floor(value);
}

function isNearInitialSpawn(x, z) {
  return Math.hypot(x + 7, z + 7) < 4;
}

function getLakeNoise(x, z) {
  return (
    Math.sin(x * 0.21) * 0.7 +
    Math.cos(z * 0.18) * 0.65 +
    Math.sin((x + z) * 0.11) * 0.55 +
    Math.cos((x - z) * 0.08) * 0.4
  );
}

export function getBiomeValue(x, z) {
  const tileX = getTileCoord(x);
  const tileZ = getTileCoord(z);
  const biomeNoise =
    Math.sin(tileX * 0.045 + 12.3) * 0.35 +
    Math.cos(tileZ * 0.052 - 3.1) * 0.35 +
    Math.sin((tileX + tileZ) * 0.029) * 0.2 +
    seededRandom(Math.floor(tileX / 8), Math.floor(tileZ / 8)) * 0.1;

  return Math.max(0, Math.min(1, biomeNoise * 0.5 + 0.5));
}

export function getBiomeForTile(x, z) {
  const value = getBiomeValue(x, z);

  if (value < 0.33) {
    return BIOMES.DESERT;
  }

  if (value > 0.66) {
    return BIOMES.SNOW;
  }

  return BIOMES.PLAINS;
}

export function isWaterTile(x, z) {
  const tileX = getTileCoord(x);
  const tileZ = getTileCoord(z);

  if (ORIGIN_WATER_KEYS.has(toTileKey(tileX, tileZ))) {
    return true;
  }

  if (isNearInitialSpawn(tileX, tileZ)) {
    return false;
  }

  return getLakeNoise(tileX, tileZ) < -1.45 && seededRandom(tileX, tileZ) > 0.22;
}

export function isTreeTile(x, z) {
  const tileX = getTileCoord(x);
  const tileZ = getTileCoord(z);
  const biome = getBiomeForTile(tileX, tileZ);

  if (
    isNearInitialSpawn(tileX, tileZ) ||
    isWaterTile(tileX, tileZ) ||
    biome === BIOMES.DESERT
  ) {
    return false;
  }

  const treeChance = seededRandom(tileX + 19.2, tileZ - 4.7);
  const spacingNoise = seededRandom(Math.floor(tileX / 2), Math.floor(tileZ / 2));

  return treeChance > (biome === BIOMES.SNOW ? 0.972 : 0.965) && spacingNoise > 0.45;
}

export function isCactusTile(x, z) {
  const tileX = getTileCoord(x);
  const tileZ = getTileCoord(z);

  if (
    isNearInitialSpawn(tileX, tileZ) ||
    isWaterTile(tileX, tileZ) ||
    getBiomeForTile(tileX, tileZ) !== BIOMES.DESERT
  ) {
    return false;
  }

  return seededRandom(tileX - 8.8, tileZ + 21.4) > 0.975;
}

export function getTerrainSurfaceY(x, z) {
  const tileX = getTileCoord(x);
  const tileZ = getTileCoord(z);

  if (isWaterTile(tileX, tileZ)) {
    return WATER_SURFACE_Y;
  }

  const rollingHill =
    Math.sin(tileX * 0.45) * 0.45 +
    Math.cos(tileZ * 0.35) * 0.35 +
    Math.sin((tileX + tileZ) * 0.22) * 0.25 +
    Math.cos((tileX - tileZ) * 0.13) * 0.18;

  return Math.round(rollingHill * 2) / 2;
}

export function getTerrainBlockCenterY(x, z) {
  const surfaceY = getTerrainSurfaceY(x, z);
  const height = isWaterTile(x, z) ? WATER_BLOCK_HEIGHT : BLOCK_HEIGHT;

  return surfaceY - height / 2;
}

export function getEntityY(x, z, entityHeight) {
  return getTerrainSurfaceY(x, z) + entityHeight / 2;
}

export const PLAYER_START = [
  -7,
  getEntityY(-7, -7, PLAYER_HEIGHT),
  -7,
];

export function isInsideWorld() {
  return true;
}

export function isWaterCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = Math.floor(x - radius - 0.5);
  const maxX = Math.ceil(x + radius + 0.5);
  const minZ = Math.floor(z - radius - 0.5);
  const maxZ = Math.ceil(z + radius + 0.5);

  for (let tileX = minX; tileX <= maxX; tileX += 1) {
    for (let tileZ = minZ; tileZ <= maxZ; tileZ += 1) {
      if (
        isWaterTile(tileX, tileZ) &&
        Math.abs(x - tileX) < 0.5 + radius &&
        Math.abs(z - tileZ) < 0.5 + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isTreeCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = Math.floor(x - TREE_RADIUS - radius);
  const maxX = Math.ceil(x + TREE_RADIUS + radius);
  const minZ = Math.floor(z - TREE_RADIUS - radius);
  const maxZ = Math.ceil(z + TREE_RADIUS + radius);

  for (let tileX = minX; tileX <= maxX; tileX += 1) {
    for (let tileZ = minZ; tileZ <= maxZ; tileZ += 1) {
      if (
        isTreeTile(tileX, tileZ) &&
        Math.abs(x - tileX) < TREE_RADIUS + radius &&
        Math.abs(z - tileZ) < TREE_RADIUS + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isCactusCollision(x, z, radius = PLAYER_RADIUS) {
  const minX = Math.floor(x - CACTUS_RADIUS - radius);
  const maxX = Math.ceil(x + CACTUS_RADIUS + radius);
  const minZ = Math.floor(z - CACTUS_RADIUS - radius);
  const maxZ = Math.ceil(z + CACTUS_RADIUS + radius);

  for (let tileX = minX; tileX <= maxX; tileX += 1) {
    for (let tileZ = minZ; tileZ <= maxZ; tileZ += 1) {
      if (
        isCactusTile(tileX, tileZ) &&
        Math.abs(x - tileX) < CACTUS_RADIUS + radius &&
        Math.abs(z - tileZ) < CACTUS_RADIUS + radius
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isWalkablePosition(x, z, radius = PLAYER_RADIUS) {
  return (
    !isWaterCollision(x, z, radius) &&
    !isTreeCollision(x, z, radius) &&
    !isCactusCollision(x, z, radius)
  );
}

export function clampToWorld(value) {
  return value;
}

export function createTerrainTiles(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const tiles = [];

  for (let x = centerX - radius; x <= centerX + radius; x += 1) {
    for (let z = centerZ - radius; z <= centerZ + radius; z += 1) {
      const type = isWaterTile(x, z) ? 'water' : 'grass';

      tiles.push({
        key: toTileKey(x, z),
        x,
        z,
        biome: getBiomeForTile(x, z),
        type,
        surfaceY: getTerrainSurfaceY(x, z),
        centerY: getTerrainBlockCenterY(x, z),
      });
    }
  }

  return tiles;
}

export function createTrees(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const trees = [];

  for (let x = centerX - radius; x <= centerX + radius; x += 1) {
    for (let z = centerZ - radius; z <= centerZ + radius; z += 1) {
      if (isTreeTile(x, z)) {
        trees.push({
          key: toTileKey(x, z),
          x,
          z,
          surfaceY: getTerrainSurfaceY(x, z),
        });
      }
    }
  }

  return trees;
}

export function createCacti(
  centerX = 0,
  centerZ = 0,
  radius = TERRAIN_RADIUS
) {
  const cacti = [];

  for (let x = centerX - radius; x <= centerX + radius; x += 1) {
    for (let z = centerZ - radius; z <= centerZ + radius; z += 1) {
      if (isCactusTile(x, z)) {
        cacti.push({
          key: toTileKey(x, z),
          x,
          z,
          surfaceY: getTerrainSurfaceY(x, z),
        });
      }
    }
  }

  return cacti;
}

export function getRandomGrassPosition(
  radius = 0.45,
  entityHeight = 1,
  centerX = PLAYER_START[0],
  centerZ = PLAYER_START[2],
  spawnRadius = 7
) {
  for (let attempts = 0; attempts < 100; attempts += 1) {
    const x = getTileCoord(centerX + Math.random() * spawnRadius * 2 - spawnRadius);
    const z = getTileCoord(centerZ + Math.random() * spawnRadius * 2 - spawnRadius);

    if (isWalkablePosition(x, z, radius)) {
      return [x, getEntityY(x, z, entityHeight), z];
    }
  }

  const fallbackX = WORLD_HALF - 2;
  const fallbackZ = WORLD_HALF - 2;

  return [fallbackX, getEntityY(fallbackX, fallbackZ, entityHeight), fallbackZ];
}
