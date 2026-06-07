import { useMemo } from 'react';
import { useVillageGltf } from './VillageGltfProvider';
import { getVillagePropDef } from '../game/villageAssets';

export default function VillageProp({
  propKey,
  x,
  z,
  surfaceY,
  rotationY = 0,
  scale,
}) {
  const { cloneVillagePrefab } = useVillageGltf();
  const def = getVillagePropDef(propKey);
  const nodeName = def?.nodeName;
  const resolvedScale = scale ?? def?.defaultScale ?? 0.34;

  const object = useMemo(() => {
    if (!nodeName) {
      return null;
    }

    return cloneVillagePrefab(nodeName);
  }, [cloneVillagePrefab, nodeName]);

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
