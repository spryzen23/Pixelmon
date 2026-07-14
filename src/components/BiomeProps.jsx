import { useMemo } from "react";

import Cactus from "./Cactus";

import FantasyBiomeProps from "./FantasyBiomeProps";

import PlantProp from "./PlantProp";

import VillageBiomeProps from "./VillageBiomeProps";

import { FANTASY_BIOME_ID } from "../game/fantasyAssets";

import { VILLAGE_BIOME_ID } from "../game/villageAssets";

import { getBiomeProps } from "../game/world";

export default function BiomeProps({ currentBiome = 0 }) {
  const biomeProps = useMemo(
    () => getBiomeProps(currentBiome),

    [currentBiome]
  );

  if (currentBiome === FANTASY_BIOME_ID) {
    return <FantasyBiomeProps />;
  }

  if (currentBiome === VILLAGE_BIOME_ID) {
    return <VillageBiomeProps />;
  }

  const { cacti, plantProps = [] } = biomeProps;

  return (
    <group key={`props-${currentBiome}`}>
      {plantProps.map((prop) => (
        <PlantProp
          key={prop.key}

          glbUrl={prop.glbUrl}

          propKey={prop.propKey}

          rotationY={prop.rotationY}

          scale={prop.scale}

          surfaceY={prop.surfaceY}

          x={prop.x}

          z={prop.z}
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
