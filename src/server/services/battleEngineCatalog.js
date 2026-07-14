import { createRequire } from "module";
import path from "path";

const _require = createRequire(import.meta.url)("module").createRequire(
  import.meta.url
);
const _localPath = path;
const Sim = eval(
  "_require(_localPath.resolve(process.cwd(), 'src/server/showdown/sim/index.js'))"
);

export const { Dex } = Sim;

export function toID(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

export function normalizeBattleId(value) {
  return toID(value);
}

export function getMoveCatalogRecord(value) {
  const move = Dex.moves.get(value);
  if (!move?.exists) return null;
  return {
    id: move.id,
    name: move.name,
    type: move.type,
    category: move.category,
    basePower: move.basePower,
    accuracy: move.accuracy,
    pp: move.pp,
    priority: move.priority,
    target: move.target,
    flags: move.flags || {},
    shortDesc: move.shortDesc || move.desc || "",
  };
}

export function getAbilityCatalogRecord(value) {
  const ability = Dex.abilities.get(value);
  if (!ability?.exists) return null;
  return {
    id: ability.id,
    name: ability.name,
    shortDesc: ability.shortDesc || ability.desc || "",
  };
}

export function getItemCatalogRecord(value) {
  const item = Dex.items.get(value);
  if (!item?.exists) return null;
  return {
    id: item.id,
    name: item.name,
    shortDesc: item.shortDesc || item.desc || "",
  };
}

export function requireMove(value) {
  const move = Dex.moves.get(value);
  if (!move?.exists) throw new Error(`Unknown move: ${value}`);
  return move;
}

export function requireAbility(value) {
  const ability = Dex.abilities.get(value);
  if (!ability?.exists) throw new Error(`Unknown ability: ${value}`);
  return ability;
}

export function requireItem(value) {
  const item = Dex.items.get(value);
  if (!item?.exists) throw new Error(`Unknown item: ${value}`);
  return item;
}
