import {
  formatSpawnProgressLine,
  getAllPlayableBiomes,
  getBiomeDisplayInfo,
  getRegionMeta,
} from './biomeDisplay';

describe('biomeDisplay', () => {
  it('returns dual label for path 0', () => {
    const info = getBiomeDisplayInfo(0);
    expect(info.terrainName).toBe('Fieldlands Trail');
    expect(info.regionName).toBe('Kanto');
    expect(info.label).toBe('Fieldlands Trail · Kanto');
    expect(info.eggGroups).toEqual(['field', 'grass']);
  });

  it('returns dual label for path 7', () => {
    const info = getBiomeDisplayInfo(7);
    expect(info.terrainName).toBe('Village World');
    expect(info.regionName).toBe('Galar');
  });

  it('lists all 8 playable biomes', () => {
    expect(getAllPlayableBiomes()).toHaveLength(8);
  });

  it('marks Paldea as data-only with footnote', () => {
    const paldea = getRegionMeta('paldea');
    expect(paldea.hasPath).toBe(false);
    expect(paldea.footnote).toContain('Paldea');
    expect(paldea.footnote).toContain('coming soon');
  });

  it('formats spawn progress line', () => {
    expect(
      formatSpawnProgressLine({
        level: 2,
        maxLevel: 8,
        active: 3,
        peak: 6,
        eggGroups: ['field', 'grass'],
        regionName: 'Kanto',
      })
    ).toBe('Level 2/8 · field/grass · 3/6 remaining · Kanto');
  });
});
