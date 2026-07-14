import { describe, it } from "node:test";
import assert from "node:assert";
import {
  battleEngineCatalog,
  createBattleEngineSession,
  getBattleEngineSession,
  submitBattleEngineChoice,
} from "../services/battleEngineService.js";

function createPayload(weather = "clear") {
  return {
    formatId: "gen7customgame",
    weather,
    participants: [
      {
        side: "p1",
        user: { id: "user-1", name: "Player" },
        control: "human",
        team: [
          {
            id: "p1-pikachu",
            species: "Pikachu",
            displayName: "Sparky",
            level: 50,
            currentHp: 120,
            maxHp: 120,
            stats: { hp: 120, atk: 75, def: 60, spa: 90, spd: 70, spe: 110 },
            moves: ["Thunderbolt", "Quick Attack"],
            ability: "Static",
            item: "Light Ball",
            status: "none",
          },
        ],
      },
      {
        side: "p2",
        user: { id: "npc-1", name: "Rival" },
        control: "ai",
        team: [
          {
            id: "p2-squirtle",
            species: "Squirtle",
            displayName: "Shell",
            level: 50,
            currentHp: 130,
            maxHp: 130,
            stats: { hp: 130, atk: 70, def: 90, spa: 70, spd: 85, spe: 60 },
            moves: ["Water Gun", "Tackle"],
            ability: "Torrent",
            item: "",
            status: "none",
          },
        ],
      },
    ],
  };
}

describe("battleEngineCatalog", () => {
  it("returns normalized move records", () => {
    const move = battleEngineCatalog.getMove("thunderbolt");
    assert.equal(move.id, "thunderbolt");
    assert.equal(move.name, "Thunderbolt");
    assert.equal(move.type, "Electric");
  });

  it("returns normalized ability records", () => {
    const ability = battleEngineCatalog.getAbility("static");
    assert.equal(ability.id, "static");
    assert.equal(ability.name, "Static");
  });

  it("returns normalized item records", () => {
    const item = battleEngineCatalog.getItem("leftovers");
    assert.equal(item.id, "leftovers");
    assert.equal(item.name, "Leftovers");
  });

  it("returns null for missing catalog records", () => {
    assert.equal(battleEngineCatalog.getMove("missing-nope"), null);
    assert.equal(battleEngineCatalog.getAbility("missing-nope"), null);
    assert.equal(battleEngineCatalog.getItem("missing-nope"), null);
  });
});

describe("battle engine sessions", () => {
  it("creates a session from two explicit battle-ready teams", () => {
    const result = createBattleEngineSession(createPayload());
    assert.ok(result.battleId);
    assert.equal(result.weather, "clear");
    assert.equal(result.participants.length, 2);
    assert.ok(result.requests.p1.active[0].moves.length > 0);
  });

  it("can retrieve a cached session without new logs", () => {
    const created = createBattleEngineSession(createPayload());
    const result = getBattleEngineSession(created.battleId);
    assert.equal(result.battleId, created.battleId);
    assert.deepEqual(result.logs, []);
  });

  it("executes a human move and lets AI answer automatically", () => {
    const created = createBattleEngineSession(createPayload());
    const result = submitBattleEngineChoice(created.battleId, "p1", "move 1");
    assert.ok(Array.isArray(result.logs));
    assert.ok(result.requests.p1 || result.ended);
  });

  it("supports app-specific healing actions", () => {
    const created = createBattleEngineSession(createPayload());
    const result = submitBattleEngineChoice(created.battleId, "p1", "potion");
    assert.ok(result.logs.some((line) => line.startsWith("|")));
  });

  it("applies configured weather", () => {
    for (const weather of ["clear", "rain", "sun", "sandstorm", "hail"]) {
      const result = createBattleEngineSession(createPayload(weather));
      assert.equal(result.weather, weather);
    }
  });

  it("rejects manual choices for AI-controlled sides", () => {
    const created = createBattleEngineSession(createPayload());
    assert.throws(
      () => submitBattleEngineChoice(created.battleId, "p2", "move 1"),
      /Cannot submit manual choice/
    );
  });

  it("throws for missing sessions", () => {
    assert.throws(
      () => getBattleEngineSession("00000000-0000-0000-0000-000000000000"),
      /not found or expired/
    );
  });

  it("supports doubles battle formatting and choices", () => {
    const payload = createPayload();
    payload.formatId = "gen7doublescustomgame";
    payload.participants[0].team.push({
      id: "p1-charmander",
      species: "Charmander",
      displayName: "Flame",
      level: 50,
      currentHp: 100,
      maxHp: 100,
      stats: { hp: 100, atk: 60, def: 50, spa: 60, spd: 50, spe: 70 },
      moves: ["Ember"],
      ability: "Blaze",
      item: "",
      status: "none",
    });
    payload.participants[1].team.push({
      id: "p2-bulbasaur",
      species: "Bulbasaur",
      displayName: "Bulba",
      level: 50,
      currentHp: 110,
      maxHp: 110,
      stats: { hp: 110, atk: 55, def: 55, spa: 65, spd: 65, spe: 45 },
      moves: ["Vine Whip"],
      ability: "Overgrow",
      item: "",
      status: "none",
    });

    const created = createBattleEngineSession(payload);
    assert.ok(created.battleId);
    assert.equal(created.formatId, "gen7doublescustomgame");

    // Choose sequentially for two active Pokemon
    const step1 = submitBattleEngineChoice(created.battleId, "p1", "move 1");
    assert.ok(step1);
    const step2 = submitBattleEngineChoice(created.battleId, "p1", "move 1");
    assert.ok(step2);
  });
});
