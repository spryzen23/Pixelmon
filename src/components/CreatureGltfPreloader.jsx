import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function CreatureGltfPreloader({ urls = [] }) {
  useEffect(() => {
    urls.forEach((url) => {
      if (url) useGLTF.preload(url);
    });
  }, [urls]);

  return null;
}
