import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import StaticRegionPlayer from './StaticRegionPlayer';

export default function ObsidianFieldlands() {
  const terrainRef = useRef();

  // Create some simple smooth rolling hills programmatically
  const planeGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(400, 400, 64, 64);
    geo.rotateX(-Math.PI / 2); // Make it flat on XZ plane
    
    // Add simple sine wave hills to vertices
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      
      // Basic smooth math function for hills
      const y = Math.sin(x * 0.05) * 5 + Math.cos(z * 0.05) * 5 + Math.sin((x+z)*0.02) * 8;
      
      // Make the center relatively flat for spawning
      const distFromCenter = Math.sqrt(x*x + z*z);
      const flattenFactor = Math.min(1, distFromCenter / 20); // Flat within radius 20
      
      pos.setY(i, y * flattenFactor);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <>
      <StaticRegionPlayer spawnPosition={[0, 10, 0]} />

      <group>
        {/* The main smooth terrain */}
        <mesh name="terrain" ref={terrainRef} geometry={planeGeo} receiveShadow>
          <meshStandardMaterial color="#4CAF50" roughness={0.8} />
        </mesh>

        {/* Landmark 1: The Tall Tower */}
        <mesh name="landmark" position={[50, 10, -50]} castShadow receiveShadow>
          <cylinderGeometry args={[2, 4, 20, 16]} />
          <meshStandardMaterial color="#795548" />
        </mesh>

        {/* Landmark 2: A prominent monolithic rock */}
        <mesh name="landmark" position={[-40, 5, 60]} castShadow receiveShadow rotation={[0.2, 0.4, -0.1]}>
          <boxGeometry args={[15, 20, 12]} />
          <meshStandardMaterial color="#9E9E9E" />
        </mesh>
        
        {/* A simple lake area (flat blue plane) */}
        <mesh position={[80, -2, 80]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#2196F3" opacity={0.8} transparent />
        </mesh>
      </group>
    </>
  );
}
