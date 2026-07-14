# Graph Report - .  (2026-07-14)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 444 nodes · 987 edges · 27 communities (20 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 24
- Community 25
- Community 26

## God Nodes (most connected - your core abstractions)
1. `getTerrainSurfaceY()` - 21 edges
2. `WORLD_PATHS` - 18 edges
3. `getEntityY()` - 16 edges
4. `createBiomeChunk()` - 15 edges
5. `generateBiomeMap()` - 15 edges
6. `isWalkablePosition()` - 15 edges
7. `getBiomeSurfaceY()` - 14 edges
8. `getGeneratedTileInfo()` - 13 edges
9. `GameScene()` - 11 edges
10. `getBiomeDefinition()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `NormalGame()` --calls--> `getBiomeCacheSummary()`  [EXTRACTED]
  src/app/App.jsx → src/world/index.js
- `NormalGame()` --calls--> `getIceRoomExitSpawnPosition()`  [EXTRACTED]
  src/app/App.jsx → src/world/index.js
- `getGroundedPosition()` --calls--> `getTerrainSurfaceY()`  [EXTRACTED]
  src/biomes/distortion/DistortionRealmLandmarks.js → src/world/index.js
- `ExitTrigger()` --calls--> `getIceRoomInteriorExitPosition()`  [EXTRACTED]
  src/biomes/icy/IceMountainLandmarks.js → src/world/index.js
- `getGroundedPosition()` --calls--> `getTerrainSurfaceY()`  [EXTRACTED]
  src/biomes/moonlit/MoonlitLandmarks.js → src/world/index.js

## Import Cycles
- None detected.

## Communities (27 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (80): AUTO_ASSET_MANIFEST, addExposedColumnShell(), addGeneratedBlock(), BLOCK_TYPES, clearAllBiomeCaches(), clearBiomeCache(), createBiomeChunk(), createCoastalFallbackChunk() (+72 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (39): App(), BIOME_SCENE_THEMES, getMetricNow(), NormalGame(), ModeSelectScreen(), CLEAR_FOG_COLOR, randomRange(), Snowstorm() (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (34): cameraForward, cameraRight, movement, Player, CreatureModelErrorBoundary, direction, randomNearbyTarget(), randomPause() (+26 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (23): CAVE_MOUTH_ROCKS, CaveMouth(), CAVERN_CEILING_SHADOWS, CAVERN_CRYSTALS, CAVERN_EDGE_ROCKS, CAVERN_LOW_ROCKS, ExitTrigger(), getRoomYaw() (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.10
Nodes (20): CaveEntrance(), moundBlocks, BLOCK_HEIGHT, CAVE_ENTRANCE_POSITION, CAVE_INTERIOR_SPAWN, getIceRoomFloorY(), getIceRoomForTile(), getIcyMountainDistance() (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.19
Nodes (15): basicMaterial(), boxMaterials(), createCanvasTexture(), createProceduralVoxelMaterials(), drawLayeredPixels(), drawNoisePixels(), drawStoneCracks(), layeredTexture() (+7 more)

### Community 6 - "Community 6"
Cohesion: 0.20
Nodes (17): addPlayerToRoom(), broadcastRoom(), cancelCountdown(), canStartCountdown(), clearRoomTimers(), createMatchCreatures(), finishMatch(), io (+9 more)

### Community 7 - "Community 7"
Cohesion: 0.15
Nodes (14): SkyBelowVista(), ALPHA_SPAWN_DISTANCES, alphaForward, alphaSpawnTarget, createWildCreatures(), CREATURE_MODEL_SCALES, GameScene(), getBiomeType() (+6 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (15): ASSETS_ROOT, BIOME_ASSET_FOLDERS, buildAssetEntry(), buildBiomeManifest(), DEFAULT_ROTATION, DEFAULTS_BY_BIOME, formatManifest(), fs (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (12): cameraForward, cameraTarget, getParallaxThrowVector(), getPlayerShoulderOrigin(), shoulderOffset, BattleRoyaleCatchLayer(), AimIndicator(), createThrowArc() (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.24
Nodes (6): CustomImportRegion(), ObsidianFieldlands(), StaticRegionPlayer, SafePointerLockControls(), ThirdPersonCamera(), Hotbar()

### Community 11 - "Community 11"
Cohesion: 0.17
Nodes (7): CaveInteriorEffects(), crystalLights, electricArcPairs, floorChargePositions, tempEnd, tempPoint, tempStart

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (4): PRIMAL_POOL_OFFSET, PrimalModelErrorBoundary, VolcanoCrater(), getVolcanoPrimalPosition()

### Community 13 - "Community 13"
Cohesion: 0.40
Nodes (9): CREATURE_ASSET_MANIFEST, getAlphaCreatureAsset(), getCreatureAssetManifest(), getCreatureAssetUrl(), getCreatureModelUrl(), getLegendaryAssets(), getOrdinaryCreatureAsset(), getOrdinaryCreatureAssets() (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.28
Nodes (3): getGroundedPosition(), MoonlitLandmarks(), MoonlitMist()

### Community 15 - "Community 15"
Cohesion: 0.36
Nodes (6): DataFrame, average_duration(), load_default_events(), load_uploaded_events(), normalize_payload(), to_dataframe()

### Community 16 - "Community 16"
Cohesion: 0.25
Nodes (7): background_color, display, icons, name, short_name, start_url, theme_color

### Community 19 - "Community 19"
Cohesion: 0.50
Nodes (4): CLEAR_FOG_COLOR, randomRange(), Sandstorm(), STORM_FOG_COLOR

### Community 21 - "Community 21"
Cohesion: 0.40
Nodes (4): PROJECTILE_SPEED, ballWorldPos, creatureWorldPos, Projectile()

## Knowledge Gaps
- **90 isolated node(s):** `short_name`, `name`, `icons`, `start_url`, `display` (+85 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `short_name`, `name`, `icons` to the rest of the system?**
  _90 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06201550387596899 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06078316773816481 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06859903381642513 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._
- **Should `Community 4` be split into smaller, more focused modules?**
  _Cohesion score 0.1038961038961039 - nodes in this community are weakly interconnected._