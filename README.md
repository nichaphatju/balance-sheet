# Personal Balance Sheet

A bilingual (EN/TH) personal finance dashboard: track assets and liabilities, see
net worth, key financial ratios, rule-based suggestions, a borrowing-power
calculator, and a short "learn" section.

## Stack

- **Node.js + Vite** for development and the production build.
- **React 18** for the UI (state via Context + `useReducer`, no routing library).
- Plain CSS with custom properties for theming (light/dark), no CSS framework.
- 100% client-side: all data is stored in the browser's `localStorage`
  (key `personal-balance-sheet.v1`). Nothing is sent to a server.

## Development

```
npm install
npm run dev       # starts the Vite dev server
npm run build      # production build to dist/
npm run preview    # serve the dist/ build locally
```

`dist/` is a static site — host it on any static host (GitHub Pages, Netlify,
Vercel, etc.).

## Project layout

- `src/lib/` — pure domain logic: categories, financial calculations
  (ratios, suggestions, borrowing power), and formatting helpers.
- `src/state/` — app state: the reducer, localStorage persistence, and the
  `AppContext` (state + derived values + actions) and `UiContext` (modal
  sheet + toast) React contexts.
- `src/components/` — UI components, with `views/` holding the six tabs
  (Overview, Assets, Liabilities, Plan, Borrowing power, Learn) and `forms/`
  holding the add/edit sheets.
- `src/styles/index.css` — design tokens and component styles.

## Backup & data portability

Settings → "Back up or move your data" exports/imports the full state as
JSON, since nothing is stored outside the browser.
