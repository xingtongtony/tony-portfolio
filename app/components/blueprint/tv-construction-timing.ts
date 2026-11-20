// TV-only construction gestures, inspired by swarm-page-builder's
// approach → draw/drag → style choreography. Other exhibits keep their timing.
export const TV_CONSTRUCTION_TIMING: Record<string, { draw: number; fill: number }> = {
  rug: { draw: 0.7, fill: 0.35 },
  console: { draw: 0.9, fill: 0.5 },
  "tv-body": { draw: 0.85, fill: 0.5 },
  "tv-ui": { draw: 0.7, fill: 0.4 },
  soundbar: { draw: 0.78, fill: 0.35 },
  remote: { draw: 0.7, fill: 0.35 },
  props: { draw: 1.05, fill: 0.43 },
  "focus-outer": { draw: 1.4, fill: 0.62 },
  "focus-inner": { draw: 1.2, fill: 0.62 },
  "focus-plaque": { draw: 0.47, fill: 0.31 },
};
