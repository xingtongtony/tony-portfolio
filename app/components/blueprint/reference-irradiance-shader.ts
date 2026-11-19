// Diffuse irradiance captured from the actual TV scene, including nearby
// coloured surfaces. SH coefficients are stored in nine stacked 3D grids.
export const INDIRECT_VERTEX = /* glsl */ `
uniform mat4 uIndirectWorldToLocal;
varying vec3 vIndirectPosition;
`;

export const INDIRECT_FRAGMENT = /* glsl */ `
uniform highp sampler3D uIndirectVolume;
uniform mat4 uIndirectWorldToLocal;
uniform vec3 uIndirectMin;
uniform vec3 uIndirectExtent;
uniform float uIndirectMix;
uniform float uIndirectCapture;
varying vec3 vIndirectPosition;

vec3 indirectCoefficient(float coefficient, vec3 position) {
  vec3 p = clamp((position - uIndirectMin) / uIndirectExtent, 0.0, 1.0);
  vec3 uv = vec3((p.x * 3.0 + 0.5) / 4.0,
                 (p.y * 2.0 + 0.5) / 3.0,
                 (coefficient * 3.0 + p.z * 2.0 + 0.5) / 27.0);
  return texture(uIndirectVolume, uv).rgb;
}

vec3 localSceneIrradiance(vec3 n) {
  vec3 p = vIndirectPosition + n * 0.04;
  float x = n.x, y = n.y, z = n.z;
  vec3 value = indirectCoefficient(0.0, p) * 0.886227;
  value += indirectCoefficient(1.0, p) * (1.023328 * y);
  value += indirectCoefficient(2.0, p) * (1.023328 * z);
  value += indirectCoefficient(3.0, p) * (1.023328 * x);
  value += indirectCoefficient(4.0, p) * (0.858086 * x * y);
  value += indirectCoefficient(5.0, p) * (0.858086 * y * z);
  value += indirectCoefficient(6.0, p) * (0.743125 * z * z - 0.247708);
  value += indirectCoefficient(7.0, p) * (0.858086 * x * z);
  value += indirectCoefficient(8.0, p) * (0.429043 * (x * x - y * y));
  return max(value, vec3(0.0));
}
`;

export const INDIRECT_LIGHTING = /* glsl */ `
#if defined(RE_IndirectDiffuse)
  if (uIndirectMix > 0.0 && uIndirectCapture < 0.5) {
    vec3 indirectWorldNormal = transformNormalByInverseViewMatrix(geometryNormal, viewMatrix);
    vec3 indirectLocalNormal = normalize(mat3(uIndirectWorldToLocal) * indirectWorldNormal);
    // Replace room-only diffuse illumination rather than adding a second
    // copy of the environment on top of it. Direct shadowed lights remain.
    iblIrradiance = mix(iblIrradiance, localSceneIrradiance(indirectLocalNormal), uIndirectMix);
  }
#endif
`;
