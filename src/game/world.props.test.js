import { clearAllBiomeCaches, getBiomeProps } from "./world";
import { getPlantPropDef } from "./plantAssets";

describe("getBiomeProps", () => {
  beforeEach(() => {
    clearAllBiomeCaches();
  });

  it("spawns GLB plants on plains biomes", () => {
    const props = getBiomeProps(0);

    expect(props.plantProps.length).toBeGreaterThan(0);
    expect(props.trees.length).toBe(0);
    expect(props.pineTrees.length).toBe(0);
    expect(props.cacti.length).toBe(0);
    expect(props.plantProps[0].glbUrl).toMatch(/\/assets\/plants\/.+\.glb$/);
  });

  it("spawns cacti and desert GLB rocks on desert biome", () => {
    const props = getBiomeProps(1);

    expect(props.cacti.length).toBeGreaterThan(0);
    expect(props.plantProps.length).toBeGreaterThan(0);
    expect(props.trees.length).toBe(0);
    expect(props.pineTrees.length).toBe(0);

    const desertRock = props.plantProps.find((prop) =>
      prop.propKey.startsWith("desert_")
    );

    expect(desertRock).toBeDefined();
    expect(getPlantPropDef(desertRock.propKey)?.biomes).toContain(1);
  });

  it("spawns pine GLB plants on snow biomes", () => {
    const props = getBiomeProps(2);

    expect(props.plantProps.length).toBeGreaterThan(0);
    expect(props.trees.length).toBe(0);
    expect(props.pineTrees.length).toBe(0);
    expect(props.cacti.length).toBe(0);

    const pinePlacement = props.plantProps.find(
      (prop) => getPlantPropDef(prop.propKey)?.category === "pine"
    );

    expect(pinePlacement).toBeDefined();
  });
});
