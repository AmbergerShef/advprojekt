# Repository Navigation Notes

This repo is safe to treat as a Vite application first.

## Entry points

- App shell: `src/main.jsx`
- Top-level composition: `src/App.jsx`
- HTML template: `index.html`
- GitHub Pages workflow: `.github/workflows/deploy-pages.yml`

## Runtime split

- `src/` contains the React-driven page structure.
- `modules/` contains imperative chart/dashboard rendering logic invoked from `src/hooks/useImperativeUi.js`.
- `public/runtime/` contains page-loaded globals required by the imperative layer:
  - `chart-data.js`
  - `translations.js`
  - `chart-config.js`

## Data flow

1. Source CSVs live in `data/`.
2. `scripts/update_data.py` refreshes the CSVs and regenerates `public/runtime/chart-data.js`.
3. `index.html` loads the runtime globals before `src/main.jsx`.
4. React mounts the page, then `useImperativeUi()` triggers the chart/dashboard renderers.

## Deployment

- Local build: `npm run build`
- GitHub Pages artifact: `dist/`
- Publishing path: GitHub Actions, not the repository root

## Caution

- Do not delete `modules/` just because there is a `src/` folder. It is still active.
- Do not move `public/runtime/` files without updating `index.html` and the data-generation script.
