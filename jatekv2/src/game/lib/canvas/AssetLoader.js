import { assetUrl } from "../assetUrl.js";

const imageCache = new Map();

function createFallbackColorTexture(color, width = 64, height = 64) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(width, height);
  ctx.moveTo(width, 0);
  ctx.lineTo(0, height);
  ctx.stroke();
  return canvas;
}

function loadImage(path) {
  if (imageCache.has(path)) {
    return imageCache.get(path);
  }

  const url = assetUrl(path);
  const promise = new Promise((resolve) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => resolve(createFallbackColorTexture("#888"));
  });

  imageCache.set(path, promise);
  return promise;
}

export async function loadAssets(map) {
  const entries = Object.entries(map);
  const loaded = await Promise.all(entries.map(([key, path]) => loadImage(path).then((image) => [key, image])));
  return Object.fromEntries(loaded);
}

export function createPattern(ctx, image, repetition = "repeat") {
  return ctx.createPattern(image, repetition);
}

export function getAssetPath(key) {
  const assets = {
    roof: "/assets/textures/facade005/Facade005.png",
    wall: "/assets/textures/concrete_wall_001_diffuse.jpg",
    floor: "/assets/textures/asphalt020l/color.jpg",
    interiorFloor: "/assets/textures/facade014/Facade014_1K-JPG_Color.jpg",
  };
  return assets[key] || assets.floor;
}
