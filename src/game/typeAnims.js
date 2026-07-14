import { getTypeAnimProfile } from "./pokemonData";
import typeAnimationCatalogData from "./data/typeAnimationCatalog.json";

export { TYPE_ANIMATION_CATALOG } from "./pokemonData";

export function loadTypeAnimationCatalog() {
  return typeAnimationCatalogData;
}

export function getTypeAnimProfileForTypes(types = []) {
  const primary = types[0] || "normal";
  return getTypeAnimProfile(primary);
}
