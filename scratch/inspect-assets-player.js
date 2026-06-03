const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'assets', 'player.glb');
if (!fs.existsSync(glbPath)) {
  console.log('missing assets player.glb');
  process.exit(0);
}

const text = fs.readFileSync(glbPath).toString('latin1');
const names = new Set();
const re = /"name":"([^"]+)"/g;
let match;

while ((match = re.exec(text)) !== null) {
  names.add(match[1]);
}

console.log(
  [...names].filter((n) => /^(idle|walk|run|walking|house)$/i.test(n)).sort()
);
