# Project Shell

This repository root is now intended to be the single homepage shell for the sibling project directories.

## Root behavior

- The root builds as a Vite + React app.
- The homepage acts as a launcher for the sibling apps.
- Published apps are emitted under `dist/apps/...`.

## Published app paths

- `apps/waste-to-energy/`
- `apps/microsoft-vs-apple/`
- `apps/last-ring-arena/`
- `apps/romanian-cities-population/`

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

That command:

1. Builds the root React shell.
2. Rebuilds `beadndo/`.
3. Copies the sibling app directories into `dist/apps/...`.
