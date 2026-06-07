import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  getBiomeMap,
  getBallsConfig,
  getTypeAnimationCatalog,
  getPokemonsSlim,
  listPlayers,
  getPlayer,
  savePlayer,
} from '../lib/dataStore.js';
import {
  getRegionSpawnIndex,
  initSpawnState,
  onCatch,
  isAlphaEligible,
} from '../services/spawnService.js';
import { getSpawnLadder } from '../lib/dataStore.js';

export const apiRouter = Router();

const DEFAULT_CHARACTER_STYLE = {
  id: 'player-21',
  label: 'Arc Runner',
  modelUrl: '/assets/players/player%20(21).glb',
  motion: 'Idle, run, jump clips',
  fitHeight: 0.92,
  modelScale: 1,
};

apiRouter.get('/health', (req, res) => {
  res.json({ ok: true, name: 'pixelmon', version: '0.1.0' });
});

apiRouter.get('/biomes', async (req, res, next) => {
  try {
    const map = await getBiomeMap();
    res.json(map);
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/biomes/:regionId/spawns', async (req, res, next) => {
  try {
    const { regionId } = req.params;
    const level = req.query.level ? Number(req.query.level) : null;
    const byLevel = await getRegionSpawnIndex(regionId);
    if (level != null) {
      return res.json({ regionId, level, pokemon: byLevel[String(level)] || [] });
    }
    res.json({ regionId, byLevel });
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/config/balls', async (req, res, next) => {
  try {
    res.json(await getBallsConfig());
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/config/animation-types', async (req, res, next) => {
  try {
    res.json(await getTypeAnimationCatalog());
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/config/spawn-ladder', async (req, res, next) => {
  try {
    res.json(await getSpawnLadder());
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/starters', async (req, res, next) => {
  try {
    const slim = await getPokemonsSlim();
    const starters = slim.entries.filter(
      (e) =>
        e.region === 'kanto' &&
        e.spawnLevel === 1 &&
        e.formTier === 1 &&
        !e.isLegendary &&
        [1, 4, 7, 25].includes(e.speciesId)
    );
    res.json({ starters });
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/pokedex', async (req, res, next) => {
  try {
    const region = req.query.region || 'kanto';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 40);
    const slim = await getPokemonsSlim();
    const all = slim.entries.filter((e) => e.region === region && e.formTier === 1);
    const start = (page - 1) * limit;
    res.json({
      region,
      page,
      limit,
      total: all.length,
      pokemon: all.slice(start, start + limit),
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/players', async (req, res, next) => {
  try {
    res.json({ players: await listPlayers() });
  } catch (e) {
    next(e);
  }
});

apiRouter.post('/players', async (req, res, next) => {
  try {
    const { displayName, companion, characterStyle } = req.body;
    if (!displayName?.trim()) {
      return res.status(400).json({ error: 'displayName required' });
    }
    const id = uuidv4();
    const player = {
      id,
      displayName: displayName.trim().slice(0, 16),
      companion: companion || null,
      characterStyle: characterStyle || DEFAULT_CHARACTER_STYLE,
      unlockedPathIds: [0],
      completedPathIds: [],
      perPathProgress: {},
      settings: { volume: 0.8, quality: 'medium' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await savePlayer(player);
    res.status(201).json(player);
  } catch (e) {
    next(e);
  }
});

apiRouter.get('/players/:id', async (req, res) => {
  try {
    const player = await getPlayer(req.params.id);
    res.json(player);
  } catch {
    res.status(404).json({ error: 'Player not found' });
  }
});

apiRouter.patch('/players/:id/save', async (req, res) => {
  try {
    const player = await getPlayer(req.params.id);
    const patch = req.body;
    const merged = {
      ...player,
      ...patch,
      id: player.id,
      perPathProgress: {
        ...player.perPathProgress,
        ...(patch.perPathProgress || {}),
      },
    };
    await savePlayer(merged);
    res.json(merged);
  } catch {
    res.status(404).json({ error: 'Player not found' });
  }
});

apiRouter.post('/players/:id/session/start', async (req, res, next) => {
  try {
    const player = await getPlayer(req.params.id);
    const { pathId, regionId } = req.body;
    const ladder = await getSpawnLadder();
    const byLevel = await getRegionSpawnIndex(regionId);
    let spawnState = player.perPathProgress?.[regionId]?.spawnState;
    if (!spawnState) {
      spawnState = initSpawnState(regionId, byLevel, ladder);
    }
    player.activeSession = { pathId, regionId, startedAt: new Date().toISOString() };
    if (!player.perPathProgress[regionId]) {
      player.perPathProgress[regionId] = {};
    }
    player.perPathProgress[regionId].spawnState = spawnState;
    await savePlayer(player);
    res.json({ player, spawnState, byLevel: Object.keys(byLevel) });
  } catch (e) {
    next(e);
  }
});

apiRouter.post('/players/:id/catch', async (req, res, next) => {
  try {
    const player = await getPlayer(req.params.id);
    const { entryId, regionId, ballId, isAlpha } = req.body;
    const slim = await getPokemonsSlim();
    const entry = slim.entries.find((e) => e.entryId === entryId);
    if (!entry) return res.status(400).json({ error: 'Invalid entry' });

    const ladder = await getSpawnLadder();
    const progress = player.perPathProgress[regionId] || {};
    let spawnState = progress.spawnState;
    if (!spawnState) {
      const byLevel = await getRegionSpawnIndex(regionId);
      spawnState = initSpawnState(regionId, byLevel, ladder);
    }

    const balls = await getBallsConfig();
    const ball = balls.balls.find((b) => b.id === ballId) || balls.balls[0];
    const baseChance = 0.35 * (ball.captureMultiplier || 1);
    const caught = Math.random() < baseChance;

    let unlocked = false;
    if (caught && !isAlpha) {
      const result = onCatch(spawnState, entry, ladder);
      spawnState = result.state;
      unlocked = result.unlocked;
    }
    if (caught && isAlpha) {
      spawnState.alphaCaught = true;
    }

    if (!progress.caughtEntryIds) progress.caughtEntryIds = [];
    if (caught && !progress.caughtEntryIds.includes(entryId)) {
      progress.caughtEntryIds.push(entryId);
    }
    progress.spawnState = spawnState;
    player.perPathProgress[regionId] = progress;
    await savePlayer(player);

    res.json({
      caught,
      unlocked,
      alphaEligible: isAlphaEligible(spawnState),
      spawnState,
      player,
    });
  } catch (e) {
    next(e);
  }
});

apiRouter.post('/players/:id/map-complete', async (req, res, next) => {
  try {
    const player = await getPlayer(req.params.id);
    const { pathId, regionId, stats } = req.body;
    if (!player.completedPathIds.includes(pathId)) {
      player.completedPathIds.push(pathId);
    }
    const map = await getBiomeMap();
    const idx = map.regions.findIndex((r) => r.regionId === regionId);
    if (idx >= 0 && idx < map.regions.length - 1) {
      const nextRegion = map.regions[idx + 1];
      if (nextRegion?.playable && !player.unlockedPathIds.includes(nextRegion.pathId)) {
        player.unlockedPathIds.push(nextRegion.pathId);
      }
    }
    player.activeSession = null;
    player.perPathProgress[regionId] = {
      ...player.perPathProgress[regionId],
      completed: true,
      stats,
      completedAt: new Date().toISOString(),
    };
    await savePlayer(player);
    res.json(player);
  } catch (e) {
    next(e);
  }
});

apiRouter.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});
