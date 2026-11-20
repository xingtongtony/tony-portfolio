import * as THREE from "three";
import type { ReferenceIndirectUniforms } from "./reference-irradiance";
import { INDIRECT_FRAGMENT, INDIRECT_VERTEX } from "./reference-irradiance-shader";
import { displayRgb, STUDIO_ATMOSPHERE, type StudioAtmosphere } from "./studio-atmosphere";
import { CONTACT_SHADOWS } from "./soft-shadows";

const GROUND_IRRADIANCE = /* glsl */ `
  // Keep the room-only irradiance for the unoccluded reference denominator.
  vec3 groundRoomIrradiance = iblIrradiance;
  vec2 groundToMin = vIndirectPosition.xz - uIndirectMin.xz;
  vec2 groundToMax = uIndirectMin.xz + uIndirectExtent.xz - vIndirectPosition.xz;
  float groundEdge = min(min(groundToMin.x, groundToMin.y), min(groundToMax.x, groundToMax.y));
  // The ground lies below the probes' minimum Y. Only XZ limits its footprint.
  float groundLocalWeight = smoothstep(0.0, 0.2, groundEdge);
  float groundIndirectWeight = groundLocalWeight * uGroundReference * uIndirectMix;
  if (groundIndirectWeight > 0.0 && uIndirectCapture < 0.5) {
    vec3 groundWorldNormal = transformNormalByInverseViewMatrix(geometryNormal, viewMatrix);
    vec3 groundLocalNormal = normalize(mat3(uIndirectWorldToLocal) * groundWorldNormal);
    iblIrradiance = mix(iblIrradiance, localSceneIrradiance(groundLocalNormal), groundIndirectWeight);
  }
`;

const GROUND_RATIO = /* glsl */ `
  ReflectedLight groundUnshadowed = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
  #if NUM_DIR_LIGHTS > 0
    IncidentLight groundDirectLight;
    #pragma unroll_loop_start
    for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
      getDirectionalLightInfo(directionalLights[i], groundDirectLight);
      RE_Direct(groundDirectLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, groundUnshadowed);
    }
    #pragma unroll_loop_end
  #endif
  RE_IndirectDiffuse(irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, groundUnshadowed);
  RE_IndirectSpecular(radiance, groundRoomIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, groundUnshadowed);
  vec3 groundActualDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
  vec3 groundReferenceDiffuse = groundUnshadowed.directDiffuse + groundUnshadowed.indirectDiffuse;
  vec3 groundRatio = clamp(groundActualDiffuse / max(groundReferenceDiffuse, vec3(0.0001)), vec3(0.25), vec3(1.25));
`;

const GROUND_OUTPUT = /* glsl */ `
  vec3 groundPaper = studioPaper();
  vec3 groundLinearPaper = sRGBTransferEOTF(vec4(groundPaper, 1.0)).rgb;
  vec3 groundPhysicalDisplay = sRGBTransferOETF(vec4(groundLinearPaper * groundRatio, 1.0)).rgb;
  float groundLegacyAlpha = uLegacyOpacity * (1.0 - getShadowMask());
  float groundBlend = clamp(uGroundReference, 0.0, 1.0);
  float groundAlpha = mix(groundLegacyAlpha, 1.0, groundBlend);
  // Interpolate premultiplied colours, then return straight alpha for the
  // material's ordinary NormalBlending. This avoids a dark transition rim.
  vec3 groundPremultiplied = mix(uGroundLegacyColor * groundLegacyAlpha, groundPhysicalDisplay, groundBlend);
  gl_FragColor = vec4(groundAlpha > 0.00001 ? groundPremultiplied / groundAlpha : vec3(0.0), groundAlpha);
`;

/**
 * Match the canvas paper exactly in unoccluded areas. A shadow changes the
 * measured ratio of received diffuse energy, rather than painting a dark
 * silhouette of the occluder on top of otherwise unchanged illumination.
 */
export function createReferenceGround(atmosphere: StudioAtmosphere, indirect: ReferenceIndirectUniforms) {
  const reference = { value: 0 };
  const legacyOpacity = { value: 0.4 };
  const material = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 1,
    metalness: 0,
    specularIntensity: 0,
    transparent: true,
    depthWrite: false,
  });
  material.name = "Reference energy-ratio ground";
  material.customProgramCacheKey = () => "reference-energy-ratio-ground-v1";
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, atmosphere, indirect, {
      uGroundReference: reference,
      uLegacyOpacity: legacyOpacity,
      uGroundLegacyColor: { value: displayRgb("#584f67") },
      uContactShadow: CONTACT_SHADOWS,
    });
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\n" + INDIRECT_VERTEX)
      .replace("#include <project_vertex>", "#include <project_vertex>\nvIndirectPosition = (uIndirectWorldToLocal * modelMatrix * vec4(transformed, 1.0)).xyz;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\n" + INDIRECT_FRAGMENT + STUDIO_ATMOSPHERE + "\nuniform float uGroundReference;\nuniform float uLegacyOpacity;\nuniform vec3 uGroundLegacyColor;\n")
      .replace("#include <shadowmap_pars_fragment>", "#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>")
      .replace("#include <lights_fragment_maps>", "#include <lights_fragment_maps>\n" + GROUND_IRRADIANCE)
      .replace("#include <lights_fragment_end>", "#include <lights_fragment_end>\n" + GROUND_RATIO)
      .replace("#include <colorspace_fragment>", "#include <colorspace_fragment>\n" + GROUND_OUTPUT);
  };
  return { material, reference, legacyOpacity };
}
