import { createPattern } from "./AssetLoader.js";

function rectContainsPoint(rect, x, z) {
  return x >= rect.x && x <= rect.x + rect.width && z >= rect.z && z <= rect.z + rect.depth;
}

function rectIntersects(rectA, rectB) {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.z < rectB.z + rectB.depth &&
    rectA.z + rectA.depth > rectB.z
  );
}

function createFloorCanvas(floor, patterns) {
  const tileSize = 16;
  const width = floor.width * tileSize;
  const height = floor.depth * tileSize;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = patterns.floor || "#333";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;

  for (let z = 0; z < floor.depth; z += 1) {
    for (let x = 0; x < floor.width; x += 1) {
      if (floor.wallGrid[z]?.[x]) {
        ctx.fillStyle = patterns.wall || "#555";
        ctx.fillRect(x * tileSize, z * tileSize, tileSize, tileSize);
      }
    }
  }

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  for (let z = 0; z <= floor.depth; z += 1) {
    ctx.beginPath();
    ctx.moveTo(0, z * tileSize);
    ctx.lineTo(width, z * tileSize);
    ctx.stroke();
  }
  for (let x = 0; x <= floor.width; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * tileSize, 0);
    ctx.lineTo(x * tileSize, height);
    ctx.stroke();
  }

  return canvas;
}

export class Building {
  constructor(config) {
    this.id = config.id;
    this.x = config.x;
    this.z = config.z;
    this.width = config.width;
    this.depth = config.depth;
    this.height = config.height;
    this.roofOffset = config.roofOffset ?? 12;
    this.floors = config.floors || [];
    this.doorZones = config.doors || [];
    this.stairZones = config.stairs || [];
    this.visible = true;
    this.floorCache = new Map();
  }

  getBounds() {
    return { x: this.x, z: this.z, width: this.width, depth: this.depth };
  }

  isVisible(cameraRect) {
    return rectIntersects(this.getBounds(), cameraRect);
  }

  containsPoint(x, z) {
    return rectContainsPoint(this.getBounds(), x, z);
  }

  getFloorForPoint(x, z) {
    if (!this.containsPoint(x, z)) {
      return null;
    }

    for (const floor of this.floors) {
      if (!floor.floorPlan) {
        return floor;
      }
      if (rectContainsPoint({ x: this.x + floor.floorOffsetX, z: this.z + floor.floorOffsetZ, width: floor.width, depth: floor.depth }, x, z)) {
        return floor;
      }
    }

    return this.floors[0] || null;
  }

  findDoorZone(playerRect) {
    return this.doorZones.find((door) => rectIntersects(playerRect, door.rect));
  }

  findStairZone(playerRect) {
    return this.stairZones.find((stair) => rectIntersects(playerRect, stair.rect));
  }

  prepareFloorCache(patterns) {
    for (const floor of this.floors) {
      if (!this.floorCache.has(floor.level)) {
        const floorCanvas = createFloorCanvas(floor, patterns);
        this.floorCache.set(floor.level, floorCanvas);
      }
    }
  }

  renderRoof(ctx, camera, patterns, hidden = false) {
    if (hidden) {
      return;
    }

    const offset = (this.height * 0.25) * camera.perspectiveScale;
    const x = this.x - camera.x;
    const z = this.z - camera.z;
    const roofWidth = this.width;
    const roofDepth = this.depth;

    ctx.save();
    ctx.translate(x, z - offset);
    ctx.fillStyle = patterns.roof || "#b57b50";
    ctx.fillRect(0, 0, roofWidth, roofDepth);
    ctx.strokeStyle = "rgba(0,0,0,0.16)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, roofWidth, roofDepth);
    ctx.restore();
  }

  renderWalls(ctx, camera, patterns, onlyVisible = true) {
    const wallThickness = 8;
    const offset = this.height * 0.25 * camera.perspectiveScale;

    const floor = this.floors[0] || { level: 0 };
    const x = this.x - camera.x;
    const z = this.z - camera.z;

    const wallPattern = patterns.wall || "#666";

    const faces = [
      { x: x, z: z, w: this.width, h: wallThickness, direction: "north" },
      { x: x, z: z + this.depth - wallThickness, w: this.width, h: wallThickness, direction: "south" },
      { x: x, z: z, w: wallThickness, h: this.depth, direction: "west" },
      { x: x + this.width - wallThickness, z: z, w: wallThickness, h: this.depth, direction: "east" },
    ];

    for (const face of faces) {
      if (onlyVisible && !rectIntersects(face, camera.getWorldRect())) {
        continue;
      }
      ctx.save();
      ctx.translate(face.x, face.z);
      ctx.fillStyle = wallPattern;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(face.w, 0);
      ctx.lineTo(face.w, face.h);
      ctx.lineTo(0, face.h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    const pseudo3D = { x: 0, z: -offset };
    ctx.save();
    ctx.translate(pseudo3D.x, pseudo3D.z);
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(x, z, this.width, this.depth);
    ctx.restore();
  }

  renderInterior(ctx, camera, currentFloorLevel, patterns, fadeAlpha = 1) {
    const floorCanvas = this.floorCache.get(currentFloorLevel);
    if (!floorCanvas) {
      return;
    }

    const x = this.x - camera.x;
    const z = this.z - camera.z;
    const floor = this.floors.find((floorItem) => floorItem.level === currentFloorLevel);
    if (!floor) {
      return;
    }

    const drawX = x + (floor.floorOffsetX ?? 0);
    const drawZ = z + (floor.floorOffsetZ ?? 0);

    ctx.save();
    ctx.globalAlpha = fadeAlpha;
    ctx.drawImage(floorCanvas, drawX, drawZ);
    ctx.restore();
  }
}
