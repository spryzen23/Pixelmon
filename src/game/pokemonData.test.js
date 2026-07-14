import { test, expect } from "vitest";
import {
  getFitToHeightForPokemon,
  getRotationForPokemon,
  isPokemonFloating,
} from "./pokemonData";

test("getFitToHeightForPokemon returns correct height overrides", () => {
  expect(getFitToHeightForPokemon({ speciesId: 1, evolutionStage: 1 })).toBe(
    0.95
  ); // Bulbasaur
  expect(getFitToHeightForPokemon({ speciesId: 6, evolutionStage: 3 })).toBe(
    1.5
  ); // Charizard
  expect(getFitToHeightForPokemon({ speciesId: 10, evolutionStage: 1 })).toBe(
    0.65
  ); // Caterpie
});

test("getFitToHeightForPokemon handles fallback stages and legendary status", () => {
  expect(getFitToHeightForPokemon({ speciesId: 999, evolutionStage: 1 })).toBe(
    0.9
  );
  expect(getFitToHeightForPokemon({ speciesId: 999, evolutionStage: 2 })).toBe(
    1.15
  );
  expect(getFitToHeightForPokemon({ speciesId: 999, evolutionStage: 3 })).toBe(
    1.45
  );
  expect(getFitToHeightForPokemon({ speciesId: 150, isLegendary: true })).toBe(
    1.65
  );
});

test("isPokemonFloating detects flying, ghost, psychic types", () => {
  expect(isPokemonFloating({ types: ["flying"] })).toBe(true);
  expect(isPokemonFloating({ types: ["ghost", "poison"] })).toBe(true);
  expect(isPokemonFloating({ types: ["grass"] })).toBe(false);
});

test("getRotationForPokemon returns correct rotations", () => {
  expect(
    getRotationForPokemon({ modelUrl: "/assets/models/glb/regular/1.glb" })
  ).toEqual([0, Math.PI, 0]);
  expect(getRotationForPokemon({ modelUrl: "/assets/companion.glb" })).toEqual([
    0, 0, 0,
  ]);
  expect(getRotationForPokemon(null)).toEqual([0, 0, 0]);
});
