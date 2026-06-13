/**
 * Generates pokemons.md and public/assets/dataSet/pokemons.json
 * from spawn catalog — grouped by regional biome, spawn level, evolution stage.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_GAME = path.join(ROOT, 'data/game');
const SPAWN_CATALOG = fs.existsSync(path.join(DATA_GAME, 'spawnCatalog.json'))
  ? path.join(DATA_GAME, 'spawnCatalog.json')
  : path.join(ROOT, 'client/src/game/data/spawnCatalog.json');
const REGIONAL_BIOMES = fs.existsSync(path.join(DATA_GAME, 'regionalBiomes.json'))
  ? path.join(DATA_GAME, 'regionalBiomes.json')
  : path.join(ROOT, 'client/src/game/data/regionalBiomes.json');
const OUT_MD = path.join(ROOT, 'pokemons.md');
const OUT_JSON = path.join(ROOT, 'public/assets/dataSet/pokemons.json');

const FORM_TIER_LABELS = {
  1: 'regular',
  2: 'shiny',
  3: 'regional/alternate',
  4: 'mega',
  5: 'gmax/multiform',
};

const PATH_TERRAIN = {
  0: 'Fieldlands Trail',
  1: 'Sandglass Flats',
  2: 'Frostpine Pass',
  3: 'Coastal Run',
  4: 'Crimson Mire',
  5: 'Coronet Approach',
  6: 'Fantasy World',
  7: 'Village World',
};

function titleCase(name) {
  return String(name)
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('-');
}

function toPokemonRecord(entry) {
  return {
    entryId: entry.entryId,
    speciesId: entry.speciesId,
    name: entry.name,
    displayName: titleCase(entry.name),
    evolutionStage: entry.evolutionStage,
    formName: entry.formName,
    formTier: entry.formTier,
    formTierLabel: FORM_TIER_LABELS[entry.formTier] || String(entry.formTier),
    spawnLevel: entry.spawnLevel,
    types: entry.types,
    eggGroups: entry.eggGroups,
    isDefault: entry.isDefault,
    isLegendary: entry.isLegendary,
    hasEggs: entry.hasEggs,
    modelUrl: entry.modelUrl || null,
  };
}

function buildBiomeBuckets(catalog, regional) {
  const byRegion = {};
  regional.regions.forEach((r) => {
    byRegion[r.id] = { meta: r, byLevel: {}, byStage: {} };
  });

  catalog.entries.forEach((entry) => {
    const region = entry.region;
    if (!byRegion[region]) {
      byRegion[region] = {
        meta: { id: region, name: titleCase(region) },
        byLevel: {},
        byStage: {},
      };
    }
    const level = entry.spawnLevel;
    const stage = entry.evolutionStage;
    if (!byRegion[region].byLevel[level]) byRegion[region].byLevel[level] = [];
    if (!byRegion[region].byStage[stage]) byRegion[region].byStage[stage] = [];
    byRegion[region].byLevel[level].push(entry);
    byRegion[region].byStage[stage].push(entry);
  });

  return byRegion;
}

function buildJsonDocument(catalog, regional, byRegion) {
  const formBand = catalog.formBandSize || 5;

  const paths = Object.entries(regional.pathToRegion || {}).map(([pathId, regionId]) => {
    const meta = byRegion[regionId]?.meta;
    return {
      pathId: Number(pathId),
      terrainName: PATH_TERRAIN[pathId] || null,
      regionId,
      regionName: meta?.name || regionId,
      minDex: meta?.minDex,
      maxDex: meta?.maxDex,
      speciesCount: meta?.count,
    };
  });

  const paldeaMeta = byRegion.paldea?.meta;
  if (paldeaMeta) {
    paths.push({
      pathId: null,
      terrainName: null,
      regionId: 'paldea',
      regionName: paldeaMeta.name,
      minDex: paldeaMeta.minDex,
      maxDex: paldeaMeta.maxDex,
      speciesCount: paldeaMeta.count,
      note: 'No playable path yet',
    });
  }

  const biomes = {};
  regional.regions.forEach((regionMeta) => {
    const bucket = byRegion[regionMeta.id];
    if (!bucket) return;

    const pathEntry = Object.entries(regional.pathToRegion || {}).find(
      ([, r]) => r === regionMeta.id
    );
    const levels = Object.keys(bucket.byLevel).map(Number).sort((a, b) => a - b);
    const stages = Object.keys(bucket.byStage).map(Number).sort((a, b) => a - b);

    const bySpawnLevel = {};
    levels.forEach((level) => {
      const entries = bucket.byLevel[level].sort(
        (a, b) => a.speciesId - b.speciesId || a.formTier - b.formTier
      );
      const stageSet = [...new Set(entries.map((e) => e.evolutionStage))].sort((a, b) => a - b);
      const tierSet = [...new Set(entries.map((e) => e.formTier))].sort((a, b) => a - b);
      bySpawnLevel[String(level)] = {
        spawnLevel: level,
        evolutionStages: stageSet,
        formTiers: tierSet.map((t) => ({
          tier: t,
          label: FORM_TIER_LABELS[t] || String(t),
        })),
        count: entries.length,
        pokemon: entries.map(toPokemonRecord),
      };
    });

    const byEvolutionStage = {};
    stages.forEach((stage) => {
      const entries = bucket.byStage[stage].sort(
        (a, b) => a.spawnLevel - b.spawnLevel || a.speciesId - b.speciesId
      );
      byEvolutionStage[String(stage)] = {
        evolutionStage: stage,
        count: entries.length,
        pokemon: entries.map(toPokemonRecord),
      };
    });

    biomes[regionMeta.id] = {
      id: regionMeta.id,
      name: regionMeta.name,
      minDex: regionMeta.minDex,
      maxDex: regionMeta.maxDex,
      speciesCount: regionMeta.count,
      pathId: pathEntry ? Number(pathEntry[0]) : null,
      terrainName: pathEntry ? PATH_TERRAIN[pathEntry[0]] : null,
      summary: {
        spawnLevels: levels,
        evolutionStages: stages,
        totalEntries: catalog.entries.filter((e) => e.region === regionMeta.id).length,
      },
      bySpawnLevel,
      byEvolutionStage,
    };
  });

  return {
    generatedFrom: 'src/game/data/spawnCatalog.json',
    generatedBy: 'scripts/generate-pokemons-md.js',
    formula: {
      expression: '(evolutionStage - 1) * formBandSize + formTier',
      formBandSize: formBand,
    },
    formTiers: FORM_TIER_LABELS,
    paths,
    biomes,
    stats: {
      totalEntries: catalog.entries.length,
      biomeCount: regional.regions.length,
    },
  };
}

function writeMarkdown(catalog, regional, byRegion) {
  const formBand = catalog.formBandSize || 5;
  const lines = [];
  lines.push('# Pokémon by Regional Biome, Spawn Level & Evolution Stage');
  lines.push('');
  lines.push('Generated from `src/game/data/spawnCatalog.json` via `npm run generate-pokemons-md`.');
  lines.push('');
  lines.push('JSON mirror: `public/assets/dataSet/pokemons.json`');
  lines.push('');
  lines.push('## Formula');
  lines.push('');
  lines.push('```');
  lines.push(`spawnLevel = (evolutionStage - 1) × ${formBand} + formTier`);
  lines.push('```');
  lines.push('');
  lines.push('| formTier | Meaning |');
  lines.push('|----------|---------|');
  Object.entries(FORM_TIER_LABELS).forEach(([tier, label]) => {
    lines.push(`| ${tier} | ${label} |`);
  });
  lines.push('');
  lines.push('## Playable path → region map');
  lines.push('');
  lines.push('| Path | Terrain | Region | Dex range |');
  lines.push('|------|---------|--------|-----------|');
  Object.entries(regional.pathToRegion || {}).forEach(([pathId, regionId]) => {
    const meta = byRegion[regionId]?.meta;
    lines.push(
      `| ${pathId} | ${PATH_TERRAIN[pathId] || '—'} | ${meta?.name || regionId} | ${meta?.minDex}–${meta?.maxDex} (${meta?.count}) |`
    );
  });
  const paldea = byRegion.paldea?.meta;
  if (paldea) {
    lines.push(`| — | *(no path yet)* | Paldea | ${paldea.minDex}–${paldea.maxDex} (${paldea.count}) |`);
  }
  lines.push('');

  regional.regions.forEach((regionMeta) => {
    const bucket = byRegion[regionMeta.id];
    if (!bucket) return;

    lines.push('---');
    lines.push('');
    lines.push(`## ${regionMeta.name} (dex ${regionMeta.minDex}–${regionMeta.maxDex}, ${regionMeta.count} species)`);
    lines.push('');

    const pathEntry = Object.entries(regional.pathToRegion || {}).find(([, r]) => r === regionMeta.id);
    if (pathEntry) {
      lines.push(`**In-game path:** ${pathEntry[0]} — ${PATH_TERRAIN[pathEntry[0]]}`);
    } else {
      lines.push('**In-game path:** none (data catalog only)');
    }
    lines.push('');

    const levels = Object.keys(bucket.byLevel).map(Number).sort((a, b) => a - b);
    const stages = Object.keys(bucket.byStage).map(Number).sort((a, b) => a - b);
    lines.push('### Summary');
    lines.push('');
    lines.push(`- Spawn levels present: ${levels.join(', ')}`);
    lines.push(`- Evolution stages present: ${stages.join(', ')}`);
    lines.push(`- Total catalog entries: ${catalog.entries.filter((e) => e.region === regionMeta.id).length}`);
    lines.push('');

    lines.push('### By spawn level');
    lines.push('');

    levels.forEach((level) => {
      const entries = bucket.byLevel[level].sort((a, b) => a.speciesId - b.speciesId || a.formTier - b.formTier);
      const stageSet = [...new Set(entries.map((e) => e.evolutionStage))].sort((a, b) => a - b);
      const tierSet = [...new Set(entries.map((e) => e.formTier))].sort((a, b) => a - b);
      lines.push(`#### Spawn level ${level} (stage ${stageSet.join('/')}, form tier ${tierSet.map((t) => FORM_TIER_LABELS[t] || t).join('/')}) — ${entries.length} entries`);
      lines.push('');
      lines.push('| # | Dex | Name | Stage | Form | Types | Egg groups |');
      lines.push('|---|-----|------|-------|------|-------|------------|');
      entries.forEach((e, i) => {
        lines.push(
          `| ${i + 1} | ${e.speciesId} | ${titleCase(e.name)} | ${e.evolutionStage} | ${e.formName} (${FORM_TIER_LABELS[e.formTier] || e.formTier}) | ${e.types.join(', ')} | ${e.eggGroups.join(', ')} |`
        );
      });
      lines.push('');
    });

    lines.push('### By evolution stage');
    lines.push('');

    stages.forEach((stage) => {
      const entries = bucket.byStage[stage].sort((a, b) => a.spawnLevel - b.spawnLevel || a.speciesId - b.speciesId);
      lines.push(`#### Evolution stage ${stage} — ${entries.length} entries`);
      lines.push('');
      lines.push('| Spawn Lv | Dex | Name | Form | Types |');
      lines.push('|----------|-----|------|------|-------|');
      entries.forEach((e) => {
        lines.push(
          `| ${e.spawnLevel} | ${e.speciesId} | ${titleCase(e.name)} | ${e.formName} | ${e.types.join(', ')} |`
        );
      });
      lines.push('');
    });
  });

  fs.writeFileSync(OUT_MD, lines.join('\n'));
  console.log(`Wrote ${OUT_MD} (${lines.length} lines)`);
}

function main() {
  const catalog = JSON.parse(fs.readFileSync(SPAWN_CATALOG, 'utf8'));
  const regional = JSON.parse(fs.readFileSync(REGIONAL_BIOMES, 'utf8'));
  const byRegion = buildBiomeBuckets(catalog, regional);

  const jsonDoc = buildJsonDocument(catalog, regional, byRegion);
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(jsonDoc, null, 2));
  console.log(`Wrote ${OUT_JSON} (${jsonDoc.stats.totalEntries} entries, ${jsonDoc.stats.biomeCount} biomes)`);

  writeMarkdown(catalog, regional, byRegion);
}

main();
