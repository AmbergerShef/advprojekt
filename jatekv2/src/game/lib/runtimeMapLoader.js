import { debugLog } from "./debug.js";
import { createCuratedDistrictSnapshot } from "../data/curatedDistrict.js";
import { normalizeSnapshot } from "./mapNormalization.js";

const bbox = {
  south: 47.4944,
  west: 19.0474,
  north: 47.5014,
  east: 19.0619,
};

const center = { lat: 47.49791, lon: 19.05421 };

function toLocal(lat, lon) {
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = Math.cos((center.lat * Math.PI) / 180) * 111320;
  return {
    x: (lon - center.lon) * metersPerDegreeLon * 0.45,
    z: -(lat - center.lat) * metersPerDegreeLat * 0.45,
  };
}

function average(points) {
  return points.reduce(
    (acc, point) => ({
      x: acc.x + point.x / points.length,
      z: acc.z + point.z / points.length,
    }),
    { x: 0, z: 0 }
  );
}

function extent(points) {
  const xs = points.map((point) => point.x);
  const zs = points.map((point) => point.z);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    depth: Math.max(...zs) - Math.min(...zs),
  };
}

function sidewalksForRoad(road) {
  const horizontal = road.width >= road.depth;
  const gap = horizontal ? road.depth / 2 + 2.2 : road.width / 2 + 2.2;
  const thickness = 3.6;

  if (horizontal) {
    return [
      { x: road.x, z: road.z - gap, width: road.width, depth: thickness },
      { x: road.x, z: road.z + gap, width: road.width, depth: thickness },
    ];
  }

  return [
    { x: road.x - gap, z: road.z, width: thickness, depth: road.depth },
    { x: road.x + gap, z: road.z, width: thickness, depth: road.depth },
  ];
}

async function fetchOnlineSnapshot() {
  const query = `
[out:json][timeout:25];
(
  way["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["highway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["footway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out body;
>;
out skel qt;
`.trim();

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: new URLSearchParams({ data: query }),
  });

  if (!response.ok) {
    throw new Error(`Overpass response ${response.status}`);
  }

  const payload = await response.json();
  const nodes = new Map(payload.elements.filter((element) => element.type === "node").map((node) => [node.id, node]));
  const ways = payload.elements.filter((element) => element.type === "way");

  const roads = ways
    .filter((way) => way.tags?.highway)
    .slice(0, 18)
    .map((way, index) => {
      const points = way.nodes
        .map((id) => nodes.get(id))
        .filter(Boolean)
        .map((node) => toLocal(node.lat, node.lon));

      if (points.length < 2) {
        return null;
      }

      const centerPoint = average(points);
      const size = extent(points);
      const type = way.tags?.highway === "primary" || way.tags?.highway === "secondary" ? "main" : "secondary";

      return {
        id: `road-${index + 1}`,
        x: Number(centerPoint.x.toFixed(2)),
        z: Number(centerPoint.z.toFixed(2)),
        width: Number(Math.max(type === "main" ? 18 : 12, size.width).toFixed(2)),
        depth: Number(Math.max(type === "main" ? 18 : 12, size.depth).toFixed(2)),
        type,
      };
    })
    .filter(Boolean);

  const sidewalks = roads.flatMap((road, index) =>
    sidewalksForRoad(road).map((sidewalk, offsetIndex) => ({
      id: `sidewalk-${index + 1}-${offsetIndex + 1}`,
      ...sidewalk,
    }))
  );

  const buildings = ways
    .filter((way) => way.tags?.building)
    .slice(0, 60)
    .map((way, index) => {
      const points = way.nodes
        .map((id) => nodes.get(id))
        .filter(Boolean)
        .map((node) => toLocal(node.lat, node.lon));

      if (points.length < 3) {
        return null;
      }

      const centerPoint = average(points);
      const size = extent(points);
      const explicitHeight = Number(way.tags?.height);
      const levels = Number(way.tags?.["building:levels"]);

      return {
        id: `building-${index + 1}`,
        x: Number(centerPoint.x.toFixed(2)),
        z: Number(centerPoint.z.toFixed(2)),
        width: Number(Math.max(8, size.width).toFixed(2)),
        depth: Number(Math.max(8, size.depth).toFixed(2)),
        height: Number((explicitHeight || (Number.isFinite(levels) ? levels * 3.4 : 14 + (index % 5) * 4)).toFixed(2)),
        kind: way.tags?.building === "commercial" || way.tags?.amenity ? "office" : "residential",
        roofShape: way.tags?.["roof:shape"] || "flat",
      };
    })
    .filter(Boolean);

  return normalizeSnapshot({
    meta: {
      name: "Budapest Inner District Snapshot",
      source: "online-overpass",
      sourceMode: "live",
    },
    buildings,
    roads,
    sidewalks,
    parks: [{ x: -138, z: 112, width: 66, depth: 54 }],
    poi: [],
    shop: { x: -40, y: 0, z: 24 },
    playerSpawn: { x: 0, y: 1.25, z: 0 },
  });
}

async function fetchFallbackSnapshot() {
  const snapshot = createCuratedDistrictSnapshot();
  return {
    ...snapshot,
    meta: {
      ...snapshot.meta,
      sourceMode: "fallback",
    },
  };
}

export async function loadRuntimeMap(setProgress) {
  debugLog("map", "runtime map load started");
  setProgress?.("input-ready");

  try {
    setProgress?.("map-loading");
    const curated = await fetchFallbackSnapshot();
    debugLog("map", "curated fallback map loaded", {
      buildings: curated.buildings.length,
      roads: curated.roads.length,
      sidewalks: curated.sidewalks.length,
    });
    setProgress?.("world-ready");
    return curated;
  } catch (error) {
    debugLog("map", "curated fallback map failed, trying online map", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  try {
    setProgress?.("map-loading");
    const online = await fetchOnlineSnapshot();
    debugLog("map", "online map loaded", {
      buildings: online.buildings.length,
      roads: online.roads.length,
      sidewalks: online.sidewalks.length,
    });
    setProgress?.("world-ready");
    return online;
  } catch (error) {
    debugLog("map", "online map failed, using fallback", {
      error: error instanceof Error ? error.message : String(error),
    });
    const fallback = await fetchFallbackSnapshot();
    setProgress?.("world-ready");
    return fallback;
  }
}
