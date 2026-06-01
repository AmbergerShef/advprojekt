import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const center = { lat: 47.49791, lon: 19.05421 };
const bbox = {
  south: 47.4944,
  west: 19.0474,
  north: 47.5014,
  east: 19.0619,
};

const overpassQuery = `
[out:json][timeout:25];
(
  way["building"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
  way["highway"](${bbox.south},${bbox.west},${bbox.north},${bbox.east});
);
out body;
>;
out skel qt;
`.trim();

function toLocal(lat, lon) {
  const metersPerDegreeLat = 111320;
  const metersPerDegreeLon = Math.cos((center.lat * Math.PI) / 180) * 111320;
  return {
    x: (lon - center.lon) * metersPerDegreeLon * 0.45,
    z: -(lat - center.lat) * metersPerDegreeLat * 0.45,
  };
}

function average(points) {
  const total = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      z: acc.z + point.z,
    }),
    { x: 0, z: 0 }
  );
  return {
    x: total.x / points.length,
    z: total.z / points.length,
  };
}

function extent(points) {
  const xs = points.map((point) => point.x);
  const zs = points.map((point) => point.z);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    depth: Math.max(...zs) - Math.min(...zs),
  };
}

const response = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "jatekv2-fps-builder/0.1",
  },
  body: new URLSearchParams({
    data: overpassQuery,
  }),
});

if (!response.ok) {
  throw new Error(`Overpass request failed: ${response.status}`);
}

const payload = await response.json();
const nodes = new Map(payload.elements.filter((element) => element.type === "node").map((node) => [node.id, node]));
const ways = payload.elements.filter((element) => element.type === "way");

const buildings = ways
  .filter((way) => way.tags?.building)
  .slice(0, 40)
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
    return {
      id: `osm-building-${index + 1}`,
      x: Number(centerPoint.x.toFixed(2)),
      z: Number(centerPoint.z.toFixed(2)),
      width: Number(Math.max(8, size.width).toFixed(2)),
      depth: Number(Math.max(8, size.depth).toFixed(2)),
      height: Number(
        (
          Number(way.tags?.height) ||
          Number(way.tags?.["building:levels"]) * 3.4 ||
          18 + (index % 5) * 4
        ).toFixed(2)
      ),
      kind: way.tags?.amenity ? "mixed" : "residential",
    };
  })
  .filter(Boolean);

const roads = ways
  .filter((way) => way.tags?.highway)
  .slice(0, 12)
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
    return {
      id: `osm-road-${index + 1}`,
      x: Number(centerPoint.x.toFixed(2)),
      z: Number(centerPoint.z.toFixed(2)),
      width: Number(Math.max(10, size.width).toFixed(2)),
      depth: Number(Math.max(10, size.depth).toFixed(2)),
      type: way.tags?.highway === "primary" ? "main" : "secondary",
    };
  })
  .filter(Boolean);

const snapshot = {
  meta: {
    name: "Budapest Inner District Snapshot",
    centerLat: center.lat,
    centerLon: center.lon,
    source: "overpass-api",
  },
  bounds: {
    width: 280,
    depth: 240,
  },
  roads,
  buildings,
  parks: [{ x: -138, z: 112, width: 66, depth: 54 }],
  playerSpawn: { x: -20, y: 1.25, z: 14 },
  missionMarkers: [
    { id: "pickup", x: -104, y: 0, z: 62 },
    { id: "courier", x: 120, y: 0, z: 104 },
    { id: "bag", x: 144, y: 0, z: -82 },
  ],
  vehicleSpawns: [
    { id: "car", type: "car", x: 22, y: 0.8, z: -10, rotation: 0 },
    { id: "bike", type: "bike", x: 100, y: 0.7, z: 18, rotation: Math.PI / 2 },
  ],
  shop: { x: -60, y: 0, z: 54 },
};

const output = resolve(process.cwd(), "public", "data", "citySnapshot.json");
writeFileSync(output, JSON.stringify(snapshot, null, 2), "utf8");
console.log(`Updated city snapshot at ${output}`);
