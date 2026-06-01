import { useMemo, useRef } from "react";
import { Sky } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore } from "../state/useGameStore.js";

function StormCloudDome() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        transparent: true,
        depthWrite: false,
        fog: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
        },
        vertexShader: `
          varying vec3 vWorldDirection;

          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldDirection = normalize(worldPosition.xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vWorldDirection;
          uniform float uTime;

          float hash(vec2 point) {
            point = fract(point * vec2(123.34, 456.21));
            point += dot(point, point + 45.32);
            return fract(point.x * point.y);
          }

          float noise(vec2 point) {
            vec2 cell = floor(point);
            vec2 local = fract(point);
            vec2 curve = local * local * (3.0 - 2.0 * local);
            float a = hash(cell);
            float b = hash(cell + vec2(1.0, 0.0));
            float c = hash(cell + vec2(0.0, 1.0));
            float d = hash(cell + vec2(1.0, 1.0));
            return mix(mix(a, b, curve.x), mix(c, d, curve.x), curve.y);
          }

          float fbm(vec2 point) {
            float value = 0.0;
            float amplitude = 0.5;
            for (int octave = 0; octave < 6; octave++) {
              value += noise(point) * amplitude;
              point *= 2.03;
              amplitude *= 0.52;
            }
            return value;
          }

          void main() {
            vec3 direction = normalize(vWorldDirection);
            float longitude = atan(direction.z, direction.x) / 6.2831853 + 0.5;
            float latitude = asin(clamp(direction.y, -1.0, 1.0)) / 3.1415926 + 0.5;
            vec2 cloudUv = vec2(longitude * 4.2 + uTime * 0.006, latitude * 8.4 - 1.1);
            float cloudBody = fbm(cloudUv);
            float anvils = fbm(cloudUv * vec2(2.1, 0.72) + vec2(12.4, -3.0));
            float cloud = smoothstep(0.42, 0.74, cloudBody + anvils * 0.22);
            float horizonBand = smoothstep(-0.08, 0.18, direction.y) * (1.0 - smoothstep(0.74, 0.96, direction.y));
            float stormWeight = smoothstep(0.36, 0.82, anvils);
            vec3 silver = vec3(0.52, 0.51, 0.49);
            vec3 charcoal = vec3(0.10, 0.11, 0.14);
            vec3 sunsetEdge = vec3(0.80, 0.48, 0.25);
            vec3 color = mix(silver, charcoal, stormWeight);
            color = mix(color, sunsetEdge, smoothstep(0.02, 0.18, direction.y) * 0.28);
            float alpha = cloud * horizonBand * (0.42 + stormWeight * 0.28);
            gl_FragColor = vec4(color, alpha);
          }
        `,
      }),
    []
  );

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <mesh frustumCulled={false} renderOrder={-5}>
      <sphereGeometry args={[760, 32, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function LightingRig() {
  const timeAccumulatorRef = useRef(0);
  const worldTime = useGameStore((state) => state.worldTime);
  const advanceWorldTime = useGameStore((state) => state.advanceWorldTime);
  const nightFactor = worldTime >= 19 || worldTime < 6 ? 1 : worldTime >= 17 ? (worldTime - 17) / 2 : worldTime < 8 ? (8 - worldTime) / 2 : 0;
  const sunIntensity = THREE.MathUtils.lerp(3.28, 0.48, nightFactor);
  const ambientIntensity = THREE.MathUtils.lerp(0.48, 0.22, nightFactor);
  const skyWarmth = nightFactor > 0.5 ? "#26385a" : "#f4caa6";

  useFrame((_, delta) => {
    timeAccumulatorRef.current += delta;
    if (timeAccumulatorRef.current >= 0.5) {
      advanceWorldTime(timeAccumulatorRef.current);
      timeAccumulatorRef.current = 0;
    }
  });

  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[120, 18, 58]}
        inclination={0.42}
        azimuth={0.18}
        turbidity={13}
        rayleigh={3.2}
        mieCoefficient={0.026}
        mieDirectionalG={0.92}
      />
      <StormCloudDome />
      <ambientLight intensity={ambientIntensity} color={skyWarmth} />
      <hemisphereLight intensity={THREE.MathUtils.lerp(0.9, 0.36, nightFactor)} color="#ffc994" groundColor="#2b3540" />
      <directionalLight
        intensity={sunIntensity}
        color="#ffbd66"
        position={[118, 42, 48]}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-230}
        shadow-camera-right={230}
        shadow-camera-top={230}
        shadow-camera-bottom={-230}
        shadow-camera-near={1}
        shadow-camera-far={340}
        shadow-bias={-0.00012}
        shadow-normalBias={0.03}
      />
      <directionalLight intensity={0.24} color="#9eb9dc" position={[-68, 28, -96]} />
    </>
  );
}
