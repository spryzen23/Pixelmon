/**
 * CRA only allows JSON imports under src/. Split scripts write both locations.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MANIFEST_SRC = path.join(ROOT, 'client', 'src', 'game', 'plantsManifest.json');
const MANIFEST_PUBLIC = path.join(ROOT, 'public', 'assets', 'plants', 'manifest.json');

function writePlantsManifest(manifest) {
  const json = `${JSON.stringify(manifest, null, 2)}\n`;

  fs.mkdirSync(path.dirname(MANIFEST_SRC), { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST_PUBLIC), { recursive: true });
  fs.writeFileSync(MANIFEST_SRC, json);
  fs.writeFileSync(MANIFEST_PUBLIC, json);
}

function loadPlantsManifest() {
  const manifestPath = fs.existsSync(MANIFEST_SRC) ? MANIFEST_SRC : MANIFEST_PUBLIC;

  if (!fs.existsSync(manifestPath)) {
    return { plants: [] };
  }

  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

module.exports = {
  MANIFEST_SRC,
  MANIFEST_PUBLIC,
  loadPlantsManifest,
  writePlantsManifest,
};
