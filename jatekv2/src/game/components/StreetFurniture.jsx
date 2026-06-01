import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../state/useGameStore.js";

function flickerForLamp(lampId, worldTime) {
  let hash = 0;
  for (let index = 0; index < lampId.length; index += 1) {
    hash = (hash * 31 + lampId.charCodeAt(index)) >>> 0;
  }

  const faulty = hash % 4 === 0;
  if (!faulty) {
    return 1;
  }

  const pulse = Math.sin(worldTime * 21 + hash * 0.01) * Math.sin(worldTime * 73 + hash * 0.03);
  return pulse > 0.28 ? 0.18 : 1;
}

export function StreetFurniture({ roads = [], shop }) {
  const worldTime = useGameStore((state) => state.worldTime);
  const lightRefreshRef = useRef(0);
  const [litLampIds, setLitLampIds] = useState(() => new Set());
  const isNight = worldTime >= 19 || worldTime < 6;
  const lamps = useMemo(
    () =>
      roads.flatMap((road) => {
        const horizontal = road.width >= road.depth;
        const longSize = horizontal ? road.width : road.depth;
        const count = Math.max(2, Math.floor(longSize / 52));
        const sideOffset = (horizontal ? road.depth : road.width) / 2 + 4.8;

        return Array.from({ length: count }).flatMap((_, index) => {
          const along = -longSize / 2 + ((index + 0.5) / count) * longSize;
          const baseX = horizontal ? road.x + along : road.x;
          const baseZ = horizontal ? road.z : road.z + along;

          return [-1, 1].map((side) => ({
            id: `lamp-${road.id}-${index}-${side}`,
            x: horizontal ? baseX : baseX + side * sideOffset,
            z: horizontal ? baseZ + side * sideOffset : baseZ,
          }));
        });
      }),
    [roads]
  );

  useFrame((state) => {
    if (state.clock.elapsedTime < lightRefreshRef.current) {
      return;
    }

    lightRefreshRef.current = state.clock.elapsedTime + 0.85;

    if (!isNight) {
      setLitLampIds((current) => (current.size ? new Set() : current));
      return;
    }

    const playerPosition = useGameStore.getState().player.position;
    const nextLitLampIds = new Set(
      [...lamps]
        .sort(
          (a, b) => {
            const distanceA = (a.x - playerPosition.x) ** 2 + (a.z - playerPosition.z) ** 2;
            const distanceB = (b.x - playerPosition.x) ** 2 + (b.z - playerPosition.z) ** 2;
            return distanceA - distanceB;
          }
        )
        .slice(0, 8)
        .map((lamp) => lamp.id)
    );

    setLitLampIds(nextLitLampIds);
  });

  return (
    <group>
      {lamps.map((lamp) => {
        const lightIntensity = litLampIds.has(lamp.id) ? 1.1 * flickerForLamp(lamp.id, worldTime) : 0;

        return (
        <group key={lamp.id} position={[lamp.x, 0, lamp.z]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.08, 0.1, 5, 8]} />
            <meshStandardMaterial color="#535c68" />
          </mesh>
          <mesh position={[0, 5.15, 0]}>
            <sphereGeometry args={[0.16, 12, 12]} />
            <meshStandardMaterial
              color={isNight ? "#ffd7a0" : "#7d858e"}
              emissive="#ffd7a0"
              emissiveIntensity={lightIntensity > 0 ? lightIntensity : 0}
            />
          </mesh>
          {lightIntensity > 0 ? (
            <pointLight color="#ffd7a0" intensity={lightIntensity} distance={14} decay={2} position={[0, 4.9, 0]} />
          ) : null}
        </group>
        );
      })}

      {shop ? (
        <mesh position={[shop.x, 2.2, shop.z]}>
          <boxGeometry args={[4.8, 1, 0.3]} />
          <meshStandardMaterial color="#3effb2" emissive="#3effb2" emissiveIntensity={1} />
        </mesh>
      ) : null}
    </group>
  );
}
