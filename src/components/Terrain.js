import { Box, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import {
  MeshStandardMaterial,
  NearestFilter,
  RepeatWrapping,
  SRGBColorSpace,
} from 'three';
import Cactus from './Cactus';
import Tree from './Tree';
import {
  BIOMES,
  BLOCK_HEIGHT,
  PLAYER_START,
  TERRAIN_RADIUS,
  VOXEL_SIZE,
  WATER_BLOCK_HEIGHT,
  createCacti,
  createTerrainTiles,
  createTrees,
  getTileCoord,
  worldToGrid,
} from '../game/world';

const TILE_COLORS = {
  water: '#2477d4',
};

export default function Terrain({ playerRef }) {
  const [gridCenter, setGridCenter] = useState({
    x: getTileCoord(PLAYER_START[0]),
    z: getTileCoord(PLAYER_START[2]),
  });
  const tiles = useMemo(
    () => createTerrainTiles(gridCenter.x, gridCenter.z, TERRAIN_RADIUS),
    [gridCenter]
  );
  const trees = useMemo(
    () => createTrees(gridCenter.x, gridCenter.z, TERRAIN_RADIUS),
    [gridCenter]
  );
  const cacti = useMemo(
    () => createCacti(gridCenter.x, gridCenter.z, TERRAIN_RADIUS),
    [gridCenter]
  );
  const [grassTexture, dirtTexture] = useTexture(['/grass.png', '/dirt.png']);

  useFrame(() => {
    const player = playerRef.current;

    if (!player) {
      return;
    }

    const { gridX, gridZ } = worldToGrid(player.position.x, player.position.z);
    const nextCenter = { x: gridX, z: gridZ };

    if (nextCenter.x !== gridCenter.x || nextCenter.z !== gridCenter.z) {
      setGridCenter(nextCenter);
    }
  });

  useEffect(() => {
    [grassTexture, dirtTexture].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.minFilter = NearestFilter;
      texture.magFilter = NearestFilter;
      texture.colorSpace = SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.needsUpdate = true;
    });
  }, [dirtTexture, grassTexture]);

  const plainsMaterials = useMemo(() => {
    const grassMaterial = new MeshStandardMaterial({
      map: grassTexture,
      roughness: 0.85,
      metalness: 0,
    });
    const dirtMaterial = new MeshStandardMaterial({
      map: dirtTexture,
      roughness: 0.9,
      metalness: 0,
    });

    // BoxGeometry material order: right, left, top, bottom, front, back.
    return [
      dirtMaterial,
      dirtMaterial,
      grassMaterial,
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
    ];
  }, [dirtTexture, grassTexture]);

  const plainsDirtMaterials = useMemo(() => {
    const dirtMaterial = new MeshStandardMaterial({
      map: dirtTexture,
      roughness: 0.9,
      metalness: 0,
    });

    return [
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
      dirtMaterial,
    ];
  }, [dirtTexture]);

  const desertMaterials = useMemo(() => {
    const sandTop = new MeshStandardMaterial({
      color: '#e9cf82',
      roughness: 0.92,
      metalness: 0,
    });
    const sandSide = new MeshStandardMaterial({
      color: '#c9a85c',
      roughness: 0.95,
      metalness: 0,
    });

    return [sandSide, sandSide, sandTop, sandSide, sandSide, sandSide];
  }, []);

  const desertDirtMaterials = useMemo(() => {
    const sandSide = new MeshStandardMaterial({
      color: '#c9a85c',
      roughness: 0.95,
      metalness: 0,
    });

    return [sandSide, sandSide, sandSide, sandSide, sandSide, sandSide];
  }, []);

  const snowMaterials = useMemo(() => {
    const snowTop = new MeshStandardMaterial({
      color: '#f3fbff',
      roughness: 0.88,
      metalness: 0,
    });
    const frozenDirtSide = new MeshStandardMaterial({
      color: '#8a8f86',
      roughness: 0.92,
      metalness: 0,
    });

    return [
      frozenDirtSide,
      frozenDirtSide,
      snowTop,
      frozenDirtSide,
      frozenDirtSide,
      frozenDirtSide,
    ];
  }, []);

  const snowDirtMaterials = useMemo(() => {
    const frozenDirtSide = new MeshStandardMaterial({
      color: '#8a8f86',
      roughness: 0.92,
      metalness: 0,
    });

    return [
      frozenDirtSide,
      frozenDirtSide,
      frozenDirtSide,
      frozenDirtSide,
      frozenDirtSide,
      frozenDirtSide,
    ];
  }, []);

  const getBlockMaterials = (tile) => {
    if (tile.type === 'dirt') {
      if (tile.biome === BIOMES.DESERT) {
        return desertDirtMaterials;
      }

      if (tile.biome === BIOMES.SNOW) {
        return snowDirtMaterials;
      }

      return plainsDirtMaterials;
    }

    if (tile.biome === BIOMES.DESERT) {
      return desertMaterials;
    }

    if (tile.biome === BIOMES.SNOW) {
      return snowMaterials;
    }

    return plainsMaterials;
  };

  return (
    <group>
      {tiles.map((tile) => {
        const isWater = tile.type === 'water';

        return (
          <Box
            key={tile.key}
            args={[
              VOXEL_SIZE,
              tile.height || (isWater ? WATER_BLOCK_HEIGHT : BLOCK_HEIGHT),
              VOXEL_SIZE,
            ]}
            material={isWater ? undefined : getBlockMaterials(tile)}
            position={[tile.x, tile.centerY, tile.z]}
            receiveShadow
          >
            {isWater && (
              <meshStandardMaterial
                color={TILE_COLORS.water}
                roughness={0.35}
                metalness={0}
                transparent
                opacity={0.82}
              />
            )}
          </Box>
        );
      })}

      {trees.map((tree) => (
        <Tree
          key={tree.key}
          x={tree.x}
          z={tree.z}
          surfaceY={tree.surfaceY}
        />
      ))}

      {cacti.map((cactus) => (
        <Cactus
          key={cactus.key}
          x={cactus.x}
          z={cactus.z}
          surfaceY={cactus.surfaceY}
        />
      ))}
    </group>
  );
}
