import { useMemo } from "react";
import { useGameStore } from "../state/useGameStore.js";

function percentage(value, max) {
  return `${Math.max(0, Math.min(100, (value / max) * 100))}%`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function missionTarget({ activeMission, civilians, pickups, bag, hostiles, snapshot, player }) {
  if (!activeMission) {
    return null;
  }

  if (!activeMission.started && activeMission.id !== "street-pickup") {
    const contact = civilians.find((npc) => npc.missionId === activeMission.id);
    if (contact) {
      return {
        x: contact.currentX ?? contact.x,
        z: contact.currentZ ?? contact.z,
        label: `Talk to ${contact.name}`,
      };
    }
  }

  if (activeMission.id === "street-pickup") {
    const pickup = pickups
      .map((entry, index) => ({ ...entry, pickupNumber: index + 1 }))
      .filter((entry) => entry.active)
      .sort(
        (a, b) =>
          Math.hypot(player.position.x - a.x, player.position.z - a.z) -
          Math.hypot(player.position.x - b.x, player.position.z - b.z)
      )[0];

    return pickup ? { x: pickup.x, z: pickup.z, label: `Cash ${pickup.pickupNumber}/3` } : null;
  }

  if (activeMission.id === "courier-run") {
    const courierMarker = snapshot.missionMarkers?.find((marker) => marker.id === "courier");
    return courierMarker ? { x: courierMarker.x, z: courierMarker.z, label: "Courier depot" } : null;
  }

  if (activeMission.id === "heat-wave") {
    if (bag.active) {
      return { x: bag.x, z: bag.z, label: "Stolen bag" };
    }

    const nearestHostile = hostiles
      .filter((hostile) => hostile.active && hostile.alive)
      .sort(
        (a, b) =>
          Math.hypot(player.position.x - a.x, player.position.z - a.z) -
          Math.hypot(player.position.x - b.x, player.position.z - b.z)
      )[0];

    return nearestHostile ? { x: nearestHostile.x, z: nearestHostile.z, label: "Hostile crew" } : null;
  }

  return null;
}

export function Hud() {
  const player = useGameStore((state) => state.player);
  const missions = useGameStore((state) => state.missions);
  const pickups = useGameStore((state) => state.pickups);
  const civilians = useGameStore((state) => state.civilians);
  const hostiles = useGameStore((state) => state.hostiles);
  const bag = useGameStore((state) => state.bag);
  const snapshot = useGameStore((state) => state.citySnapshot);
  const objectiveText = useGameStore((state) => state.objectiveText);
  const statusText = useGameStore((state) => state.statusText);
  const interactHint = useGameStore((state) => state.interactHint);
  const activeMissionId = useGameStore((state) => state.activeMissionId);
  const mapLoadState = useGameStore((state) => state.mapLoadState);
  const onlineDataMode = useGameStore((state) => state.onlineDataMode);
  const movementState = useGameStore((state) => state.movementState);

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeMissionId),
    [activeMissionId, missions]
  );

  const target = useMemo(
    () => missionTarget({ activeMission, civilians, pickups, bag, hostiles, snapshot, player }),
    [activeMission, bag, civilians, hostiles, pickups, player, snapshot]
  );
  const targetDistance = target ? Math.round(Math.hypot(player.position.x - target.x, player.position.z - target.z)) : 0;
  const targetMarkerStyle = target
    ? {
        transform: `translate(calc(-50% + ${clamp((target.x - player.position.x) * 0.34, -68, 68)}px), calc(-50% + ${clamp(
          (target.z - player.position.z) * 0.34,
          -68,
          68
        )}px))`,
      }
    : undefined;
  const wantedLevel = Math.max(0, Math.min(5, Math.ceil(player.heat / 20)));

  return (
    <div className="hud vice-hud">
      <div className="vice-crosshair"></div>

      <div className="wanted-hud" aria-label="Player status">
        <div className="wanted-stars" aria-hidden="true">
          {Array.from({ length: 5 }, (_, index) => (
            <span className={index < wantedLevel ? "is-lit" : ""} key={index}>*</span>
          ))}
        </div>
        <div className="cash-line">${player.money}</div>
        <div className="weapon-line">
          <span>{player.weapon}</span>
          <strong>{player.ammo}/{player.reserveAmmo}</strong>
        </div>
      </div>

      <section className="mission-feed">
        <p className="eyebrow">Current Job</p>
        <h2>{activeMission ? activeMission.title : "Free Roam"}</h2>
        <p>{activeMission ? activeMission.description : "All missions complete. The city is yours."}</p>
      </section>

      <div className="phone-toast">
        <span>Streetline</span>
        <strong>{statusText}</strong>
      </div>

      <div className="vice-minimap">
        <span className="map-grid"></span>
        <span className="map-route"></span>
        {target ? <span className="map-objective" style={targetMarkerStyle}></span> : null}
        <span className="map-player"></span>
        <strong>{target ? `${target.label} - ${targetDistance}m` : player.inVehicle ? "Danube Quay" : "Market Pier"}</strong>
      </div>

      <div className="street-hints">
        <div>
          <span>Objective</span>
          <strong>{objectiveText}</strong>
        </div>
        <div>
          <span>Interact</span>
          <strong>{interactHint}</strong>
        </div>
      </div>

      <div className="health-armor">
        <div className="bar-row">
          <header>
            <span>Health</span>
            <strong>{Math.round(player.health)}</strong>
          </header>
          <div className="bar-track">
            <div className="bar-fill health" style={{ width: percentage(player.health, 100) }}></div>
          </div>
        </div>
        <div className="bar-row">
          <header>
            <span>Heat</span>
            <strong>{Math.round(player.heat)}</strong>
          </header>
          <div className="bar-track">
            <div className="bar-fill heat" style={{ width: percentage(player.heat, 100) }}></div>
          </div>
        </div>
      </div>

      {player.inVehicle ? (
        <div className="speed-readout">
          <strong>{Math.round(player.vehicleSpeedKmh || 0)}</strong>
          <span>KM/H</span>
        </div>
      ) : null}

      <div className="runtime-tag">
        <span>{mapLoadState}</span>
        <span>{onlineDataMode}</span>
        <span>{movementState}</span>
      </div>
    </div>
  );
}
