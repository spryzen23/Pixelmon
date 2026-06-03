# Voxel Legends Prototype

Voxel Legends is a React + Three.js prototype for a creature-catching voxel adventure. It blends a blocky, biome-based world with third-person movement, companion recall, projectile catching, weather effects, and region-specific creature assets.

## Tech Stack

- React
- Three.js
- @react-three/fiber
- @react-three/drei
- InstancedMesh voxel terrain rendering
- GLB character and creature models loaded from `public/assets`

## Running The Project

Install dependencies:

```bash
npm install
```

Start the local dev server:

```bash
npm start
```

Run tests:

```bash
npm test -- --watchAll=false
```

Create a production build:

```bash
npm run build
```

## Gameplay Controls

- Click the game window to lock the mouse.
- Move with `WASD` or arrow keys.
- Throw the equipped ball with `Spacebar`.
- Recall or send out the companion with `E`.
- Adjust throw power with `Q`, `R`, or the mouse wheel.
- Switch ball type with `1`, `2`, and `3`.
- Switch biomes with the biome menu on the right side of the screen.

## Current Game Architecture

The game currently uses a segmented biome system instead of an infinite world.

- There are 6 finite biomes.
- Only one biome is active at a time.
- Each biome renders a cached 3x3 chunk map.
- Terrain blocks are rendered with instanced meshes for performance.
- The player is clamped inside the active biome bounds.
- Creature spawns are reset when switching biomes.
- Catching all ordinary creatures in a biome spawns that biome's alpha creature.

## Biomes

The active biomes are defined in `src/game/world.js`:

```txt
0 Fieldlands Trail
1 Sandglass Flats
2 Frostpine Pass
3 Coastal Run
4 Crimson Mire
5 Coronet Approach
```

## Asset Folder Structure

Global player, companion, terrain, and fallback assets live directly under `public/assets`:

```txt
public/assets/
  player.glb
  companion.glb
  wild_creature.glb
  grass.png
  dirt.png
  grass_dirt.png
```

Each biome has its own folder for ordinary creatures and alpha creatures:

```txt
public/assets/
  Fieldlands Trail/
    alpha.glb
    ordinary/
      creature_01.glb
      creature_02.glb

  Sandglass Flats/
    alpha.glb
    ordinary/
      creature_01.glb
      creature_02.glb

  Frostpine Pass/
    alpha.glb
    ordinary/
      creature_01.glb

  Coastal Run/
    alpha.glb
    ordinary/
      creature_01.glb

  Crimson Mire/
    alpha.glb
    ordinary/
      creature_01.glb

  Coronet Approach/
    alpha.glb
    ordinary/
      creature_01.glb
```

Folder names must match the biome names in `WORLD_PATHS`.

## Adding More Ordinary Creatures

Put additional ordinary GLB files inside the biome's `ordinary` folder:

```txt
public/assets/Fieldlands Trail/ordinary/creature_03.glb
public/assets/Fieldlands Trail/ordinary/creature_04.glb
```

Then register them in `CREATURE_ASSET_MANIFEST` inside `src/game/world.js`:

```js
0: {
  ordinary: [
    { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    { file: 'ordinary/creature_02.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
    { file: 'ordinary/creature_03.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
  ],
  alpha: { file: 'alpha.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
}
```

The ordinary spawner cycles through this list, so a biome can have multiple creature types active at once.

## Adding More Alpha Models

The current gameplay uses one active alpha encounter per biome. The default structure is:

```txt
public/assets/<Biome Name>/alpha.glb
```

For multiple alpha variants, use an `alpha` folder:

```txt
public/assets/Fieldlands Trail/alpha/
  alpha_01.glb
  alpha_02.glb
  alpha_03.glb
```

Then update `CREATURE_ASSET_MANIFEST` to point at the alpha model you want to spawn:

```js
0: {
  ordinary: [
    { file: 'ordinary/creature_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
  ],
  alpha: { file: 'alpha/alpha_01.glb', scale: 0.35, rotation: [0, Math.PI / 2, 0] },
}
```

To rotate alpha variants randomly, change the `alpha` field into a list and update `getAlphaCreatureAsset()` in `src/game/world.js` to select from that list.

## Model Scale And Rotation

Different GLB files often use different export axes and real-world sizes. Each manifest entry supports:

- `file`: relative file path inside the biome folder.
- `scale`: visual model scale.
- `rotation`: corrective `[x, y, z]` rotation in radians.

Examples:

```js
{ file: 'ordinary/creature_01.glb', scale: 0.45, rotation: [0, Math.PI / 2, 0] }
{ file: 'ordinary/creature_02.glb', scale: 0.3, rotation: [-Math.PI / 2, 0, 0] }
```

This lets normal creatures share a consistent gameplay size while still correcting each model independently.

## Weather And Atmosphere

- Sandglass Flats has intermittent sandstorms with blowing particles and fog.
- Frostpine Pass and Coronet Approach have snowy storms.
- The world uses a cloudy voxel sky and extended ocean horizon to hide map edges and make each biome feel larger.

## Important Source Files

```txt
src/App.jsx                         Root Canvas and UI shell
src/components/GameScene.js         Main gameplay scene and creature state
src/components/Player.js            Player movement and camera-relative walking
src/components/WildCreature.js      Creature AI, GLB rendering, alpha scaling
src/components/VoxelWorld.js        Instanced terrain renderer
src/components/OceanHorizon.js      Extended ocean and horizon blending
src/components/Sandstorm.js         Desert weather
src/components/Snowstorm.js         Snow biome weather
src/game/world.js                   Biome data, terrain math, asset manifest
src/game/projectilePhysics.js       Throw origin and trajectory math
```

## Notes

- Files in `public/assets` are served from `/assets/...`.
- Spaces in biome folder names are allowed because asset URLs are encoded in `world.js`.
- If a model appears sideways or too large, adjust only its manifest `rotation` or `scale`.
- If a biome has new creature files but they do not appear, confirm they were added to `CREATURE_ASSET_MANIFEST`.
