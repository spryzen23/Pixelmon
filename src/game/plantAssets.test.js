import {
  PLANT_PROP_DEFS,
  getPlantManifestEntries,
  getPlantPropVariants,
  pickPlantPropVariant,
} from "./plantAssets";

describe("plantAssets", () => {
  it("defines every manifest entry with file and biomes", () => {
    getPlantManifestEntries().forEach((entry) => {
      expect(entry.id).toBeTruthy();
      expect(entry.file).toMatch(/\.glb$/);
      expect(entry.biomes.length).toBeGreaterThan(0);
      expect(PLANT_PROP_DEFS[entry.id]).toBeDefined();
      expect(PLANT_PROP_DEFS[entry.id].glbUrl).toContain(entry.file);
    });
  });

  it("pickPlantPropVariant only returns ids allowed for biome", () => {
    const plainsTree = pickPlantPropVariant("tree", 0, 0.1);
    const def = PLANT_PROP_DEFS[plainsTree];

    expect(def.category).toBe("tree");
    expect(def.biomes).toContain(0);

    const snowPine = pickPlantPropVariant("pine", 2, 0.5);
    const pineDef = PLANT_PROP_DEFS[snowPine];

    expect(pineDef.category).toBe("pine");
    expect(pineDef.biomes).toContain(2);
  });

  it("returns no tree variants for desert biome", () => {
    expect(getPlantPropVariants("tree", 1)).toEqual([]);
    expect(pickPlantPropVariant("tree", 1, 0.5)).toBeNull();
  });

  it("returns no pine variants for plains biome", () => {
    expect(getPlantPropVariants("pine", 0)).toEqual([]);
    expect(pickPlantPropVariant("pine", 0, 0.5)).toBeNull();
  });

  it("returns desert rock variants only for desert biome", () => {
    expect(getPlantPropVariants("desert_rock", 1).length).toBeGreaterThan(0);
    expect(getPlantPropVariants("desert_rock", 0)).toEqual([]);

    const desertRock = pickPlantPropVariant("desert_scatter", 1, 0.25);
    const def = PLANT_PROP_DEFS[desertRock];

    expect(def.category).toBe("desert_scatter");
    expect(def.biomes).toContain(1);
  });
});
