# Pixelmon — Voxel Legends

Browser-based voxel creature-catching game with React 19, Three.js (R3F), and a Node.js JSON file backend.

## Quick start

```bash
npm install
npm install --prefix server
npm install --prefix client
npm run build-slim
npm run dev
```

- Client: <http://localhost:3000>
- API: <http://localhost:4000/api/health>

## Structure

| Path | Purpose |
|------|---------|
| `client/` | React + Vite + R3F game UI |
| `server/` | Express REST API + static assets |
| `data/config/` | biomeMap, spawnLadder, balls, unlocks |
| `data/game/` | spawnCatalog, typeAnimationCatalog, pokemons.slim.json |
| `data/players/` | Per-player JSON saves |
| `public/assets/` | GLBs, manifests, type icons, datasets |

## Game flow

Welcome → Player select → Name + companion → Map select → Load → Play → Complete → Welcome

## Scripts

- `npm run dev` — client + server (REST API + Battle Royale Socket.io on port 4000)
- `npm run build-slim` — compact spawn index from pokemons.json
- `npm run generate-catalogs` — regenerate data/game catalogs
- `npm run generate:assets` — scan biome GLB folders into `generatedAssetManifest.js`
- `codebase.bat` — full validation pipeline (Windows)

## Game modes

- **Campaign** — regional progression, saves, pokedex (default welcome flow)
- **Sandbox Explorer** — in-game biome switcher, no catch persistence (Welcome → Game modes)
- **Battle Royale** — Socket.io rooms on the same server port

## Controls

- WASD move · F or Space throw · E companion · X exit cave/ice rooms
- Sandbox: right-side biome menu + export biome load metrics

## Version roadmap

See [docs/versions.md](docs/versions.md).
