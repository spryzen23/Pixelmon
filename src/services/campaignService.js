import { api } from "../api";
import { getBiomeDisplayInfo } from "../game/biomeDisplay";

export function buildCampaignSession(region) {
  const display = getBiomeDisplayInfo(region.pathId);
  return {
    pathId: region.pathId,
    regionId: region.regionId,
    terrainName: display.terrainName || region.terrainName,
  };
}

export async function loadBiomeMap() {
  return api.getBiomes();
}
