import fs from 'fs/promises';
import path from 'path';
import { getDB } from '../src/server/lib/db.js';
import {
  ROOT,
  DATA_CONFIG,
  DATA_GAME,
  DATA_PLAYERS,
  PUBLIC_DATASET
} from '../src/server/lib/paths.js';

// Helper to parse simple CSV files
function parseCSV(content) {
  const lines = content.split(/\r?\n/);
  const headers = lines[0].split(',');
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(',');
    rows.push(parts);
  }
  return { headers, rows };
}

// Bulk insert helper to avoid SQLite parameter limits (999 variables max)
async function batchInsert(db, tableName, columns, rows) {
  const maxParams = 900;
  const batchSize = Math.floor(maxParams / columns.length);
  const placeholders = new Array(columns.length).fill('?').join(',');
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const sql = `INSERT OR IGNORE INTO ${tableName} (${columns.join(',')}) VALUES ` + 
      batch.map(() => `(${placeholders})`).join(',');
    const flatParams = batch.flat();
    await db.run(sql, flatParams);
  }
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

async function migrate() {
  console.log('Starting migration to SQLite...');
  const db = await getDB();

  await db.run('BEGIN TRANSACTION');

  try {

    // 2. Migrate configs
    const configsToMigrate = [
      { filename: 'balls.json', key: 'balls', dir: DATA_CONFIG },
      { filename: 'biomeMap.json', key: 'biomeMap', dir: DATA_CONFIG },
      { filename: 'locomotionOverrides.json', key: 'locomotionOverrides', dir: DATA_CONFIG },
      { filename: 'spawnLadder.json', key: 'spawnLadder', dir: DATA_CONFIG },
      { filename: 'unlocks.json', key: 'unlocks', dir: DATA_CONFIG },
    ];

    for (const conf of configsToMigrate) {
      const filePath = path.join(conf.dir, conf.filename);
      try {
        const raw = await fs.readFile(filePath, 'utf8');
        JSON.parse(raw);
        await db.run(
          'INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)',
          [conf.key, raw]
        );
        console.log(`Migrated config: ${conf.key}`);
      } catch (err) {
        console.warn(`Warning: Could not migrate config ${conf.key} from ${filePath}: ${err.message}`);
      }
    }

    // Migrate typeAnimationCatalog
    const typeAnimPath = path.join(DATA_GAME, 'typeAnimationCatalog.json');
    const fallbackTypeAnimPath = path.join(PUBLIC_DATASET, 'typeAnimationCatalog.json');
    let typeAnimRaw = null;
    try {
      typeAnimRaw = await fs.readFile(typeAnimPath, 'utf8');
    } catch {
      try {
        typeAnimRaw = await fs.readFile(fallbackTypeAnimPath, 'utf8');
      } catch (err) {
        console.warn(`Warning: Could not read typeAnimationCatalog from game or public assets: ${err.message}`);
      }
    }

    if (typeAnimRaw) {
      await db.run(
        'INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)',
        ['typeAnimationCatalog', typeAnimRaw]
      );
      console.log('Migrated config: typeAnimationCatalog');
    }

    // Migrate client configs: regionalBiomes.json & spawnCatalog.json
    const clientDataDir = path.join(ROOT, 'src', 'game', 'data');
    
    // regionalBiomes
    try {
      const regBiomesRaw = await fs.readFile(path.join(clientDataDir, 'regionalBiomes.json'), 'utf8');
      await db.run(
        'INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)',
        ['regionalBiomes', regBiomesRaw]
      );
      console.log('Migrated config: regionalBiomes');
    } catch (err) {
      console.warn(`Warning: Could not migrate client regionalBiomes.json: ${err.message}`);
    }

    // spawnCatalog
    try {
      const spawnCatalogRaw = await fs.readFile(path.join(clientDataDir, 'spawnCatalog.json'), 'utf8');
      await db.run(
        'INSERT OR REPLACE INTO configs (key, value) VALUES (?, ?)',
        ['spawnCatalog', spawnCatalogRaw]
      );
      console.log('Migrated config: spawnCatalog');
    } catch (err) {
      console.warn(`Warning: Could not migrate client spawnCatalog.json: ${err.message}`);
    }

    // 3. Migrate Pokemon paths and entries
    const slimPath = path.join(DATA_GAME, 'pokemons.slim.json');
    let slimData = null;
    try {
      const raw = await fs.readFile(slimPath, 'utf8');
      slimData = JSON.parse(raw);
    } catch {
      console.log('pokemons.slim.json not found, attempting to build from full pokemons.json...');
      const fullPath = path.join(PUBLIC_DATASET, 'pokemons.json');
      try {
        const rawFull = await fs.readFile(fullPath, 'utf8');
        const full = JSON.parse(rawFull);
        slimData = buildSlimFromFull(full);
      } catch (err) {
        console.error(`Error: Could not load full pokemons dataset from ${fullPath}: ${err.message}`);
      }
    }

    if (slimData) {
      await db.run('DELETE FROM pokemon_paths');
      await db.run('DELETE FROM pokemon_entries');

      if (slimData.paths) {
        for (const p of slimData.paths) {
          await db.run(
            `INSERT INTO pokemon_paths (pathId, terrainName, regionId, regionName, minDex, maxDex, speciesCount)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [p.pathId, p.terrainName, p.regionId, p.regionName, p.minDex, p.maxDex, p.speciesCount]
          );
        }
        console.log(`Migrated ${slimData.paths.length} pokemon paths`);
      }

      if (slimData.entries) {
        for (const e of slimData.entries) {
          await db.run(
            `INSERT INTO pokemon_entries (entryId, speciesId, name, displayName, region, spawnLevel, formTier, evolutionStage, types, eggGroups, modelUrl, isLegendary, hasEggs)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              e.entryId,
              e.speciesId,
              e.name,
              e.displayName,
              e.region,
              e.spawnLevel,
              e.formTier,
              e.evolutionStage,
              JSON.stringify(e.types || []),
              JSON.stringify(e.eggGroups || []),
              e.modelUrl || null,
              e.isLegendary ? 1 : 0,
              e.hasEggs ? 1 : 0
            ]
          );
        }
        console.log(`Migrated ${slimData.entries.length} pokemon entries`);
      }
    }

    // 4. Migrate Player profiles
    try {
      await fs.mkdir(DATA_PLAYERS, { recursive: true });
      const files = await fs.readdir(DATA_PLAYERS);
      const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'package.json');
      
      let playerMigratedCount = 0;
      for (const file of jsonFiles) {
        const filePath = path.join(DATA_PLAYERS, file);
        try {
          const raw = await fs.readFile(filePath, 'utf8');
          const p = JSON.parse(raw);
          if (p && p.id) {
            await db.run(
              `INSERT OR REPLACE INTO players (id, displayName, pokecoins, data, updatedAt)
               VALUES (?, ?, ?, ?, ?)`,
              [
                p.id,
                p.displayName || 'Unknown Player',
                p.pokecoins ?? 500,
                raw,
                p.updatedAt || new Date().toISOString()
              ]
            );
            playerMigratedCount++;
          }
        } catch (err) {
          console.warn(`Warning: Could not migrate player file ${file}: ${err.message}`);
        }
      }
      console.log(`Migrated ${playerMigratedCount} player profiles`);
    } catch (err) {
      console.warn(`Warning: Could not list/read player profiles from ${DATA_PLAYERS}: ${err.message}`);
    }

    // --- BATCH DATASET IMPORT ---
    let runRawImport = false;
    try {
      await fs.access(path.join(PUBLIC_DATASET, 'pokemon.json'));
      runRawImport = true;
    } catch {
      console.log('Raw dataset files not found. Skipping raw dataset migration.');
    }

    if (runRawImport) {
      // Clear old raw tables only during a raw import
      await db.run('DELETE FROM raw_abilities');
      await db.run('DELETE FROM raw_moves');
      await db.run('DELETE FROM raw_pokemon');
      await db.run('DELETE FROM raw_pokemon_moves');
      await db.run('DELETE FROM raw_evolution_chains');
      await db.run('DELETE FROM raw_pokemon_species');
      await db.run('DELETE FROM raw_machines');
      await db.run('DELETE FROM raw_versions');
      await db.run('DELETE FROM raw_version_groups');

      // 5. Versions & Version Groups
      console.log('Migrating versions & version groups...');
      const versionsCsv = await fs.readFile(path.join(PUBLIC_DATASET, 'versions.csv'), 'utf8');
    const parsedVersions = parseCSV(versionsCsv);
    for (const row of parsedVersions.rows) {
      const id = parseInt(row[0], 10);
      const identifier = row[2]; // id,version_group_id,identifier
      await db.run('INSERT INTO raw_versions (id, identifier) VALUES (?, ?)', [id, identifier]);
    }

    const versionGroupsCsv = await fs.readFile(path.join(PUBLIC_DATASET, 'version-groups.csv'), 'utf8');
    const parsedVerGroups = parseCSV(versionGroupsCsv);
    for (const row of parsedVerGroups.rows) {
      const id = parseInt(row[0], 10);
      const identifier = row[1]; // id,identifier,generation_id,order
      await db.run('INSERT INTO raw_version_groups (id, identifier) VALUES (?, ?)', [id, identifier]);
    }

    // 6. Abilities Name Map from pokemon.json
    console.log('Building ability names map from pokemon.json...');
    const pokemonRaw = await fs.readFile(path.join(PUBLIC_DATASET, 'pokemon.json'), 'utf8');
    const pokemonJSON = JSON.parse(pokemonRaw).pokemon;
    const abilityNames = new Map();
    for (const p of Object.values(pokemonJSON)) {
      if (p.Ab) {
        for (const ab of p.Ab) {
          if (ab.id && ab.n) {
            abilityNames.set(ab.id, ab.n);
          }
        }
      }
    }

    // 7. Abilities Table
    console.log('Migrating abilities...');
    const abilityRaw = await fs.readFile(path.join(PUBLIC_DATASET, 'ability.json'), 'utf8');
    const abilityJSON = JSON.parse(abilityRaw).abilities;
    for (const ab of abilityJSON) {
      const id = ab.id;
      const name = abilityNames.get(id) || `ability-${id}`;
      const effect = ab.effect_entries?.effect || null;
      const shortEffect = ab.effect_entries?.short_effect || null;
      await db.run(
        'INSERT INTO raw_abilities (id, name, effect, short_effect) VALUES (?, ?, ?, ?)',
        [id, name, effect, shortEffect]
      );
    }

    // 8. Moves Table (CSV + JSON)
    console.log('Migrating moves...');
    const moveMap = new Map();
    const movesCsv = await fs.readFile(path.join(PUBLIC_DATASET, 'moves.csv'), 'utf8');
    const parsedMoves = parseCSV(movesCsv);
    for (const row of parsedMoves.rows) {
      const id = parseInt(row[0], 10);
      const identifier = row[1];
      const genId = row[2] ? parseInt(row[2], 10) : null;
      const typeId = row[3] ? parseInt(row[3], 10) : null;
      const power = row[4] ? parseInt(row[4], 10) : null;
      const pp = row[5] ? parseInt(row[5], 10) : null;
      const accuracy = row[6] ? parseInt(row[6], 10) : null;
      const priority = row[7] ? parseInt(row[7], 10) : null;
      const dmgClassId = row[9] ? parseInt(row[9], 10) : null;
      moveMap.set(id, { id, identifier, genId, typeId, power, pp, accuracy, priority, dmgClassId });
    }

    const moveRaw = await fs.readFile(path.join(PUBLIC_DATASET, 'move.json'), 'utf8');
    const moveJSON = JSON.parse(moveRaw).moves;
    for (const m of moveJSON) {
      const id = m.id;
      const csvData = moveMap.get(id) || {
        identifier: `move-${id}`,
        genId: null,
        typeId: null,
        power: null,
        pp: null,
        accuracy: null,
        priority: null,
        dmgClassId: null
      };

      const effectEntries = m.effect_entries ? JSON.stringify(m.effect_entries) : null;
      const flavorTexts = m.flavor_text_entries ? JSON.stringify(m.flavor_text_entries) : null;

      await db.run(
        `INSERT INTO raw_moves (id, identifier, generation_id, type_id, power, pp, accuracy, priority, damage_class_id, effect_entries, flavor_texts)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          csvData.identifier,
          csvData.genId,
          csvData.typeId,
          csvData.power,
          csvData.pp,
          csvData.accuracy,
          csvData.priority,
          csvData.dmgClassId,
          effectEntries,
          flavorTexts
        ]
      );
    }

    // 9. Pokemon Table (using pokemonJSON parsed above)
    console.log('Migrating pokemon details...');
    for (const p of Object.values(pokemonJSON)) {
      await db.run(
        `INSERT INTO raw_pokemon (id, name, height, weight, base_experience, stats, types, abilities)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id,
          p.N,
          p.H,
          p.W,
          p.BE,
          JSON.stringify(p.St || []),
          JSON.stringify(p.T || []),
          JSON.stringify(p.Ab || [])
        ]
      );
    }

    // 10. Pokemon Moves mapping (very large CSV - using optimized batchInsert)
    console.log('Migrating pokemon moves mappings...');
    const pokeMovesCsv = await fs.readFile(path.join(PUBLIC_DATASET, 'pokemon-moves.csv'), 'utf8');
    const parsedPokeMoves = parseCSV(pokeMovesCsv);
    const pokeMovesRows = [];
    for (const row of parsedPokeMoves.rows) {
      const pokeId = parseInt(row[0], 10);
      const verGrpId = parseInt(row[1], 10);
      const moveId = parseInt(row[2], 10);
      const methodId = parseInt(row[3], 10);
      const level = parseInt(row[4], 10);
      if (!isNaN(pokeId) && !isNaN(verGrpId) && !isNaN(moveId) && !isNaN(methodId) && !isNaN(level)) {
        pokeMovesRows.push([pokeId, verGrpId, moveId, methodId, level]);
      }
    }
    await batchInsert(db, 'raw_pokemon_moves', ['pokemon_id', 'version_group_id', 'move_id', 'pokemon_move_method_id', 'level'], pokeMovesRows);
    console.log(`Migrated ${pokeMovesRows.length} pokemon moves mappings`);

    // 11. Evolution Chains
    console.log('Migrating evolution chains...');
    const evoChainRaw = await fs.readFile(path.join(PUBLIC_DATASET, 'evolution-chain.json'), 'utf8');
    const evoChainJSON = JSON.parse(evoChainRaw)['evolution-chains'];
    for (const chain of evoChainJSON) {
      if (chain && chain.id) {
        await db.run(
          'INSERT INTO raw_evolution_chains (id, chain_json) VALUES (?, ?)',
          [chain.id, JSON.stringify(chain)]
        );
      }
    }

    // 12. Pokemon Species
    console.log('Migrating pokemon species details...');
    const speciesRaw = await fs.readFile(path.join(PUBLIC_DATASET, 'pokemon-species.json'), 'utf8');
    const speciesJSON = JSON.parse(speciesRaw)['pokemon-species'];
    for (const species of speciesJSON) {
      await db.run(
        `INSERT INTO raw_pokemon_species (id, name, egg_groups, evolution_chain_id, genus, flavor_text_entries)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          species.id,
          species.name,
          JSON.stringify(species.EgG || []),
          species.EvC,
          species.G || null,
          JSON.stringify(species.FTE || [])
        ]
      );
    }

    // 13. Machines Table
    console.log('Migrating machines...');
    const machinesCsv = await fs.readFile(path.join(PUBLIC_DATASET, 'machines.csv'), 'utf8');
    const parsedMachines = parseCSV(machinesCsv);
    const machRows = [];
    for (const row of parsedMachines.rows) {
      const num = parseInt(row[0], 10);
      const verId = parseInt(row[1], 10);
      const itemId = parseInt(row[2], 10);
      const moveId = parseInt(row[3], 10);
      if (!isNaN(num) && !isNaN(verId) && !isNaN(itemId) && !isNaN(moveId)) {
        machRows.push([num, verId, itemId, moveId]);
      }
    }
    await batchInsert(db, 'raw_machines', ['machine_number', 'version_group_id', 'item_id', 'move_id'], machRows);
    }

    await db.run('COMMIT');
    console.log('Migration completed successfully!');
  } catch (err) {
    await db.run('ROLLBACK');
    console.error('Migration failed, changes rolled back:', err);
    process.exit(1);
  } finally {
    await db.close();
  }
}

migrate();
