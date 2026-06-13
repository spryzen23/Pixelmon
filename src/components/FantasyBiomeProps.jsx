import { useMemo } from 'react';
import FantasyProp from './FantasyProp';
import { FANTASY_BIOME_ID } from '../game/fantasyAssets';
import { getBiomeProps } from '../game/world';

export default function FantasyBiomeProps() {
  const { fantasyProps = [] } = useMemo(
    () => getBiomeProps(FANTASY_BIOME_ID),
    []
  );

  return (
    <group key="fantasy-props">
      {fantasyProps.map((prop) => (
        <FantasyProp
          key={prop.key}
          propKey={prop.propKey}
          rotationY={prop.rotationY}
          scale={prop.scale}
          surfaceY={prop.surfaceY}
          x={prop.x}
          z={prop.z}
        />
      ))}
    </group>
  );
}
