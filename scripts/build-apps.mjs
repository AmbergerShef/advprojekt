import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const distDir = resolve(root, "dist");
const appsDir = join(distDir, "apps");

const appCopies = [
  {
    kind: "vite-build",
    sourceDir: "beadndo",
    outDir: "waste-to-energy"
  },
  {
    kind: "static-copy",
    sourceDir: "adatelemzes-projekt",
    outDir: "microsoft-vs-apple"
  },
  {
    kind: "static-copy",
    sourceDir: "jatek-projekt",
    outDir: "last-ring-arena"
  },
  {
    kind: "static-copy",
    sourceDir: "romania-nepesseg",
    outDir: "romanian-cities-population"
  }
];

function ensureCleanDir(path) {
  rmSync(path, { recursive: true, force: true });
  mkdirSync(path, { recursive: true });
}

function rewriteBackLinks(targetDir) {
  const indexPath = join(targetDir, "index.html");
  if (!existsSync(indexPath)) {
    return;
  }

  const content = readFileSync(indexPath, "utf8")
    .replaceAll('href="../index.html"', 'href="../../index.html"')
    .replaceAll('href="../index.html#', 'href="../../index.html#');
  writeFileSync(indexPath, content, "utf8");
}

function copyStaticApp({ sourceDir, outDir }) {
  const sourcePath = resolve(root, sourceDir);
  const targetPath = join(appsDir, outDir);
  ensureCleanDir(targetPath);
  cpSync(sourcePath, targetPath, { recursive: true });
  rewriteBackLinks(targetPath);
}

function buildViteApp({ sourceDir, outDir }) {
  const sourcePath = resolve(root, sourceDir);
  const targetPath = join(appsDir, outDir);
  ensureCleanDir(targetPath);

  execFileSync(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "build"], {
    cwd: sourcePath,
    stdio: "inherit",
    env: {
      ...process.env,
      PATH: `/opt/homebrew/bin:${process.env.PATH || ""}`
    }
  });

  cpSync(join(sourcePath, "dist"), targetPath, { recursive: true });
}

mkdirSync(appsDir, { recursive: true });

for (const app of appCopies) {
  if (app.kind === "vite-build") {
    buildViteApp(app);
  } else {
    copyStaticApp(app);
  }
}
