import { describe, it, expect } from "vitest";
import { assetUrl, getPlantsForBiome } from "./assets.js";

describe("assets", () => {
  it("assetUrl prefixes path", () => {
    expect(assetUrl("/assets/test.glb")).toContain("/assets/test.glb");
  });

  it("getPlantsForBiome filters indices", () => {
    const manifest = {
      plants: [
        { id: "a", biomes: [0, 1] },
        { id: "b", biomes: [2] },
      ],
    };
    expect(getPlantsForBiome(manifest, 0)).toHaveLength(1);
    expect(getPlantsForBiome(manifest, 2)).toHaveLength(1);
  });
});
