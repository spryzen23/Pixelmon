import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Box3, Vector3 } from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import { POKEBALL_MODEL_URLS } from "../game/balls";
import { PROJECTILE_RADIUS } from "../game/projectilePhysics";

const bboxSize = new Vector3();
const DEFAULT_TARGET_DIAMETER = PROJECTILE_RADIUS * 2;

export default function BallModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  targetDiameter = DEFAULT_TARGET_DIAMETER,
  modelScale = 1,
  spin = false,
}) {
  const rootRef = useRef();
  const gltf = useGLTF(url);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);

  const fitScale = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    box.getSize(bboxSize);
    const maxDim = Math.max(bboxSize.x, bboxSize.y, bboxSize.z);

    if (!maxDim) {
      return modelScale;
    }

    return (targetDiameter / maxDim) * modelScale;
  }, [scene, targetDiameter, modelScale]);

  useFrame((_, delta) => {
    if (!spin || !rootRef.current) {
      return;
    }

    rootRef.current.rotation.y += delta * 1.4;
  });

  return (
    <group
      ref={rootRef}
      position={position}
      rotation={rotation}
      scale={fitScale}
      castShadow
    >
      <primitive object={scene} />
    </group>
  );
}

POKEBALL_MODEL_URLS.forEach((modelUrl) => useGLTF.preload(modelUrl));
