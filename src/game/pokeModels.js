/** Default wild creature models (pilot set) when manifest is unavailable. */
export const PILOT_POKE_MODELS = [
  '/poke_glb/1.glb',
  '/poke_glb/2.glb',
  '/poke_glb/3.glb',
  '/poke_glb/4.glb',
  '/poke_glb/5.glb',
  '/poke_glb/6.glb',
];

export const POKE_MANIFEST_URL = '/poke_glb/manifest.json';

/**
 * @param {unknown} data
 * @returns {string[]}
 */
export function parseManifestModels(data) {
  if (!data || typeof data !== 'object' || !Array.isArray(data.models)) {
    return PILOT_POKE_MODELS;
  }

  const models = data.models.filter(
    (url) => typeof url === 'string' && url.startsWith('/poke_glb/') && url.endsWith('.glb')
  );

  return models.length > 0 ? models : PILOT_POKE_MODELS;
}

/**
 * Load creature model URLs from manifest.json (falls back to pilot list).
 * @returns {Promise<string[]>}
 */
export async function fetchPokeModels() {
  try {
    const response = await fetch(POKE_MANIFEST_URL, { cache: 'no-cache' });
    if (!response.ok) {
      return PILOT_POKE_MODELS;
    }
    const data = await response.json();
    return parseManifestModels(data);
  } catch {
    return PILOT_POKE_MODELS;
  }
}
