import { Vector2, Vector3 } from "three";

/** Hex to display-space RGB for colours evaluated after tone mapping. */
export function displayRgb(hex: string) {
  const rgb = parseInt(hex.slice(1), 16);
  return new Vector3(((rgb >> 16) & 255) / 255, ((rgb >> 8) & 255) / 255, (rgb & 255) / 255);
}

export function createStudioAtmosphere() {
  return {
    uStudioBuffer: { value: new Vector2(1, 1) },
    uStudioSweep: { value: new Vector3(0.6, 0.57, 0.17) },
    uStudioWall: { value: new Vector3(1, 1, 1) },
    uStudioBounce: { value: new Vector3(1, 1, 1) },
  };
}

export type StudioAtmosphere = ReturnType<typeof createStudioAtmosphere>;

// Sample the same opaque, display-space colour for the backdrop and the
// patent fills. An unbuilt silhouette still hides the lines behind it.
export const STUDIO_ATMOSPHERE = /* glsl */ `
  uniform vec2 uStudioBuffer;
  uniform vec3 uStudioSweep;
  uniform vec3 uStudioWall;
  uniform vec3 uStudioBounce;

  vec3 studioPaper() {
    vec2 uv = gl_FragCoord.xy / uStudioBuffer;
    float x = uv.x - uStudioSweep.x;
    float height = (uv.y - uStudioSweep.y) / uStudioSweep.z;
    float curvedHeight = height - 0.23 * x * x;
    float sweep = exp(-1.8 * (curvedHeight - 0.2) * (curvedHeight - 0.2));
    float floorFalloff = 1.0 - smoothstep(-2.8, 0.05, curvedHeight);
    vec2 spill = vec2((x - 0.10) * 2.55, (curvedHeight - 0.65) * 0.82);
    float bounce = exp(-dot(spill, spill));
    vec2 softbox = vec2((x + 0.18 + height * 0.105) * 3.8, (height - 0.85) * 0.59);
    float light = exp(-dot(softbox, softbox));
    vec2 floorPool = vec2((x + 0.06) * 3.0, (curvedHeight + 1.32) * 1.15);
    float reflectedLight = exp(-dot(floorPool, floorPool));

    // Return to paper at the header, copy column and bottom of the stage.
    float edges = smoothstep(0.015, 0.58, uv.x)
                * smoothstep(0.035, 0.27, uv.y)
                * (1.0 - smoothstep(0.75, 0.995, uv.y));
    vec3 room = mix(vec3(1.0), uStudioWall, 0.53 + 0.16 * sweep + 0.08 * floorFalloff);
    room = mix(room, uStudioBounce, 0.49 * bounce * (0.55 + 0.45 * sweep));
    room = mix(room, vec3(1.0), 0.50 * light + 0.24 * reflectedLight);
    return mix(vec3(1.0), room, edges);
  }
`;
