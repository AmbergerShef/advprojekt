import { useEffect, useMemo, useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { assetUrl } from "../lib/assetUrl.js";
import { useGameStore } from "../state/useGameStore.js";
import { EnterableBuilding } from "./EnterableBuilding.jsx";

function buildingColor(kind) {
  switch (kind) {
    case "house":
      return "#d6c6ad";
    case "garage":
      return "#c3c8ca";
    case "office":
      return "#aab3bf";
    case "service":
      return "#b8c0cb";
    case "mixed":
      return "#beaf9e";
    default:
      return "#ccbba7";
  }
}

function createGarageDoorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#8f969c");
  gradient.addColorStop(1, "#596168");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(20, 24, 30, 0.38)";
  context.lineWidth = 6;

  for (let y = 52; y < canvas.height; y += 54) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.stroke();
  }

  context.fillStyle = "rgba(255, 255, 255, 0.12)";
  context.fillRect(42, 72, 122, 42);
  context.fillRect(348, 72, 122, 42);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function configureBaseTexture(texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
}

function cloneTexture(texture, repeatX, repeatY) {
  const clone = texture.clone();
  clone.needsUpdate = true;
  configureBaseTexture(clone);
  clone.repeat.set(Math.max(1, repeatX), Math.max(1, repeatY));
  return clone;
}

function materialPreset(buildingKind, facadeGlassColor, facadeGlassNormal, facadeGlassRoughness, facadeNightColor, facadeNightNormal, facadeNightRoughness, facadeNightEmission) {
  const officeLike = buildingKind === "office";
  const industrialLike = buildingKind === "service" || buildingKind === "garage";

  return {
    map: officeLike || industrialLike ? facadeGlassColor : facadeNightColor,
    normalMap: officeLike || industrialLike ? facadeGlassNormal : facadeNightNormal,
    roughnessMap: officeLike || industrialLike ? facadeGlassRoughness : facadeNightRoughness,
    emissiveMap: officeLike || industrialLike ? undefined : facadeNightEmission,
    emissive: officeLike || industrialLike ? "#101622" : "#fff1c0",
    emissiveIntensity: officeLike ? 0.08 : industrialLike ? 0.02 : 0.38,
    color: officeLike ? "#f3f7ff" : buildingColor(buildingKind),
    roughness: officeLike ? 0.66 : industrialLike ? 0.82 : 0.9,
    metalness: officeLike ? 0.12 : industrialLike ? 0.08 : 0.04,
  };
}

function GarageDoor({ building, texture }) {
  const ref = useRef();
  const isOpen = useGameStore((state) => Boolean(state.garageDoors[building.id]));
  const width = Math.min(building.width * 0.62, 24);
  const closedY = 3.7;
  const openY = 7.2;
  const closedScaleY = 1;
  const openScaleY = 0.18;

  useFrame((_, delta) => {
    if (!ref.current) {
      return;
    }

    const targetY = isOpen ? openY : closedY;
    const targetScaleY = isOpen ? openScaleY : closedScaleY;
    ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, targetY, Math.min(1, delta * 7));
    ref.current.scale.y = THREE.MathUtils.lerp(ref.current.scale.y, targetScaleY, Math.min(1, delta * 7));
  });

  return (
    <mesh ref={ref} castShadow position={[0, closedY, building.depth / 2 + 0.08]}>
      <boxGeometry args={[width, 5.8, 0.28]} />
      <meshStandardMaterial map={texture} roughness={0.72} metalness={0.22} />
    </mesh>
  );
}

export function BuildingLayer({ buildings = [] }) {
  const [
    facadeGlassColor,
    facadeGlassNormal,
    facadeGlassRoughness,
    facadeNightColor,
    facadeNightNormal,
    facadeNightRoughness,
    facadeNightEmission,
  ] = useTexture([
    assetUrl("assets/textures/facade005/Facade005_1K-JPG_Color.jpg"),
    assetUrl("assets/textures/facade005/Facade005_1K-JPG_NormalGL.jpg"),
    assetUrl("assets/textures/facade005/Facade005_1K-JPG_Roughness.jpg"),
    assetUrl("assets/textures/facade014/Facade014_1K-JPG_Color.jpg"),
    assetUrl("assets/textures/facade014/Facade014_1K-JPG_NormalGL.jpg"),
    assetUrl("assets/textures/facade014/Facade014_1K-JPG_Roughness.jpg"),
    assetUrl("assets/textures/facade014/Facade014_1K-JPG_Emission.jpg"),
  ]);

  const garageDoorTexture = useMemo(() => createGarageDoorTexture(), []);

  useEffect(() => {
    [
      facadeGlassColor,
      facadeGlassNormal,
      facadeGlassRoughness,
      facadeNightColor,
      facadeNightNormal,
      facadeNightRoughness,
      facadeNightEmission,
    ].forEach((texture) => {
      configureBaseTexture(texture);
      texture.repeat.set(2, 2);
    });
  }, [
    facadeGlassColor,
    facadeGlassNormal,
    facadeGlassRoughness,
    facadeNightColor,
    facadeNightNormal,
    facadeNightRoughness,
    facadeNightEmission,
  ]);

  return (
    <group>
      {buildings.map((building) => {
        const preset = materialPreset(
          building.kind,
          cloneTexture(facadeGlassColor, building.width / 14, building.height / 8),
          cloneTexture(facadeGlassNormal, building.width / 14, building.height / 8),
          cloneTexture(facadeGlassRoughness, building.width / 14, building.height / 8),
          cloneTexture(facadeNightColor, building.width / 12, building.height / 7),
          cloneTexture(facadeNightNormal, building.width / 12, building.height / 7),
          cloneTexture(facadeNightRoughness, building.width / 12, building.height / 7),
          cloneTexture(facadeNightEmission, building.width / 12, building.height / 7)
        );
        const hasPitchedRoof = building.roofShape === "hip" || building.kind === "house";
        const roofColor = building.kind === "house" ? "#6f332b" : "#20262f";

        if (building.modelUrl || building.enterable) {
          return <EnterableBuilding key={building.id} building={building} materialProps={preset} />;
        }

        return (
          <group key={building.id} position={[building.x, 0, building.z]}>
            <RigidBody type="fixed" colliders={false} friction={1.05}>
              <CuboidCollider args={[building.width / 2, building.height / 2, building.depth / 2]} position={[0, building.height / 2, 0]} />
              <mesh castShadow receiveShadow position={[0, building.height / 2, 0]}>
                <boxGeometry args={[building.width, building.height, building.depth]} />
                <meshStandardMaterial {...preset} />
              </mesh>
            </RigidBody>
            {building.kind === "garage" || building.kind === "service" ? (
              <GarageDoor building={building} texture={garageDoorTexture} />
            ) : null}
            {building.kind === "shop" ? (
              <mesh castShadow position={[0, 4.8, building.depth / 2 + 0.11]}>
                <boxGeometry args={[building.width * 0.58, 1.4, 0.3]} />
                <meshStandardMaterial color="#3effb2" emissive="#3effb2" emissiveIntensity={0.8} />
              </mesh>
            ) : null}
            {hasPitchedRoof ? (
              <mesh castShadow position={[0, building.height + 2, 0]} rotation-y={Math.PI / 4}>
                <coneGeometry args={[Math.max(building.width, building.depth) * 0.58, 4.2, 4]} />
                <meshStandardMaterial color={roofColor} roughness={0.88} metalness={0.02} />
              </mesh>
            ) : (
              <mesh castShadow position={[0, building.height + 0.3, 0]}>
                <boxGeometry args={[building.width - 0.6, 0.5, building.depth - 0.6]} />
                <meshStandardMaterial color={roofColor} emissive="#161b22" emissiveIntensity={0.2} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
