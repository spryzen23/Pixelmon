const API_BASE = import.meta.env.VITE_API_URL || '';

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
};
