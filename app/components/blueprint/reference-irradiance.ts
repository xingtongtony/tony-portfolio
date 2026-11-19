import * as THREE from "three";
import type { BuiltFigure } from "./figure-builder";

const NX = 4;
const NY = 3;
const NZ = 3;
const SH_COUNT = 9;
const CUBE_SIZE = 16;
const PROBE_COUNT = NX * NY * NZ;
const MIN = new THREE.Vector3(-1.9, 0.14, -1.5);
const EXTENT = new THREE.Vector3(3.8, 2.4, 2.2);

export type ReferenceIndirectUniforms = {
  uIndirectVolume: { value: THREE.Data3DTexture };
  uIndirectWorldToLocal: { value: THREE.Matrix4 };
  uIndirectMin: { value: THREE.Vector3 };
  uIndirectExtent: { value: THREE.Vector3 };
  uIndirectMix: { value: number };
  uIndirectCapture: { value: number };
};

/** Nine RGB SH coefficient grids, stacked as coefficient * NZ + local Z. */
export function createIndirectUniforms(): ReferenceIndirectUniforms {
  // WebGL2 permits linear filtering of RGBA16F without OES_texture_float_linear.
  // Signed half-floats preserve the negative SH coefficients and HDR radiance.
  const texture = new THREE.Data3DTexture(new Uint16Array(NX * NY * NZ * SH_COUNT * 4), NX, NY, NZ * SH_COUNT);
  texture.name = "TV one-bounce irradiance SH";
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.HalfFloatType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = texture.wrapT = texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  texture.generateMipmaps = false;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  return {
    uIndirectVolume: { value: texture },
    uIndirectWorldToLocal: { value: new THREE.Matrix4() },
    uIndirectMin: { value: MIN.clone() },
    uIndirectExtent: { value: EXTENT.clone() },
    uIndirectMix: { value: 0 },
    uIndirectCapture: { value: 0 },
  };
}

/**
 * Capture actual scene radiance, without recursively sampling this volume.
 * Thus each visible surface contributes its directly lit reflected colour.
 * The returned SH coefficients are radiance; apply cosine convolution once
 * in the receiving material, as with THREE.SphericalHarmonics3.getIrradianceAt.
 */
export function createReferenceIrradiance(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
  tv: BuiltFigure,
  radiance: THREE.CubeTexture,
) {
  const uniforms = tv.indirect!;
  if (!uniforms) throw new Error("TV indirect uniforms must be created before its materials.");
  const volume = uniforms.uIndirectVolume.value;
  const staging = new Float32Array(NX * NY * NZ * SH_COUNT * 4);
  const pixels = new Float32Array(CUBE_SIZE * CUBE_SIZE * 4);
  const cube = new THREE.WebGLCubeRenderTarget(CUBE_SIZE, {
    type: THREE.FloatType,
    format: THREE.RGBAFormat,
    colorSpace: THREE.LinearSRGBColorSpace,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    generateMipmaps: false,
    depthBuffer: true,
  });
  const camera = new THREE.CubeCamera(0.025, 50, cube);
  camera.layers.set(1);
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshPhysicalMaterial({ color: "#e6def5", roughness: 0.75, metalness: 0 }),
  );
  floor.name = "TV irradiance capture floor";
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.002;
  floor.receiveShadow = true;
  floor.layers.set(1);
  scene.add(floor);

  // Keep capture visibility independent of the normal camera's layer 0.
  const layerMasks = new Map<THREE.Object3D, number>();
  const enableCapture = (object: THREE.Object3D) => {
    if (!layerMasks.has(object)) layerMasks.set(object, object.layers.mask);
    object.layers.enable(1);
  };
  tv.group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    if (materials.some(material => material instanceof THREE.MeshPhysicalMaterial)) enableCapture(object);
  });
  scene.traverse((object) => { if (object instanceof THREE.Light) enableCapture(object); });

  const localPoint = new THREE.Vector3();
  const direction = new THREE.Vector3();
  const basis = new Array<number>(SH_COUNT).fill(0);
  const coefficients = Array.from({ length: SH_COUNT }, () => new THREE.Vector3());
  let next = 0;
  let disposed = false;

  function updateTransform() {
    tv.group.updateWorldMatrix(true, true);
    uniforms.uIndirectWorldToLocal.value.copy(tv.group.matrixWorld).invert();
  }

  function integrateProbe() {
    for (const coefficient of coefficients) coefficient.set(0, 0, 0);
    let totalWeight = 0;
    const pixelSize = 2 / CUBE_SIZE;
    // This is LightProbeGenerator.fromCubeRenderTarget's WebGL face layout.
    // Reading synchronously keeps a capture and its growth state atomic.
    for (let face = 0; face < 6; face++) {
      gl.readRenderTargetPixels(cube, 0, 0, CUBE_SIZE, CUBE_SIZE, pixels, face);
      for (let pixel = 0; pixel < CUBE_SIZE * CUBE_SIZE; pixel++) {
        const col = -1 + (pixel % CUBE_SIZE + 0.5) * pixelSize;
        const row = 1 - (Math.floor(pixel / CUBE_SIZE) + 0.5) * pixelSize;
        switch (face) {
          case 0: direction.set(1, row, -col); break;
          case 1: direction.set(-1, row, col); break;
          case 2: direction.set(col, 1, -row); break;
          case 3: direction.set(col, -1, row); break;
          case 4: direction.set(col, row, 1); break;
          default: direction.set(-col, row, -1); break;
        }
        const lengthSq = direction.lengthSq();
        const weight = 4 / (Math.sqrt(lengthSq) * lengthSq);
        totalWeight += weight;
        direction.transformDirection(uniforms.uIndirectWorldToLocal.value);
        THREE.SphericalHarmonics3.getBasisAt(direction, basis);
        const offset = pixel * 4;
        const r = pixels[offset];
        const g = pixels[offset + 1];
        const b = pixels[offset + 2];
        for (let k = 0; k < SH_COUNT; k++) {
          const weightedBasis = basis[k] * weight;
          coefficients[k].x += r * weightedBasis;
          coefficients[k].y += g * weightedBasis;
          coefficients[k].z += b * weightedBasis;
        }
      }
    }
    const normalization = 4 * Math.PI / totalWeight;
    const x = next % NX;
    const y = Math.floor(next / NX) % NY;
    const z = Math.floor(next / (NX * NY));
    for (let k = 0; k < SH_COUNT; k++) {
      const offset = (((k * NZ + z) * NY + y) * NX + x) * 4;
      staging[offset] = coefficients[k].x * normalization;
      staging[offset + 1] = coefficients[k].y * normalization;
      staging[offset + 2] = coefficients[k].z * normalization;
      staging[offset + 3] = 1;
    }
  }

  return {
    uniforms,
    /** One 16px six-face capture per call. True after all 36 probes commit. */
    step(): boolean {
      if (disposed) return false;
      updateTransform();
      if (next >= PROBE_COUNT) return true;
      const target = gl.getRenderTarget();
      const face = gl.getActiveCubeFace();
      const mipmap = gl.getActiveMipmapLevel();
      const toneMapping = gl.toneMapping;
      const autoClear = gl.autoClear;
      const background = scene.background;
      const backgroundIntensity = scene.backgroundIntensity;
      const shadowAutoUpdate = gl.shadowMap.autoUpdate;
      const shadowNeedsUpdate = gl.shadowMap.needsUpdate;
      const xrEnabled = gl.xr.enabled;
      const previousCapture = uniforms.uIndirectCapture.value;
      try {
        uniforms.uIndirectCapture.value = 1;
        scene.background = radiance;
        scene.backgroundIntensity = scene.environmentIntensity;
        gl.toneMapping = THREE.NoToneMapping;
        gl.autoClear = true;
        gl.shadowMap.autoUpdate = false;
        gl.shadowMap.needsUpdate = false;
        localPoint.set(
          MIN.x + EXTENT.x * (next % NX) / (NX - 1),
          MIN.y + EXTENT.y * (Math.floor(next / NX) % NY) / (NY - 1),
          MIN.z + EXTENT.z * Math.floor(next / (NX * NY)) / (NZ - 1),
        );
        camera.position.copy(localPoint).applyMatrix4(tv.group.matrixWorld);
        camera.update(gl, scene);
        integrateProbe();
        next++;
        if (next === PROBE_COUNT) {
          const destination = volume.image.data as Uint16Array;
          for (let i = 0; i < staging.length; i++) destination[i] = THREE.DataUtils.toHalfFloat(staging[i]);
          volume.needsUpdate = true;
        }
        return next === PROBE_COUNT;
      } finally {
        uniforms.uIndirectCapture.value = previousCapture;
        scene.background = background;
        scene.backgroundIntensity = backgroundIntensity;
        gl.toneMapping = toneMapping;
        gl.autoClear = autoClear;
        gl.shadowMap.autoUpdate = shadowAutoUpdate;
        gl.shadowMap.needsUpdate = shadowNeedsUpdate;
        gl.xr.enabled = xrEnabled;
        gl.setRenderTarget(target, face, mipmap);
      }
    },
    reset() {
      next = 0;
      uniforms.uIndirectMix.value = 0;
      updateTransform();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const [object, mask] of layerMasks) object.layers.mask = mask;
      floor.removeFromParent();
      floor.geometry.dispose();
      floor.material.dispose();
      cube.dispose();
      volume.dispose();
    },
  };
}
