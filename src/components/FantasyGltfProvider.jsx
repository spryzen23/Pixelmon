import { useGLTF } from '@react-three/drei';
import { createContext, useCallback, useContext, useMemo } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  FANTASY_GLB_URL,
  getFantasyNodeNames,
  isFantasyNodeAllowed,
} from '../game/fantasyAssets';

const FantasyGltfContext = createContext(null);

function hideCollisionMeshes(object) {
  object.traverse((child) => {
    if (child.name && child.name.includes('UCX')) {
      child.visible = false;
    }
  });
}

function buildPrefabCache(scene) {
  const cache = new Map();
  const wanted = new Set(getFantasyNodeNames());

  scene.traverse((child) => {
    if (!child.name || !wanted.has(child.name) || !isFantasyNodeAllowed(child.name)) {
      return;
    }

    if (cache.has(child.name)) {
      return;
    }

    hideCollisionMeshes(child);
    cache.set(child.name, child);
  });

  return cache;
}

export function FantasyGltfProvider({ children }) {
  const gltf = useGLTF(FANTASY_GLB_URL);

  const prefabCache = useMemo(() => {
    hideCollisionMeshes(gltf.scene);
    return buildPrefabCache(gltf.scene);
  }, [gltf.scene]);

  const cloneFantasyPrefab = useCallback(
    (nodeName) => {
      const source = prefabCache.get(nodeName);

      if (!source) {
        return null;
      }

      const cloned = clone(source);
      hideCollisionMeshes(cloned);
      return cloned;
    },
    [prefabCache]
  );

  const value = useMemo(
    () => ({
      cloneFantasyPrefab,
      isReady: prefabCache.size > 0,
      prefabCache,
    }),
    [cloneFantasyPrefab, prefabCache]
  );

  return (
    <FantasyGltfContext.Provider value={value}>
      {children}
    </FantasyGltfContext.Provider>
  );
}

export function useFantasyGltf() {
  const context = useContext(FantasyGltfContext);

  if (!context) {
    throw new Error('useFantasyGltf must be used within FantasyGltfProvider');
  }

  return context;
}
