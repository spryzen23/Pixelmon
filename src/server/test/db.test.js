import { describe, it } from "node:test";
import assert from "node:assert";
import {
  getBiomeMap,
  getPokemonsSlim,
  getPlayer,
  savePlayer,
  listPlayers,
  getLocalPokemon,
  getLocalMove,
} from "../lib/dataStore.js";

describe("SQLite Integration", () => {
  it("should load biome map from sqlite", async () => {
    const biomeMap = await getBiomeMap();
    assert.ok(biomeMap);
    assert.ok(biomeMap.regions);
    assert.equal(Array.isArray(biomeMap.regions), true);
  });

  it("should load pokemon slim entries from sqlite", async () => {
    const slim = await getPokemonsSlim();
    assert.ok(slim);
    assert.ok(slim.entries);
    assert.ok(slim.paths);
    assert.ok(slim.entries.length > 0);
  });

  it("should list, save, and load players in sqlite", async () => {
    const testPlayerId = "test-player-" + Date.now();

    // 1. Create/save test player
    const playerState = {
      id: testPlayerId,
      displayName: "Test Ash",
      pokecoins: 750,
      trainers: [],
      perPathProgress: {},
      settings: { volume: 0.5, quality: "low" },
    };

    await savePlayer(playerState);

    // 2. Fetch the player back
    const retrieved = await getPlayer(testPlayerId);
    assert.equal(retrieved.id, testPlayerId);
    assert.equal(retrieved.displayName, "Test Ash");
    assert.equal(retrieved.pokecoins, 750);
    assert.equal(retrieved.settings.volume, 0.5);

    // 3. List players and check if our player is there
    const players = await listPlayers();
    const found = players.find((p) => p.id === testPlayerId);
    assert.ok(found);
    assert.equal(found.displayName, "Test Ash");

    // 4. Save a trainer inside this player
    const trainerState = {
      id: "test-trainer-" + Date.now(),
      userId: testPlayerId, // links to test player
      displayName: "Trainer Brock",
      characterStyle: { id: "style-1" },
      coins: 600,
    };

    const savedTrainer = await savePlayer(trainerState);
    assert.equal(savedTrainer.displayName, "Trainer Brock");
    assert.equal(savedTrainer.coins, 600);

    // Verify user update
    const updatedUser = await getPlayer(testPlayerId);
    assert.equal(updatedUser.pokecoins, 600);
    assert.equal(updatedUser.trainers.length, 1);
    assert.equal(updatedUser.trainers[0].id, trainerState.id);

    // Verify retrieving via trainer id fallback
    const retrievedTrainer = await getPlayer(trainerState.id);
    assert.equal(retrievedTrainer.id, trainerState.id);
    assert.equal(retrievedTrainer.coins, 600);
    assert.equal(retrievedTrainer.userId, testPlayerId);
  });

  it("should retrieve a local pokemon by name or id", async () => {
    const p1 = await getLocalPokemon(1);
    assert.ok(p1);
    assert.equal(p1.id, 1);
    assert.equal(p1.name, "bulbasaur");
    assert.ok(Array.isArray(p1.stats));
    assert.ok(p1.stats.some((s) => s.stat.name === "hp"));
    assert.ok(p1.types.some((t) => t.type.name === "grass"));
    assert.ok(p1.moves.length > 0);

    const p2 = await getLocalPokemon("Bulbasaur");
    assert.ok(p2);
    assert.equal(p2.id, 1);

    const pNone = await getLocalPokemon("missingpokemonxyz");
    assert.equal(pNone, null);
  });

  it("should retrieve a local move by name", async () => {
    const m1 = await getLocalMove("tackle");
    assert.ok(m1);
    assert.equal(m1.name, "tackle");
    assert.ok(m1.power > 0);
    assert.equal(m1.type.name, "normal");

    const mNone = await getLocalMove("missingmovexyz");
    assert.equal(mNone, null);
  });
});
