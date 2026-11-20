// TV-only construction gestures, inspired by swarm-page-builder's
// approach → draw/drag → style choreography. Other exhibits keep their timing.
export const TV_CONSTRUCTION_TIMING: Record<string, { draw: number; fill: number }> = {
  rug: { draw: 0.9, fill: 0.45 },
  console: { draw: 1.15, fill: 0.65 },
  "tv-body": { draw: 1.1, fill: 0.65 },
  "tv-ui": { draw: 0.9, fill: 0.5 },
  soundbar: { draw: 1.0, fill: 0.45 },
  remote: { draw: 0.9, fill: 0.45 },
  props: { draw: 1.35, fill: 0.55 },
  "focus-outer": { draw: 1.8, fill: 0.8 },
  "focus-inner": { draw: 1.55, fill: 0.8 },
  "focus-plaque": { draw: 0.6, fill: 0.4 },
};
