# Project pipeline

How this project is built, run, and deployed. Kept in sync with the actual
setup — if a command or path here stops working, fix this file in the same
change, not after.

## Stack

- **Node.js + Vite** — build tooling and dev server only. The app itself is
  100% client-side; Node/Vite never run in production.
- **React 18** — UI, function components + hooks only. State via React
  Context (`AppContext`, `UiContext`) + `useReducer`, no external state
  library, no routing library (tab state syncs to `location.hash` manually).
- **Plain CSS** — custom properties (design tokens) in `src/styles/index.css`
  for theming (light/dark), no CSS framework.
- **Firebase Hosting** — static hosting for the production build.

This split (Node for build only, fully static output) was a deliberate choice
made when the vanilla-JS app was refactored to Vite + React, to keep the app
deployable to any static host with no server/backend to run or pay for.

## Data architecture

- All user data lives in the browser's `localStorage`, under the key
  `personal-balance-sheet.v1` (see `src/state/initialState.js`). There is no
  backend, no database, no sync between devices.
- This means: data loads automatically on return visits to the same browser
  profile, survives restarts, but is lost if the user clears site data or
  switches browser/device — there is no server-side copy.
- **Backup/restore**: Settings → "Back up or move your data" — full-state
  JSON, copy/paste or file.
- **Export**: Settings → "Export to spreadsheet" — CSV of assets,
  liabilities, goals and snapshots (`src/lib/exportCsv.js`), for human
  reading in Excel/Sheets, not a backup replacement (lossy: formulas/settings
  fields are summarized, not a full state dump).

## Local development

```
npm install
npm run dev       # Vite dev server, hot reload
npm run build     # production build -> dist/
npm run preview   # serve the dist/ build locally
```

## Deployment — Firebase Hosting

Project: `the-balance-sheet` (see `.firebaserc`). Hosting config in
`firebase.json` (serves `dist/`, SPA rewrite to `index.html`).

```
npm run build
npx firebase deploy --only hosting
```

Live URL: https://the-balance-sheet.web.app

Firebase CLI (`firebase-tools`) is a devDependency, so `npx firebase` works
without a global install. First-time auth: `npx firebase login` (interactive
browser login — cannot be automated).

**Every deploy ships whatever is currently built into `dist/` — always run
`npm run build` immediately before `firebase deploy`, never deploy a stale
build.**

## Directory layout

- `src/lib/` — pure, framework-agnostic domain logic: categories, financial
  calculations (ratios, suggestions, borrowing power), formatting, CSV export.
- `src/state/` — reducer, localStorage persistence, `AppContext` (state +
  derived values + actions) and `UiContext` (modal sheet + toast) React
  contexts.
- `src/components/` — UI components; `views/` holds the six tabs (Overview,
  Assets, Liabilities, Plan, Borrowing power, Learn), `forms/` holds the
  add/edit sheets.
- `src/styles/index.css` — design tokens and component styles.
- `docs/` — this pipeline doc, the change log, and the improvement roadmap.
