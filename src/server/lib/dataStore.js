import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import NodeCache from 'node-cache';
import {
  DATA_CONFIG,
  DATA_GAME,
  DATA_PLAYERS,
  PUBLIC_DATASET,
} from './paths.js';

const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });
const playerSaveChains = new Map();

async function readJson(filePath) {
  const key = filePath;
  const hit = cache.get(key);
  if (hit) return hit;
  const raw = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(raw);
  cache.set(key, data);
  return data;
}

export async function getBiomeMap() {
  return readJson(path.join(DATA_CONFIG, 'biomeMap.json'));
}

export async function getSpawnLadder() {
  return readJson(path.join(DATA_CONFIG, 'spawnLadder.json'));
}

export async function getBallsConfig() {
  return readJson(path.join(DATA_CONFIG, 'balls.json'));
}

export async function getUnlocksConfig() {
  return readJson(path.join(DATA_CONFIG, 'unlocks.json'));
}

export async function getTypeAnimationCatalog() {
  const gamePath = path.join(DATA_GAME, 'typeAnimationCatalog.json');
  try {
    await fs.access(gamePath);
    return readJson(gamePath);
  } catch {
    return readJson(path.join(PUBLIC_DATASET, 'typeAnimationCatalog.json'));
  }
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
  const slim = path.join(DATA_GAME, 'pokemons.slim.json');
  let data;
  try {
    await fs.access(slim);
    data = await readJson(slim);
  } catch {
    const full = await readJson(path.join(PUBLIC_DATASET, 'pokemons.json'));
    data = buildSlimFromFull(full);
  }

  if (data && data.entries) {
    data.entries.forEach((p) => {
      p.modelUrl = localifyModelUrl(p.modelUrl);
    });
  }
  return data;
}

export async function getPokemonsFull() {
  const full = await readJson(path.join(PUBLIC_DATASET, 'pokemons.json'));
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

function buildSlimFromFull(full) {
  const entries = [];
  for (const [regionId, biome] of Object.entries(full.biomes || {})) {
    for (const bucket of Object.values(biome.bySpawnLevel || {})) {
      for (const p of bucket.pokemon || []) {
        entries.push({
          entryId: p.entryId,
          speciesId: p.speciesId,
          name: p.name,
          displayName: p.displayName,
          region: regionId,
          spawnLevel: p.spawnLevel,
          formTier: p.formTier,
          evolutionStage: p.evolutionStage,
          types: p.types,
          eggGroups: p.eggGroups,
          modelUrl: p.modelUrl,
          isLegendary: p.isLegendary,
          hasEggs: p.hasEggs,
        });
      }
    }
  }
  return { entries, paths: full.paths };
}

export async function listPlayers() {
  await fs.mkdir(DATA_PLAYERS, { recursive: true });
  const files = await fs.readdir(DATA_PLAYERS);
  const players = [];
  for (const f of files.filter((x) => x.endsWith('.json'))) {
    const p = await readJson(path.join(DATA_PLAYERS, f));
    players.push({
      id: p.id,
      displayName: p.displayName,
      characterStyle: p.characterStyle || null,
      completedPathIds: p.completedPathIds || [],
      unlockedPathIds: p.unlockedPathIds || [0],
      updatedAt: p.updatedAt,
    });
  }
  return players;
}

export async function getPlayer(id) {
  const filePath = path.join(DATA_PLAYERS, `${id}.json`);
  return readJson(filePath);
}

async function savePlayerToDisk(player) {
  await fs.mkdir(DATA_PLAYERS, { recursive: true });
  const filePath = path.join(DATA_PLAYERS, `${player.id}.json`);
  const tmp = `${filePath}.${randomUUID()}.tmp`;
  const snapshot = { ...player, updatedAt: new Date().toISOString() };
  await fs.writeFile(tmp, JSON.stringify(snapshot, null, 2));
  try {
    await fs.rename(tmp, filePath);
  } catch (renameErr) {
    await fs.unlink(tmp).catch(() => { });
    throw renameErr;
  }
  cache.del(filePath);
  return snapshot;
}

export function savePlayer(player) {
  const prev = playerSaveChains.get(player.id) ?? Promise.resolve();
  const next = prev.then(() => savePlayerToDisk(player));
  playerSaveChains.set(
    player.id,
    next.finally(() => {
      if (playerSaveChains.get(player.id) === next) {
        playerSaveChains.delete(player.id);
      }
    }),
  );
  return next;
}

export function invalidateCache() {
  cache.flushAll();
}
