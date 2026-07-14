/**
 * Builds data/game/pokemons.slim.json from public/assets/dataSet/pokemons.json
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IN = path.join(ROOT, 'public/assets/dataSet/pokemons.json');
const OUT = path.join(ROOT, 'data/game/pokemons.slim.json');

function main() {
  if (!fs.existsSync(IN)) {
    console.warn(`Warning: Source file ${IN} not found. Skipping build-slim.`);
    return;
  }
  const full = JSON.parse(fs.readFileSync(IN, 'utf8'));
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
  const doc = {
    generatedBy: 'scripts/build-slim.js',
    paths: full.paths,
    entries,
    stats: { totalEntries: entries.length },
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(doc));
  console.log(`Wrote ${OUT} (${entries.length} entries)`);
}

main();
