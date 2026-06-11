import { useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { PLANTS_BASE_URL, getPlantPropDef, getPlantPropVariants } from '../game/plantAssets';

const PLANT_CATEGORIES = [
  'tree',
  'pine',
  'plant',
  'rock',
  'desert_large',
  'desert_rock',
  'desert_scatter',
];

function getBiomePlantFiles(biomeId) {
  const files = new Set();

  PLANT_CATEGORIES.forEach((category) => {
    getPlantPropVariants(category, biomeId).forEach((propKey) => {
      const def = getPlantPropDef(propKey);
      if (def?.file) {
        files.add(def.file);
      }
    });
  });

  return [...files];
}

export default function BiomePlantPreloader({ biomeId = 0 }) {
  useEffect(() => {
    getBiomePlantFiles(biomeId).forEach((file) => {
      useGLTF.preload(`${PLANTS_BASE_URL}/${file}`);
    });
  }, [biomeId]);

  return null;
}
