# Change log

Dated log of completed work on this project. Newest first. This is a record
of *what shipped and why*, not a task list — see `ROADMAP.md` for planned
work.

## 2026-10-18 — Backup reminder + offline PWA (roadmap #1 and #2)

- **Backup-loss warning**: added `S.lastBackupAt`, set via a new
  `MARK_BACKED_UP` action whenever "Copy backup" succeeds in Settings. The
  Settings sheet now shows "Last backed up [date]" / "Never backed up" next
  to the backup section (same pattern as the snapshot "last saved"
  indicator), and `suggestions()` surfaces a `warn`-level nudge if it's
  unset or more than 30 days old — shorter than the existing 180-day
  stale-snapshot threshold, since data loss here is total and irreversible
  rather than just a gap in the trend chart.
- **Offline-capable installable PWA**: added `vite-plugin-pwa` (devDependency,
  chosen over a hand-written service worker for correct precache/cache-
  invalidation behavior on each deploy — see the roadmap decision). It
  generates a Workbox service worker (`registerType: 'autoUpdate'`) that
  precaches the app shell, and generates `manifest.webmanifest` from config
  in `vite.config.js` (removed the old static `public/manifest.webmanifest`
  and its manual `<link>` tag to avoid duplication). Switched `base` from
  `'./'` to `'/'` for correct service-worker scope/manifest resolution —
  safe since the app is only ever deployed to a Firebase Hosting domain
  root. Verified: service worker registers and activates, all 6 app-shell
  entries precache correctly, and the generated `NavigationRoute` serves
  `index.html` from cache for the SPA's hash-based routing.
- Both verified end-to-end in a real browser (production build via
  `vite preview`), not just a successful `npm run build`.
- **Cache-header fix** (`firebase.json`): Firebase Hosting's default
  `max-age=3600` was applying to `sw.js`, `index.html`, and
  `manifest.webmanifest`, meaning a browser could serve a stale service
  worker/entry point for up to an hour after a deploy — undermining the
  `autoUpdate` registration type. Added explicit `no-cache` for those plus
  `/` (the root path, since the SPA rewrite's header matching is based on
  the *requested* path, not the rewritten destination), and a long
  `immutable` cache for the content-hashed `assets/**` and `workbox-*.js`
  files, which are safe to cache forever. Verified live via `curl -I`
  against the deployed site after each change.

## 2026-10-18 — Theme refresh, snapshot UX fix, CSV export, support link

- **Theme**: replaced the original bank-green palette with a warmer,
  indigo-violet accent (`#6D5EF5`) aimed at a 20-40 audience, on a near-white
  (not stark grey) background. Updated favicon, manifest, and `theme-color`
  to match. Dark mode updated to the same family.
- **Snapshot UX fix**: saving a same-day snapshot previously gave only a
  2-second toast and the net-worth chart looked unchanged (a single
  same-day point can't draw a trend line). Now the Statement card shows a
  "Last saved [date]" indicator with a tooltip, and the History card
  explicitly acknowledges a same-day save instead of repeating the generic
  empty-state prompt.
- **CSV export** (`src/lib/exportCsv.js`): Settings → "Export to
  spreadsheet" downloads assets/liabilities/goals/snapshots as one CSV with
  a UTF-8 BOM (so Thai text renders correctly in Excel). No new npm
  dependency — built on `Blob`/`URL` only.
- **Learn tab**: added an explanation under "How to use this app" that data
  auto-saves continuously to the browser (no save button, survives
  restarts) and that "Save snapshot" is a separate, optional trend
  checkpoint — not a save action. Addresses user confusion about whether
  manual restore is needed after time away from the app.
- **Buy Me a Coffee** link added to the header (`https://buymeacoffee.com/ncp_gie`).
- Deployed to Firebase Hosting.

## 2026-10-18 — Firebase Hosting setup

- Added `firebase.json` (serves `dist/`, SPA rewrite to `index.html`) and
  `.firebaserc` (project `the-balance-sheet`).
- Added `firebase-tools` as a devDependency so `npx firebase` works without
  a global install.
- Documented deploy steps in `README.md`.
- First production deploy: https://the-balance-sheet.web.app

## 2026-10-17 — Vanilla JS → Vite + React refactor

- Replaced the single-file (~960 line) vanilla-JS `index.html` app with a
  Node.js + Vite + React 18 application. Scope decisions made with the user
  up front: Node/Vite for build tooling only (app stays 100% client-side,
  localStorage-only — no backend), React for the UI framework.
- Ported all business logic (categories, financial ratios/suggestions,
  Thai-market borrowing-power calculator, formatting) verbatim into
  framework-agnostic modules under `src/lib/`.
- Split state into `AppContext` (data + derived calculations + actions) and
  `UiContext` (modal sheet + toast), via `useReducer`.
- Preserved the exact `localStorage` key and state shape
  (`personal-balance-sheet.v1`), so existing users' saved data loads into
  the new app with no migration.
- Visual refresh to a minimal, financial-services-appropriate palette
  (superseded by the 2026-10-18 theme refresh above).
- Rewrote `README.md` to match the new stack (the previous README referenced
  files — `src/app.html`, `dist/`, `build.py` — that never existed in the
  repo).
- Verified end-to-end in a real browser: all six tabs, language toggle, live
  field recalculation, forms, settings/backup, confirm-delete pattern.
