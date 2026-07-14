import path from 'path';

export const ROOT = process.cwd();
export const DATA = path.join(ROOT, 'data');
export const DATA_GAME = path.join(DATA, 'game');
export const DATA_CONFIG = path.join(DATA, 'config');
export const DATA_PLAYERS = path.join(DATA, 'players');
export const DATA_REFERENCE = path.join(DATA, 'reference');
export const PUBLIC_DATASET = path.join(ROOT, 'public', 'assets', 'dataSet');
