import { loadAssets, getAssetPath, createPattern } from "./AssetLoader.js";
import { World } from "./World.js";
import { Renderer } from "./Renderer.js";

const CAMERA_DEFAULT = {
  x: 0,
  z: 0,
  zoom: 1.2,
  perspectiveScale: 0.7,
  viewWidth: 1024,
  viewHeight: 640,
  getWorldRect() {
    return {
      x: this.x,
      z: this.z,
      width: this.viewWidth / this.zoom,
      depth: this.viewHeight / this.zoom,
    };
  },
};

const PLAYER_DEFAULT = {
  x: 80,
  z: 180,
  size: 18,
  speed: 130,
  floor: 0,
  velocityX: 0,
  velocityZ: 0,
};

const INPUT_KEYS = {
  ArrowUp: { dz: -1 },
  ArrowDown: { dz: 1 },
  ArrowLeft: { dx: -1 },
  ArrowRight: { dx: 1 },
  KeyW: { dz: -1 },
  KeyS: { dz: 1 },
  KeyA: { dx: -1 },
  KeyD: { dx: 1 },
};

function normalizeDirection(dx, dz) {
  if (dx === 0 && dz === 0) {
    return { dx: 0, dz: 0 };
  }
  const length = Math.hypot(dx, dz);
  return { dx: dx / length, dz: dz / length };
}

function createRectangle(x, z, width, depth) {
  return { x, z, width, depth };
}

function rectIntersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.z < b.z + b.depth &&
    a.z + a.depth > b.z
  );
}

export class CanvasGame {
  constructor(container, { width = 1200, height = 740 } = {}) {
    this.container = container;
    this.canvas = document.createElement("canvas");
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.display = "block";
    this.canvas.width = width;
    this.canvas.height = height;
    this.container.appendChild(this.canvas);

    this.camera = { ...CAMERA_DEFAULT };
    this.camera.viewWidth = width;
    this.camera.viewHeight = height;

    this.player = { ...PLAYER_DEFAULT };
    this.world = null;
    this.renderer = null;
    this.patterns = {};
    this.currentFloor = 0;
    this.interiorState = null;
    this.inputState = { dx: 0, dz: 0 };
    this.lastTime = performance.now();
    this.running = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.loop = this.loop.bind(this);
  }

  async init() {
    const assets = await loadAssets({
      roof: getAssetPath("roof"),
      wall: getAssetPath("wall"),
      floor: getAssetPath("floor"),
      interiorFloor: getAssetPath("interiorFloor"),
    });

    const ctx = this.canvas.getContext("2d");
    this.patterns = {
      roof: createPattern(ctx, assets.roof),
      wall: createPattern(ctx, assets.wall),
      floor: createPattern(ctx, assets.floor),
      interiorFloor: createPattern(ctx, assets.interiorFloor),
      grass: "#244d27",
      road: "#2d2d33",
      sidewalk: "#646464",
      park: "#487e3f",
      buildingBase: "rgba(130,130,180,0.22)",
    };

    this.world = new World({
      width: 1100,
      depth: 900,
      roads: [
        { x: 40, z: 120, width: 860, depth: 84 },
        { x: 360, z: 50, width: 80, depth: 760 },
      ],
      grassPatches: [
        { x: 18, z: 18, width: 280, depth: 180 },
        { x: 480, z: 520, width: 420, depth: 220 },
      ],
      buildings: [
        {
          id: "market",
          x: 140,
          z: 412,
          width: 260,
          depth: 180,
          height: 76,
          floorOffsetX: 0,
          floorOffsetZ: 0,
          floors: [
            {
              level: 0,
              width: 260,
              depth: 180,
              floorOffsetX: 0,
              floorOffsetZ: 0,
              wallGrid: Array.from({ length: 12 }, (_, z) =>
                Array.from({ length: 16 }, (_, x) => z === 0 || z === 11 || x === 0 || x === 15)
              ),
            },
            {
              level: 1,
              width: 260,
              depth: 180,
              floorOffsetX: 0,
              floorOffsetZ: 0,
              wallGrid: Array.from({ length: 12 }, (_, z) =>
                Array.from({ length: 16 }, (_, x) => z === 0 || z === 11 || x === 0 || x === 15)
              ),
            },
          ],
          doors: [
            { rect: createRectangle(220, 412, 20, 30), type: "entrance", targetFloor: 0 },
          ],
          stairs: [
            { rect: createRectangle(170, 480, 30, 30), fromFloor: 0, toFloor: 1 },
          ],
        },
        {
          id: "garage",
          x: 600,
          z: 240,
          width: 220,
          depth: 300,
          height: 88,
          floors: [
            {
              level: 0,
              width: 220,
              depth: 300,
              floorOffsetX: 0,
              floorOffsetZ: 0,
              wallGrid: Array.from({ length: 18 }, (_, z) =>
                Array.from({ length: 14 }, (_, x) => z === 0 || z === 17 || x === 0 || x === 13)
              ),
            },
            {
              level: 1,
              width: 220,
              depth: 300,
              floorOffsetX: 0,
              floorOffsetZ: 0,
              wallGrid: Array.from({ length: 18 }, (_, z) =>
                Array.from({ length: 14 }, (_, x) => z === 0 || z === 17 || x === 0 || x === 13)
              ),
            },
          ],
          doors: [
            { rect: createRectangle(700, 240, 30, 40), type: "garage-entrance", targetFloor: 0 },
          ],
          stairs: [
            { rect: createRectangle(660, 330, 28, 28), fromFloor: 0, toFloor: 1 },
          ],
        },
      ],
    });

    this.world.prepareStaticLayer(this.patterns);
    this.renderer = new Renderer(this.canvas, this.world, this.patterns, this.camera);
    this.centerCameraOnPlayer();
    this.addEventListeners();
    return this;
  }

  addEventListeners() {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
  }

  removeEventListeners() {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
  }

  onKeyDown(event) {
    const entry = INPUT_KEYS[event.code];
    if (!entry) {
      return;
    }
    this.inputState.dx += entry.dx || 0;
    this.inputState.dz += entry.dz || 0;
    event.preventDefault();
  }

  onKeyUp(event) {
    const entry = INPUT_KEYS[event.code];
    if (!entry) {
      return;
    }
    this.inputState.dx -= entry.dx || 0;
    this.inputState.dz -= entry.dz || 0;
    event.preventDefault();
  }

  centerCameraOnPlayer() {
    this.camera.x = Math.max(0, Math.min(this.player.x - (this.camera.viewWidth / this.camera.zoom) * 0.5, this.world.width - this.camera.viewWidth / this.camera.zoom));
    this.camera.z = Math.max(0, Math.min(this.player.z - (this.camera.viewHeight / this.camera.zoom) * 0.5, this.world.depth - this.camera.viewHeight / this.camera.zoom));
  }

  getPlayerRect() {
    const half = this.player.size * 0.5;
    return createRectangle(this.player.x - half, this.player.z - half, this.player.size, this.player.size);
  }

  update(delta) {
    const { dx, dz } = normalizeDirection(this.inputState.dx, this.inputState.dz);
    const speed = this.player.speed * delta;
    const nextX = this.player.x + dx * speed;
    const nextZ = this.player.z + dz * speed;

    const nextRect = createRectangle(nextX - this.player.size * 0.5, nextZ - this.player.size * 0.5, this.player.size, this.player.size);

    if (!this.world.collideWithWorld(nextRect, this.player.floor)) {
      this.player.x = nextX;
      this.player.z = nextZ;
    }

    const buildingAtPlayer = this.world.getBuildingAtPoint(this.player.x, this.player.z);
    const doorState = this.world.getInteriorState(nextRect);

    if (doorState) {
      this.interiorState = doorState;
      this.currentFloor = doorState.floor?.level ?? 0;
    } else if (this.interiorState?.building && buildingAtPlayer?.id === this.interiorState.building.id) {
      this.interiorState = {
        building: this.interiorState.building,
        floor: this.interiorState.building.floors.find((floor) => floor.level === this.currentFloor) || this.interiorState.floor,
        inside: true,
      };
    } else {
      this.interiorState = null;
    }

    const stair = this.world.checkStairTransition(nextRect);
    if (stair) {
      if (stair.stair.toFloor > stair.stair.fromFloor) {
        this.currentFloor = Math.min(this.currentFloor + 1, 3);
      } else {
        this.currentFloor = Math.max(this.currentFloor - 1, 0);
      }
      this.interiorState = {
        building: stair.building,
        floor: stair.building.floors.find((floor) => floor.level === this.currentFloor),
        inside: true,
      };
    }

    this.centerCameraOnPlayer();
  }

  loop() {
    if (!this.running) {
      return;
    }

    const now = performance.now();
    const delta = Math.min(0.033, (now - this.lastTime) / 1000);
    this.lastTime = now;

    this.update(delta);
    this.renderer.render(this.player, this.interiorState);
    requestAnimationFrame(this.loop);
  }

  start() {
    if (!this.renderer) {
      throw new Error("CanvasGame.init() must be called before start().");
    }
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    this.removeEventListeners();
  }
}
