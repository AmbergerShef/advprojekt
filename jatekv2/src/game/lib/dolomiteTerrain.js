import * as THREE from "three";

const GRADIENTS = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0, 1],
  [0, -1],
];

const DEFAULT_SEED = 59371;
const DEFAULT_RESOLUTION = 256;
const TERRAIN_MAX_HEIGHT = 82;
const NOISE_CACHE = new Map();

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(a, b, t) {
  return a * (1 - t) + b * t;
}

function mixColor(a, b, t) {
  return [
    mix(a[0], b[0], t),
    mix(a[1], b[1], t),
    mix(a[2], b[2], t),
  ];
}

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createSimplexNoise(seed = DEFAULT_SEED) {
  const random = seededRandom(seed);
  const source = Array.from({ length: 256 }, (_, index) => index);

  for (let index = source.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [source[index], source[swapIndex]] = [source[swapIndex], source[index]];
  }

  const permutation = new Uint8Array(512);
  for (let index = 0; index < 512; index += 1) {
    permutation[index] = source[index & 255];
  }

  return (xin, yin) => {
    const f2 = 0.5 * (Math.sqrt(3) - 1);
    const g2 = (3 - Math.sqrt(3)) / 6;
    const s = (xin + yin) * f2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * g2;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const i1 = x0 > y0 ? 1 : 0;
    const j1 = x0 > y0 ? 0 : 1;
    const x1 = x0 - i1 + g2;
    const y1 = y0 - j1 + g2;
    const x2 = x0 - 1 + 2 * g2;
    const y2 = y0 - 1 + 2 * g2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = permutation[ii + permutation[jj]] % 12;
    const gi1 = permutation[ii + i1 + permutation[jj + j1]] % 12;
    const gi2 = permutation[ii + 1 + permutation[jj + 1]] % 12;
    let n0 = 0;
    let n1 = 0;
    let n2 = 0;

    let contribution = 0.5 - x0 * x0 - y0 * y0;
    if (contribution > 0) {
      contribution *= contribution;
      n0 = contribution * contribution * (GRADIENTS[gi0][0] * x0 + GRADIENTS[gi0][1] * y0);
    }

    contribution = 0.5 - x1 * x1 - y1 * y1;
    if (contribution > 0) {
      contribution *= contribution;
      n1 = contribution * contribution * (GRADIENTS[gi1][0] * x1 + GRADIENTS[gi1][1] * y1);
    }

    contribution = 0.5 - x2 * x2 - y2 * y2;
    if (contribution > 0) {
      contribution *= contribution;
      n2 = contribution * contribution * (GRADIENTS[gi2][0] * x2 + GRADIENTS[gi2][1] * y2);
    }

    return 70 * (n0 + n1 + n2);
  };
}

function getNoise(seed = DEFAULT_SEED) {
  if (!NOISE_CACHE.has(seed)) {
    NOISE_CACHE.set(seed, createSimplexNoise(seed));
  }

  return NOISE_CACHE.get(seed);
}

function fbm(noise, x, y, octaves = 6, lacunarity = 2.02, gain = 0.5) {
  let value = 0;
  let amplitude = 0.5;
  let frequency = 1;
  let normalizer = 0;

  for (let octave = 0; octave < octaves; octave += 1) {
    value += noise(x * frequency, y * frequency) * amplitude;
    normalizer += amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }

  return value / normalizer;
}

function ridgedFbm(noise, x, y, octaves = 7) {
  let value = 0;
  let amplitude = 0.55;
  let frequency = 1;
  let normalizer = 0;
  let ridgeMemory = 1;

  for (let octave = 0; octave < octaves; octave += 1) {
    let ridge = 1 - Math.abs(noise(x * frequency, y * frequency));
    ridge *= ridge;
    ridge *= ridgeMemory;
    ridgeMemory = ridge;
    value += ridge * amplitude;
    normalizer += amplitude;
    frequency *= 2.08;
    amplitude *= 0.54;
  }

  return clamp(value / normalizer);
}

function hash2(ix, iy, seed = DEFAULT_SEED) {
  let hash = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 1442695041);
  hash = Math.imul(hash ^ (hash >>> 13), 1274126177);
  return ((hash ^ (hash >>> 16)) >>> 0) / 4294967296;
}

function cellular(x, y, seed = DEFAULT_SEED) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  let f1 = Infinity;
  let f2 = Infinity;

  for (let oy = -1; oy <= 1; oy += 1) {
    for (let ox = -1; ox <= 1; ox += 1) {
      const cx = ix + ox;
      const cy = iy + oy;
      const jitterX = hash2(cx, cy, seed) * 0.82 + 0.09;
      const jitterY = hash2(cx + 19, cy - 31, seed + 7919) * 0.82 + 0.09;
      const dx = cx + jitterX - x;
      const dy = cy + jitterY - y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < f1) {
        f2 = f1;
        f1 = distance;
      } else if (distance < f2) {
        f2 = distance;
      }
    }
  }

  return { f1, f2 };
}

function playableMask(x, z, bounds) {
  const protectedHalfWidth = bounds.width * 0.5 + 28;
  const protectedHalfDepth = bounds.depth * 0.5 + 28;
  const dx = Math.max(0, Math.abs(x) - protectedHalfWidth);
  const dz = Math.max(0, Math.abs(z) - protectedHalfDepth);
  const distanceFromPlayableArea = Math.hypot(dx, dz);
  return smoothstep(0, 230, distanceFromPlayableArea);
}

export function sampleDolomiteHeight01(x, z, bounds, seed = DEFAULT_SEED) {
  const noise = getNoise(seed);
  const mountainMask = playableMask(x, z, bounds);

  if (mountainMask <= 0.0001) {
    return 0;
  }

  const warpX = fbm(noise, x * 0.0062 + 17.4, z * 0.0062 - 5.8, 4, 2.05, 0.52);
  const warpZ = fbm(noise, x * 0.0062 - 23.1, z * 0.0062 + 11.2, 4, 2.05, 0.52);
  const wx = x + warpX * 48;
  const wz = z + warpZ * 48;
  const broad = (fbm(noise, wx * 0.0022 - 12.8, wz * 0.0022 + 4.1, 6, 1.92, 0.56) + 1) * 0.5;
  const ridge = ridgedFbm(noise, wx * 0.0047 + 9.7, wz * 0.0047 - 3.5, 8);
  const chisel = (fbm(noise, wx * 0.027, wz * 0.027, 4, 2.14, 0.46) + 1) * 0.5;
  const cells = cellular(wx * 0.035, wz * 0.035, seed);
  const cellEdge = cells.f2 - cells.f1;
  const fracture = 1 - smoothstep(0.028, 0.18, cellEdge);
  const block = smoothstep(0.18, 0.78, 1 - cells.f1);
  const ridgeMass = Math.pow(ridge, 1.42);
  const relief = clamp(0.10 + broad * 0.34 + ridgeMass * 0.48 + chisel * 0.06 + block * 0.08 - fracture * 0.06);
  const peakLift = smoothstep(0.58, 0.96, ridgeMass) * 0.12;
  const talus = smoothstep(0.18, 0.72, broad) * 0.06;

  return clamp(mountainMask * Math.pow(relief + peakLift + talus, 1.08));
}

export function sampleDolomiteHeight(x, z, bounds, seed = DEFAULT_SEED) {
  return sampleDolomiteHeight01(x, z, bounds, seed) * TERRAIN_MAX_HEIGHT;
}

export function sampleDolomiteSurfaceColor(x, z, bounds, seed = DEFAULT_SEED) {
  const height01 = sampleDolomiteHeight01(x, z, bounds, seed);
  const heightStep = 4;
  const left = sampleDolomiteHeight01(x - heightStep, z, bounds, seed);
  const right = sampleDolomiteHeight01(x + heightStep, z, bounds, seed);
  const down = sampleDolomiteHeight01(x, z - heightStep, bounds, seed);
  const up = sampleDolomiteHeight01(x, z + heightStep, bounds, seed);
  const slope = clamp(
    Math.hypot((right - left) * TERRAIN_MAX_HEIGHT, (up - down) * TERRAIN_MAX_HEIGHT) / (heightStep * 2)
  );
  const noise = getNoise(seed + 313);
  const grain = (fbm(noise, x * 0.055, z * 0.055, 4, 2.1, 0.48) + 1) * 0.5;
  const cells = cellular(x * 0.045, z * 0.045, seed + 101);
  const fracture = 1 - smoothstep(0.025, 0.16, cells.f2 - cells.f1);
  const valley = [0.13, 0.27, 0.13];
  const grass = [0.31, 0.47, 0.18];
  const forest = [0.10, 0.22, 0.10];
  const earth = [0.43, 0.32, 0.20];
  const limestone = [0.68, 0.66, 0.58];
  const ochre = [0.76, 0.55, 0.32];
  const snow = [0.90, 0.91, 0.86];
  let color = mixColor(valley, grass, smoothstep(0.00, 0.20, height01));
  color = mixColor(color, forest, smoothstep(0.12, 0.38, height01) * (1 - smoothstep(0.48, 0.68, slope)));
  color = mixColor(color, earth, smoothstep(0.22, 0.48, height01));
  color = mixColor(color, limestone, smoothstep(0.38, 0.72, height01) + smoothstep(0.24, 0.56, slope) * 0.52);
  color = mixColor(color, ochre, smoothstep(0.46, 0.74, height01) * 0.36);
  color = mixColor(color, snow, smoothstep(0.78, 0.96, height01) * (1 - smoothstep(0.30, 0.72, slope)));

  const shade = 0.78 + grain * 0.28 - fracture * 0.18 + slope * 0.08;
  return color.map((channel) => clamp(channel * shade, 0, 1));
}

export function getDolomiteTerrainMetrics(bounds) {
  return {
    width: Math.max(bounds.width * 2.65, 860),
    depth: Math.max(bounds.depth * 3.05, 820),
    maxHeight: TERRAIN_MAX_HEIGHT,
  };
}

export function getDolomiteWalkableBounds(bounds) {
  const terrain = getDolomiteTerrainMetrics(bounds);
  return {
    width: terrain.width,
    depth: terrain.depth,
  };
}

function createTexture(data, size, colorSpace = THREE.NoColorSpace) {
  const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.UnsignedByteType);
  texture.colorSpace = colorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

function createDetailAlbedoTexture(seed = DEFAULT_SEED) {
  const size = 512;
  const data = new Uint8Array(size * size * 4);
  const noise = createSimplexNoise(seed + 101);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const nx = x / size;
      const ny = y / size;
      const grain = (fbm(noise, nx * 26, ny * 26, 5, 2.1, 0.48) + 1) * 0.5;
      const vein = Math.abs(noise(nx * 52 + 4.2, ny * 9 - 2.7));
      const fiber = Math.abs(noise(nx * 11 - ny * 3, ny * 31 + 8.1));
      const cool = grain * 18 + vein * 12;
      const warm = fiber * 10;

      data[index] = clamp(204 + warm - cool, 0, 255);
      data[index + 1] = clamp(207 + grain * 16 - vein * 18, 0, 255);
      data[index + 2] = clamp(195 + grain * 12 - fiber * 10, 0, 255);
      data[index + 3] = 255;
    }
  }

  const texture = createTexture(data, size, THREE.SRGBColorSpace);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.generateMipmaps = true;
  texture.anisotropy = 6;
  return texture;
}

export function buildDolomiteTerrain(bounds, options = {}) {
  const seed = options.seed || DEFAULT_SEED;
  const resolution = options.resolution || DEFAULT_RESOLUTION;
  const terrainMetrics = getDolomiteTerrainMetrics(bounds);
  const terrainWidth = terrainMetrics.width;
  const terrainDepth = terrainMetrics.depth;
  const heightValues = new Float32Array(resolution * resolution);
  const heightData = new Uint8Array(resolution * resolution * 4);
  const colorData = new Uint8Array(resolution * resolution * 4);
  const normalData = new Uint8Array(resolution * resolution * 4);
  const roughnessData = new Uint8Array(resolution * resolution * 4);
  const meterPerTexelX = terrainWidth / (resolution - 1);
  const meterPerTexelZ = terrainDepth / (resolution - 1);

  for (let y = 0; y < resolution; y += 1) {
    const v = y / (resolution - 1);
    const worldZ = (v - 0.5) * terrainDepth;

    for (let x = 0; x < resolution; x += 1) {
      const u = x / (resolution - 1);
      const worldX = (u - 0.5) * terrainWidth;
      const value = sampleDolomiteHeight01(worldX, worldZ, bounds, seed);
      const index = y * resolution + x;
      const rgbaIndex = index * 4;
      const encoded = Math.round(clamp(value) * 255);

      heightValues[index] = value;
      heightData[rgbaIndex] = encoded;
      heightData[rgbaIndex + 1] = encoded;
      heightData[rgbaIndex + 2] = encoded;
      heightData[rgbaIndex + 3] = 255;
    }
  }

  for (let y = 0; y < resolution; y += 1) {
    for (let x = 0; x < resolution; x += 1) {
      const index = y * resolution + x;
      const rgbaIndex = index * 4;
      const left = heightValues[y * resolution + Math.max(0, x - 1)];
      const right = heightValues[y * resolution + Math.min(resolution - 1, x + 1)];
      const down = heightValues[Math.max(0, y - 1) * resolution + x];
      const up = heightValues[Math.min(resolution - 1, y + 1) * resolution + x];
      const dx = ((right - left) * TERRAIN_MAX_HEIGHT) / (meterPerTexelX * 2);
      const dz = ((up - down) * TERRAIN_MAX_HEIGHT) / (meterPerTexelZ * 2);
      const normal = new THREE.Vector3(-dx * 0.78, -dz * 0.78, 1).normalize();
      const upness = 1 / Math.sqrt(1 + dx * dx + dz * dz);
      const slope = 1 - upness;
      const height = heightValues[index];
      const v = y / (resolution - 1);
      const u = x / (resolution - 1);
      const worldX = (u - 0.5) * terrainWidth;
      const worldZ = (v - 0.5) * terrainDepth;
      const color = sampleDolomiteSurfaceColor(worldX, worldZ, bounds, seed);
      const snow = smoothstep(0.78, 0.96, height) * (1 - smoothstep(0.34, 0.76, slope));
      const roughness = clamp(0.72 + slope * 0.24 + height * 0.05 - snow * 0.14);
      const encodedRoughness = Math.round(roughness * 255);

      normalData[rgbaIndex] = Math.round((normal.x * 0.5 + 0.5) * 255);
      normalData[rgbaIndex + 1] = Math.round((normal.y * 0.5 + 0.5) * 255);
      normalData[rgbaIndex + 2] = Math.round((normal.z * 0.5 + 0.5) * 255);
      normalData[rgbaIndex + 3] = 255;

      colorData[rgbaIndex] = Math.round(color[0] * 255);
      colorData[rgbaIndex + 1] = Math.round(color[1] * 255);
      colorData[rgbaIndex + 2] = Math.round(color[2] * 255);
      colorData[rgbaIndex + 3] = 255;

      roughnessData[rgbaIndex] = encodedRoughness;
      roughnessData[rgbaIndex + 1] = encodedRoughness;
      roughnessData[rgbaIndex + 2] = encodedRoughness;
      roughnessData[rgbaIndex + 3] = 255;
    }
  }

  const albedoMap = createDetailAlbedoTexture(seed);
  albedoMap.repeat.set(terrainWidth / 46, terrainDepth / 46);

  return {
    width: terrainWidth,
    depth: terrainDepth,
    maxHeight: TERRAIN_MAX_HEIGHT,
    segments: 128,
    resolution,
    displacementBias: 0,
    heightMap: createTexture(heightData, resolution),
    colorMap: createTexture(colorData, resolution, THREE.SRGBColorSpace),
    normalMap: createTexture(normalData, resolution),
    roughnessMap: createTexture(roughnessData, resolution),
    albedoMap,
    texelSize: new THREE.Vector2(1 / (resolution - 1), 1 / (resolution - 1)),
    worldSize: new THREE.Vector2(terrainWidth, terrainDepth),
  };
}

export function disposeDolomiteTerrain(terrain) {
  terrain.heightMap.dispose();
  terrain.colorMap.dispose();
  terrain.normalMap.dispose();
  terrain.roughnessMap.dispose();
  terrain.albedoMap.dispose();
}

export function enhanceDolomiteTerrainShader(shader, terrain) {
  shader.uniforms.uTerrainHeightMap = { value: terrain.heightMap };
  shader.uniforms.uTerrainMaxHeight = { value: terrain.maxHeight };
  shader.uniforms.uTerrainTexel = { value: terrain.texelSize };
  shader.uniforms.uTerrainWorldSize = { value: terrain.worldSize };

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
      #include <common>
      uniform sampler2D uTerrainHeightMap;
      uniform float uTerrainMaxHeight;
      uniform vec2 uTerrainTexel;
      uniform vec2 uTerrainWorldSize;

      float terrainSaturate(float value) {
        return clamp(value, 0.0, 1.0);
      }

      float terrainUpness(vec2 uv) {
        float left = texture2D(uTerrainHeightMap, uv - vec2(uTerrainTexel.x, 0.0)).r;
        float right = texture2D(uTerrainHeightMap, uv + vec2(uTerrainTexel.x, 0.0)).r;
        float down = texture2D(uTerrainHeightMap, uv - vec2(0.0, uTerrainTexel.y)).r;
        float up = texture2D(uTerrainHeightMap, uv + vec2(0.0, uTerrainTexel.y)).r;
        float dx = ((right - left) * uTerrainMaxHeight) / (uTerrainTexel.x * uTerrainWorldSize.x * 2.0);
        float dz = ((up - down) * uTerrainMaxHeight) / (uTerrainTexel.y * uTerrainWorldSize.y * 2.0);
        return inversesqrt(1.0 + dx * dx + dz * dz);
      }

      vec3 dolomiteGradient(float height01) {
        vec3 valley = vec3(0.08, 0.20, 0.12);
        vec3 meadow = vec3(0.30, 0.50, 0.20);
        vec3 forest = vec3(0.17, 0.28, 0.13);
        vec3 earth = vec3(0.38, 0.30, 0.20);
        vec3 limestone = vec3(0.62, 0.61, 0.56);
        vec3 ochre = vec3(0.78, 0.57, 0.34);
        vec3 snow = vec3(0.92, 0.93, 0.88);

        vec3 color = mix(valley, meadow, smoothstep(0.02, 0.20, height01));
        color = mix(color, forest, smoothstep(0.16, 0.46, height01));
        color = mix(color, earth, smoothstep(0.27, 0.54, height01));
        color = mix(color, limestone, smoothstep(0.44, 0.78, height01));
        color = mix(color, ochre, smoothstep(0.50, 0.76, height01) * (1.0 - smoothstep(0.78, 0.95, height01)));
        color = mix(color, snow, smoothstep(0.80, 0.98, height01));
        return color;
      }
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <color_fragment>",
    `
      #include <color_fragment>
      float terrainHeight01 = terrainSaturate(texture2D(uTerrainHeightMap, vUv).r);
      float terrainSlope = 1.0 - terrainUpness(vUv);
      vec3 heightColor = dolomiteGradient(terrainHeight01);
      vec3 rockColor = mix(vec3(0.34, 0.31, 0.27), vec3(0.76, 0.72, 0.64), terrainHeight01);
      float rockMix = terrainSaturate(smoothstep(0.18, 0.58, terrainSlope) + smoothstep(0.45, 0.74, terrainHeight01) * 0.34);
      float snowCap = smoothstep(0.78, 0.94, terrainHeight01) * (1.0 - smoothstep(0.36, 0.72, terrainSlope));
      float greenHold = 1.0 - smoothstep(0.18, 0.42, terrainHeight01);
      vec3 splatColor = mix(heightColor, rockColor, rockMix);
      splatColor = mix(splatColor, vec3(0.15, 0.33, 0.15), greenHold * (1.0 - rockMix) * 0.28);
      splatColor = mix(splatColor, vec3(0.92, 0.93, 0.88), snowCap);
      diffuseColor.rgb = mix(diffuseColor.rgb, splatColor, 0.74) * (1.0 - terrainSlope * 0.06);
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <roughnessmap_fragment>",
    `
      #include <roughnessmap_fragment>
      float terrainHeightForRoughness = terrainSaturate(texture2D(uTerrainHeightMap, vUv).r);
      float terrainSlopeForRoughness = 1.0 - terrainUpness(vUv);
      roughnessFactor = clamp(
        roughnessFactor + terrainSlopeForRoughness * 0.16 - smoothstep(0.82, 0.96, terrainHeightForRoughness) * 0.08,
        0.54,
        1.0
      );
    `
  );
}
