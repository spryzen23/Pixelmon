const POKEBALL_ASSET_BASE = '/assets/pokeballs';
// Fallback GLBs may live under public/assets/pokeballs/

export const BALL_TYPES = [
  {
    id: 'standard',
    name: 'Standard Ball',
    color: '#e61f2c',
    accentColor: '#ffffff',
    captureChance: 0.8,
    key: '1',
    modelUrl: `${POKEBALL_ASSET_BASE}/standard.glb`,
    modelScale: 1,
  },
  {
    id: 'great',
    name: 'Great Ball',
    color: '#2468ff',
    accentColor: '#e61f2c',
    captureChance: 0.9,
    key: '2',
    modelUrl: `${POKEBALL_ASSET_BASE}/great.glb`,
    modelScale: 1,
  },
  {
    id: 'ultra',
    name: 'Ultra Ball',
    color: '#171717',
    accentColor: '#ffd928',
    captureChance: 0.97,
    key: '3',
    modelUrl: `${POKEBALL_ASSET_BASE}/ultra.glb`,
    modelScale: 1,
  },
];

export const DEFAULT_BALL = BALL_TYPES[0];

export const POKEBALL_MODEL_URLS = BALL_TYPES.map((ball) => ball.modelUrl);
