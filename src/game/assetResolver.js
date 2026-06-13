import { AUTO_ASSET_MANIFEST } from './generatedAssetManifest.js';

const DEFAULT_WILD_URL = '/assets/wild_creature.glb';

function encodeAssetUrl(folderName, file) {
  return encodeURI(`/assets/${folderName}/${file}`);
}

export function resolveWildModel(entry, pathId = 0) {
  if (entry?.modelUrl) {
    return {
      modelUrl: entry.modelUrl,
      modelScale: entry.isAlpha ? 0.35 * 2.5 : 0.35,
      modelRotation: [0, Math.PI / 2, 0],
    };
  }

  const manifest = AUTO_ASSET_MANIFEST[pathId];
  if (!manifest) {
    return { modelUrl: DEFAULT_WILD_URL, modelScale: 0.35, modelRotation: [0, Math.PI / 2, 0] };
  }

  const pool = entry?.isAlpha
    ? manifest.alphaVariants?.length
      ? manifest.alphaVariants
      : manifest.alpha
        ? [manifest.alpha]
        : []
    : manifest.ordinary || [];

  const asset = pool.length
    ? pool[Math.floor(Math.random() * pool.length)]
    : null;

  if (!asset) {
    return { modelUrl: DEFAULT_WILD_URL, modelScale: 0.35, modelRotation: [0, Math.PI / 2, 0] };
  }

  return {
    modelUrl: encodeAssetUrl(manifest.folderName, asset.file),
    modelScale: asset.scale ?? 0.35,
    modelRotation: asset.rotation || [0, Math.PI / 2, 0],
  };
}
