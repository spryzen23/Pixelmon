import { useEffect, useState } from "react";

const PHASES = [
  { key: "session", label: "Starting session", weight: 25 },
  { key: "spawns", label: "Loading spawns", weight: 25 },
  { key: "biome", label: "Preloading biome", weight: 35 },
  { key: "ready", label: "Ready", weight: 15 },
];

export function usePreloadProgress(phase = "session") {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const idx = PHASES.findIndex((p) => p.key === phase);
    if (idx < 0) return;
    let total = 0;
    for (let i = 0; i <= idx; i++) {
      total += PHASES[i].weight;
    }
    setProgress(total);
  }, [phase]);

  const currentLabel = PHASES.find((p) => p.key === phase)?.label ?? "Loading";

  return { progress, label: currentLabel, phases: PHASES };
}
