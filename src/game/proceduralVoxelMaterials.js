import {
  CanvasTexture,
  MeshBasicMaterial,
  MeshStandardMaterial,
  NearestFilter,
  SRGBColorSpace,
} from 'three';

const TEXTURE_SIZE = 32;
const PIXEL_GRID = 16;
const PIXEL_SCALE = TEXTURE_SIZE / PIXEL_GRID;

function hash(seed, x, y) {
  const value = Math.sin(seed * 91.7 + x * 127.1 + y * 311.7) * 43758.5453;

  return value - Math.floor(value);
}

function pick(palette, seed, x, y) {
  const index = Math.floor(hash(seed, x, y) * palette.length);

  return palette[Math.max(0, Math.min(palette.length - 1, index))];
}

function createCanvasTexture(draw) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;
  context.imageSmoothingEnabled = false;
  draw(context);

  const texture = new CanvasTexture(canvas);

  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.magFilter = NearestFilter;
  texture.minFilter = NearestFilter;
  texture.needsUpdate = true;

  return texture;
}

function drawNoisePixels(context, palette, seed) {
  for (let y = 0; y < PIXEL_GRID; y += 1) {
    for (let x = 0; x < PIXEL_GRID; x += 1) {
      context.fillStyle = pick(palette, seed, x, y);
      context.fillRect(
        x * PIXEL_SCALE,
        y * PIXEL_SCALE,
        PIXEL_SCALE,
        PIXEL_SCALE
      );
    }
  }
}

function drawLayeredPixels(
  context,
  topPalette,
  bottomPalette,
  seed,
  topRows = 4
) {
  for (let y = 0; y < PIXEL_GRID; y += 1) {
    for (let x = 0; x < PIXEL_GRID; x += 1) {
      const drip = hash(seed + 4.7, x, 0) > 0.72
        ? Math.floor(hash(seed + 8.1, x, y) * 3)
        : 0;
      const useTop = y < topRows + drip;

      context.fillStyle = useTop
        ? pick(topPalette, seed, x, y)
        : pick(bottomPalette, seed + 21, x, y);
      context.fillRect(
        x * PIXEL_SCALE,
        y * PIXEL_SCALE,
        PIXEL_SCALE,
        PIXEL_SCALE
      );
    }
  }
}

function drawStoneCracks(context, crackColor, seed) {
  context.fillStyle = crackColor;

  for (let line = 0; line < 8; line += 1) {
    const startX = Math.floor(hash(seed + line, 2, 9) * PIXEL_GRID);
    const startY = Math.floor(hash(seed + line, 6, 3) * PIXEL_GRID);
    const length = 2 + Math.floor(hash(seed + line, 5, 5) * 4);

    for (let step = 0; step < length; step += 1) {
      const x = Math.max(
        0,
        Math.min(PIXEL_GRID - 1, startX + step - Math.floor(length / 2))
      );
      const y = Math.max(
        0,
        Math.min(
          PIXEL_GRID - 1,
          startY + Math.floor(hash(seed + line, step, 1) * 2)
        )
      );

      context.fillRect(
        x * PIXEL_SCALE,
        y * PIXEL_SCALE,
        PIXEL_SCALE,
        PIXEL_SCALE
      );
    }
  }
}

function pixelTexture(palette, seed, crackColor) {
  return createCanvasTexture((context) => {
    drawNoisePixels(context, palette, seed);

    if (crackColor) {
      drawStoneCracks(context, crackColor, seed);
    }
  });
}

function layeredTexture(topPalette, bottomPalette, seed, topRows = 4) {
  return createCanvasTexture((context) => {
    drawLayeredPixels(context, topPalette, bottomPalette, seed, topRows);
  });
}

function liquidTexture(palette, seed, streakColor) {
  return createCanvasTexture((context) => {
    drawNoisePixels(context, palette, seed);
    context.fillStyle = streakColor;

    for (let y = 2; y < PIXEL_GRID; y += 5) {
      for (let x = 0; x < PIXEL_GRID; x += 1) {
        if (hash(seed + 13, x, y) > 0.52) {
          context.fillRect(
            x * PIXEL_SCALE,
            y * PIXEL_SCALE,
            PIXEL_SCALE,
            PIXEL_SCALE
          );
        }
      }
    }
  });
}

function standardMaterial(texture, options = {}) {
  return new MeshStandardMaterial({
    map: texture,
    metalness: 0,
    roughness: 0.86,
    ...options,
  });
}

function basicMaterial(texture, options = {}) {
  return new MeshBasicMaterial({
    fog: true,
    map: texture,
    ...options,
  });
}

function boxMaterials({ bottom, side, top }) {
  return [side, side, top, bottom, side, side];
}

export function createProceduralVoxelMaterials() {
  const palettes = {
    basalt: ['#120d10', '#1b1215', '#25171b', '#311a1c', '#452019'],
    cave: ['#24251f', '#30322a', '#3a3a30', '#464438', '#2b3428'],
    cloud: ['#f7fcff', '#eaf6ff', '#d9edf7', '#ffffff', '#cce3ef'],
    crystal: ['#6b2d8f', '#8b42bd', '#b56be6', '#d99cff', '#4d236e'],
    desert: ['#d0b76a', '#e1cc82', '#c5a95f', '#f0dda0', '#b99a52'],
    distortion: ['#2f1453', '#421b72', '#6025a0', '#271044', '#8f54dc'],
    dirt: ['#6f4328', '#7f4f2e', '#8d5b35', '#5b3522', '#9b6a3e'],
    grass: ['#1f7f26', '#2f9b31', '#38b43a', '#196b20', '#65c94c'],
    lava: ['#ff2a0a', '#ff5a12', '#ff7a18', '#ffa12b', '#ffe06a'],
    moss: ['#1d5e25', '#277631', '#32913b', '#448f3a', '#174d24'],
    moonGrass: ['#9fb8c4', '#b9ced7', '#d6e2e8', '#7894a7', '#c7d9df'],
    moonStone: ['#10142a', '#171c3a', '#24264f', '#2f315f', '#0a0f22'],
    ruins: ['#54584f', '#686b61', '#77786c', '#454a42', '#918d79'],
    snow: ['#eefcff', '#d7f0fb', '#f8ffff', '#b9ddeb', '#ffffff'],
    stone: ['#5d6267', '#70767a', '#85898b', '#4f5458', '#969796'],
    voidStone: ['#080617', '#100b28', '#18103a', '#241657', '#06040f'],
    water: ['#1169b0', '#1e88d4', '#3eb4e8', '#0a5794', '#74d8ff'],
  };

  const textures = {
    basalt: pixelTexture(palettes.basalt, 11, '#101013'),
    cave: pixelTexture(palettes.cave, 12, '#171916'),
    cloud: pixelTexture(palettes.cloud, 28),
    crystal: pixelTexture(palettes.crystal, 31, '#f3c8ff'),
    desert: pixelTexture(palettes.desert, 13),
    distortion: pixelTexture(palettes.distortion, 32, '#d09cff'),
    dirt: pixelTexture(palettes.dirt, 14),
    grassSide: layeredTexture(palettes.grass, palettes.dirt, 15, 5),
    grassTop: pixelTexture(palettes.grass, 16),
    lava: liquidTexture(palettes.lava, 17, '#fff08a'),
    mossSide: layeredTexture(palettes.moss, palettes.stone, 18, 7),
    mossTop: pixelTexture(palettes.moss, 19),
    moonGrassSide: layeredTexture(palettes.moonGrass, palettes.moonStone, 25, 5),
    moonGrassTop: pixelTexture(palettes.moonGrass, 26),
    moonStone: pixelTexture(palettes.moonStone, 27, '#46527d'),
    ruins: pixelTexture(palettes.ruins, 24, '#30342f'),
    snowSide: layeredTexture(palettes.snow, palettes.dirt, 20, 5),
    snowTop: pixelTexture(palettes.snow, 21),
    stone: pixelTexture(palettes.stone, 22, '#3f4346'),
    voidStone: pixelTexture(palettes.voidStone, 33, '#4d29a1'),
    water: liquidTexture(palettes.water, 23, '#a7ecff'),
  };

  const dirt = standardMaterial(textures.dirt, { roughness: 0.92 });
  const grassSide = standardMaterial(textures.grassSide, { roughness: 0.88 });
  const grassTop = standardMaterial(textures.grassTop, { roughness: 0.84 });
  const moonStone = standardMaterial(textures.moonStone, { roughness: 0.94 });
  const stone = standardMaterial(textures.stone, { roughness: 0.9 });
  const voidStone = standardMaterial(textures.voidStone, {
    color: '#15102c',
    roughness: 0.96,
  });

  return {
    basalt: boxMaterials({
      bottom: standardMaterial(textures.basalt, { roughness: 0.94 }),
      side: standardMaterial(textures.basalt, { roughness: 0.94 }),
      top: standardMaterial(textures.basalt, { roughness: 0.94 }),
    }),
    cave: boxMaterials({
      bottom: standardMaterial(textures.cave, { roughness: 0.95 }),
      side: standardMaterial(textures.cave, { roughness: 0.95 }),
      top: standardMaterial(textures.cave, { roughness: 0.95 }),
    }),
    cloud: boxMaterials({
      bottom: standardMaterial(textures.cloud, { roughness: 0.72 }),
      side: standardMaterial(textures.cloud, { roughness: 0.78 }),
      top: standardMaterial(textures.cloud, { roughness: 0.64 }),
    }),
    crystal: basicMaterial(textures.crystal, {
      color: '#e5b1ff',
      opacity: 0.88,
      transparent: true,
    }),
    desert: boxMaterials({
      bottom: standardMaterial(textures.desert, { roughness: 0.94 }),
      side: standardMaterial(textures.desert, { roughness: 0.93 }),
      top: standardMaterial(textures.desert, { roughness: 0.9 }),
    }),
    distortion: boxMaterials({
      bottom: voidStone,
      side: standardMaterial(textures.distortion, {
        color: '#5b2a9f',
        emissive: '#19072d',
        emissiveIntensity: 0.25,
        roughness: 0.82,
      }),
      top: standardMaterial(textures.distortion, {
        color: '#7d4bc4',
        emissive: '#2d0b55',
        emissiveIntensity: 0.35,
        roughness: 0.72,
      }),
    }),
    dirt: boxMaterials({
      bottom: dirt,
      side: dirt,
      top: dirt,
    }),
    grass: boxMaterials({
      bottom: dirt,
      side: grassSide,
      top: grassTop,
    }),
    lava: basicMaterial(textures.lava, {
      color: '#ffffff',
      depthWrite: false,
      transparent: true,
      opacity: 0.98,
    }),
    moss: boxMaterials({
      bottom: stone,
      side: standardMaterial(textures.mossSide, { roughness: 0.9 }),
      top: standardMaterial(textures.mossTop, { roughness: 0.86 }),
    }),
    moon_grass: boxMaterials({
      bottom: moonStone,
      side: standardMaterial(textures.moonGrassSide, {
        color: '#b4cbd8',
        roughness: 0.88,
      }),
      top: standardMaterial(textures.moonGrassTop, {
        color: '#d6e5ec',
        roughness: 0.78,
      }),
    }),
    moon_stone: boxMaterials({
      bottom: moonStone,
      side: moonStone,
      top: moonStone,
    }),
    ruins: boxMaterials({
      bottom: stone,
      side: standardMaterial(textures.ruins, { roughness: 0.93 }),
      top: standardMaterial(textures.ruins, { roughness: 0.9 }),
    }),
    snow: boxMaterials({
      bottom: dirt,
      side: standardMaterial(textures.snowSide, { roughness: 0.9 }),
      top: standardMaterial(textures.snowTop, { roughness: 0.82 }),
    }),
    stone: boxMaterials({
      bottom: stone,
      side: stone,
      top: stone,
    }),
    void_stone: boxMaterials({
      bottom: voidStone,
      side: voidStone,
      top: voidStone,
    }),
    water: basicMaterial(textures.water, {
      color: '#74d8ff',
      depthWrite: false,
      transparent: true,
      opacity: 0.72,
    }),
  };
}
