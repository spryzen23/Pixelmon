import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { fetchPokeModels, PILOT_POKE_MODELS } from '../game/pokeModels';

/** Preload pilot models immediately; extend when manifest loads. */
PILOT_POKE_MODELS.forEach((url) => useGLTF.preload(url));

/**
 * Fetches manifest and preloads all listed poke GLBs for faster wild spawns.
 */
export default function PokeGlbPreloader() {
  useEffect(() => {
    let cancelled = false;

    fetchPokeModels().then((models) => {
      if (cancelled) {
        return;
      }
      models.forEach((url) => {
        try {
          useGLTF.preload(url);
        } catch {
          // Missing files are handled by ModelErrorBoundary at render time.
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
