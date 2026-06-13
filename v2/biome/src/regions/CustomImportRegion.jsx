import React, { useMemo, useEffect } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import StaticRegionPlayer from './StaticRegionPlayer';

export default function CustomImportRegion({ url }) {
  // Load the external GLB from the provided URL
  const { scene } = useGLTF(url);

  // Traverse the scene and forcefully rename all meshes to 'terrain' 
  // so the player's Raycaster registers collision on them.
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          // We name everything 'terrain' to make the whole map walkable
          child.name = 'terrain';
          child.receiveShadow = true;
          child.castShadow = true;
        }
      });
    }
  }, [scene]);

  // Random spawn logic: Pick a random X/Z between -50 and 50, drop from high up
  const randomSpawn = useMemo(() => {
    const rx = (Math.random() - 0.5) * 100;
    const rz = (Math.random() - 0.5) * 100;
    return [rx, 150, rz]; // Drop from Y=150 so gravity snaps them down
  }, []);

  return (
    <>
      <StaticRegionPlayer spawnPosition={randomSpawn} />
      
      {/* Render the user's custom map */}
      <group>
        <Clone object={scene} />
      </group>
    </>
  );
}
