import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "../state/useGameStore.js";

function createClothTexture(role) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  const base = role === "mission" ? "#ffb347" : role === "shop" ? "#3cffae" : "#7cc9ff";
  const trim = role === "mission" ? "#6b3517" : role === "shop" ? "#0f5f46" : "#133a66";

  context.fillStyle = base;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = trim;
  context.fillRect(0, 92, canvas.width, 10);
  context.fillRect(0, 146, canvas.width, 7);
  context.fillStyle = "rgba(255,255,255,0.16)";
  context.fillRect(18, 22, 22, 86);
  context.fillRect(88, 22, 22, 86);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function paletteForRole(role, id = "") {
  if (role === "mission") {
    return { shirt: "#ffb347", pants: "#27334f", skin: "#d89b73", accent: "#ffe0a8" };
  }
  if (role === "shop") {
    return { shirt: "#3cffae", pants: "#263c31", skin: "#c98a68", accent: "#ecfff8" };
  }
  if (role === "hostile") {
    return { shirt: "#ff5f72", pants: "#222631", skin: "#b87861", accent: "#531925" };
  }

  const variants = [
    { shirt: "#7cc9ff", pants: "#27334f", skin: "#d59a72", accent: "#d8f2ff" },
    { shirt: "#c99cff", pants: "#303044", skin: "#8f5d48", accent: "#f0ddff" },
    { shirt: "#ff9f7c", pants: "#3b3131", skin: "#e0aa84", accent: "#ffe4d8" },
  ];
  return variants[id.charCodeAt(id.length - 1) % variants.length];
}

function Humanoid({ role, id, hostile = false, walking = false, dialogue }) {
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const palette = useMemo(() => paletteForRole(role, id), [id, role]);
  const clothTexture = useMemo(() => createClothTexture(role), [role]);

  useFrame((state) => {
    const stride = walking ? Math.sin(state.clock.elapsedTime * (hostile ? 10 : 6.5) + id.length) : 0;
    if (leftLeg.current) leftLeg.current.rotation.x = stride * 0.42;
    if (rightLeg.current) rightLeg.current.rotation.x = -stride * 0.42;
    if (leftArm.current) leftArm.current.rotation.x = -stride * 0.28;
    if (rightArm.current) rightArm.current.rotation.x = stride * 0.28;
  });

  return (
    <group>
      <mesh castShadow position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.24, 16, 12]} />
        <meshStandardMaterial color={palette.skin} roughness={0.78} />
      </mesh>
      <mesh castShadow position={[0, 1.22, 0]}>
        <boxGeometry args={[0.62, 0.82, 0.32]} />
        <meshStandardMaterial map={clothTexture} color={palette.shirt} roughness={0.84} />
      </mesh>
      <mesh castShadow position={[0, 0.78, 0.19]}>
        <boxGeometry args={[0.5, 0.14, 0.08]} />
        <meshStandardMaterial color={palette.accent} emissive={hostile ? palette.accent : "#000000"} emissiveIntensity={hostile ? 0.4 : 0} />
      </mesh>
      <mesh ref={leftArm} castShadow position={[-0.48, 1.15, 0]}>
        <capsuleGeometry args={[0.08, 0.56, 4, 8]} />
        <meshStandardMaterial color={palette.skin} roughness={0.82} />
      </mesh>
      <mesh ref={rightArm} castShadow position={[0.48, 1.15, 0]}>
        <capsuleGeometry args={[0.08, 0.56, 4, 8]} />
        <meshStandardMaterial color={palette.skin} roughness={0.82} />
      </mesh>
      <mesh ref={leftLeg} castShadow position={[-0.18, 0.48, 0]}>
        <capsuleGeometry args={[0.1, 0.76, 4, 8]} />
        <meshStandardMaterial color={palette.pants} roughness={0.88} />
      </mesh>
      <mesh ref={rightLeg} castShadow position={[0.18, 0.48, 0]}>
        <capsuleGeometry args={[0.1, 0.76, 4, 8]} />
        <meshStandardMaterial color={palette.pants} roughness={0.88} />
      </mesh>
      {dialogue ? (
        <Html center position={[0, 2.35, 0]} distanceFactor={14}>
          <div
            style={{
              maxWidth: "190px",
              padding: "8px 10px",
              borderRadius: "8px",
              background: "rgba(6, 10, 16, 0.86)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "white",
              fontSize: "12px",
              lineHeight: 1.25,
              textAlign: "center",
              boxShadow: "0 10px 26px rgba(0,0,0,0.35)",
            }}
          >
            {dialogue}
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Civilian({ npc }) {
  const ref = useRef(null);
  const lastSyncRef = useRef(0);
  const player = useGameStore((state) => state.player);
  const activeDialogue = useGameStore((state) => state.activeDialogue);
  const setCivilianPosition = useGameStore((state) => state.setCivilianPosition);
  const isTalking = activeDialogue?.npcId === npc.id;
  const dialogue = isTalking ? activeDialogue.text : null;

  useFrame((state) => {
    if (!ref.current) {
      return;
    }
    const distance = Math.hypot(player.position.x - npc.x, player.position.z - npc.z);

    if (isTalking) {
      const dx = player.position.x - ref.current.position.x;
      const dz = player.position.z - ref.current.position.z;
      ref.current.rotation.y = Math.atan2(dx, dz);
      return;
    }

    const panicOffset = player.heat > 45 && distance < 18 ? 2.4 : 1.2;
    const speed = player.heat > 45 && distance < 18 ? 1.3 : 0.48;
    const phase = state.clock.elapsedTime * speed + npc.x * 0.13 + npc.z * 0.07;
    const nextX = npc.x + Math.sin(phase) * panicOffset;
    const nextZ = npc.z + Math.cos(phase * 0.82) * panicOffset;
    const dx = nextX - ref.current.position.x;
    const dz = nextZ - ref.current.position.z;
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, nextX, 0.08);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, nextZ, 0.08);
    if (Math.hypot(dx, dz) > 0.01) {
      ref.current.rotation.y = Math.atan2(dx, dz);
    }

    if (state.clock.elapsedTime >= lastSyncRef.current) {
      lastSyncRef.current = state.clock.elapsedTime + 0.25;
      setCivilianPosition(npc.id, { x: ref.current.position.x, z: ref.current.position.z });
    }
  });

  return (
    <group ref={ref} position={[npc.currentX ?? npc.x, npc.y, npc.currentZ ?? npc.z]}>
      <Humanoid role={npc.role} id={npc.id} walking={!isTalking} dialogue={dialogue} />
      <Html center position={[0, 2.4, 0]} distanceFactor={18}>
        <div style={{ fontSize: "12px", color: "white", whiteSpace: "nowrap", textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>
          {npc.name}
        </div>
      </Html>
    </group>
  );
}

function Hostile({ hostile }) {
  const ref = useRef(null);
  const lastSyncRef = useRef(0);
  const player = useGameStore((state) => state.player);
  const damagePlayer = useGameStore((state) => state.damagePlayer);
  const raiseHeat = useGameStore((state) => state.raiseHeat);
  const setHostilePosition = useGameStore((state) => state.setHostilePosition);

  useFrame((state, delta) => {
    if (!ref.current || !hostile.active || !hostile.alive) {
      if (ref.current) {
        ref.current.visible = false;
      }
      return;
    }

    ref.current.visible = true;
    const dx = player.position.x - ref.current.position.x;
    const dz = player.position.z - ref.current.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance > 1.8) {
      ref.current.position.x += (dx / Math.max(distance, 1)) * delta * 4.4;
      ref.current.position.z += (dz / Math.max(distance, 1)) * delta * 4.4;
      ref.current.rotation.y = Math.atan2(dx, dz);
    } else {
      damagePlayer(16 * delta);
      raiseHeat(10 * delta);
    }

    if (state.clock.elapsedTime >= lastSyncRef.current) {
      lastSyncRef.current = state.clock.elapsedTime + 0.08;
      setHostilePosition(hostile.id, {
        x: ref.current.position.x,
        y: ref.current.position.y,
        z: ref.current.position.z,
      });
    }
  });

  return (
    <group ref={ref} position={[hostile.x, hostile.y, hostile.z]}>
      <group userData={{ hostileId: hostile.id }}>
        <Humanoid role="hostile" id={hostile.id} hostile walking={hostile.active && hostile.alive} />
      </group>
    </group>
  );
}

export function Npcs() {
  const lastDialogueClearRef = useRef(0);
  const civilians = useGameStore((state) => state.civilians);
  const hostiles = useGameStore((state) => state.hostiles);
  const clearExpiredDialogue = useGameStore((state) => state.clearExpiredDialogue);

  useFrame((state) => {
    if (state.clock.elapsedTime < lastDialogueClearRef.current) {
      return;
    }

    lastDialogueClearRef.current = state.clock.elapsedTime + 0.4;
    clearExpiredDialogue();
  });

  return (
    <>
      {civilians.map((npc) => (
        <Civilian key={npc.id} npc={npc} />
      ))}
      {hostiles.map((hostile) => (
        <Hostile key={hostile.id} hostile={hostile} />
      ))}
    </>
  );
}
