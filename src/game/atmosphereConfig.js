import { Color } from "three";

/** Shared exponential fog — used by Canvas and weather systems. */
export const DEFAULT_FOG_COLOR = "#c5e4f8";
export const DEFAULT_FOG_DENSITY = 0.0034;

export const DESERT_FOG_COLOR = "#e6dcc8";
export const DESERT_FOG_DENSITY = 0.004;
export const DESERT_STORM_FOG_COLOR = "#d2b48c";
export const DESERT_STORM_FOG_DENSITY = 0.028;

export const SNOW_FOG_COLOR = "#e6f2fa";
export const SNOW_FOG_DENSITY = 0.0036;
export const SNOW_STORM_FOG_COLOR = "#dceaf6";
export const SNOW_STORM_FOG_DENSITY = 0.022;

export const SKY_BACKGROUND = "#9fd0ef";
export const VOXEL_WATER_COLOR = "#3d9fd4";
export const VOXEL_WATER_OPACITY = 0.58;

export function applyDefaultFog(scene) {
  if (!scene.fog?.isFogExp2) {
    return;
  }

  scene.fog.color.set(DEFAULT_FOG_COLOR);
  scene.fog.density = DEFAULT_FOG_DENSITY;
}

export function lerpFogExp2(
  scene,
  targetColorHex,
  targetDensity,
  colorMix = 0.03,
  densityMix = 0.03
) {
  if (!scene.fog?.isFogExp2) {
    return;
  }

  const targetColor = new Color(targetColorHex);

  scene.fog.color.lerp(targetColor, colorMix);
  scene.fog.density += (targetDensity - scene.fog.density) * densityMix;
}
