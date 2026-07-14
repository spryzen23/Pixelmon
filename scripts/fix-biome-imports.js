const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'client', 'src', 'components', 'biomes');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith('.js')) continue;

    let content = fs.readFileSync(full, 'utf8');
    content = content
      .replace(/from '\.\.\/\.\.\/world'/g, "from '../../../game/biomeLandmarks'")
      .replace(/from '\.\.\/\.\.\/entities\/AnimatedModel'/g, "from '../../AnimatedModel'")
      .replace(/from '\.\.\/\.\.\/entities\/ModelErrorBoundary'/g, "from '../../ModelErrorBoundary'");

    const jsxPath = full.replace(/\.js$/, '.jsx');
    fs.writeFileSync(jsxPath, content);
    fs.unlinkSync(full);
  }
}

walk(ROOT);
console.log('Biome imports fixed.');
