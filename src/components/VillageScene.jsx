import { useMemo } from "react";
import { useVillageGltf } from "./VillageGltfProvider";

export default function VillageScene({ x, z, surfaceY, scale, rotationY = 0 }) {
  const { cloneVillageScene } = useVillageGltf();

  const object = useMemo(() => cloneVillageScene(), [cloneVillageScene]);

  if (!object) {
    return null;
  }

  return (
    <primitive
      object={object}
      position={[x, surfaceY, z]}
      rotation={[0, rotationY, 0]}
      scale={[scale, scale, scale]}
      castShadow
    />
  );
}
