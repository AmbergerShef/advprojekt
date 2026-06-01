function sidewalksForRoad(road) {
  const horizontal = road.width >= road.depth;
  const gap = horizontal ? road.depth / 2 + 3.2 : road.width / 2 + 3.2;
  const thickness = 4.4;

  if (horizontal) {
    return [
      { id: `${road.id}-north-walk`, x: road.x, z: road.z - gap, width: road.width, depth: thickness },
      { id: `${road.id}-south-walk`, x: road.x, z: road.z + gap, width: road.width, depth: thickness },
    ];
  }

  return [
    { id: `${road.id}-west-walk`, x: road.x - gap, z: road.z, width: thickness, depth: road.depth },
    { id: `${road.id}-east-walk`, x: road.x + gap, z: road.z, width: thickness, depth: road.depth },
  ];
}

export function createCuratedDistrictSnapshot() {
  const roads = [
    { id: "central-avenue", x: 0, z: 0, width: 390, depth: 24, type: "main" },
    { id: "north-avenue", x: 0, z: -94, width: 342, depth: 18, type: "secondary" },
    { id: "south-avenue", x: 0, z: 96, width: 342, depth: 18, type: "secondary" },
    { id: "market-street", x: -118, z: 0, width: 20, depth: 244, type: "main" },
    { id: "station-street", x: 0, z: 0, width: 20, depth: 244, type: "main" },
    { id: "garage-street", x: 126, z: 0, width: 22, depth: 244, type: "main" },
    { id: "depot-loop", x: 72, z: -148, width: 190, depth: 16, type: "service" },
    { id: "park-lane", x: -80, z: 148, width: 190, depth: 16, type: "service" },
  ];

  const buildings = [
    { id: "market-hall", x: -166, z: -42, width: 44, depth: 58, height: 18, kind: "shop", roofShape: "flat" },
    { id: "corner-store", x: -78, z: -44, width: 36, depth: 42, height: 15, kind: "shop", roofShape: "flat" },
    { id: "market-flats", x: -166, z: 48, width: 42, depth: 54, height: 31, kind: "mixed", roofShape: "flat" },
    { id: "row-house-1", x: -176, z: -128, width: 28, depth: 34, height: 12, kind: "house", roofShape: "hip" },
    { id: "row-house-2", x: -132, z: -128, width: 28, depth: 34, height: 12, kind: "house", roofShape: "hip" },
    { id: "row-house-3", x: -176, z: 132, width: 28, depth: 34, height: 12, kind: "house", roofShape: "hip" },
    { id: "row-house-4", x: -132, z: 132, width: 28, depth: 34, height: 12, kind: "house", roofShape: "hip" },
    { id: "central-office", x: -46, z: -48, width: 42, depth: 52, height: 42, kind: "office", roofShape: "flat" },
    { id: "north-apartment", x: 46, z: -48, width: 44, depth: 52, height: 34, kind: "residential", roofShape: "flat" },
    { id: "south-apartment", x: -46, z: 48, width: 42, depth: 52, height: 29, kind: "residential", roofShape: "flat" },
    { id: "courier-depot", x: 56, z: -126, width: 58, depth: 32, height: 14, kind: "service", roofShape: "flat" },
    { id: "warehouse-north", x: 138, z: -126, width: 54, depth: 34, height: 15, kind: "service", roofShape: "flat" },
    { id: "garage-main", x: 166, z: -42, width: 54, depth: 38, height: 13, kind: "garage", roofShape: "flat" },
    { id: "garage-service", x: 166, z: 44, width: 46, depth: 34, height: 12, kind: "garage", roofShape: "flat" },
    { id: "hideout", x: 154, z: 132, width: 52, depth: 34, height: 14, kind: "garage", roofShape: "flat" },
    { id: "park-villas", x: -48, z: 132, width: 38, depth: 30, height: 14, kind: "house", roofShape: "hip" },
  ];

  const parks = [
    { id: "market-square", x: -118, z: 52, width: 56, depth: 48 },
    { id: "south-park", x: -76, z: 126, width: 86, depth: 42 },
    { id: "garage-yard", x: 126, z: 86, width: 78, depth: 42 },
  ];

  return {
    meta: {
      name: "Mountain Ring District",
      centerLat: 47.49791,
      centerLon: 19.05421,
      source: "handcrafted-playable-district-v2",
      sourceMode: "curated",
    },
    bounds: { width: 430, depth: 360 },
    roads,
    sidewalks: roads.flatMap(sidewalksForRoad),
    buildings,
    parks,
    poi: [
      { id: "spawn", x: -12, z: 28, label: "Safe Spawn" },
      { id: "market", x: -138, z: -18, label: "Market" },
      { id: "garage", x: 158, z: -18, label: "Garage Row" },
      { id: "courier", x: 56, z: -148, label: "Courier Depot" },
      { id: "trail", x: 8, z: 184, label: "Forest Trail" },
    ],
    playerSpawn: { x: -12, y: 1.25, z: 28 },
    missionMarkers: [
      { id: "pickup", x: -142, y: 0, z: 52 },
      { id: "courier", x: 56, y: 0, z: -148 },
      { id: "bag", x: 116, y: 0, z: 96 },
    ],
    vehicleSpawns: [
      { id: "car", type: "car", x: 18, y: 0.8, z: 0, rotation: Math.PI / 2 },
      { id: "bike", type: "bike", x: 64, y: 0.7, z: -154, rotation: Math.PI / 2 },
    ],
    shop: { x: -138, y: 0, z: -18 },
  };
}
