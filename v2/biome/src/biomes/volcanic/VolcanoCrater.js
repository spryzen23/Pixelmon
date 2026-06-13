import { Suspense, useEffect, useMemo, useRef, Component } from 'react';
import { useGLTF } from '@react-three/drei';
import { Box3, MeshStandardMaterial, Vector3 } from 'three';
import { clone } from 'three/examples/jsm/utils/SkeletonUtils.js';
import {
  getVolcanoPrimalPosition,
} from '../../world';

const PRIMAL_MODEL_URL = '/assets/Volcanic Biome/legendary/primal_groudon.glb';
const PRIMAL_TARGET_HEIGHT = 2.17;
const PRIMAL_MAX_SCALE = 0.504;
const PRIMAL_MIN_SCALE = 0.05;
const PRIMAL_POOL_OFFSET = [0, 0, -1.35];

class PrimalModelErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.warn('Primal model failed to load, using fallback.', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function PrimalFallback() {
  return (
    <group scale={[2.8, 2.8, 2.8]}>
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.75, 16, 10]} />
        <meshStandardMaterial
          color="#351019"
          emissive="#ff3a0a"
          emissiveIntensity={0.18}
        />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.22, 0]}>
        <coneGeometry args={[0.42, 0.7, 5]} />
        <meshStandardMaterial
          color="#ff7a18"
          emissive="#ff3a0a"
          emissiveIntensity={0.48}
        />
      </mesh>
    </group>
  );
}

function PrimalModel() {
  const modelRef = useRef();
  const gltf = useGLTF(PRIMAL_MODEL_URL);
  const gltfScene = useMemo(() => clone(gltf.scene), [gltf.scene]);
  const fit = useMemo(() => {
    const box = new Box3().setFromObject(gltfScene);
    const size = new Vector3();
    const center = new Vector3();

    box.getSize(size);
    box.getCenter(center);

    const modelHeight = Math.max(size.y, 0.001);
    const scale = Math.max(
      PRIMAL_MIN_SCALE,
      Math.min(PRIMAL_MAX_SCALE, PRIMAL_TARGET_HEIGHT / modelHeight)
    );

    return {
      position: [
        -center.x,
        -box.min.y - 0.12 / scale,
        -center.z,
      ],
      scale,
    };
  }, [gltfScene]);

  useEffect(() => {
    gltfScene.traverse((node) => {
      if (!node.isMesh) {
        return;
      }

      node.castShadow = true;
      node.receiveShadow = true;

      if (!node.material) {
        node.material = new MeshStandardMaterial({
          color: '#213f6f',
          roughness: 0.68,
        });
      }
    });
  }, [gltfScene]);

  return (
    <group
      ref={modelRef}
      rotation={[0, Math.PI, 0]}
      scale={fit.scale}
    >
      <primitive object={gltfScene} position={fit.position} />
    </group>
  );
}

export default function VolcanoCrater({ currentBiome = 2 }) {
  const position = useMemo(() => {
    return getVolcanoPrimalPosition(currentBiome);
  }, [currentBiome]);

  return (
    <group position={position}>
      <pointLight
        color="#ff5a12"
        distance={12}
        intensity={2.8}
        position={[0, 1.8, 0]}
      />
      <group position={PRIMAL_POOL_OFFSET}>
        <PrimalModelErrorBoundary fallback={<PrimalFallback />}>
          <Suspense fallback={<PrimalFallback />}>
            <PrimalModel />
          </Suspense>
        </PrimalModelErrorBoundary>
      </group>
    </group>
  );
}
