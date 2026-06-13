const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'client', 'src', 'modes', 'battleRoyale');

const REPLACEMENTS = [
  ["from '../../systems/", "from '../../components/"],
  ["from '../../entities/", "from '../../components/"],
  ["from '../../environment/", "from '../../components/"],
  ["from '../../world/VoxelWorld'", "from '../../components/VoxelWorld'"],
  ["from '../../biomes/", "from '../../components/biomes/"],
  ["from '../../components/biomes/desert/Sandstorm'", "from '../../components/Sandstorm'"],
  ["from '../../components/biomes/icy/Snowstorm'", "from '../../components/Snowstorm'"],
  ["from '../../world'", "from '../../game/world'"],
];

for (const file of fs.readdirSync(DIR)) {
  if (!file.endsWith('.jsx')) continue;
  const full = path.join(DIR, file);
  let content = fs.readFileSync(full, 'utf8');
  for (const [from, to] of REPLACEMENTS) {
    content = content.split(from).join(to);
  }
  fs.writeFileSync(full, content);
}

console.log('BR imports updated.');
