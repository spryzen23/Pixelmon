import { useAnimations, useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';

export default function AnimatedModel({
  url,
  actionName = 'Idle',
  fallbackActionName = 'Walk',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) {
  const modelRef = useRef();
  const gltf = useGLTF(url);
  const scene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const { actions, names } = useAnimations(gltf.animations, modelRef);
  const activeAction = useRef(null);

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    try {
      const fallbackNames = Array.isArray(fallbackActionName)
        ? fallbackActionName
        : [fallbackActionName];
      const preferredNames = [actionName, ...fallbackNames].filter(Boolean);
      const clipName =
        preferredNames
          .map((preferredName) => {
            return names.find(
              (name) => name.toLowerCase() === preferredName.toLowerCase()
            );
          })
          .find(Boolean) || names[0];

      if (!clipName || !actions[clipName]) {
        return undefined;
      }

      const nextAction = actions[clipName];

      if (activeAction.current === nextAction) {
        return undefined;
      }

      nextAction.reset().fadeIn(0.2).play();

      if (activeAction.current) {
        activeAction.current.crossFadeTo(nextAction, 0.25, false);
      }

      activeAction.current = nextAction;

      return undefined;
    } catch (error) {
      return undefined;
    }
  }, [actionName, actions, fallbackActionName, names]);

  return (
    <group ref={modelRef} position={position} scale={scale}>
      <group rotation={rotation}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

useGLTF.preload('/assets/player.glb');
useGLTF.preload('/assets/companion.glb');
useGLTF.preload('/assets/wild_creature.glb');
