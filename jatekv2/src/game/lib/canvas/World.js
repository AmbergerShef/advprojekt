import { Building } from "./Building.js";

function rectIntersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.z < b.z + b.depth &&
    a.z + a.depth > b.z
  );
}

export class World {
  constructor({ width, depth, buildings, roads = [], grassPatches = [] }) {
    this.width = width;
    this.depth = depth;
    this.buildings = buildings.map((item) => new Building(item));
    this.roads = roads;
    this.grassPatches = grassPatches;

    this.staticCanvas = document.createElement("canvas");
    this.staticCanvas.width = width;
    this.staticCanvas.height = depth;
    this.staticCtx = this.staticCanvas.getContext("2d");
    this.prepared = false;
    this.camera = null;
  }

  prepareStaticLayer(patterns) {
    const ctx = this.staticCtx;
    ctx.clearRect(0, 0, this.width, this.depth);

    ctx.fillStyle = patterns.grass || "#2b3b23";
    ctx.fillRect(0, 0, this.width, this.depth);

    ctx.save();
    ctx.fillStyle = patterns.road || "#2f2f33";
    for (const road of this.roads) {
      ctx.fillRect(road.x, road.z, road.width, road.depth);
    }
    ctx.restore();

    ctx.save();
    ctx.fillStyle = patterns.sidewalk || "#6a6a6a";
    for (const road of this.roads) {
      ctx.fillRect(road.x - 4, road.z - 4, road.width + 8, 4);
      ctx.fillRect(road.x - 4, road.z + road.depth, road.width + 8, 4);
      ctx.fillRect(road.x - 4, road.z, 4, road.depth);
      ctx.fillRect(road.x + road.width, road.z, 4, road.depth);
    }
    ctx.restore();

    for (const patch of this.grassPatches) {
      ctx.fillStyle = patterns.park || "#4e8d42";
      ctx.fillRect(patch.x, patch.z, patch.width, patch.depth);
    }

    for (const building of this.buildings) {
      ctx.save();
      ctx.fillStyle = patterns.buildingBase || "rgba(120,120,140,0.26)";
      ctx.fillRect(building.x, building.z, building.width, building.depth);
      ctx.restore();
    }

    for (const building of this.buildings) {
      building.prepareFloorCache(patterns);
    }

    this.prepared = true;
  }

  getVisibleBuildings(cameraRect) {
    return this.buildings.filter((building) => rectIntersects(building.getBounds(), cameraRect));
  }

  getBuildingAtPoint(x, z) {
    return this.buildings.find((building) => building.containsPoint(x, z));
  }

  getInteriorState(playerRect) {
    const building = this.buildings.find((building) => building.findDoorZone(playerRect));
    if (!building) {
      return null;
    }

    const currentFloor = building.getFloorForPoint(playerRect.x + playerRect.width * 0.5, playerRect.z + playerRect.depth * 0.5);
    return {
      building,
      floor: currentFloor,
      inside: true,
    };
  }

  checkStairTransition(playerRect) {
    for (const building of this.buildings) {
      const stair = building.findStairZone(playerRect);
      if (stair) {
        return { building, stair };
      }
    }
    return null;
  }

  collideWithWorld(playerRect, layer) {
    for (const building of this.buildings) {
      if (!rectIntersects(playerRect, building.getBounds())) {
        continue;
      }
      const floor = building.getFloorForPoint(playerRect.x, playerRect.z) || building.floors[0];
      if (!floor || !floor.wallGrid) {
        return false;
      }
      const tileSize = 16;
      const localX = Math.floor((playerRect.x - (building.x + (floor.floorOffsetX ?? 0))) / tileSize);
      const localZ = Math.floor((playerRect.z - (building.z + (floor.floorOffsetZ ?? 0))) / tileSize);
      if (floor.wallGrid[localZ]?.[localX]) {
        return true;
      }
    }
    return false;
  }
}
