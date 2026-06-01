export function pointInBuilding(x, z, buildings, padding = 1.2) {
  return buildings.some((building) => {
    const minX = building.x - building.width / 2 - padding;
    const maxX = building.x + building.width / 2 + padding;
    const minZ = building.z - building.depth / 2 - padding;
    const maxZ = building.z + building.depth / 2 + padding;
    return x > minX && x < maxX && z > minZ && z < maxZ;
  });
}

export function clampWorld(position, bounds, inset = 4) {
  return {
    x: Math.min(bounds.width / 2 - inset, Math.max(-bounds.width / 2 + inset, position.x)),
    z: Math.min(bounds.depth / 2 - inset, Math.max(-bounds.depth / 2 + inset, position.z)),
  };
}
