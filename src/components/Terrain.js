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
  WATER_BLOCK_HEIGHT,
  createCacti,
  createTerrainTiles,
  createTrees,
  getTileCoord,
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

    const nextCenter = {
      x: getTileCoord(player.position.x),
      z: getTileCoord(player.position.z),
    };

    if (nextCenter.x !== gridCenter.x || nextCenter.z !== gridCenter.z) {
      setGridCenter(nextCenter);
    }
  });

  useEffect(() => {
    [grassTexture, dirtTexture].forEach((texture) => {
      texture.wrapS = RepeatWrapping;
      texture.wrapT = RepeatWrapping;
      texture.magFilter = NearestFilter;
      texture.minFilter = NearestFilter;
      texture.colorSpace = SRGBColorSpace;
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

  const getBlockMaterials = (biome) => {
    if (biome === BIOMES.DESERT) {
      return desertMaterials;
    }

    if (biome === BIOMES.SNOW) {
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
              1.02,
              isWater ? WATER_BLOCK_HEIGHT : BLOCK_HEIGHT,
              1.02,
            ]}
            material={isWater ? undefined : getBlockMaterials(tile.biome)}
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
