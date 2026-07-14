import { useMemo } from "react";
import { useFantasyGltf } from "./FantasyGltfProvider";
import { getFantasyPropDef } from "../game/fantasyAssets";

export default function FantasyProp({
  propKey,
  x,
  z,
  surfaceY,
  rotationY = 0,
  scale,
}) {
  const { cloneFantasyPrefab } = useFantasyGltf();
  const def = getFantasyPropDef(propKey);
  const nodeName = def?.nodeName;
  const resolvedScale = scale ?? def?.defaultScale ?? 0.42;

  const object = useMemo(() => {
    if (!nodeName) {
      return null;
    }

    return cloneFantasyPrefab(nodeName);
  }, [cloneFantasyPrefab, nodeName]);

  if (!object) {
    return null;
  }

  return (
    <primitive
      object={object}
      position={[x, surfaceY, z]}
      rotation={[0, rotationY, 0]}
      scale={[resolvedScale, resolvedScale, resolvedScale]}
      castShadow
    />
  );
}
