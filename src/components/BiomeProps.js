import { useMemo } from 'react';
import Cactus from './Cactus';
import PineTree from './PineTree';
import Tree from './Tree';
import { getBiomeProps } from '../game/world';

export default function BiomeProps({ currentBiome = 0 }) {
  const { trees, pineTrees, cacti } = useMemo(
    () => getBiomeProps(currentBiome),
    [currentBiome]
  );

  return (
    <group key={`props-${currentBiome}`}>
      {trees.map((tree) => (
        <Tree
          key={tree.key}
          x={tree.x}
          z={tree.z}
          surfaceY={tree.surfaceY}
        />
      ))}

      {pineTrees.map((pine) => (
        <PineTree
          key={pine.key}
          x={pine.x}
          z={pine.z}
          surfaceY={pine.surfaceY}
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
