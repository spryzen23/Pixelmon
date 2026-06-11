/* global process */
const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  health: () => request('/api/health'),
  getBiomes: () => request('/api/biomes'),
  getSpawns: (regionId, level) =>
    request(`/api/biomes/${regionId}/spawns${level != null ? `?level=${level}` : ''}`),
  getBalls: () => request('/api/config/balls'),
  getAnimationTypes: () => request('/api/config/animation-types'),
  getSpawnLadder: () => request('/api/config/spawn-ladder'),
  getStarters: () => request('/api/starters'),
  generateGridPractice: () => request('/api/grid/generate-practice'),
  getPokedex: (region, page, limit) =>
    request(`/api/pokedex?region=${region}&page=${page}&limit=${limit}`),
  listPlayers: () => request('/api/players'),
  createPlayer: (body) => request('/api/players', { method: 'POST', body: JSON.stringify(body) }),
  getPlayer: (id) => request(`/api/players/${id}`),
  patchPlayer: (id, body) =>
    request(`/api/players/${id}/save`, { method: 'PATCH', body: JSON.stringify(body) }),
  startSession: (id, body, options = {}) =>
    request(`/api/players/${id}/session/start`, {
      method: 'POST',
      body: JSON.stringify(body),
      ...options,
    }),
  catch: (id, body) =>
    request(`/api/players/${id}/catch`, { method: 'POST', body: JSON.stringify(body) }),
  mapComplete: (id, body) =>
    request(`/api/players/${id}/map-complete`, { method: 'POST', body: JSON.stringify(body) }),
  startBattle: (body) =>
    request('/api/battle/start', { method: 'POST', body: JSON.stringify(body) }),
  submitBattleChoice: (body) =>
    request('/api/battle/choice', { method: 'POST', body: JSON.stringify(body) }),
  createBattleEngineSession: (body) =>
    request('/api/battle-engine/sessions', { method: 'POST', body: JSON.stringify(body) }),
  getBattleEngineSession: (battleId) => request(`/api/battle-engine/sessions/${battleId}`),
  submitBattleEngineChoice: (battleId, body) =>
    request(`/api/battle-engine/sessions/${battleId}/choices`, {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getBattleEngineMove: (id) => request(`/api/battle-engine/catalog/moves/${id}`),
  getBattleEngineAbility: (id) => request(`/api/battle-engine/catalog/abilities/${id}`),
  getBattleEngineItem: (id) => request(`/api/battle-engine/catalog/items/${id}`),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  verify: (token) => request(`/api/auth/verify?token=${token}`),
};
