import { Vector2, Vector3 } from "three";

/** Hex to display-space RGB for colours evaluated after tone mapping. */
export function displayRgb(hex: string) {
  const rgb = parseInt(hex.slice(1), 16);
  return new Vector3(((rgb >> 16) & 255) / 255, ((rgb >> 8) & 255) / 255, (rgb & 255) / 255);
}

/**
 * The page's own colour, away from the light: this much of the studio's wall
 * colour, the rest white. It is what the header is painted, so it is also
 * what the headline's seam must be (see `paperCss`).
 */
export const STUDIO_PAPER = 0.5;

/** The page's colour for CSS, rounded the way the canvas rounds it. */
export function paperCss(wall: Vector3) {
  const channel = (v: number) => Math.round((1 + (v - 1) * STUDIO_PAPER) * 255);
  return `rgb(${channel(wall.x)} ${channel(wall.y)} ${channel(wall.z)})`;
}

export function createStudioAtmosphere() {
  return {
    uStudioBuffer: { value: new Vector2(1, 1) },
    // Where the figure on stage stands on the canvas (x, y from 0 to 1), and
    // how big a scene unit is there.
    uStudioSweep: { value: new Vector3(0.6, 0.5, 0.17) },
    uStudioWall: { value: new Vector3(1, 1, 1) },
    // The canvas runs on to the left of the stage, under the navigation
    // panel: x is where the stage starts in it (0 to 1), y how many canvas
    // widths make one stage width.
    uStudioFrame: { value: new Vector2(0, 1) },
    // x: the sine of the camera's elevation — how tall a unit of floor is on
    // screen. (A vector, so the frame loop can set it without assigning.)
    uStudioView: { value: new Vector2(0.479, 0) },
  };
}

export type StudioAtmosphere = ReturnType<typeof createStudioAtmosphere>;

// Sample the same opaque, display-space colour for the backdrop and the
// patent fills. An unbuilt silhouette still hides the lines behind it.
export const STUDIO_ATMOSPHERE = /* glsl */ `
  uniform vec2 uStudioBuffer;
  uniform vec3 uStudioSweep;
  uniform vec3 uStudioWall;
  uniform vec2 uStudioFrame;
  uniform vec2 uStudioView;

  // The room is light and nothing else. One seamless floor, no wall and no
  // line anywhere: bright where the figure on stage stands and dimmer with
  // distance in every direction. The distance is measured along the floor —
  // a step away from the viewer is shorter on screen than a step sideways —
  // so the light lies on a plane, and that plane is the space the figure is
  // in. (A wall behind the figure was tried: it had to fade out again before
  // the header, and read as a smear across the page.)
  vec3 studioPaper() {
    vec2 uv = gl_FragCoord.xy / uStudioBuffer;
    float unit = 1.04 / uStudioSweep.z;
    float stageAspect = uStudioBuffer.x / uStudioBuffer.y / uStudioFrame.y;
    vec2 onFloor = vec2(
      (uv.x - uStudioSweep.x) * uStudioFrame.y * stageAspect,
      (uStudioSweep.y - uv.y) / uStudioView.x
    ) * unit;
    float reach = dot(onFloor, onFloor);
    // A bright core under the figure and a wide, faint skirt round it.
    float pool = 0.72 * exp(-reach / 5.5) + 0.28 * exp(-reach / 18.0);
    return mix(mix(vec3(1.0), uStudioWall, ${STUDIO_PAPER.toFixed(3)}), mix(vec3(1.0), uStudioWall, 0.04), pool);
  }
`;
