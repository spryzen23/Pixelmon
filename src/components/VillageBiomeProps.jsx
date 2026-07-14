import { useMemo } from "react";
import VillageProp from "./VillageProp";
import VillageScene from "./VillageScene";
import { VILLAGE_BIOME_ID } from "../game/villageAssets";
import { getBiomeProps } from "../game/world";

export default function VillageBiomeProps() {
  const { villageScene, villageProps = [] } = useMemo(
    () => getBiomeProps(VILLAGE_BIOME_ID),
    []
  );

  return (
    <group key="village-props">
      {villageScene && (
        <VillageScene
          key={villageScene.key}
          rotationY={villageScene.rotationY ?? 0}
          scale={villageScene.scale}
          surfaceY={villageScene.surfaceY}
          x={villageScene.x}
          z={villageScene.z}
        />
      )}

      {villageProps.map((prop) => (
        <VillageProp
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
