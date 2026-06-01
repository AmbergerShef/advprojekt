import { useCallback, useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { CapsuleCollider, RigidBody, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { clampWorld, pointInBuilding } from "../lib/collision.js";
import { debugLog } from "../lib/debug.js";
import { getDolomiteWalkableBounds, sampleDolomiteHeight } from "../lib/dolomiteTerrain.js";
import { useGameStore } from "../state/useGameStore.js";

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const walk = new THREE.Vector3();
const cameraDirection = new THREE.Vector3();
const cameraEuler = new THREE.Euler(0, 0, 0, "YXZ");

const PLAYER_RADIUS = 0.38;
const PLAYER_HALF_HEIGHT = 0.72;
const PLAYER_CENTER_OFFSET = 1.25;

const VEHICLE_EXIT_OFFSETS = [
  { side: 1, forward: 0 },
  { side: -1, forward: 0 },
  { side: 1, forward: -1.8 },
  { side: -1, forward: -1.8 },
  { side: 0, forward: -3 },
  { side: 0, forward: 3 },
];

function findNearestInteraction(position, civilians, vehicles, buildings, shop, currentVehicle) {
  if (currentVehicle) {
    return {
      id: "vehicle-exit",
      type: "vehicle-exit",
      label: "Exit vehicle",
      distance: 0,
    };
  }

  let nearest = null;

  civilians.forEach((npc) => {
    const npcX = npc.currentX ?? npc.x;
    const npcZ = npc.currentZ ?? npc.z;
    const distance = Math.hypot(position.x - npcX, position.z - npcZ);
    if (distance < 3.4 && (!nearest || distance < nearest.distance)) {
      nearest = {
        id: npc.id,
        type: npc.role === "shop" ? "shop" : "npc",
        missionId: npc.missionId,
        label: npc.role === "shop" ? `Shop: ${npc.name}` : `Talk: ${npc.name}`,
        distance,
      };
    }
  });

  vehicles.forEach((vehicle) => {
    const distance = Math.hypot(position.x - vehicle.x, position.z - vehicle.z);
    if (distance < 4.2 && (!nearest || distance < nearest.distance)) {
      nearest = {
        id: vehicle.id,
        type: "vehicle",
        label: `Enter ${vehicle.label}`,
        distance,
      };
    }
  });

  buildings
    .filter((building) => building.kind === "garage" || building.kind === "service")
    .forEach((building) => {
      const doorX = building.x;
      const doorZ = building.z + building.depth / 2 + 0.8;
      const distance = Math.hypot(position.x - doorX, position.z - doorZ);
      if (distance < 5.2 && (!nearest || distance < nearest.distance)) {
        nearest = {
          id: building.id,
          type: "garage",
          label: "Nyit/Zar garazs",
          distance,
        };
      }
    });

  if (shop) {
    const distance = Math.hypot(position.x - shop.x, position.z - shop.z);
    if (distance < 4.2 && (!nearest || distance < nearest.distance)) {
      nearest = {
        id: "shop",
        type: "shop",
        label: "Use street shop",
        distance,
      };
    }
  }

  return nearest;
}

function resolveInteraction(target, actions) {
  if (!target) {
    return;
  }

  switch (target.type) {
    case "vehicle":
      actions.enterVehicle(target.id);
      return;
    case "vehicle-exit":
      actions.exitVehicle();
      return;
    case "shop":
      actions.useShop();
      return;
    case "npc":
      actions.talkToNpc(target.id);
      if (target.missionId) {
        actions.startMission(target.missionId);
      }
      return;
    case "garage":
      actions.toggleGarageDoor(target.id);
      return;
    default:
  }
}

function hitNearestHostile(camera, playerPosition, hostiles, hitHostile, shot) {
  camera.getWorldDirection(cameraDirection);
  let bestTarget = null;
  let bestScore = 0.82;
  const range = shot?.range || 28;
  const damage = shot?.damage || 34;

  hostiles.forEach((hostile) => {
    if (!hostile.alive || !hostile.active) {
      return;
    }

    const toHostile = new THREE.Vector3(hostile.x - playerPosition.x, 1.2, hostile.z - playerPosition.z);
    const distance = toHostile.length();
    if (distance > range) {
      return;
    }

    toHostile.normalize();
    const score = cameraDirection.dot(toHostile);
    if (score > bestScore) {
      bestScore = score;
      bestTarget = hostile;
    }
  });

  if (bestTarget) {
    hitHostile(bestTarget.id, damage);
    debugLog("input", "hostile-hit", { hostileId: bestTarget.id });
  }
}

function vehicleObstacleRadius(vehicle) {
  return vehicle.type === "bike" ? 1.2 : 2.4;
}

function findVehicleExitPosition(vehicle, bounds, buildings, obstacles) {
  const sideDistance = vehicle.type === "bike" ? 3.2 : 5.4;
  const yaw = vehicle.rotation || 0;
  const sideX = Math.cos(yaw);
  const sideZ = -Math.sin(yaw);
  const forwardX = -Math.sin(yaw);
  const forwardZ = -Math.cos(yaw);

  for (const offset of VEHICLE_EXIT_OFFSETS) {
    const candidate = clampWorld(
      {
        x: vehicle.x + sideX * offset.side * sideDistance + forwardX * offset.forward,
        z: vehicle.z + sideZ * offset.side * sideDistance + forwardZ * offset.forward,
      },
      bounds,
      4
    );

    if (pointInBuilding(candidate.x, candidate.z, buildings, 1.8)) {
      continue;
    }

    const blocked = obstacles.some((obstacle) => {
      if (obstacle.id === vehicle.id) {
        return false;
      }
      return Math.hypot(candidate.x - obstacle.x, candidate.z - obstacle.z) < obstacle.radius + 0.45;
    });

    if (!blocked) {
      return { x: candidate.x, y: 1.25, z: candidate.z };
    }
  }

  const fallback = clampWorld({ x: vehicle.x + sideX * sideDistance, z: vehicle.z + sideZ * sideDistance }, bounds, 4);
  return { x: fallback.x, y: 1.25, z: fallback.z };
}

export function FirstPersonController() {
  const playerBodyRef = useRef(null);
  const characterControllerRef = useRef(null);
  const keysRef = useRef({
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
    ArrowUp: false,
    ArrowLeft: false,
    ArrowDown: false,
    ArrowRight: false,
    Space: false,
    ShiftLeft: false,
    ShiftRight: false,
  });
  const positionRef = useRef({ x: 0, y: 1.25, z: 0 });
  const horizontalVelocityRef = useRef({ x: 0, z: 0 });
  const vehicleSpeedRef = useRef(0);
  const lastVehicleIdRef = useRef(null);
  const lastVehicleSpeedSyncRef = useRef(0);
  const heatCooldownAccumulatorRef = useRef(0);
  const verticalVelocityRef = useRef(0);
  const groundedRef = useRef(true);
  const jumpQueuedRef = useRef(false);
  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const lastInteractIdRef = useRef("__init__");
  const lastMovementLogRef = useRef(0);
  const lastPositionRef = useRef({ x: NaN, z: NaN });
  const lastMovementStateRef = useRef("idle");
  const pointerLockCooldownUntilRef = useRef(0);
  const ignoredVehicleCollisionRef = useRef({ id: null, radius: 0, until: 0 });
  const { camera, gl } = useThree();
  const { world } = useRapier();

  const started = useGameStore((state) => state.started);
  const debugEnabled = useGameStore((state) => state.debugEnabled);
  const snapshot = useGameStore((state) => state.citySnapshot);
  const player = useGameStore((state) => state.player);
  const respawnNonce = useGameStore((state) => state.respawnNonce);
  const civilians = useGameStore((state) => state.civilians);
  const vehicles = useGameStore((state) => state.vehicles);
  const hostiles = useGameStore((state) => state.hostiles);
  const setPointerLocked = useGameStore((state) => state.setPointerLocked);
  const setPlayerPosition = useGameStore((state) => state.setPlayerPosition);
  const setVehicleSpeedKmh = useGameStore((state) => state.setVehicleSpeedKmh);
  const setMovementState = useGameStore((state) => state.setMovementState);
  const setStatus = useGameStore((state) => state.setStatus);
  const setInteractState = useGameStore((state) => state.setInteractState);
  const enterVehicle = useGameStore((state) => state.enterVehicle);
  const exitVehicle = useGameStore((state) => state.exitVehicle);
  const moveVehicle = useGameStore((state) => state.moveVehicle);
  const useShop = useGameStore((state) => state.useShop);
  const startMission = useGameStore((state) => state.startMission);
  const talkToNpc = useGameStore((state) => state.talkToNpc);
  const toggleGarageDoor = useGameStore((state) => state.toggleGarageDoor);
  const shoot = useGameStore((state) => state.shoot);
  const reload = useGameStore((state) => state.reload);
  const switchWeapon = useGameStore((state) => state.switchWeapon);
  const hitHostile = useGameStore((state) => state.hitHostile);
  const coolHeat = useGameStore((state) => state.coolHeat);

  const buildings = useMemo(() => snapshot.buildings || [], [snapshot.buildings]);
  const movementBounds = useMemo(() => getDolomiteWalkableBounds(snapshot.bounds), [snapshot.bounds]);
  const dynamicObstacles = useMemo(
    () => [
      ...vehicles
        .filter((vehicle) => vehicle.id !== player.inVehicle)
        .map((vehicle) => ({
          id: vehicle.id,
          x: vehicle.x,
          z: vehicle.z,
          radius: vehicleObstacleRadius(vehicle),
        })),
      ...civilians.map((npc) => ({
        id: npc.id,
        x: npc.currentX ?? npc.x,
        z: npc.currentZ ?? npc.z,
        radius: 0.85,
      })),
      ...hostiles
        .filter((hostile) => hostile.alive && hostile.active)
        .map((hostile) => ({ id: hostile.id, x: hostile.x, z: hostile.z, radius: 0.95 })),
    ],
    [civilians, hostiles, player.inVehicle, vehicles]
  );

  useEffect(() => {
    const controller = world.createCharacterController(0.05);
    controller.setSlideEnabled(true);
    controller.enableAutostep(0.72, 0.32, true);
    controller.enableSnapToGround(0.5);
    controller.setMaxSlopeClimbAngle(Math.PI / 4.5);
    controller.setMinSlopeSlideAngle(Math.PI / 3);
    characterControllerRef.current = controller;

    return () => {
      characterControllerRef.current = null;
      world.removeCharacterController(controller);
    };
  }, [world]);

  const collidesAt = (x, z) => {
    if (sampleDolomiteHeight(x, z, snapshot.bounds) > 68) {
      return true;
    }

    return dynamicObstacles.some((obstacle) => {
      if (obstacle.id === ignoredVehicleCollisionRef.current.id) {
        return false;
      }
      return Math.hypot(x - obstacle.x, z - obstacle.z) < obstacle.radius;
    });
  };

  const resetControllerPosition = useCallback(
    (targetPosition, nextYaw = 0) => {
      const terrainHeight = sampleDolomiteHeight(targetPosition.x, targetPosition.z, snapshot.bounds);
      const nextY = terrainHeight + (targetPosition.y || 1.25);
      const nextPosition = { x: targetPosition.x, y: nextY, z: targetPosition.z };

      positionRef.current = nextPosition;
      playerBodyRef.current?.setTranslation(nextPosition, true);
      playerBodyRef.current?.setNextKinematicTranslation(nextPosition);
      horizontalVelocityRef.current = { x: 0, z: 0 };
      vehicleSpeedRef.current = 0;
      verticalVelocityRef.current = 0;
      groundedRef.current = true;
      jumpQueuedRef.current = false;
      yawRef.current = nextYaw;
      pitchRef.current = 0;
      lastPositionRef.current = { x: nextPosition.x, z: nextPosition.z };
      camera.position.set(nextPosition.x, nextPosition.y + 0.45, nextPosition.z);
      cameraEuler.set(0, nextYaw, 0);
      camera.quaternion.setFromEuler(cameraEuler);
      setPlayerPosition(nextPosition);
    },
    [camera, setPlayerPosition, snapshot.bounds]
  );

  const exitCurrentVehicle = useCallback(() => {
    const currentVehicleId = useGameStore.getState().player.inVehicle;
    const currentVehicle = useGameStore.getState().vehicles.find((vehicle) => vehicle.id === currentVehicleId);

    if (!currentVehicle) {
      exitVehicle();
      return;
    }

    const exitPosition = findVehicleExitPosition(currentVehicle, movementBounds, buildings, dynamicObstacles);
    exitPosition.y = sampleDolomiteHeight(exitPosition.x, exitPosition.z, snapshot.bounds) + 1.25;
    positionRef.current = exitPosition;
    playerBodyRef.current?.setTranslation(exitPosition, true);
    playerBodyRef.current?.setNextKinematicTranslation(exitPosition);
    horizontalVelocityRef.current = { x: 0, z: 0 };
    vehicleSpeedRef.current = 0;
    verticalVelocityRef.current = 0;
    groundedRef.current = true;
    ignoredVehicleCollisionRef.current = {
      id: currentVehicle.id,
      radius: vehicleObstacleRadius(currentVehicle),
      until: performance.now() + 1800,
    };

    setPlayerPosition(exitPosition);
    camera.position.set(exitPosition.x, exitPosition.y + 0.45, exitPosition.z);
    setVehicleSpeedKmh(0);
    exitVehicle();
    setStatus("Exited vehicle.");
  }, [
    buildings,
    camera,
    dynamicObstacles,
    exitVehicle,
    movementBounds,
    setPlayerPosition,
    setStatus,
    setVehicleSpeedKmh,
    snapshot.bounds,
  ]);

  useEffect(() => {
    const spawn = snapshot.playerSpawn || { x: 0, y: 1.25, z: 0 };
    resetControllerPosition(spawn, 0);
  }, [resetControllerPosition, snapshot.playerSpawn]);

  useEffect(() => {
    if (respawnNonce === 0) {
      return;
    }

    resetControllerPosition(useGameStore.getState().player.position, 0);
    setVehicleSpeedKmh(0);
  }, [resetControllerPosition, respawnNonce, setVehicleSpeedKmh]);

  useEffect(() => {
    const currentVehicleId = player.inVehicle;

    if (currentVehicleId && lastVehicleIdRef.current !== currentVehicleId) {
      const currentVehicle = useGameStore.getState().vehicles.find((vehicle) => vehicle.id === currentVehicleId);
      if (currentVehicle) {
        resetControllerPosition(
          { x: currentVehicle.x, y: 1.25, z: currentVehicle.z },
          currentVehicle.rotation || yawRef.current
        );
        setVehicleSpeedKmh(0);
      }
    }

    if (!currentVehicleId && lastVehicleIdRef.current) {
      vehicleSpeedRef.current = 0;
      setVehicleSpeedKmh(0);
    }

    lastVehicleIdRef.current = currentVehicleId;
  }, [player.inVehicle, resetControllerPosition, setVehicleSpeedKmh]);

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      debugLog("input", "pointerlockchange", { locked });
      setPointerLocked(locked);
      if (!locked) {
        pointerLockCooldownUntilRef.current = performance.now() + 1250;
      }
    };

    const onMouseMove = (event) => {
      if (document.pointerLockElement !== canvas) {
        return;
      }

      const inVehicle = Boolean(useGameStore.getState().player.inVehicle);
      yawRef.current -= event.movementX * (inVehicle ? 0.00045 : 0.0022);
      pitchRef.current = Math.max(-1.35, Math.min(1.35, pitchRef.current - event.movementY * 0.0018));
    };

    const onKeyChange = (pressed) => (event) => {
      if (!started) {
        return;
      }

      if (event.code in keysRef.current) {
        keysRef.current[event.code] = pressed;
        if (event.code === "Space") {
          event.preventDefault();
          if (pressed) {
            jumpQueuedRef.current = true;
          }
        }
        if (debugEnabled) {
          debugLog("input", pressed ? "keydown" : "keyup", {
            code: event.code,
            keys: { ...keysRef.current },
          });
        }
      }

      if (!pressed) {
        return;
      }

      if (event.code === "KeyR") {
        reload();
      }
      if (event.code === "Digit1") {
        switchWeapon("Pistol");
      }
      if (event.code === "Digit2") {
        switchWeapon("Shotgun");
      }
      if (event.code === "KeyE") {
        resolveInteraction(useGameStore.getState().nearbyTarget, {
          enterVehicle,
          exitVehicle: exitCurrentVehicle,
          useShop,
          startMission,
          talkToNpc,
          toggleGarageDoor,
        });
      }
    };

    const keyDownHandler = onKeyChange(true);
    const keyUpHandler = onKeyChange(false);

    const onCanvasMouseDown = async () => {
      if (!started) {
        return;
      }

      if (document.pointerLockElement !== canvas) {
        const now = performance.now();
        if (now < pointerLockCooldownUntilRef.current) {
          setStatus("Pointer lock cooldown active. Wait a second, then click again.");
          return;
        }

        try {
          debugLog("input", "pointerlock-attempt");
          await canvas.requestPointerLock();
        } catch (error) {
          debugLog("input", "pointerlock-error", {
            error: error instanceof Error ? error.message : String(error),
          });
          setStatus("Pointer lock was blocked by the browser. Click again after a short pause.");
        }
        return;
      }

      const shot = shoot();
      if (shot.fired) {
        hitNearestHostile(camera, positionRef.current, useGameStore.getState().hostiles, hitHostile, shot);
      }
    };

    document.addEventListener("pointerlockchange", onPointerLockChange);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    canvas.addEventListener("mousedown", onCanvasMouseDown);
    canvas.addEventListener("contextmenu", (event) => event.preventDefault());

    return () => {
      document.removeEventListener("pointerlockchange", onPointerLockChange);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      canvas.removeEventListener("mousedown", onCanvasMouseDown);
    };
  }, [
    camera,
    debugEnabled,
    enterVehicle,
    exitCurrentVehicle,
    gl.domElement,
    hitHostile,
    reload,
    setPointerLocked,
    setVehicleSpeedKmh,
    setStatus,
    shoot,
    startMission,
    started,
    switchWeapon,
    talkToNpc,
    toggleGarageDoor,
    useShop,
  ]);

  useEffect(() => {
    if (started) {
      setStatus("Click once inside the scene to lock cursor. Move with WASD.");
    }
  }, [setStatus, started]);

  useFrame((_, delta) => {
    if (!started) {
      return;
    }

    const position = positionRef.current;
    if (ignoredVehicleCollisionRef.current.id) {
      const ignoredVehicle = vehicles.find((vehicle) => vehicle.id === ignoredVehicleCollisionRef.current.id);
      if (
        !ignoredVehicle ||
        (performance.now() > ignoredVehicleCollisionRef.current.until &&
          Math.hypot(position.x - ignoredVehicle.x, position.z - ignoredVehicle.z) >
            ignoredVehicleCollisionRef.current.radius + 2.4)
      ) {
        ignoredVehicleCollisionRef.current = { id: null, radius: 0, until: 0 };
      }
    }
    const forwardPressed = keysRef.current.KeyW || keysRef.current.ArrowUp;
    const backPressed = keysRef.current.KeyS || keysRef.current.ArrowDown;
    const leftPressed = keysRef.current.KeyA || keysRef.current.ArrowLeft;
    const rightPressed = keysRef.current.KeyD || keysRef.current.ArrowRight;
    const runPressed = keysRef.current.ShiftLeft || keysRef.current.ShiftRight;
    const walkSpeed = runPressed ? 10.5 : 6.8;
    const vehicleTuning =
      player.inVehicle === "bike"
        ? { maxSpeed: 22, reverseSpeed: 7.5, acceleration: 7.4, braking: 8.8, friction: 2.6, turnRate: 2.35 }
        : { maxSpeed: 18, reverseSpeed: 6, acceleration: 5.9, braking: 7.2, friction: 2.25, turnRate: 1.8 };

    if (player.inVehicle) {
      const throttle = forwardPressed ? 1 : backPressed ? -1 : 0;
      const targetVehicleSpeed =
        throttle > 0 ? vehicleTuning.maxSpeed : throttle < 0 ? -vehicleTuning.reverseSpeed : 0;
      const response =
        throttle === 0 ? vehicleTuning.friction : throttle > 0 ? vehicleTuning.acceleration : vehicleTuning.braking;

      vehicleSpeedRef.current = THREE.MathUtils.lerp(
        vehicleSpeedRef.current,
        targetVehicleSpeed,
        Math.min(1, delta * response)
      );

      if (throttle === 0 && Math.abs(vehicleSpeedRef.current) < 0.08) {
        vehicleSpeedRef.current = 0;
      }

      const steer = (leftPressed ? 1 : 0) - (rightPressed ? 1 : 0);
      if (steer && Math.abs(vehicleSpeedRef.current) > 0.12) {
        const directionSign = vehicleSpeedRef.current >= 0 ? 1 : -1;
        const speedFactor = THREE.MathUtils.clamp(Math.abs(vehicleSpeedRef.current) / vehicleTuning.maxSpeed, 0.32, 1);
        yawRef.current += steer * vehicleTuning.turnRate * speedFactor * directionSign * delta;
      }
    }

    forward.set(-Math.sin(yawRef.current), 0, -Math.cos(yawRef.current));
    right.set(Math.cos(yawRef.current), 0, -Math.sin(yawRef.current));
    walk.set(0, 0, 0);

    if (player.inVehicle) {
      if (vehicleSpeedRef.current >= 0) {
        walk.copy(forward);
      } else {
        walk.copy(forward).multiplyScalar(-1);
      }
    } else {
      if (forwardPressed) walk.add(forward);
      if (backPressed) walk.sub(forward);
      if (leftPressed) walk.sub(right);
      if (rightPressed) walk.add(right);
    }

    const nearby = findNearestInteraction(position, civilians, vehicles, buildings, snapshot.shop, player.inVehicle);
    const interactLabel = nearby ? `${nearby.label} [E]` : "Move close to an NPC, vehicle or shop, then press E.";
    const nextInteractId = nearby ? nearby.id : "__none__";

    if (nextInteractId !== lastInteractIdRef.current) {
      lastInteractIdRef.current = nextInteractId;
      setInteractState(nearby, Boolean(nearby), interactLabel);
      if (nearby) {
        debugLog("input", "nearby-target", { id: nearby.id, type: nearby.type });
      } else {
        debugLog("input", "nearby-target-cleared");
      }
    }

    const targetSpeed = player.inVehicle ? Math.abs(vehicleSpeedRef.current) : walkSpeed;
    const acceleration = player.inVehicle ? 16 : walk.lengthSq() > 0 ? 10 : groundedRef.current ? 7.5 : 2.4;
    const desiredDirection = walk.lengthSq() > 0 ? walk.clone().normalize() : walk;
    const desiredVX = desiredDirection.x * targetSpeed;
    const desiredVZ = desiredDirection.z * targetSpeed;

    horizontalVelocityRef.current.x = THREE.MathUtils.lerp(
      horizontalVelocityRef.current.x,
      desiredVX,
      Math.min(1, delta * acceleration)
    );
    horizontalVelocityRef.current.z = THREE.MathUtils.lerp(
      horizontalVelocityRef.current.z,
      desiredVZ,
      Math.min(1, delta * acceleration)
    );

    if (jumpQueuedRef.current && groundedRef.current && !player.inVehicle) {
      verticalVelocityRef.current = 7.2;
      groundedRef.current = false;
      jumpQueuedRef.current = false;
      debugLog("input", "jump");
    }

    if (!groundedRef.current) {
      verticalVelocityRef.current -= 18 * delta;
    }

    let blocked = false;
    let desiredMoveX = horizontalVelocityRef.current.x * delta;
    let desiredMoveZ = horizontalVelocityRef.current.z * delta;
    const clampedTarget = clampWorld(
      { x: position.x + desiredMoveX, z: position.z + desiredMoveZ },
      movementBounds,
      player.inVehicle ? 6 : 4
    );
    desiredMoveX = clampedTarget.x - position.x;
    desiredMoveZ = clampedTarget.z - position.z;

    if (collidesAt(position.x + desiredMoveX, position.z)) {
      blocked = true;
      desiredMoveX = 0;
      horizontalVelocityRef.current.x *= 0.2;
    }

    if (collidesAt(position.x + desiredMoveX, position.z + desiredMoveZ)) {
      blocked = true;
      desiredMoveZ = 0;
      horizontalVelocityRef.current.z *= 0.2;
    }

    const body = playerBodyRef.current;
    const collider = body?.numColliders() ? body.collider(0) : null;
    const controller = characterControllerRef.current;
    const desiredMoveY = groundedRef.current ? 0 : verticalVelocityRef.current * delta;
    let physicsGrounded = false;
    let nextX = position.x + desiredMoveX;
    let nextY = position.y + desiredMoveY;
    let nextZ = position.z + desiredMoveZ;

    if (controller && collider) {
      controller.computeColliderMovement(collider, {
        x: desiredMoveX,
        y: desiredMoveY,
        z: desiredMoveZ,
      });
      const correctedMove = controller.computedMovement();
      nextX = position.x + correctedMove.x;
      nextY = position.y + correctedMove.y;
      nextZ = position.z + correctedMove.z;
      physicsGrounded = controller.computedGrounded();

      if (
        Math.abs(correctedMove.x - desiredMoveX) > 0.015 ||
        Math.abs(correctedMove.z - desiredMoveZ) > 0.015
      ) {
        blocked = true;
        horizontalVelocityRef.current.x *= 0.35;
        horizontalVelocityRef.current.z *= 0.35;
      }
    }

    const terrainHeight = sampleDolomiteHeight(nextX, nextZ, snapshot.bounds);
    const groundY = terrainHeight + PLAYER_CENTER_OFFSET;

    if (nextY <= groundY || (!physicsGrounded && groundedRef.current)) {
      nextY = groundY;
      verticalVelocityRef.current = 0;
      groundedRef.current = true;
    } else if (physicsGrounded) {
      verticalVelocityRef.current = 0;
      groundedRef.current = true;
    } else {
      groundedRef.current = false;
    }

    positionRef.current = { x: nextX, y: nextY, z: nextZ };
    body?.setNextKinematicTranslation({ x: nextX, y: nextY, z: nextZ });

    if (player.inVehicle) {
      moveVehicle(player.inVehicle, {
        x: nextX,
        y: terrainHeight + (player.inVehicle === "bike" ? 0.7 : 0.8),
        z: nextZ,
        rotation: yawRef.current,
      });

      const now = performance.now();
      const vehicleSpeedKmh = Math.round(Math.abs(vehicleSpeedRef.current) * 6.2);
      if (now - lastVehicleSpeedSyncRef.current > 140 && vehicleSpeedKmh !== player.vehicleSpeedKmh) {
        lastVehicleSpeedSyncRef.current = now;
        setVehicleSpeedKmh(vehicleSpeedKmh);
      }
    }

    if (
      Number.isNaN(lastPositionRef.current.x) ||
      Math.abs(nextX - lastPositionRef.current.x) > 0.03 ||
      Math.abs(nextZ - lastPositionRef.current.z) > 0.03 ||
      Math.abs(nextY - position.y) > 0.03
    ) {
      lastPositionRef.current = { x: nextX, z: nextZ };
      setPlayerPosition({ x: nextX, y: nextY, z: nextZ });
    }

    const movementState = blocked
      ? "blocked"
      : !groundedRef.current
        ? "airborne"
        : (player.inVehicle ? Math.abs(vehicleSpeedRef.current) > 0.15 : walk.lengthSq() > 0) ||
          Math.abs(horizontalVelocityRef.current.x) > 0.15 ||
          Math.abs(horizontalVelocityRef.current.z) > 0.15
        ? player.inVehicle
          ? "driving"
          : "moving"
        : "idle";

    if (movementState !== lastMovementStateRef.current) {
      lastMovementStateRef.current = movementState;
      setMovementState(movementState);
    }

    camera.position.set(nextX, player.inVehicle ? nextY + 1.0 : nextY + 0.45, nextZ);
    cameraEuler.set(pitchRef.current, yawRef.current, 0);
    camera.quaternion.setFromEuler(cameraEuler);
    camera.updateMatrixWorld();

    heatCooldownAccumulatorRef.current += delta;
    if (player.heat > 0 && heatCooldownAccumulatorRef.current >= 0.55) {
      coolHeat(player.inVehicle ? 0.8 : 1.3);
      heatCooldownAccumulatorRef.current = 0;
    }

    if (debugEnabled && performance.now() - lastMovementLogRef.current > 350) {
      lastMovementLogRef.current = performance.now();
      debugLog("movement", "tick", {
        position: { x: Number(nextX.toFixed(2)), z: Number(nextZ.toFixed(2)) },
        blocked,
        mode: player.inVehicle || "foot",
        y: Number(nextY.toFixed(2)),
        grounded: groundedRef.current,
      });
    }
  });

  return (
    <RigidBody
      ref={playerBodyRef}
      type="kinematicPosition"
      colliders={false}
      enabledRotations={[false, false, false]}
      position={[positionRef.current.x, positionRef.current.y, positionRef.current.z]}
    >
      <CapsuleCollider args={[PLAYER_HALF_HEIGHT, PLAYER_RADIUS]} friction={0.2} />
    </RigidBody>
  );
}
