// Area-light shadows for the clay figures.
//
// three.js shadows have one softness everywhere. A soft box does not: its
// shadow is crisp where an object touches the ground and widens with distance
// (contact hardening). That gradient is most of what makes a clay render look
// lit rather than computed, so this replaces the renderer's basic shadow
// lookup with percentage-closer soft shadows (PCSS):
//
//   1. Blocker search — average the depth of whatever stands between this
//      point and the light, over a small disc of the shadow map.
//   2. Penumbra — the further those blockers are from the point, the wider
//      the filter. `light.shadow.radius` is the light's size: penumbra (in
//      shadow-map UV) per unit of normalised depth between blocker and point.
//   3. Filter — average many depth tests over a disc of that width.
//
// Samples sit on a Vogel disc turned by a per-pixel angle, which trades
// banding for a fine, stable grain. The receiver's own depth slope is carried
// into every sample so a wide filter does not shadow the surface it is on.
//
// Use with <Canvas shadows="basic">. Call before the first material compiles.

import * as THREE from "three";

const HELPERS = /* glsl */ `
	#define PCSS_BLOCKERS 16
	#define PCSS_TAPS 24

	float pcssAngle( vec2 p ) {
		return 6.2831853 * fract( 52.9829189 * fract( dot( p, vec2( 0.06711056, 0.00583715 ) ) ) );
	}

	vec2 pcssDisc( int i, int n, float phi ) {
		float r = sqrt( ( float( i ) + 0.5 ) / float( n ) );
		float a = float( i ) * 2.3999632 + phi;
		return r * vec2( cos( a ), sin( a ) );
	}

	float pcssShadow( sampler2D shadowMap, float lightSize, vec3 coord ) {
		// How the receiver's depth changes across the map (receiver-plane bias).
		vec3 dx = dFdx( coord );
		vec3 dy = dFdy( coord );
		float det = dx.x * dy.y - dx.y * dy.x;
		vec2 slope = abs( det ) > 1e-12
			? vec2( dy.y * dx.z - dx.y * dy.z, dx.x * dy.z - dy.x * dx.z ) / det
			: vec2( 0.0 );
		slope = clamp( slope, vec2( -3.0 ), vec2( 3.0 ) );

		float phi = pcssAngle( gl_FragCoord.xy );
		float search = lightSize * 0.12;

		float blockers = 0.0;
		float blockerDepth = 0.0;
		for ( int i = 0; i < PCSS_BLOCKERS; i ++ ) {
			vec2 o = pcssDisc( i, PCSS_BLOCKERS, phi ) * search;
			float d = texture2D( shadowMap, coord.xy + o ).r;
			if ( d < coord.z + dot( o, slope ) ) {
				blockerDepth += d;
				blockers += 1.0;
			}
		}
		if ( blockers < 0.5 ) return 1.0;

		float radius = clamp( ( coord.z - blockerDepth / blockers ) * lightSize, 0.0012, search );
		float lit = 0.0;
		for ( int i = 0; i < PCSS_TAPS; i ++ ) {
			vec2 o = pcssDisc( i, PCSS_TAPS, phi + 1.7 ) * radius;
			lit += step( coord.z + dot( o, slope ), texture2D( shadowMap, coord.xy + o ).r );
		}
		return lit / float( PCSS_TAPS );
	}
`;

// The single hard depth test inside the basic getShadow(), and that function's
// signature (the build strips comments, so there is no marker to look for).
const HARD_TEST = /float depth = texture2D\( shadowMap, shadowCoord\.xy \)\.r;[\s\S]*?#endif/;
const SIGNATURE = "float getShadow( sampler2D shadowMap";

let installed = false;

export function installSoftShadows() {
  if (installed) return;
  installed = true;
  const chunk = THREE.ShaderChunk.shadowmap_pars_fragment;
  const test = HARD_TEST.exec(chunk);
  const at = test ? chunk.lastIndexOf(SIGNATURE, test.index) : -1;
  if (!test || at < 0) {
    // A different three.js: keep its own (hard) shadows rather than break the scene.
    console.warn("blueprint: soft shadows not installed — unexpected shadow shader");
    return;
  }
  THREE.ShaderChunk.shadowmap_pars_fragment =
    chunk.slice(0, at) +
    HELPERS +
    chunk.slice(at, test.index) +
    "shadow = pcssShadow( shadowMap, shadowRadius, shadowCoord.xyz );" +
    chunk.slice(test.index + test[0].length);
}
