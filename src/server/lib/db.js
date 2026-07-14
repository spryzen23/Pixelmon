import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { DATA } from "./paths.js";

let dbInstance = null;
let dbPromise = null;

export function getDB() {
  if (dbInstance) return Promise.resolve(dbInstance);
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    const dbPath = path.join(DATA, "pixelmon.db");

    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    // Optimize SQLite settings for performance
    await db.run("PRAGMA journal_mode = WAL");
    await db.run("PRAGMA synchronous = NORMAL");
    await db.run("PRAGMA foreign_keys = ON");

    await initSchema(db);

    dbInstance = db;
    dbPromise = null;
    return db;
  })();

  return dbPromise;
}

async function initSchema(db) {
  // 1. Configs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS configs (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // 2. Pokemon paths table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pokemon_paths (
      pathId INTEGER PRIMARY KEY,
      terrainName TEXT,
      regionId TEXT NOT NULL,
      regionName TEXT NOT NULL,
      minDex INTEGER,
      maxDex INTEGER,
      speciesCount INTEGER
    )
  `);

  // 3. Pokemon entries table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS pokemon_entries (
      entryId INTEGER PRIMARY KEY,
      speciesId INTEGER NOT NULL,
      name TEXT NOT NULL,
      displayName TEXT NOT NULL,
      region TEXT NOT NULL,
      spawnLevel INTEGER NOT NULL,
      formTier INTEGER NOT NULL,
      evolutionStage INTEGER NOT NULL,
      types TEXT NOT NULL,       -- JSON array of strings
      eggGroups TEXT NOT NULL,   -- JSON array of strings
      modelUrl TEXT,
      isLegendary INTEGER NOT NULL DEFAULT 0, -- 0 or 1
      hasEggs INTEGER NOT NULL DEFAULT 0      -- 0 or 1
    )
  `);

  // Indexing for common spawns and queries
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_pokemon_entries_region ON pokemon_entries(region);
    CREATE INDEX IF NOT EXISTS idx_pokemon_entries_spawnLevel ON pokemon_entries(spawnLevel);
  `);

  // 4. Players table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      id TEXT PRIMARY KEY,
      displayName TEXT NOT NULL,
      username TEXT,
      password TEXT,
      pokecoins INTEGER DEFAULT 500,
      data TEXT NOT NULL, -- Full JSON state
      updatedAt TEXT NOT NULL
    )
  `);

  try {
    await db.exec("ALTER TABLE players ADD COLUMN username TEXT");
  } catch (err) {
    // Ignore if column already exists
  }

  try {
    await db.exec("ALTER TABLE players ADD COLUMN password TEXT");
  } catch (err) {
    // Ignore if column already exists
  }

  await db.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS idx_players_username ON players(username) WHERE username IS NOT NULL;
  `);

  // --- RAW DATASET TABLES FOR LOCAL POKEAPI ---

  // 5. Abilities Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_abilities (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      effect TEXT,
      short_effect TEXT
    )
  `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_raw_abilities_name ON raw_abilities(name);`
  );

  // 6. Moves Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_moves (
      id INTEGER PRIMARY KEY,
      identifier TEXT NOT NULL,
      generation_id INTEGER,
      type_id INTEGER,
      power INTEGER,
      pp INTEGER,
      accuracy INTEGER,
      priority INTEGER,
      damage_class_id INTEGER,
      effect_entries TEXT, -- JSON
      flavor_texts TEXT    -- JSON
    )
  `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_raw_moves_name ON raw_moves(identifier);`
  );

  // 7. Raw Pokemon stats & details
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_pokemon (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      height INTEGER,
      weight INTEGER,
      base_experience INTEGER,
      stats TEXT,       -- JSON
      types TEXT,       -- JSON
      abilities TEXT    -- JSON
    )
  `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_raw_pokemon_name ON raw_pokemon(name);`
  );

  // 8. Pokemon Moves (learn method mapping)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_pokemon_moves (
      pokemon_id INTEGER,
      version_group_id INTEGER,
      move_id INTEGER,
      pokemon_move_method_id INTEGER,
      level INTEGER,
      PRIMARY KEY (pokemon_id, version_group_id, move_id, pokemon_move_method_id, level)
    )
  `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_raw_pokemon_moves_poke ON raw_pokemon_moves(pokemon_id);`
  );

  // 9. Evolution Chains
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_evolution_chains (
      id INTEGER PRIMARY KEY,
      chain_json TEXT
    )
  `);

  // 10. Pokemon Species
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_pokemon_species (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      egg_groups TEXT,     -- JSON
      evolution_chain_id INTEGER,
      genus TEXT,
      flavor_text_entries TEXT -- JSON
    )
  `);
  await db.exec(
    `CREATE INDEX IF NOT EXISTS idx_raw_pokemon_species_name ON raw_pokemon_species(name);`
  );

  // 11. Machines Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_machines (
      machine_number INTEGER,
      version_group_id INTEGER,
      item_id INTEGER,
      move_id INTEGER,
      PRIMARY KEY (machine_number, version_group_id, move_id)
    )
  `);

  // 12. Versions & Version Groups Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_versions (
      id INTEGER PRIMARY KEY,
      identifier TEXT NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS raw_version_groups (
      id INTEGER PRIMARY KEY,
      identifier TEXT NOT NULL
    )
  `);
}
