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
const OCEAN_PALETTES = {
  default: {
    deep: '#36aadd',
    haze: '#e8f7ff',
    horizon: '#9eddf4',
    mid: '#55c2ee',
    sky: '#d8eefb',
    surface: '#4dbdeb',
    surfaceOpacity: 0.72,
  },
  volcanic: {
    deep: '#170e12',
    haze: '#6b4038',
    horizon: '#7b3324',
    mid: '#2a1516',
    sky: '#4a2928',
    surface: '#1d1114',
    surfaceOpacity: 0.52,
  },
};

export default function OceanHorizon({ biomeType = 'grass' }) {
  const palette = OCEAN_PALETTES[biomeType] || OCEAN_PALETTES.default;
  const showHazeWalls = biomeType !== 'volcanic';
  const geometry = useMemo(() => {
    return new PlaneGeometry(OCEAN_SIZE, OCEAN_SIZE, 1, 1);
  }, []);
  const seaSurfaceGeometry = useMemo(() => {
    return new PlaneGeometry(SEA_SURFACE_SIZE, SEA_SURFACE_SIZE, 1, 1);
  }, []);
  const seaSurfaceMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: palette.surface,
      depthWrite: false,
      fog: true,
      opacity: palette.surfaceOpacity,
      transparent: true,
    });
  }, [palette.surface, palette.surfaceOpacity]);
  const material = useMemo(() => {
    return new ShaderMaterial({
      uniforms: {
        ...UniformsUtils.clone(UniformsLib.fog),
        deepWater: { value: new Color(palette.deep) },
        horizonWater: { value: new Color(palette.horizon) },
        midWater: { value: new Color(palette.mid) },
        skyWater: { value: new Color(palette.sky) },
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
  }, [palette.deep, palette.horizon, palette.mid, palette.sky]);
  const hazeMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: palette.haze,
      depthWrite: false,
      fog: false,
      opacity: biomeType === 'volcanic' ? 0.16 : 0.1,
      transparent: true,
    });
  }, [biomeType, palette.haze]);

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
      {showHazeWalls && (
        <>
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
        </>
      )}
    </group>
  );
}
