import { useMemo } from 'react';
import {
  Color,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
} from 'three';
import { WATER_LEVEL } from '../game/world';

const OCEAN_SIZE = 1400;
const SEA_SURFACE_SIZE = 520;
const DEEP_WATER = new Color('#36aadd');
const MID_WATER = new Color('#55c2ee');
const HORIZON_WATER = new Color('#9eddf4');
const SKY_WATER = new Color('#d8eefb');
const SEA_SURFACE = '#4dbdeb';
const HAZE_COLOR = '#e8f7ff';

export default function OceanHorizon() {
  const geometry = useMemo(() => {
    return new PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 1, 1);
  }, []);
  const seaSurfaceGeometry = useMemo(() => {
    return new PlaneGeometry(SEA_SURFACE_SIZE, SEA_SURFACE_SIZE, 1, 1);
  }, []);
  const seaSurfaceMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: SEA_SURFACE,
      depthWrite: false,
      fog: true,
      opacity: 0.72,
      transparent: true,
    });
  }, []);
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        ...UniformsUtils.clone(UniformsLib.fog),
        deepWater: { value: DEEP_WATER },
        horizonWater: { value: HORIZON_WATER },
        midWater: { value: MID_WATER },
        skyWater: { value: SKY_WATER },
        oceanHalfSize: { value: OCEAN_SIZE * 0.5 },
      },
      vertexShader: `
        uniform float oceanHalfSize;
        varying float vRadius;

        void main() {
          vRadius = length(position.xy) / oceanHalfSize;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 deepWater;
        uniform vec3 horizonWater;
        uniform vec3 midWater;
        uniform vec3 skyWater;
        varying float vRadius;

        #include <fog_pars_fragment>

        void main() {
          float midBlend = smoothstep(0.06, 0.58, vRadius);
          float horizonBlend = smoothstep(0.50, 0.92, vRadius);
          float skyBlend = smoothstep(0.78, 1.0, vRadius);
          float alphaFade = mix(0.86, 0.62, smoothstep(0.72, 1.0, vRadius));
          vec3 color = mix(deepWater, midWater, midBlend);
          color = mix(color, horizonWater, horizonBlend);
          color = mix(color, skyWater, skyBlend * 0.25);

          gl_FragColor = vec4(color, alphaFade);

          #include <fog_fragment>
        }
      `,
      fog: true,
      transparent: true,
      depthWrite: false,
    });
  }, []);
  const hazeMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: HAZE_COLOR,
      depthWrite: false,
      fog: false,
      opacity: 0.1,
      transparent: true,
    });
  }, []);

  return (
    <group>
      <mesh
        geometry={seaSurfaceGeometry}
        material={seaSurfaceMaterial}
        position={[0, WATER_LEVEL + 0.012, 0]}
        renderOrder={2}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={geometry}
        material={material}
        position={[0, WATER_LEVEL - 0.05, 0]}
        renderOrder={1}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh material={hazeMaterial} position={[0, 26, -430]}>
        <planeGeometry args={[1200, 72]} />
      </mesh>
      <mesh material={hazeMaterial} position={[0, 26, 430]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1200, 72]} />
      </mesh>
      <mesh material={hazeMaterial} position={[-430, 26, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1200, 72]} />
      </mesh>
      <mesh material={hazeMaterial} position={[430, 26, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1200, 72]} />
      </mesh>
    </group>
  );
}
