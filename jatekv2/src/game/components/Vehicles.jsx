import { useMemo } from "react";
import * as THREE from "three";
import { useGameStore } from "../state/useGameStore.js";

function createVehiclePaintTexture(baseColor, stripeColor) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  context.fillStyle = baseColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = stripeColor;
  context.fillRect(0, 104, canvas.width, 18);
  context.fillRect(0, 134, canvas.width, 8);

  for (let index = 0; index < 180; index += 1) {
    context.fillStyle = `rgba(255, 255, 255, ${0.03 + Math.random() * 0.09})`;
    context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 1);
  texture.anisotropy = 4;
  return texture;
}

function VehicleMesh({ vehicle }) {
  const worldTime = useGameStore((state) => state.worldTime);
  const lightsOn = worldTime >= 19 || worldTime < 6;
  const dimensions =
    vehicle.type === "bike"
      ? { color: "#ff884d", stripe: "#ffe0a8" }
      : { color: "#66d7ff", stripe: "#f7fbff" };
  const paintTexture = useMemo(
    () => createVehiclePaintTexture(dimensions.color, dimensions.stripe),
    [dimensions.color, dimensions.stripe]
  );

  if (vehicle.type === "bike") {
    return <BikeMesh vehicle={vehicle} paintTexture={paintTexture} lightsOn={lightsOn} />;
  }

  return <CarMesh vehicle={vehicle} paintTexture={paintTexture} lightsOn={lightsOn} />;
}

function Wheel({ x, z, radius = 0.42 }) {
  return (
    <group position={[x, radius, z]} rotation-z={Math.PI / 2}>
      <mesh castShadow>
        <cylinderGeometry args={[radius, radius, 0.34, 24]} />
        <meshStandardMaterial color="#090b10" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, 0.18]}>
        <cylinderGeometry args={[radius * 0.42, radius * 0.42, 0.04, 16]} />
        <meshStandardMaterial color="#aeb8c4" metalness={0.72} roughness={0.28} />
      </mesh>
    </group>
  );
}

function CarMesh({ vehicle, paintTexture, lightsOn }) {
  return (
    <group position={[vehicle.x, vehicle.y, vehicle.z]} rotation={[0, vehicle.rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.84, 0]}>
        <boxGeometry args={[2.25, 0.82, 4.55]} />
        <meshStandardMaterial map={paintTexture} color="#ffffff" metalness={0.36} roughness={0.32} />
      </mesh>
      <mesh castShadow receiveShadow position={[0, 1.34, -0.28]}>
        <boxGeometry args={[1.72, 0.72, 2.08]} />
        <meshStandardMaterial color="#2c3340" metalness={0.24} roughness={0.22} />
      </mesh>
      <mesh castShadow position={[0, 1.76, -0.28]}>
        <boxGeometry args={[1.42, 0.16, 1.64]} />
        <meshStandardMaterial color="#66d7ff" metalness={0.34} roughness={0.26} />
      </mesh>
      <mesh position={[0, 1.36, 0.84]} rotation-x={-0.34}>
        <boxGeometry args={[1.48, 0.06, 0.78]} />
        <meshStandardMaterial color="#101722" transparent opacity={0.78} roughness={0.18} />
      </mesh>
      <mesh position={[0, 1.35, -1.42]} rotation-x={0.3}>
        <boxGeometry args={[1.48, 0.06, 0.72]} />
        <meshStandardMaterial color="#101722" transparent opacity={0.82} roughness={0.18} />
      </mesh>
      <mesh castShadow position={[0, 0.58, 2.44]}>
        <boxGeometry args={[2.42, 0.32, 0.28]} />
        <meshStandardMaterial color="#151a22" metalness={0.25} roughness={0.48} />
      </mesh>
      <mesh castShadow position={[0, 0.58, -2.44]}>
        <boxGeometry args={[2.42, 0.32, 0.28]} />
        <meshStandardMaterial color="#151a22" metalness={0.25} roughness={0.48} />
      </mesh>
      {[-0.62, 0.62].map((x) => (
        <mesh key={`head-${x}`} position={[x, 0.86, -2.61]}>
          <boxGeometry args={[0.42, 0.18, 0.08]} />
          <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={lightsOn ? 1.8 : 0.2} />
        </mesh>
      ))}
      {[-0.68, 0.68].map((x) => (
        <mesh key={`tail-${x}`} position={[x, 0.88, 2.61]}>
          <boxGeometry args={[0.36, 0.18, 0.08]} />
          <meshStandardMaterial color="#ff5263" emissive="#ff5263" emissiveIntensity={lightsOn ? 1.15 : 0.32} />
        </mesh>
      ))}
      <Wheel x={0.96} z={1.42} />
      <Wheel x={-0.96} z={1.42} />
      <Wheel x={0.96} z={-1.42} />
      <Wheel x={-0.96} z={-1.42} />
    </group>
  );
}

function BikeMesh({ vehicle, paintTexture, lightsOn }) {
  return (
    <group position={[vehicle.x, vehicle.y, vehicle.z]} rotation={[0, vehicle.rotation, 0]}>
      <mesh castShadow receiveShadow position={[0, 0.92, 0]}>
        <boxGeometry args={[0.72, 0.42, 1.9]} />
        <meshStandardMaterial map={paintTexture} color="#ffffff" metalness={0.42} roughness={0.36} />
      </mesh>
      <mesh castShadow position={[0, 1.24, -0.2]}>
        <boxGeometry args={[0.48, 0.18, 0.82]} />
        <meshStandardMaterial color="#1d2129" roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, 1.42, 0.25]} rotation-x={0.45}>
        <boxGeometry args={[0.7, 0.12, 0.3]} />
        <meshStandardMaterial color="#202732" roughness={0.42} />
      </mesh>
      <mesh castShadow position={[0, 0.74, 0]}>
        <boxGeometry args={[0.16, 0.18, 2.55]} />
        <meshStandardMaterial color="#11161d" metalness={0.5} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.98, -1.24]}>
        <sphereGeometry args={[0.12, 12, 8]} />
        <meshStandardMaterial color="#fff3b0" emissive="#fff3b0" emissiveIntensity={lightsOn ? 1.5 : 0.1} />
      </mesh>
      <Wheel x={0} z={1.08} radius={0.34} />
      <Wheel x={0} z={-1.08} radius={0.34} />
    </group>
  );
}

export function Vehicles() {
  const vehicles = useGameStore((state) => state.vehicles);

  return (
    <>
      {vehicles.map((vehicle) => (
        <VehicleMesh key={vehicle.id} vehicle={vehicle} />
      ))}
    </>
  );
}
