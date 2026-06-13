import fs from 'fs/promises';
import path from 'path';
import NodeCache from 'node-cache';
import { getDB } from './db.js';
import { PUBLIC_DATASET } from './paths.js';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
const playerSaveChains = new Map();

// Helper to fetch and cache configuration records
async function getCachedConfig(key, fetchFn) {
  const hit = cache.get(key);
  if (hit) return hit;
  const data = await fetchFn();
  cache.set(key, data);
  return data;
}

// Helper to retrieve configurations stored in SQLite as JSON
async function getConfigFromDB(key) {
  const db = await getDB();
  const row = await db.get('SELECT value FROM configs WHERE key = ?', [key]);
  if (!row) {
    throw new Error(`Config key not found in SQLite: ${key}`);
  }
  return JSON.parse(row.value);
}

export async function getBiomeMap() {
  return getCachedConfig('biomeMap', () => getConfigFromDB('biomeMap'));
}

export async function getSpawnLadder() {
  return getCachedConfig('spawnLadder', () => getConfigFromDB('spawnLadder'));
}

export async function getBallsConfig() {
  return getCachedConfig('balls', () => getConfigFromDB('balls'));
}

export async function getUnlocksConfig() {
  return getCachedConfig('unlocks', () => getConfigFromDB('unlocks'));
}

export async function getTypeAnimationCatalog() {
  return getCachedConfig('typeAnimationCatalog', () => getConfigFromDB('typeAnimationCatalog'));
}

function localifyModelUrl(remoteUrl) {
  if (!remoteUrl || typeof remoteUrl !== 'string') return remoteUrl;
  
  const index = remoteUrl.indexOf('/models/');
  if (index !== -1) {
    let subPath = remoteUrl.slice(index + '/models/'.length);
    if (subPath.startsWith('opt/')) {
      subPath = subPath.slice('opt/'.length);
    }
    return `/assets/models/glb/${subPath}`;
  }
  
  return remoteUrl;
}

export async function getPokemonsSlim() {
  return getCachedConfig('pokemonsSlim', async () => {
    const db = await getDB();
    const paths = await db.all('SELECT * FROM pokemon_paths');
    const entries = await db.all('SELECT * FROM pokemon_entries');

    entries.forEach((p) => {
      p.types = JSON.parse(p.types);
      p.eggGroups = JSON.parse(p.eggGroups);
      p.isLegendary = Boolean(p.isLegendary);
      p.hasEggs = Boolean(p.hasEggs);
      p.modelUrl = localifyModelUrl(p.modelUrl);
    });

    return { entries, paths };
  });
}

export async function getPokemonsFull() {
  // We keep the filesystem fallback for the full dataset since it's dev-only and large
  const full = await getCachedConfig('pokemonsFull', async () => {
    const raw = await fs.readFile(path.join(PUBLIC_DATASET, 'pokemons.json'), 'utf8');
    return JSON.parse(raw);
  });
  
  if (full && full.biomes) {
    for (const biome of Object.values(full.biomes)) {
      for (const bucket of Object.values(biome.bySpawnLevel || {})) {
        for (const p of bucket.pokemon || []) {
          p.modelUrl = localifyModelUrl(p.modelUrl);
        }
      }
    }
  }
  return full;
}

function normalizePlayer(player) {
  if (player) {
    if (!player.perPathProgress) player.perPathProgress = {};
    if (!player.completedPathIds) player.completedPathIds = [];
    if (!player.unlockedPathIds) player.unlockedPathIds = [0];
  }
  return player;
}

export async function findUserByTrainerId(trainerId) {
  const db = await getDB();
  const rows = await db.all('SELECT data FROM players');
  for (const row of rows) {
    try {
      const user = JSON.parse(row.data);
      if (user.trainers && user.trainers.some((t) => t.id === trainerId)) {
        return normalizePlayer(user);
      }
    } catch (err) {
      console.error('Failed to parse user state in findUserByTrainerId:', err);
    }
  }
  return null;
}

export async function listPlayers() {
  const db = await getDB();
  const rows = await db.all('SELECT id, displayName, pokecoins, data, updatedAt FROM players');
  const players = [];
  for (const row of rows) {
    try {
      const p = JSON.parse(row.data);
      players.push({
        id: row.id,
        displayName: row.displayName,
        pokecoins: row.pokecoins ?? 500,
        trainers: p.trainers || [],
        updatedAt: row.updatedAt,
      });
    } catch (err) {
      console.error('Failed to parse player profile from DB:', row.id, err);
    }
  }
  return players;
}

export async function getPlayer(id) {
  const db = await getDB();
  const row = await db.get('SELECT data FROM players WHERE id = ?', [id]);
  if (row) {
    return normalizePlayer(JSON.parse(row.data));
  }
  
  const user = await findUserByTrainerId(id);
  if (user) {
    const trainer = user.trainers.find((t) => t.id === id);
    if (trainer) {
      return normalizePlayer({
        ...trainer,
        coins: user.pokecoins ?? 500,
        userId: user.id,
      });
    }
  }
  throw new Error('Player/Trainer not found: ' + id);
}

async function savePlayerToDisk(player) {
  const db = await getDB();
  const isTrainer = player.userId || (!player.trainers && player.characterStyle);

  if (isTrainer) {
    const userId = player.userId || (await findUserByTrainerId(player.id))?.id;
    if (!userId) {
      throw new Error('Parent user not found for trainer: ' + player.id);
    }
    
    // Load parent user from database
    const row = await db.get('SELECT data FROM players WHERE id = ?', [userId]);
    if (!row) {
      throw new Error('Parent user not found in DB: ' + userId);
    }
    const user = JSON.parse(row.data);

    if (player.coins !== undefined) {
      user.pokecoins = player.coins;
    }

    const idx = user.trainers.findIndex((t) => t.id === player.id);
    const cleanTrainer = { ...player };
    delete cleanTrainer.userId;
    delete cleanTrainer.coins;

    if (idx >= 0) {
      user.trainers[idx] = {
        ...user.trainers[idx],
        ...cleanTrainer,
        updatedAt: new Date().toISOString(),
      };
    } else {
      user.trainers.push({
        ...cleanTrainer,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    user.updatedAt = new Date().toISOString();
    
    // Update parent user in SQLite
    await db.run(
      'UPDATE players SET displayName = ?, username = ?, password = ?, pokecoins = ?, data = ?, updatedAt = ? WHERE id = ?',
      [
        user.displayName,
        user.username || null,
        user.password || null,
        user.pokecoins ?? 500,
        JSON.stringify(user),
        user.updatedAt,
        user.id
      ]
    );

    return {
      ...(idx >= 0 ? user.trainers[idx] : user.trainers[user.trainers.length - 1]),
      coins: user.pokecoins,
      userId: user.id,
    };
  } else {
    // Save user directly to SQLite
    const snapshot = { ...player, updatedAt: new Date().toISOString() };
    await db.run(
      `INSERT INTO players (id, displayName, username, password, pokecoins, data, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
         displayName = excluded.displayName,
         username = excluded.username,
         password = excluded.password,
         pokecoins = excluded.pokecoins,
         data = excluded.data,
         updatedAt = excluded.updatedAt`,
      [
        snapshot.id,
        snapshot.displayName,
        snapshot.username || null,
        snapshot.password || null,
        snapshot.pokecoins ?? 500,
        JSON.stringify(snapshot),
        snapshot.updatedAt
      ]
    );
    return snapshot;
  }
}

export function savePlayer(player) {
  const isTrainer = player.userId || (!player.trainers && player.characterStyle);
  
  if (isTrainer) {
    const chainPromise = (async () => {
      const userId = player.userId || (await findUserByTrainerId(player.id))?.id;
      const lockId = userId || player.id;
      const prev = playerSaveChains.get(lockId) ?? Promise.resolve();
      const next = prev.then(() => savePlayerToDisk(player));
      playerSaveChains.set(
        lockId,
        next.finally(() => {
          if (playerSaveChains.get(lockId) === next) {
            playerSaveChains.delete(lockId);
          }
        })
      );
      return next;
    })();
    return chainPromise;
  } else {
    const prev = playerSaveChains.get(player.id) ?? Promise.resolve();
    const next = prev.then(() => savePlayerToDisk(player));
    playerSaveChains.set(
      player.id,
      next.finally(() => {
        if (playerSaveChains.get(player.id) === next) {
          playerSaveChains.delete(player.id);
        }
      })
    );
    return next;
  }
}

export function invalidateCache() {
  cache.flushAll();
}

const TYPE_MAPPING = {
  1: 'normal',
  2: 'fighting',
  3: 'flying',
  4: 'poison',
  5: 'ground',
  6: 'rock',
  7: 'bug',
  8: 'ghost',
  9: 'steel',
  10: 'fire',
  11: 'water',
  12: 'grass',
  13: 'electric',
  14: 'psychic',
  15: 'ice',
  16: 'dragon',
  17: 'dark',
  18: 'fairy'
};

const DAMAGE_CLASS_MAPPING = {
  1: 'status',
  2: 'physical',
  3: 'special'
};

export async function getLocalPokemon(nameOrId) {
  const db = await getDB();
  const lower = String(nameOrId).toLowerCase().trim();
  const isId = /^\d+$/.test(lower);
  
  let row = null;
  if (isId) {
    row = await db.get('SELECT * FROM raw_pokemon WHERE id = ?', [parseInt(lower, 10)]);
  } else {
    row = await db.get('SELECT * FROM raw_pokemon WHERE name = ?', [lower]);
    if (!row) {
      row = await db.get('SELECT * FROM raw_pokemon WHERE name LIKE ?', [`${lower}%`]);
    }
  }

  if (!row) return null;

  const dbStats = JSON.parse(row.stats || '[]');
  const stats = dbStats.map(s => ({
    base_stat: s.bs,
    stat: { name: s.n }
  }));

  const dbTypes = JSON.parse(row.types || '[]');
  const types = dbTypes.map((t, idx) => ({
    slot: idx + 1,
    type: { name: t.n }
  }));

  const moveRows = await db.all(`
    SELECT DISTINCT rm.identifier AS name
    FROM raw_pokemon_moves rpm
    JOIN raw_moves rm ON rpm.move_id = rm.id
    WHERE rpm.pokemon_id = ?
    ORDER BY rpm.level ASC
  `, [row.id]);

  const moves = moveRows.map(m => ({
    move: { name: m.name }
  }));

  return {
    id: row.id,
    name: row.name,
    height: row.height,
    weight: row.weight,
    base_experience: row.base_experience,
    stats,
    types,
    sprites: {
      front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${row.id}.png`,
      other: {
        'official-artwork': {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${row.id}.png`
        }
      }
    },
    moves
  };
}

export async function getLocalMove(name) {
  const db = await getDB();
  const lower = String(name).toLowerCase().trim();
  
  const row = await db.get('SELECT * FROM raw_moves WHERE identifier = ?', [lower]);
  if (!row) return null;

  return {
    id: row.id,
    name: row.identifier,
    power: row.power,
    accuracy: row.accuracy,
    pp: row.pp,
    type: { name: TYPE_MAPPING[row.type_id] || 'normal' },
    damage_class: { name: DAMAGE_CLASS_MAPPING[row.damage_class_id] || 'physical' }
  };
}

