import { useGLTF } from "@react-three/drei";
import { createContext, useCallback, useContext, useMemo } from "react";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  VILLAGE_GLB_URL,
  getVillageArchetypeNodeNames,
  isVillageNodeAllowed,
} from "../game/villageAssets";

const VillageGltfContext = createContext(null);

function buildPrefabCache(scene) {
  const cache = new Map();
  const wanted = new Set(getVillageArchetypeNodeNames());

  scene.traverse((child) => {
    if (
      !child.name ||
      !wanted.has(child.name) ||
      !isVillageNodeAllowed(child.name)
    ) {
      return;
    }

    if (cache.has(child.name)) {
      return;
    }

    cache.set(child.name, child);
  });

  return cache;
}

function findRootNode(scene) {
  let rootNode = null;

  scene.traverse((child) => {
    if (child.name === "RootNode") {
      rootNode = child;
    }
  });

  return rootNode;
}

export function VillageGltfProvider({ children }) {
  const gltf = useGLTF(VILLAGE_GLB_URL);

  const { prefabCache, villageRoot } = useMemo(() => {
    return {
      prefabCache: buildPrefabCache(gltf.scene),
      villageRoot: findRootNode(gltf.scene),
    };
  }, [gltf.scene]);

  const cloneVillagePrefab = useCallback(
    (nodeName) => {
      const source = prefabCache.get(nodeName);

      if (!source) {
        return null;
      }

      return clone(source);
    },
    [prefabCache]
  );

  const cloneVillageScene = useCallback(() => {
    if (!villageRoot) {
      return null;
    }

    return clone(villageRoot);
  }, [villageRoot]);

  const value = useMemo(
    () => ({
      cloneVillagePrefab,
      cloneVillageScene,
      isReady: prefabCache.size > 0 && Boolean(villageRoot),
      prefabCache,
    }),
    [cloneVillagePrefab, cloneVillageScene, prefabCache, villageRoot]
  );

  return (
    <VillageGltfContext.Provider value={value}>
      {children}
    </VillageGltfContext.Provider>
  );
}

export function useVillageGltf() {
  const context = useContext(VillageGltfContext);

  if (!context) {
    throw new Error("useVillageGltf must be used within VillageGltfProvider");
  }

  return context;
}
