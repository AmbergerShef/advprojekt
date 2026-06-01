import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { assetUrl } from "../lib/assetUrl.js";

function createStripeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  context.fillStyle = "#555c66";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#f6f8fb";
  context.fillRect(0, canvas.height / 2 - 6, canvas.width, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 1);
  return texture;
}

function createSidewalkTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  context.fillStyle = "#c7ccd3";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(104, 111, 122, 0.3)";
  context.lineWidth = 2;

  for (let index = 0; index < 5; index += 1) {
    const offset = 32 + index * 44;
    context.beginPath();
    context.moveTo(0, offset);
    context.lineTo(canvas.width, offset - 10);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

function StripeMarks({ road }) {
  const horizontal = road.width >= road.depth;
  const longSize = horizontal ? road.width : road.depth;
  const stripeCount = Math.max(3, Math.floor(longSize / 16));
  const spacing = longSize / stripeCount;

  return (
    <group position={[road.x, 0.071, road.z]}>
      {Array.from({ length: stripeCount }).map((_, index) => {
        const offset = -longSize / 2 + spacing * index + spacing / 2;
        const x = horizontal ? offset : 0;
        const z = horizontal ? 0 : offset;
        return (
          <mesh key={index} rotation-x={-Math.PI / 2} position={[x, 0, z]}>
            <planeGeometry args={[horizontal ? spacing * 0.55 : 0.5, horizontal ? 0.5 : spacing * 0.55]} />
            <meshBasicMaterial color="#f6f8fb" />
          </mesh>
        );
      })}
      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[horizontal ? longSize : 0.25, horizontal ? 0.25 : longSize]} />
        <meshBasicMaterial color="#ffffff" opacity={0.85} transparent />
      </mesh>
    </group>
  );
}

export function RoadNetwork({ roads = [], sidewalks = [] }) {
  const [asphaltColor, asphaltNormal, asphaltRoughness] = useTexture([
    assetUrl("assets/textures/asphalt020l/color.jpg"),
    assetUrl("assets/textures/asphalt020l/normal.jpg"),
    assetUrl("assets/textures/asphalt020l/roughness.jpg"),
  ]);

  const stripeTexture = useMemo(() => createStripeTexture(), []);
  const sidewalkTexture = useMemo(() => createSidewalkTexture(), []);

  useEffect(() => {
    [asphaltColor, asphaltNormal, asphaltRoughness, sidewalkTexture].forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.anisotropy = 4;
    });

    asphaltColor.repeat.set(12, 12);
    asphaltNormal.repeat.set(12, 12);
    asphaltRoughness.repeat.set(12, 12);
  }, [asphaltColor, asphaltNormal, asphaltRoughness, sidewalkTexture]);

  return (
    <group>
      {roads.map((road) => (
        <group key={road.id}>
          <mesh receiveShadow rotation-x={-Math.PI / 2} position={[road.x, 0.03, road.z]}>
            <planeGeometry args={[road.width, road.depth]} />
            <meshStandardMaterial
              map={asphaltColor}
              normalMap={asphaltNormal}
              roughnessMap={asphaltRoughness}
              roughness={0.95}
              metalness={0.04}
            />
          </mesh>
          <mesh receiveShadow rotation-x={-Math.PI / 2} position={[road.x, 0.031, road.z]}>
            <planeGeometry args={[road.width, road.depth]} />
            <meshStandardMaterial map={stripeTexture} transparent opacity={0.22} roughness={1} />
          </mesh>
          <StripeMarks road={road} />
        </group>
      ))}

      {sidewalks.map((sidewalk) => (
        <mesh key={sidewalk.id} receiveShadow rotation-x={-Math.PI / 2} position={[sidewalk.x, 0.055, sidewalk.z]}>
          <planeGeometry args={[sidewalk.width, sidewalk.depth]} />
          <meshStandardMaterial
            map={sidewalkTexture}
            roughness={0.98}
            metalness={0.02}
            color="#d2d6dd"
          />
        </mesh>
      ))}
    </group>
  );
}
