# Personal Balance Sheet

- `src/app.html` — the app (published as the Artifact as-is).
- `dist/` — installable PWA build: `index.html`, `manifest.webmanifest`, `sw.js`, `icon.svg`.
  Run `python3 build.py` after editing `src/app.html`, then host `dist/` on any static host
  (GitHub Pages, Netlify, Vercel). It can be wrapped as a mobile app with Capacitor or a TWA.
- Data is stored in the browser's localStorage; Settings → backup text moves it between devices.
