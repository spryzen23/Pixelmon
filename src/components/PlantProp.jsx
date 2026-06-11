import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { getPlantPropDef } from '../game/plantAssets';

export default function PlantProp({
  propKey,
  glbUrl,
  x,
  z,
  surfaceY,
  rotationY = 0,
  scale,
}) {
  const def = getPlantPropDef(propKey);
  const url = glbUrl ?? def?.glbUrl;
  const resolvedScale = scale ?? def?.defaultScale ?? 1;
  const { scene } = useGLTF(url);

  const object = useMemo(() => scene.clone(), [scene]);

  if (!url || !object) {
    return null;
  }

  return (
    <primitive
      object={object}
      position={[x, surfaceY, z]}
      rotation={[0, rotationY, 0]}
      scale={[resolvedScale, resolvedScale, resolvedScale]}
      castShadow={false}
    />
  );
}
