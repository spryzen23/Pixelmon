Here is a **question list** you can work through to absorb everything from this thread (unused code, dead code, duplicates, optimizations) and from your `promsts.txt` prompts—**learn → understand → analyze → small steps**.

Use it like a checklist: answer each section in your own words (or in notes), then turn gaps into Agent-mode tasks.

---

## A. Project intent and scope

1. What is Pixelmon (Voxel Legends) in one sentence (stack + core loop)?

2. What are the **three layers** of the codebase (`App`, `components`, `game`) and what must **not** live in each?
3. Which goals from `promsts.txt` (lines 194–206) did we cover in chat—unused, dead, duplicate, optimize, logger, checkboxes—and which are **still open**?
4. What does “no backend unless requested” mean for this repo right now?
5. After cleanup, what should a player still be able to do (move, throw, catch, biome switch, companion, alpha)?

---

## B. Architecture and data flow

1. Draw the runtime path: `index.js` → `App.jsx` → `GameScene` → which children?
2. Where is **terrain** actually rendered today—and what file used to do it?
3. Where do **wild creature URLs** come from (`CREATURE_ASSET_MANIFEST` vs `poke_glb`)?
4. What happens on **biome switch** (cache clear, preload, loading overlay, respawn)?
5. Where is **throw** handled (key, physics, hit, capture chance, burst, alpha spawn)?
6. Who owns **keyboard input** today (how many `keydown` listeners)?
7. Where are **scale and rotation** for creatures defined—and where are they duplicated?

---

## C. File-by-file comprehension

For each path, answer: **Imported? Purpose? Keep / remove / merge?**

### Shell & entry

1. `src/index.js` — what runs besides `App`?
2. `src/reportWebVitals.js` — does it do anything useful as wired today?
3. `src/App.jsx` — what state lives here vs in `GameScene`?
4. `src/App.test.js` — what is mocked and what behavior is asserted?

### Game logic (`src/game/`)

1. `world.js` — list 5 responsibilities (biomes, cache, height, walkability, manifest).
2. `balls.js` — what does each ball change?
3. `projectilePhysics.js` — what is parallax throw and shoulder origin?
4. `animationUtils.js` — what is tested today?
5. `pokeModels.js` — still needed if biome GLBs are canonical?

### Scene components (live)

1. `GameScene.js` — list 4 subsystems inside it that could become modules.
2. `VoxelWorld.js` — how are chunks instanced; what textures does it load?
3. `Player.js` — movement constraints (boundary, water, steps)?
4. `WildCreature.js` vs `CompanionCreature.js` — what logic is shared vs unique?
5. `AnimatedModel.js` — native clips vs procedural; what ESLint issues exist?
6. `PokeGlbPreloader.js` — what does it preload that spawns don’t use?

### Orphan / legacy (from reviews)

**Audit answers (implemented):**

1. **`Terrain.js` vs `world.js`** — **Not merged.** Active stack: [`world.js`](src/game/world.js) (chunks, `heightLookup`, collision) + [`VoxelWorld.js`](src/components/VoxelWorld.js) (instanced blocks). `Terrain.js` imported removed APIs (`createTerrainTiles`, `createTrees`, `createCacti`) and was never mounted in `GameScene`. **Deleted** after props moved to `getBiomeProps` + `BiomeProps.js`.

2. **`Tree.js` / `Cactus.js` / `PineTree.js`** — Spawned via `getBiomeProps()` in `world.js` and rendered by [`BiomeProps.js`](src/components/BiomeProps.js): deciduous trees on biomes 0/3/4 (grass), **pine trees on biomes 2/5 (snow)**, cacti on biome 1 (desert). `TREE_RADIUS` / `CACTUS_RADIUS` used in `isWalkablePosition`.

3. **Aim UX** — **Active:** HUD crosshair ([`App.jsx`](src/App.jsx)) + [`AimIndicator.js`](src/components/AimIndicator.js) (camera-relative arc via `getParallaxThrowVector`). **Removed:** [`AimReticle.js`](src/components/AimReticle.js) (unused; player-forward ring, conflicts with pointer-lock aim).

### Public assets

1. Which paths does **code** use: `/player.glb` or `/assets/player.glb`?
2. What lives in `public/poke_glb/` vs `public/assets/<Biome>/`?
3. Is `grass_dirt.png` referenced anywhere in `src/`?
4. Does `codebase.bat` check paths that match what components import?

---

## D. Dead code (previous answer)

1. Name the **four component files** safe to delete with no import chain.
2. Which **`world.js` exports** have zero importers outside `world.js`?
3. Is `poke_glb` pipeline **dead** or **redundant**? What breaks if you remove it without testing?
4. What is the difference between **dead file** and **redundant but mounted** (`PokeGlbPreloader`)?
5. What README vs HUD mismatch exists for **throw** key?

---

## E. Duplicate code and files (latest answer)

1. List **three duplicate file groups** on disk (terrain stack, root vs `assets/`, `poke_glb` vs manifest).
2. Why is `CREATURE_MODEL_SCALES` in `GameScene` a **single-source-of-truth** problem (biome 0 example)?
3. Which `world.js` functions are **aliases** of `generateBiomeMap`?
4. Where is `BLOCK_TYPES` defined twice and why is order a risk?
5. Where is `PILOT_POKE_MODELS` preloaded **twice**?
6. Where is `preloadBiome` called **more than once** on biome switch—and is that OK?
7. What repeated JSX pattern exists in Player / Companion / Wild?
8. What two blocks in `GameScene` both build wild/alpha spawn objects?

---

## F. Errors, warnings, and verification

1. What three ESLint issues did `error.txt` report?
2. What does `codebase.bat` warn about that is **missing** (`scripts/*.py`)?
3. How many test files exist and what **isn’t** covered (`world.js`, `projectilePhysics.js`)?
4. What commands prove a change is safe (`npm test -- --watchAll=false`, `npm run build`, `codebase.bat`)?
5. What manual playtest covers catch → alpha → biome switch?

---

## G. Deep analysis prompts (per `promsts.txt` workflow)

1. **Learn:** What are the 6 biome names and folder names under `public/assets/`?
2. **Understand:** Walk through catch flow: projectile hit → chance → burst → ordinary count → alpha.
3. **Analyze:** Why is `GameScene.js` ~521 lines—what would you extract first without behavior change?
4. **Analyze:** What causes slow biome switch (cache, GLB preload, `VoxelWorld` remount `key`)?
5. **Analyze:** Where could React re-renders be reduced (App state vs GameScene)?
6. **Break down:** Split “remove duplicates” into phases 1–7 from the duplicate review—which depend on which?

---

## H. Smaller tasks — master checklist

Use this to turn analysis into work. Check off only after test/build.

### Phase 1 — Orphan files

1. Delete `Terrain.js`, `AimReticle.js` — **done** (keep `Tree.js`, `Cactus.js` via `BiomeProps`). Grep clean?
2. Tests + build green?

### Phase 2 — Manifest as single source for scale/rotation

1. Remove `CREATURE_MODEL_SCALES` from `GameScene`; rely on `asset.scale` / defaults in `world.js`.
2. Playtest biome 0 ordinary + alpha scales.

### Phase 3 — `world.js` API cleanup

1. Export one `BLOCK_TYPES`; use in `VoxelWorld`.
2. Remove unused `PATH_*` aliases and duplicate map functions (after grep).
3. Remove unused terrain radii (`TREE_RADIUS`, `CACTUS_RADIUS`) if terrain stack gone.

### Phase 4 — Asset path consolidation

1. Choose canonical: `public/assets/` or root `public/`.
2. Update all `MODEL_URL` and texture paths.
3. Delete duplicate GLBs/textures; update README + `codebase.bat`.

### Phase 5 — Preload pipeline

1. One `preloadCoreModels()` module; remove duplicate preloads.
2. Remove `PokeGlbPreloader` + `pokeModels.js` + `public/poke_glb/` if verified.

### Phase 6 — Logic dedupe (optional refactor)

1. `useGameInput` — one keyboard listener.
2. `GlbCharacter` — shared Suspense/boundary wrapper.
3. `buildCreatureSpawn()` — shared wild/alpha object builder.

### Phase 7 — Quality & docs

1. Fix BOM + unused `liveForward` in `AnimatedModel.js`.
2. Align README controls with `GameScene` (`F` throw).
3. Fix or remove `codebase.bat` Python steps.
4. Add tests for `world.js` helpers and `projectilePhysics.js`.

---

## I. Decision questions (answer before Agent mode)

1. **Assets:** Keep root `public/*.glb` or standardize on `public/assets/`?
2. **Legacy:** Keep `poke_glb` for fallback or delete after manifest-only spawns?
3. **Scope:** One PR per phase or one big cleanup branch?
4. **Risk:** Which phase needs in-browser playtest vs tests-only?

---

## J. Self-check — “I understand deeply if I can…”

1. Explain without opening files: how `getOrdinaryCreatureAsset` builds a URL.
2. Explain why deleting `Terrain.js` does not change the running game.
3. Explain why duplicate `CREATURE_MODEL_SCALES` can change biome 0 appearance.
4. List what you would do **first** tomorrow in Agent mode and why (one phase, one sentence).

---

## K. Mapping chat → your `promsts.txt` lines

| `promsts.txt` theme | Questions to answer |
|---------------------|---------------------|
| Unused code (L114) | D36–D39, C28–C31 |
| Dead code (L116) | D36–D40, H60–H61 |
| Duplicate code (L118) | E41–E48, H62–H74 |
| Optimize (L200) | G57–G58, H60+ |
| Logger / console (L204) | F49 (already low console use) |
| Errors/warnings (L206) | F49–F52, H75–H77 |
| General workflow (L14–L20) | A1–A5, G54–G59, J83–J86 |

---

## Suggested order to work the list

1. **A + B** (30 min) — big picture  
2. **C + D + E** (60 min) — file and cleanup inventory  
3. **F + G** (30 min) — verify and deep flows  
4. **H** — turn answers into tickets  
5. **I + J** — decisions and proof you understand  

---

## One-line workflow (from your prompts)

> Read README + `App.jsx` + `world.js` → answer A–E → pick phases in H → run tests/build after each phase → update `commands.txt` / README when paths change.

---

I'm still in **Ask mode**—I can't apply changes. When you finish sections **I** and **J**, switch to **Agent mode** and say e.g. **“Execute Phase 1 and 2 from the question list.”** I can then implement and verify step by step.
