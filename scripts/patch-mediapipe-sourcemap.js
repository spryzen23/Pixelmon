/**
 * @mediapipe/tasks-vision ships vision_bundle.mjs with a sourceMappingURL
 * pointing at a missing .map file. CRA's source-map-loader warns on every build.
 */
const fs = require('fs');
const path = require('path');

const mapPath = path.join(
  __dirname,
  '..',
  'node_modules',
  '@mediapipe',
  'tasks-vision',
  'vision_bundle_mjs.js.map'
);

const emptyMap = JSON.stringify({
  version: 3,
  sources: [],
  names: [],
  mappings: '',
});

try {
  if (!fs.existsSync(mapPath)) {
    fs.mkdirSync(path.dirname(mapPath), { recursive: true });
    fs.writeFileSync(mapPath, emptyMap);
  }
} catch {
  // Optional dependency path; ignore when node_modules is absent.
}
