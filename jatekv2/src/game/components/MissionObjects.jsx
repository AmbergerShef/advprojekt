import { useEffect } from "react";
import { Html } from "@react-three/drei";
import { sampleDolomiteHeight } from "../lib/dolomiteTerrain.js";
import { useGameStore } from "../state/useGameStore.js";

function Pickup({ pickup, index, isMissionActive }) {
  if (!pickup.active) {
    return null;
  }

  const beaconColor = isMissionActive ? "#ffcf52" : "#ffe48b";

  return (
    <group position={[pickup.x, pickup.y, pickup.z]}>
      {isMissionActive ? (
        <>
          <mesh position={[0, 0.05, 0]} rotation-x={-Math.PI / 2}>
            <ringGeometry args={[1.35, 2.05, 32]} />
            <meshBasicMaterial color={beaconColor} transparent opacity={0.92} />
          </mesh>
          <mesh position={[0, 3.4, 0]}>
            <cylinderGeometry args={[0.08, 0.2, 5.2, 12]} />
            <meshBasicMaterial color={beaconColor} transparent opacity={0.38} />
          </mesh>
        </>
      ) : null}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[1, 0.45, 0.7]} />
        <meshStandardMaterial color="#ffe48b" emissive="#ffcb5f" emissiveIntensity={0.8} />
      </mesh>
      <Html center position={[0, 1.9, 0]} distanceFactor={16}>
        <div style={{ color: "#ffe48b", fontSize: "12px", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          {isMissionActive ? `Cash ${index + 1}/3` : "$"}
        </div>
      </Html>
    </group>
  );
}

function SecretPickup({ pickup, bounds }) {
  if (!pickup.active) {
    return null;
  }

  const y = sampleDolomiteHeight(pickup.x, pickup.z, bounds) + 0.65;

  return (
    <group position={[pickup.x, y, pickup.z]}>
      <mesh castShadow rotation={[0.4, 0.8, 0.2]}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial color="#8fffe0" emissive="#2ee8b8" emissiveIntensity={0.75} roughness={0.34} />
      </mesh>
      <Html center position={[0, 1.15, 0]} distanceFactor={18}>
        <div style={{ color: "#a8ffe8", fontSize: "12px", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.85)" }}>
          ?
        </div>
      </Html>
    </group>
  );
}

export function MissionObjects() {
  const pickups = useGameStore((state) => state.pickups);
  const secretPickups = useGameStore((state) => state.secretPickups);
  const player = useGameStore((state) => state.player);
  const bag = useGameStore((state) => state.bag);
  const activeMissionId = useGameStore((state) => state.activeMissionId);
  const missions = useGameStore((state) => state.missions);
  const collectPickup = useGameStore((state) => state.collectPickup);
  const collectSecretPickup = useGameStore((state) => state.collectSecretPickup);
  const advanceMission = useGameStore((state) => state.advanceMission);
  const takeBag = useGameStore((state) => state.takeBag);
  const maybeResolveMissionProgress = useGameStore((state) => state.maybeResolveMissionProgress);
  const snapshot = useGameStore((state) => state.citySnapshot);
  const courierMarker = snapshot.missionMarkers?.find((marker) => marker.id === "courier") || { x: 78, z: 96 };
  const pickupMission = missions.find((mission) => mission.id === "street-pickup");
  const pickupMissionActive = activeMissionId === "street-pickup" && pickupMission?.state !== "done";

  useEffect(() => {
    if (pickupMissionActive) {
      pickups.forEach((pickup) => {
        if (!pickup.active) {
          return;
        }
        const distance = Math.hypot(player.position.x - pickup.x, player.position.z - pickup.z);
        if (distance < 3.8) {
          collectPickup(pickup.id);
          maybeResolveMissionProgress();
        }
      });
    }

    if (bag.active) {
      const distance = Math.hypot(player.position.x - bag.x, player.position.z - bag.z);
      if (distance < 2.6) {
        takeBag();
        maybeResolveMissionProgress();
      }
    }

    secretPickups.forEach((pickup) => {
      if (!pickup.active) {
        return;
      }
      const distance = Math.hypot(player.position.x - pickup.x, player.position.z - pickup.z);
      if (distance < 3) {
        collectSecretPickup(pickup.id);
      }
    });

    const courierMission = missions.find((mission) => mission.id === "courier-run");
    if (activeMissionId === "courier-run" && courierMission?.started && player.inVehicle === "bike") {
      const goalDistance = Math.hypot(player.position.x - courierMarker.x, player.position.z - courierMarker.z);
      if (goalDistance < 5) {
        advanceMission("courier-run", 1);
        maybeResolveMissionProgress();
      }
    }
  }, [
    activeMissionId,
    advanceMission,
    bag.active,
    bag.x,
    bag.z,
    collectPickup,
    collectSecretPickup,
    courierMarker.x,
    courierMarker.z,
    maybeResolveMissionProgress,
    missions,
    pickupMissionActive,
    pickupMission?.started,
    pickups,
    player.inVehicle,
    player.position.x,
    player.position.z,
    secretPickups,
    takeBag,
  ]);

  return (
    <>
      {pickups.map((pickup, index) => (
        <Pickup key={pickup.id} pickup={pickup} index={index} isMissionActive={pickupMissionActive} />
      ))}
      {secretPickups.map((pickup) => (
        <SecretPickup key={pickup.id} pickup={pickup} bounds={snapshot.bounds} />
      ))}
      {bag.active ? (
        <group position={[bag.x, bag.y, bag.z]}>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.8, 0.55, 0.35]} />
            <meshStandardMaterial color="#be7dff" emissive="#8c46ff" emissiveIntensity={1.2} />
          </mesh>
        </group>
      ) : null}
      {activeMissionId === "courier-run" && missions.find((mission) => mission.id === "courier-run")?.started ? (
        <mesh position={[courierMarker.x, 0.08, courierMarker.z]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[2.8, 4.2, 32]} />
          <meshBasicMaterial color="#66d7ff" />
        </mesh>
      ) : null}
    </>
  );
}
