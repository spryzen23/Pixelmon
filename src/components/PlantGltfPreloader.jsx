import { useGLTF } from "@react-three/drei";
import { PLANTS_BASE_URL, getUniquePlantGlbFiles } from "../game/plantAssets";

getUniquePlantGlbFiles().forEach((file) => {
  useGLTF.preload(`${PLANTS_BASE_URL}/${file}`);
});

export default function PlantGltfPreloader() {
  return null;
}
