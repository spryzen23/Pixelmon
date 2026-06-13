const PUBLIC_URL = process.env.NEXT_PUBLIC_BASE_PATH || '/';

export function assetUrl(relativePath) {
  const p = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${PUBLIC_URL.replace(/\/$/, '')}${p}`;
}

let plantsManifestCache = null;
let pokeballsManifestCache = null;

export async function loadPlantsManifest() {
  if (plantsManifestCache) return plantsManifestCache;
  const res = await fetch(assetUrl('/assets/plants/manifest.json'));
  plantsManifestCache = await res.json();
  return plantsManifestCache;
}

export async function loadPokeballsManifest() {
  if (pokeballsManifestCache) return pokeballsManifestCache;
  const res = await fetch(assetUrl('/assets/pokeballs/manifest.json'));
  pokeballsManifestCache = await res.json();
  return pokeballsManifestCache;
}

export function getPlantsForBiome(manifest, biomeIndex) {
  return (manifest?.plants || []).filter((p) => p.biomes?.includes(biomeIndex));
}

export function getBallModel(manifest, ballId) {
  const ball = (manifest?.balls || manifest || []).find?.((b) => b.id === ballId);
  if (!ball) return null;
  return {
    ...ball,
    url: assetUrl(`/assets/pokeballs/${ball.file}`),
  };
}

export function typeIconUrl(type) {
  return assetUrl(`/assets/images/Others/type-icons/${type}.svg`);
}
