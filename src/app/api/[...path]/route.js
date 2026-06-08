import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../../../server/lib/db.js';

export const dynamic = 'force-dynamic';
import {
  getBiomeMap,
  getBallsConfig,
  getTypeAnimationCatalog,
  getPokemonsSlim,
  listPlayers,
  getPlayer,
  savePlayer,
  getSpawnLadder,
  getLocalPokemon,
  getLocalMove
} from '../../../server/lib/dataStore.js';
import {
  getRegionSpawnIndex,
  initSpawnState,
  onCatch,
  isAlphaEligible
} from '../../../server/services/spawnService.js';
import {
  startNewBattle,
  makeChoice
} from '../../../server/services/battleService.js';



// GET Handlers
export async function GET(request, { params }) {
  try {
    const { path: routeParts } = params;
    const url = new URL(request.url);

    // 1. GET /api/health
    if (routeParts[0] === 'health') {
      return NextResponse.json({ ok: true, name: 'pixelmon', version: '0.1.0' });
    }

    // 2. GET /api/biomes
    if (routeParts[0] === 'biomes' && routeParts.length === 1) {
      const map = await getBiomeMap();
      return NextResponse.json(map);
    }

    // 3. GET /api/biomes/:regionId/spawns
    if (routeParts[0] === 'biomes' && routeParts[2] === 'spawns' && routeParts.length === 3) {
      const regionId = routeParts[1];
      const levelQuery = url.searchParams.get('level');
      const level = levelQuery ? Number(levelQuery) : null;
      const byLevel = await getRegionSpawnIndex(regionId);
      if (level != null) {
        return NextResponse.json({ regionId, level, pokemon: byLevel[String(level)] || [] });
      }
      return NextResponse.json({ regionId, byLevel });
    }

    // 4. GET /api/config/balls
    if (routeParts[0] === 'config' && routeParts[1] === 'balls') {
      return NextResponse.json(await getBallsConfig());
    }

    // 5. GET /api/config/animation-types
    if (routeParts[0] === 'config' && routeParts[1] === 'animation-types') {
      return NextResponse.json(await getTypeAnimationCatalog());
    }

    // 6. GET /api/config/spawn-ladder
    if (routeParts[0] === 'config' && routeParts[1] === 'spawn-ladder') {
      return NextResponse.json(await getSpawnLadder());
    }

    // 7. GET /api/starters
    if (routeParts[0] === 'starters') {
      const slim = await getPokemonsSlim();
      return NextResponse.json({ starters: slim.entries });
    }

    // 8. GET /api/pokedex
    if (routeParts[0] === 'pokedex') {
      const region = url.searchParams.get('region') || 'kanto';
      const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
      const limit = Math.min(100, Number(url.searchParams.get('limit')) || 40);
      const slim = await getPokemonsSlim();
      const all = slim.entries.filter((e) => e.region === region && e.formTier === 1);
      const start = (page - 1) * limit;
      return NextResponse.json({
        region,
        page,
        limit,
        total: all.length,
        pokemon: all.slice(start, start + limit),
      });
    }

    // 9. GET /api/players
    if (routeParts[0] === 'players' && routeParts.length === 1) {
      return NextResponse.json({ players: await listPlayers() });
    }

    // 10. GET /api/players/:id
    if (routeParts[0] === 'players' && routeParts.length === 2) {
      const id = routeParts[1];
      try {
        const player = await getPlayer(id);
        return NextResponse.json(player);
      } catch {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
    }

    // 11. GET /api/pokemon/:nameOrId
    if (routeParts[0] === 'pokemon' && routeParts.length === 2) {
      const nameOrId = routeParts[1];
      const pokemon = await getLocalPokemon(nameOrId);
      if (!pokemon) {
        return NextResponse.json({ error: 'Pokemon not found' }, { status: 404 });
      }
      return NextResponse.json(pokemon);
    }

    // 12. GET /api/move/:name
    if (routeParts[0] === 'move' && routeParts.length === 2) {
      const name = routeParts[1];
      const move = await getLocalMove(name);
      if (!move) {
        return NextResponse.json({ error: 'Move not found' }, { status: 404 });
      }
      return NextResponse.json(move);
    }

    // 13. GET /api/auth/verify
    if (routeParts[0] === 'auth' && routeParts[1] === 'verify') {
      const token = url.searchParams.get('token');
      if (!token) {
        return NextResponse.json({ error: 'Token required' }, { status: 400 });
      }
      try {
        const player = await getPlayer(token);
        if (player.trainers === undefined) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }
        return NextResponse.json({ success: true, user: player });
      } catch {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
      }
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// POST Handlers
export async function POST(request, { params }) {
  try {
    const { path: routeParts } = params;
    const body = await request.json().catch(() => ({}));

    // POST /api/auth/register
    if (routeParts[0] === 'auth' && routeParts[1] === 'register') {
      const { username, password, displayName } = body;
      if (!username?.trim() || !password?.trim() || !displayName?.trim()) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
      }

      const db = await getDB();
      const existing = await db.get('SELECT id FROM players WHERE username = ?', [username.toLowerCase().trim()]);
      if (existing) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }

      const crypto = await import('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      const id = uuidv4();
      const user = {
        id,
        displayName: displayName.trim().slice(0, 16),
        username: username.toLowerCase().trim(),
        password: passwordHash,
        pokecoins: 500,
        trainers: [],
        perPathProgress: {},
        completedPathIds: [],
        unlockedPathIds: [0],
        settings: { volume: 0.8, quality: 'medium' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await db.run(
        `INSERT INTO players (id, displayName, username, password, pokecoins, data, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user.id, user.displayName, user.username, user.password, user.pokecoins, JSON.stringify(user), user.updatedAt]
      );

      return NextResponse.json({ success: true, token: user.id, user }, { status: 201 });
    }

    // POST /api/auth/login
    if (routeParts[0] === 'auth' && routeParts[1] === 'login') {
      const { username, password } = body;
      if (!username?.trim() || !password?.trim()) {
        return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
      }

      const db = await getDB();
      const row = await db.get('SELECT data FROM players WHERE username = ?', [username.toLowerCase().trim()]);
      if (!row) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      const user = JSON.parse(row.data);
      const crypto = await import('crypto');
      const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

      if (user.password !== passwordHash) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      return NextResponse.json({ success: true, token: user.id, user });
    }

    // 1. POST /api/players
    if (routeParts[0] === 'players' && routeParts.length === 1) {
      const { displayName } = body;
      if (!displayName?.trim()) {
        return NextResponse.json({ error: 'displayName required' }, { status: 400 });
      }
      const id = uuidv4();
      const player = {
        id,
        displayName: displayName.trim().slice(0, 16),
        pokecoins: 500,
        trainers: [],
        perPathProgress: {},
        completedPathIds: [],
        unlockedPathIds: [0],
        settings: { volume: 0.8, quality: 'medium' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await savePlayer(player);
      return NextResponse.json(player, { status: 201 });
    }

    // 2. POST /api/players/:id/session/start
    if (routeParts[0] === 'players' && routeParts[2] === 'session' && routeParts[3] === 'start') {
      const id = routeParts[1];
      const { pathId, regionId } = body;
      const player = await getPlayer(id);
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
      return NextResponse.json({ player, spawnState, byLevel: Object.keys(byLevel) });
    }

    // 3. POST /api/players/:id/catch
    if (routeParts[0] === 'players' && routeParts[2] === 'catch') {
      const id = routeParts[1];
      const { entryId, regionId, ballId, isAlpha } = body;
      const player = await getPlayer(id);
      
      // Initialize inventory if not present
      if (!player.inventory) {
        player.inventory = {
          balls: {
            standard: 999,
            great: 5,
            ultra: 1
          }
        };
      } else if (!player.inventory.balls) {
        player.inventory.balls = {
          standard: 999,
          great: 5,
          ultra: 1
        };
      }

      // Check and decrement Great/Ultra balls
      if (ballId !== 'standard') {
        const count = player.inventory.balls[ballId] ?? 0;
        if (count <= 0) {
          return NextResponse.json({ error: 'Out of ' + ballId + ' balls' }, { status: 400 });
        }
        player.inventory.balls[ballId] = count - 1;
      }

      const slim = await getPokemonsSlim();
      const entry = slim.entries.find((e) => e.entryId === entryId);
      if (!entry) return NextResponse.json({ error: 'Invalid entry' }, { status: 400 });

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

      return NextResponse.json({
        caught,
        unlocked,
        alphaEligible: isAlphaEligible(spawnState),
        spawnState,
        player,
      });
    }

    // 4. POST /api/players/:id/map-complete
    if (routeParts[0] === 'players' && routeParts[2] === 'map-complete') {
      const id = routeParts[1];
      const { pathId, regionId, stats } = body;
      const player = await getPlayer(id);
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
      return NextResponse.json(player);
    }

    // 5. POST /api/battle/start
    if (routeParts[0] === 'battle' && routeParts[1] === 'start') {
      const { team, difficulty, weather } = body;
      const result = startNewBattle({ team, difficulty, weather });
      return NextResponse.json(result, { status: 201 });
    }

    // 6. POST /api/battle/choice
    if (routeParts[0] === 'battle' && routeParts[1] === 'choice') {
      const { battleId, choice } = body;
      if (!battleId || !choice) {
        return NextResponse.json({ error: 'battleId and choice are required' }, { status: 400 });
      }
      const result = makeChoice(battleId, choice);
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

// PATCH Handlers
export async function PATCH(request, { params }) {
  try {
    const { path: routeParts } = params;
    const body = await request.json().catch(() => ({}));

    // 1. PATCH /api/players/:id/save
    if (routeParts[0] === 'players' && routeParts[2] === 'save') {
      const id = routeParts[1];
      try {
        const player = await getPlayer(id);
        const merged = {
          ...player,
          ...body,
          id: player.id,
          perPathProgress: {
            ...player.perPathProgress,
            ...(body.perPathProgress || {}),
          },
        };
        await savePlayer(merged);
        return NextResponse.json(merged);
      } catch {
        return NextResponse.json({ error: 'Player not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
