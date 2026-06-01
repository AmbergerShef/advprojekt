export function assetUrl(path) {
  const base = typeof import.meta !== "undefined" ? import.meta.env.BASE_URL || "./" : "./";
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  if (typeof document === "undefined") {
    return `${base}${normalizedPath}`;
  }

  return new URL(`${base}${normalizedPath}`, document.baseURI).toString();
}
