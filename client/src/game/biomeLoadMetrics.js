export const BIOME_LOAD_METRICS_KEY = 'voxelLegends.biomeLoadMetrics.v1';

function getStorage() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  return window.localStorage;
}

export function getStoredBiomeLoadMetrics() {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(BIOME_LOAD_METRICS_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : parsed.events || [];
  } catch (error) {
    console.warn('Biome load metrics could not be read.', error);

    return [];
  }
}

export function recordBiomeLoadMetric(metric) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  const nextMetric = {
    schemaVersion: 1,
    timestampIso: new Date().toISOString(),
    ...metric,
  };
  const metrics = [...getStoredBiomeLoadMetrics(), nextMetric].slice(-500);

  storage.setItem(BIOME_LOAD_METRICS_KEY, JSON.stringify(metrics));
}

export function clearBiomeLoadMetrics() {
  const storage = getStorage();

  if (storage) {
    storage.removeItem(BIOME_LOAD_METRICS_KEY);
  }
}

export function downloadBiomeLoadMetrics() {
  const metrics = getStoredBiomeLoadMetrics();
  const payload = {
    exportedAtIso: new Date().toISOString(),
    events: metrics,
    schemaVersion: 1,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = 'biome_load_metrics.json';
  anchor.click();
  URL.revokeObjectURL(url);
}
