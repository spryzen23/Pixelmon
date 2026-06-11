import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import AnimatedModel from './AnimatedModel';
import ModelErrorBoundary from './ModelErrorBoundary';
import VoxelFallback from './VoxelFallback';

export default function CompanionPreview({
  modelUrl,
  primaryType = 'normal',
  fitToHeight = 1.1,
  isFloating = false,
  rotation = [0, 0, 0],
}) {
  const fallbackProps = {
    color: '#3498db',
    height: 1.0,
    width: 0.6,
    depth: 0.6,
    position: [0, -0.3, 0],
    scale: 1,
  };

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0.8, 2.5], fov: 45 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'auto', background: 'transparent' }}
    >
      <ambientLight intensity={1.6} />
      <directionalLight position={[4, 8, 4]} intensity={2.0} />
      <pointLight position={[-4, 4, -4]} intensity={0.8} />

      <Suspense fallback={<VoxelFallback {...fallbackProps} />}>
        {modelUrl ? (
          <ModelErrorBoundary
            resetKey={modelUrl}
            fallback={<VoxelFallback {...fallbackProps} />}
          >
            <AnimatedModel
              url={modelUrl}
              actionName="Idle"
              fallbackActionName={['Walk', 'Idle']}
              position={[0, isFloating ? -0.15 : -0.4, 0]}
              rotation={rotation}
              fitToHeight={fitToHeight}
              primaryType={primaryType}
            />
          </ModelErrorBoundary>
        ) : null}
      </Suspense>

      {/* Stylized Platform Stand */}
      <mesh position={[0, -0.45, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.95, 0.08, 32]} />
        <meshStandardMaterial
          color="#1a2536"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      <mesh position={[0, -0.445, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.01, 32]} />
        <meshStandardMaterial
          color="#34495e"
          roughness={0.3}
          metalness={0.5}
          emissive="#2c3e50"
          emissiveIntensity={0.2}
        />
      </mesh>

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={4.5}
        autoRotate
        autoRotateSpeed={2.0}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
