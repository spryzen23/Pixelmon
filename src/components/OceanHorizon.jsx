import { useMemo } from 'react';
import {
  Color,
  MeshBasicMaterial,
  RingGeometry,
  ShaderMaterial,
} from 'three';
import {
  DEFAULT_FOG_COLOR,
  DEFAULT_FOG_DENSITY,
} from '../game/atmosphereConfig';
import { WATER_LEVEL } from '../game/world';

/** Ocean ring outside the playable voxel area (see BIOME_BOUNDARY ~35). */
const OCEAN_INNER_RADIUS = 48;
const OCEAN_OUTER_RADIUS = 720;
const SEA_INNER_RADIUS = 42;
const SEA_OUTER_RADIUS = 200;

const DEEP_WATER = new Color('#2f8ec8');
const MID_WATER = new Color('#4aade0');
const HORIZON_WATER = new Color('#7ec8eb');
const SKY_WATER = new Color('#b8dff5');
const SEA_SURFACE = '#4dbdeb';

export default function OceanHorizon() {
  const oceanGeometry = useMemo(() => {
    return new RingGeometry(OCEAN_INNER_RADIUS, OCEAN_OUTER_RADIUS, 96, 1);
  }, []);

  const seaSurfaceGeometry = useMemo(() => {
    return new RingGeometry(SEA_INNER_RADIUS, SEA_OUTER_RADIUS, 64, 1);
  }, []);

  const seaSurfaceMaterial = useMemo(() => {
    return new MeshBasicMaterial({
      color: SEA_SURFACE,
      depthWrite: false,
      fog: true,
      opacity: 0.5,
      transparent: true,
    });
  }, []);

  const material = useMemo(() => {
    const fogColor = new Color(DEFAULT_FOG_COLOR);

    return new ShaderMaterial({
      uniforms: {
        deepWater: { value: DEEP_WATER },
        horizonWater: { value: HORIZON_WATER },
        midWater: { value: MID_WATER },
        skyWater: { value: SKY_WATER },
        fogColor: { value: fogColor },
        fogDensity: { value: DEFAULT_FOG_DENSITY },
        oceanInner: { value: OCEAN_INNER_RADIUS },
        oceanOuter: { value: OCEAN_OUTER_RADIUS },
      },
      vertexShader: `
        uniform float oceanInner;
        uniform float oceanOuter;
        varying float vRadius;
        varying float vFogDepth;

        void main() {
          float dist = length(position.xy);
          vRadius = (dist - oceanInner) / (oceanOuter - oceanInner);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          vFogDepth = -mvPosition.z;
        }
      `,
      fragmentShader: `
        uniform vec3 deepWater;
        uniform vec3 horizonWater;
        uniform vec3 midWater;
        uniform vec3 skyWater;
        uniform vec3 fogColor;
        uniform float fogDensity;
        varying float vRadius;
        varying float vFogDepth;

        void main() {
          float midBlend = smoothstep(0.0, 0.45, vRadius);
          float horizonBlend = smoothstep(0.35, 0.85, vRadius);
          float skyBlend = smoothstep(0.7, 1.0, vRadius);
          float alphaFade = mix(0.55, 0.92, smoothstep(0.0, 0.35, vRadius));
          alphaFade *= 1.0 - smoothstep(0.88, 1.0, vRadius);

          vec3 color = mix(deepWater, midWater, midBlend);
          color = mix(color, horizonWater, horizonBlend);
          color = mix(color, skyWater, skyBlend * 0.35);

          float fogFactor = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
          color = mix(color, fogColor, clamp(fogFactor, 0.0, 0.95));

          gl_FragColor = vec4(color, alphaFade);
        }
      `,
      fog: false,
      transparent: true,
      depthWrite: false,
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
        geometry={oceanGeometry}
        material={material}
        position={[0, WATER_LEVEL - 0.04, 0]}
        renderOrder={1}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}
