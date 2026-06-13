import Ashfall from './biomes/volcanic/Ashfall';
import VolcanoCrater from './biomes/volcanic/VolcanoCrater';
import CaveEntrance from './biomes/cave/CaveEntrance';
import CaveInteriorEffects from './biomes/cave/CaveInteriorEffects';
import IceMountainLandmarks, {
  IceKyuremRoomInterior,
} from './biomes/icy/IceMountainLandmarks';
import MoonlitLandmarks from './biomes/moonlit/MoonlitLandmarks';
import DistantSkyIsland from './biomes/sky/DistantSkyIsland';
import SkyBelowVista from './biomes/sky/SkyBelowVista';
import SkyBiomeLandmarks from './biomes/sky/SkyBiomeLandmarks';
import DistortionRealmLandmarks from './biomes/distortion/DistortionRealmLandmarks';
import { CAVE_BIOME_ID, CAVE_ZONES } from '../game/world';

export default function BiomeLandmarks({
  fantasyBiome,
  currentBiome,
  caveZone = CAVE_ZONES.EXTERIOR,
  iceRoomId = null,
  onEnterCave = () => { },
  onEnterIceRoom = () => { },
  onExitIceRoom = () => { },
  playerRef,
}) {
  const isCaveInterior =
    fantasyBiome === 'cave' && caveZone === CAVE_ZONES.INTERIOR;
  const isCaveExterior = fantasyBiome === 'cave' && caveZone === CAVE_ZONES.EXTERIOR;
  const isIceRoomInterior = fantasyBiome === 'icy' && Boolean(iceRoomId);

  if (isIceRoomInterior) {
    return (
      <IceKyuremRoomInterior
        activeRoomId={iceRoomId}
        onExitRoom={onExitIceRoom}
        playerRef={playerRef}
      />
    );
  }

  return (
    <>
      {isCaveExterior && (
        <CaveEntrance onEnterCave={onEnterCave} playerRef={playerRef} />
      )}
      {isCaveInterior && <CaveInteriorEffects playerRef={playerRef} />}
      {fantasyBiome === 'volcanic' && (
        <>
          <Ashfall playerRef={playerRef} />
          <VolcanoCrater currentBiome={currentBiome} />
        </>
      )}
      {fantasyBiome === 'moonlit' && <MoonlitLandmarks />}
      {fantasyBiome === 'distortion' && <DistortionRealmLandmarks />}
      {fantasyBiome === 'sky' && (
        <>
          <SkyBiomeLandmarks />
          <SkyBelowVista />
        </>
      )}
      {fantasyBiome === 'icy' && (
        <IceMountainLandmarks
          onEnterRoom={onEnterIceRoom}
          playerRef={playerRef}
        />
      )}
      {fantasyBiome !== 'sky' &&
        fantasyBiome !== 'distortion' &&
        fantasyBiome !== 'moonlit' &&
        !isCaveInterior && <DistantSkyIsland currentBiome={currentBiome} />}
    </>
  );
}

export { CAVE_BIOME_ID, CAVE_ZONES };
