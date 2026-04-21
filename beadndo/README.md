# Waste-to-Energy Europe Portfolio

This repository is deployed as a Vite-built React site on GitHub Pages.

The current codebase is intentionally split into three layers:

- `src/`: React sections, components, hooks, and app-level styling.
- `modules/`: imperative DOM/chart helpers still used by the React shell.
- `public/runtime/`: browser-loaded runtime files that expose `window.chartData`, `window.siteI18n`, and chart configuration for the Vega-based visualizations.

Supporting folders:

- `data/`: source CSV files used to generate the runtime chart bundle.
- `assets/`: images used by the site and presentation material.
- `scripts/`: maintenance scripts, including data refresh.
- `.github/workflows/`: CI/CD, including GitHub Pages deployment.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The app builds into `dist/`, and the Pages workflow deploys that folder.

## GitHub Pages setup

In the GitHub repository settings:

1. Open `Settings -> Pages`.
2. Set `Source` to `GitHub Actions`.
3. Push to `main` or run the `Deploy GitHub Pages` workflow manually.

## Notes for future cleanup

- The repo still contains a mixed React + imperative chart runtime. That is expected for now.
- `public/runtime/chart-data.js` is generated from the CSV files in `data/` by `scripts/update_data.py`.
- If the local folder name is still the old typo (`beadndo`), treat that as a legacy workspace name rather than the canonical project name.
