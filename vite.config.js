import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const githubPagesBase =
  process.env.GITHUB_ACTIONS === "true" && repositoryName ? `/${repositoryName}/` : "/";
const rootDir = process.cwd();

const devAppMounts = {
  "waste-to-energy": resolve(rootDir, "beadndo", "dist"),
  "microsoft-vs-apple": resolve(rootDir, "adatelemzes-projekt"),
  "last-ring-arena": resolve(rootDir, "jatek-projekt"),
  "romanian-cities-population": resolve(rootDir, "romania-nepesseg")
};

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function fileResponse(res, filePath) {
  const extension = extname(filePath).toLowerCase();
  const type = contentTypes[extension] || "application/octet-stream";
  res.statusCode = 200;
  res.setHeader("Content-Type", type);
  res.end(readFileSync(filePath));
}

function resolveAppRequest(pathname) {
  const cleanPath = pathname.split("?")[0];
  const match = cleanPath.match(/^\/apps\/([^/]+)(?:\/(.*))?$/);

  if (!match) {
    return null;
  }

  const [, slug, rest = ""] = match;
  const sourceRoot = devAppMounts[slug];
  if (!sourceRoot) {
    return { status: 404 };
  }

  const candidate = rest ? join(sourceRoot, rest) : join(sourceRoot, "index.html");

  if (existsSync(candidate) && statSync(candidate).isFile()) {
    return { status: 200, filePath: candidate };
  }

  const indexCandidate = join(sourceRoot, "index.html");
  if (existsSync(indexCandidate) && statSync(indexCandidate).isFile()) {
    if (cleanPath.endsWith("/") || rest === "" || !extname(rest)) {
      return { status: 200, filePath: indexCandidate };
    }
  }

  return { status: 404 };
}

function siblingAppsMiddleware(req, res, next) {
  const pathname = req.url?.split("?")[0] || "/";
  const resolved = resolveAppRequest(pathname);

  if (!resolved) {
    next();
    return;
  }

  if (resolved.status === 404) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("App route not found.");
    return;
  }

  fileResponse(res, resolved.filePath);
}

export default defineConfig({
  base: githubPagesBase,
  plugins: [
    react(),
    {
      name: "serve-sibling-apps",
      configureServer(server) {
        server.middlewares.use(siblingAppsMiddleware);
      },
      configurePreviewServer(server) {
        server.middlewares.use(siblingAppsMiddleware);
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
