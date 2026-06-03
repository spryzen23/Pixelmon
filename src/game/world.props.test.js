import {
  clearAllBiomeCaches,
  getBiomeProps,
} from './world';

describe('getBiomeProps', () => {
  beforeEach(() => {
    clearAllBiomeCaches();
  });

  it('spawns trees on plains biomes', () => {
    const props = getBiomeProps(0);

    expect(props.trees.length).toBeGreaterThan(0);
    expect(props.cacti.length).toBe(0);
  });

  it('spawns cacti on desert biome', () => {
    const props = getBiomeProps(1);

    expect(props.cacti.length).toBeGreaterThan(0);
    expect(props.trees.length).toBe(0);
    expect(props.pineTrees.length).toBe(0);
  });

  it('spawns pine trees on snow biomes', () => {
    const props = getBiomeProps(2);

    expect(props.pineTrees.length).toBeGreaterThan(0);
    expect(props.trees.length).toBe(0);
    expect(props.cacti.length).toBe(0);
  });
});
