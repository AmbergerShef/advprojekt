import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  buildDolomiteTerrain,
  disposeDolomiteTerrain,
  sampleDolomiteHeight,
  sampleDolomiteSurfaceColor,
} from "../lib/dolomiteTerrain.js";

const treeDummy = new THREE.Object3D();

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

function createGrassTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  context.fillStyle = "#245337";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 2200; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = 3 + Math.random() * 10;
    const hue = 92 + Math.random() * 34;
    const lightness = 24 + Math.random() * 24;
    context.strokeStyle = `hsla(${hue}, 42%, ${lightness}%, 0.58)`;
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + Math.random() * 4 - 2, y - length);
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function createGroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  context.fillStyle = "#2d3339";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 420; index += 1) {
    const shade = 30 + Math.random() * 34;
    context.fillStyle = `rgba(${shade}, ${shade + 4}, ${shade + 8}, 0.18)`;
    context.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 3, 1 + Math.random() * 3);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function createDolomiteGeometry(bounds, terrain) {
  const geometry = new THREE.PlaneGeometry(
    terrain.width,
    terrain.depth,
    terrain.segments,
    terrain.segments
  );
  const positions = geometry.attributes.position;
  const colors = new Float32Array(positions.count * 3);

  for (let index = 0; index < positions.count; index += 1) {
    const x = positions.getX(index);
    const worldZ = -positions.getY(index);
    const height = sampleDolomiteHeight(x, worldZ, bounds);
    const color = sampleDolomiteSurfaceColor(x, worldZ, bounds);

    positions.setZ(index, height);
    colors[index * 3] = color[0];
    colors[index * 3 + 1] = color[1];
    colors[index * 3 + 2] = color[2];
  }

  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  return geometry;
}

function createMountainTreePlacements(bounds, terrain) {
  const random = seededRandom(81427 + Math.round(bounds.width + bounds.depth));
  const trees = [];
  const targetCount = 130;
  const maxAttempts = targetCount * 16;
  const cityHalfWidth = bounds.width * 0.5;
  const cityHalfDepth = bounds.depth * 0.5;

  for (let attempt = 0; attempt < maxAttempts && trees.length < targetCount; attempt += 1) {
    const side = Math.floor(random() * 4);
    const borderDistance = 7 + random() * 190;
    const alongX = (random() - 0.5) * terrain.width * 0.82;
    const alongZ = (random() - 0.5) * terrain.depth * 0.82;
    let x = alongX;
    let z = alongZ;

    if (side === 0) {
      z = -cityHalfDepth - borderDistance;
    } else if (side === 1) {
      x = cityHalfWidth + borderDistance;
    } else if (side === 2) {
      z = cityHalfDepth + borderDistance;
    } else {
      x = -cityHalfWidth - borderDistance;
    }

    if (Math.abs(x) > terrain.width * 0.48 || Math.abs(z) > terrain.depth * 0.48) {
      continue;
    }

    const outsideCity = Math.abs(x) > cityHalfWidth + 5 || Math.abs(z) > cityHalfDepth + 5;
    const height = sampleDolomiteHeight(x, z, bounds);

    if (!outsideCity || height < 0.8 || height > 78) {
      continue;
    }

    trees.push({
      x,
      y: height,
      z,
      yaw: random() * Math.PI * 2,
      scale: 0.72 + random() * 0.78,
    });
  }

  return trees;
}

function MountainForest({ bounds, terrain }) {
  const trunkRef = useRef();
  const crownRef = useRef();
  const trees = useMemo(
    () => createMountainTreePlacements(bounds, terrain),
    [bounds.depth, bounds.width, terrain.depth, terrain.width]
  );

  useEffect(() => {
    if (!trunkRef.current || !crownRef.current) {
      return;
    }

    trees.forEach((tree, index) => {
      treeDummy.position.set(tree.x, tree.y + tree.scale * 1.05, tree.z);
      treeDummy.rotation.set(0, tree.yaw, 0);
      treeDummy.scale.set(tree.scale, tree.scale, tree.scale);
      treeDummy.updateMatrix();
      trunkRef.current.setMatrixAt(index, treeDummy.matrix);

      treeDummy.position.set(tree.x, tree.y + tree.scale * 3.05, tree.z);
      treeDummy.rotation.set(0, tree.yaw + Math.PI * 0.15, 0);
      treeDummy.scale.set(tree.scale, tree.scale, tree.scale);
      treeDummy.updateMatrix();
      crownRef.current.setMatrixAt(index, treeDummy.matrix);
    });

    trunkRef.current.instanceMatrix.needsUpdate = true;
    crownRef.current.instanceMatrix.needsUpdate = true;
  }, [trees]);

  return (
    <group>
      <instancedMesh ref={(node) => (trunkRef.current = node)} args={[undefined, undefined, trees.length]} receiveShadow>
        <cylinderGeometry args={[0.14, 0.24, 2.1, 5]} />
        <meshStandardMaterial color="#4a2f1d" roughness={0.86} />
      </instancedMesh>
      <instancedMesh ref={(node) => (crownRef.current = node)} args={[undefined, undefined, trees.length]} receiveShadow>
        <coneGeometry args={[1.28, 4.2, 6]} />
        <meshStandardMaterial color="#1f4a2c" roughness={0.94} />
      </instancedMesh>
    </group>
  );
}

export function WorldTerrain({ bounds, parks = [] }) {
  const grassTexture = useMemo(() => createGrassTexture(), []);
  const groundTexture = useMemo(() => createGroundTexture(), []);
  const dolomiteTerrain = useMemo(
    () => buildDolomiteTerrain(bounds),
    [bounds.depth, bounds.width]
  );
  const dolomiteGeometry = useMemo(
    () => createDolomiteGeometry(bounds, dolomiteTerrain),
    [bounds.depth, bounds.width, dolomiteTerrain]
  );

  useEffect(() => {
    groundTexture.repeat.set(bounds.width / 24, bounds.depth / 24);
    grassTexture.repeat.set(8, 8);
  }, [bounds.depth, bounds.width, grassTexture, groundTexture]);

  useEffect(() => () => disposeDolomiteTerrain(dolomiteTerrain), [dolomiteTerrain]);
  useEffect(() => () => dolomiteGeometry.dispose(), [dolomiteGeometry]);

  return (
    <group>
      <mesh
        key={`${dolomiteTerrain.width}-${dolomiteTerrain.depth}`}
        receiveShadow
        rotation-x={-Math.PI / 2}
      >
        <primitive object={dolomiteGeometry} attach="geometry" />
        <meshStandardMaterial
          map={dolomiteTerrain.albedoMap}
          vertexColors
          normalMap={dolomiteTerrain.normalMap}
          normalScale={[0.72, 0.72]}
          roughnessMap={dolomiteTerrain.roughnessMap}
          roughness={0.88}
          metalness={0.02}
          color="#ffffff"
        />
      </mesh>
      <MountainForest bounds={bounds} terrain={dolomiteTerrain} />
      <mesh receiveShadow rotation-x={-Math.PI / 2}>
        <planeGeometry args={[bounds.width, bounds.depth]} />
        <meshStandardMaterial map={groundTexture} color="#343a40" roughness={1} />
      </mesh>
      {parks.map((park, index) => (
        <mesh key={index} receiveShadow rotation-x={-Math.PI / 2} position={[park.x, 0.02, park.z]}>
          <planeGeometry args={[park.width, park.depth]} />
          <meshStandardMaterial
            map={grassTexture}
            color="#4d8b45"
            roughness={1}
            onBeforeCompile={(shader) => {
              shader.fragmentShader = shader.fragmentShader.replace(
                "#include <map_fragment>",
                `
                  #include <map_fragment>
                  diffuseColor.rgb *= 0.78 + 0.22 * sin(vUv.x * 90.0 + vUv.y * 37.0);
                `
              );
            }}
          />
        </mesh>
      ))}
    </group>
  );
}
