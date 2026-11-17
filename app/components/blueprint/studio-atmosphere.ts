import { Vector2, Vector3 } from "three";

/** Hex to display-space RGB for colours evaluated after tone mapping. */
export function displayRgb(hex: string) {
  const rgb = parseInt(hex.slice(1), 16);
  return new Vector3(((rgb >> 16) & 255) / 255, ((rgb >> 8) & 255) / 255, (rgb & 255) / 255);
}

/**
 * The page is one sheet of tinted paper: this much of the studio's wall
 * colour, the rest white. The backdrop fades into it at its edges, and the
 * page around the canvas is painted the same colour (see `paperCss`), so the
 * sidebar, the headline and the index all stand on the one surface.
 */
export const STUDIO_PAPER = 0.42;

/**
 * How far behind the figure the room's back wall stands, in scene units. Far
 * enough that the whole figure is seen against floor, with the wall rising
 * above it: an object looked down on is surrounded by the ground it is on.
 */
export const STUDIO_DEPTH = 4.2;

/** The paper's colour for CSS, rounded the way the canvas rounds it. */
export function paperCss(wall: Vector3) {
  const channel = (v: number) => Math.round((1 + (v - 1) * STUDIO_PAPER) * 255);
  return `rgb(${channel(wall.x)} ${channel(wall.y)} ${channel(wall.z)})`;
}

export function createStudioAtmosphere() {
  return {
    uStudioBuffer: { value: new Vector2(1, 1) },
    uStudioSweep: { value: new Vector3(0.6, 0.57, 0.17) },
    uStudioWall: { value: new Vector3(1, 1, 1) },
    uStudioBounce: { value: new Vector3(1, 1, 1) },
    // The canvas runs on to the left of the stage, under the navigation
    // panel: x is where the stage starts in it (0 to 1), y how many canvas
    // widths make one stage width's worth of studio.
    uStudioFrame: { value: new Vector2(0, 1) },
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
  uniform vec2 uStudioFrame;

  vec3 studioPaper() {
    vec2 uv = gl_FragCoord.xy / uStudioBuffer;
    vec3 paper = mix(vec3(1.0), uStudioWall, ${STUDIO_PAPER.toFixed(3)});

    // Where this pixel is in the room, in the scene's own units. uStudioSweep
    // is the foot of the back wall behind the figure on stage (x, y on the
    // canvas) and how big a unit is; the camera looks down at about 29°, so
    // a unit of floor is 0.48 of a unit tall on screen and a unit of wall 0.88.
    float unit = 1.04 / uStudioSweep.z;
    float stageAspect = uStudioBuffer.x / uStudioBuffer.y / uStudioFrame.y;
    float across = (uv.x - uStudioSweep.x) * uStudioFrame.y * stageAspect * unit;
    float rise = (uv.y - uStudioSweep.y) * unit;

    // The floor: a pool of light where the figure stands, in front of the
    // wall, falling back to the paper's own tone further out. A lit
    // floor under a soft shadow is what says "this stands on something".
    vec2 fromFigure = vec2(across, -rise / 0.479 - ${STUDIO_DEPTH.toFixed(2)});
    float lit = exp(-dot(fromFigure, fromFigure) / 7.5);
    vec3 ground = mix(paper, mix(vec3(1.0), uStudioWall, 0.10), 0.92 * lit);

    // The wall: deepest just above its foot, where the least light reaches,
    // and back to paper towards the header and far to the sides. The lit
    // floor throws a little of its light onto the wall behind the figure.
    float up = rise / 0.878;
    float shade = exp(-up * up / 9.0) * exp(-across * across / 90.0);
    vec3 wall = mix(paper, mix(vec3(1.0), uStudioWall, 0.80), shade);
    vec2 glow = vec2(across * 0.55, up - 0.2);
    wall = mix(wall, mix(vec3(1.0), uStudioBounce, 0.30), 0.34 * exp(-dot(glow, glow) / 2.4));

    // Floor meets wall in a soft cove, not a line.
    vec3 room = mix(ground, wall, smoothstep(-0.16, 0.30, rise));

    // The header and the foot of the page are plain paper: the headline's
    // seam is a flat colour, and the index lies on the page.
    float page = smoothstep(0.02, 0.16, uv.y) * (1.0 - smoothstep(0.66, 0.885, uv.y));
    return mix(paper, room, page);
  }
`;
