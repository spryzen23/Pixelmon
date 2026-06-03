const fs = require('fs');
const path = require('path');

const glbPath = path.join(__dirname, '..', 'public', 'player.glb');
const text = fs.readFileSync(glbPath).toString('latin1');
const names = new Set();
const re = /"name":"([^"]+)"/g;
let match;

while ((match = re.exec(text)) !== null) {
  names.add(match[1]);
}

const clips = [...names].filter((n) =>
  /idle|walk|run|house|hip|ash|armature|mixamo/i.test(n)
);
console.log(JSON.stringify({ clipCount: clips.length, clips: clips.sort() }, null, 2));
