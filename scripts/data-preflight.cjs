/**
 * Verifies the SQLite pokemon catalog is present (replaces legacy pokemons.slim.json check).
 */
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const DB_PATH = path.join(__dirname, '..', 'data', 'pixelmon.db');

async function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.error(`ERROR: ${DB_PATH} not found. Run: npm run setup-data`);
    process.exit(1);
  }

  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  try {
    const entries = await db.get('SELECT COUNT(*) AS c FROM pokemon_entries');
    const paths = await db.get('SELECT COUNT(*) AS c FROM pokemon_paths');
    if (!entries?.c || !paths?.c) {
      console.error(
        `ERROR: SQLite pokemon catalog incomplete (entries=${entries?.c ?? 0}, paths=${paths?.c ?? 0}). Run: npm run setup-data`
      );
      process.exit(1);
    }
    console.log(`OK SQLite pokemon catalog (${entries.c} entries, ${paths.c} paths)`);
  } finally {
    await db.close();
  }
}

main().catch((err) => {
  console.error('ERROR: data preflight failed:', err.message);
  process.exit(1);
});
