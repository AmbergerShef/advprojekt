const DEFAULT_BOUNDS = { width: 280, depth: 240 };

function avgPair(min, max) {
  return (min + max) / 2;
}

function mapPoint(item, centerX, centerZ, scale) {
  return {
    ...item,
    x: Number((((item.x || 0) - centerX) * scale).toFixed(2)),
    z: Number((((item.z || 0) - centerZ) * scale).toFixed(2)),
  };
}

export function normalizeSnapshot(snapshot) {
  if (snapshot.meta?.sourceMode === "curated") {
    return {
      ...snapshot,
      bounds: snapshot.bounds || DEFAULT_BOUNDS,
    };
  }

  const anchors = [...(snapshot.buildings || []), ...(snapshot.roads || []), ...(snapshot.sidewalks || [])];
  if (!anchors.length) {
    return {
      ...snapshot,
      bounds: DEFAULT_BOUNDS,
    };
  }

  const xs = anchors.map((entry) => entry.x || 0);
  const zs = anchors.map((entry) => entry.z || 0);
  const centerX = avgPair(Math.min(...xs), Math.max(...xs));
  const centerZ = avgPair(Math.min(...zs), Math.max(...zs));
  const spanX = Math.max(1, Math.max(...xs) - Math.min(...xs));
  const spanZ = Math.max(1, Math.max(...zs) - Math.min(...zs));
  const scale = Math.min(1, 190 / Math.max(spanX, spanZ));

  return {
    ...snapshot,
    bounds: DEFAULT_BOUNDS,
    buildings: (snapshot.buildings || []).map((building) => ({
      ...mapPoint(building, centerX, centerZ, scale),
      width: Math.max(8, (building.width || 8) * scale),
      depth: Math.max(8, (building.depth || 8) * scale),
      height: Math.max(10, building.height || 16),
    })),
    roads: (snapshot.roads || []).map((road) => ({
      ...mapPoint(road, centerX, centerZ, scale),
      width: Math.max(12, (road.width || 12) * scale),
      depth: Math.max(12, (road.depth || 12) * scale),
    })),
    sidewalks: (snapshot.sidewalks || []).map((sidewalk) => ({
      ...mapPoint(sidewalk, centerX, centerZ, scale),
      width: Math.max(4, (sidewalk.width || 4) * scale),
      depth: Math.max(4, (sidewalk.depth || 4) * scale),
    })),
    parks: (snapshot.parks || []).map((park) => ({
      ...mapPoint(park, centerX, centerZ, scale),
      width: Math.max(10, (park.width || 10) * scale),
      depth: Math.max(10, (park.depth || 10) * scale),
    })),
    poi: (snapshot.poi || []).map((poi) => mapPoint(poi, centerX, centerZ, scale)),
    shop: snapshot.shop ? mapPoint(snapshot.shop, centerX, centerZ, scale) : snapshot.shop,
    playerSpawn: snapshot.playerSpawn
      ? {
          ...mapPoint(snapshot.playerSpawn, centerX, centerZ, scale),
          y: snapshot.playerSpawn.y || 1.25,
        }
      : { x: 0, y: 1.25, z: 0 },
  };
}
