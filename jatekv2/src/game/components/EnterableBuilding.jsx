import { Suspense, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useGameStore } from "../state/useGameStore.js";

const DEFAULT_INTERIOR_MODEL = "/models/house_interior.glb";

function BuildingProxy({ building, materialProps }) {
  return (
    <RigidBody type="fixed" colliders={false} friction={1.05}>
      <CuboidCollider args={[building.width / 2, building.height / 2, building.depth / 2]} position={[0, building.height / 2, 0]} />
      <mesh castShadow receiveShadow position={[0, building.height / 2, 0]}>
        <boxGeometry args={[building.width, building.height, building.depth]} />
        <meshStandardMaterial {...(materialProps || { color: "#b9afa2", roughness: 0.88 })} />
      </mesh>
    </RigidBody>
  );
}

function LoadedEnterableBuilding({ modelUrl, scale = 1 }) {
  const { scene } = useGLTF(modelUrl);
  const model = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    model.traverse((child) => {
      if (!child.isMesh) {
        return;
      }
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material = child.material.clone();
        child.material.side = THREE.FrontSide;
      }
    });
  }, [model]);

  return (
    <RigidBody type="fixed" colliders="trimesh" friction={1.12}>
      <primitive object={model} scale={scale} />
    </RigidBody>
  );
}

export function EnterableBuilding({ building, materialProps, loadDistance = 72 }) {
  const playerPosition = useGameStore((state) => state.player.position);
  const distanceSq = (playerPosition.x - building.x) ** 2 + (playerPosition.z - building.z) ** 2;
  const shouldLoadInterior = distanceSq < loadDistance * loadDistance;
  const modelUrl = building.modelUrl || DEFAULT_INTERIOR_MODEL;

  return (
    <group position={[building.x, 0, building.z]} rotation-y={building.rotation || 0}>
      {shouldLoadInterior ? (
        <Suspense fallback={<BuildingProxy building={building} materialProps={materialProps} />}>
          <LoadedEnterableBuilding modelUrl={modelUrl} scale={building.modelScale || 1} />
        </Suspense>
      ) : (
        <BuildingProxy building={building} materialProps={materialProps} />
      )}
    </group>
  );
}
