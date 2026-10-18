# Project memory — Personal Balance Sheet

Project-specific instructions. These apply on top of (and don't replace) any
global `CLAUDE.md` instructions.

## What this is

A bilingual (EN/TH) personal finance dashboard — assets/liabilities
tracking, net worth, financial ratios, rule-based suggestions, a Thai-market
borrowing-power calculator, and a Learn tab. Node.js + Vite + React 18 for
build tooling and UI; the app itself is 100% client-side with data in
`localStorage` — no backend, no database, no server-side user data. Deployed
as a static site to Firebase Hosting.

Full details: `docs/PIPELINE.md` (stack, dev/build/deploy commands, data
architecture, directory layout).

## Standing rule: keep `docs/` current

This project keeps its own working notes in `docs/`, separate from this
file:

- `docs/PIPELINE.md` — how the project is built, run, and deployed. Update
  this if a command, path, hosting target, or architectural decision
  (e.g. client-only vs. backend) changes.
- `docs/CHANGELOG.md` — dated log of completed work, newest entry first.
  **After finishing any task, build, or deploy, add an entry here** — what
  shipped and why, not a diff dump. Group same-day related work into one
  entry rather than one entry per file.
- `docs/ROADMAP.md` — prioritized improvement backlog. When a roadmap item
  is implemented, check it off there and move the shipped summary into
  `CHANGELOG.md`. When new improvement ideas come up (from the user or from
  your own review), add them here rather than only mentioning them in chat,
  so they aren't lost between sessions.

Do this *every time*, not just for large changes — a quick bug fix still
gets a one- or two-line `CHANGELOG.md` entry. If a conversation is
summarized/compacted mid-task, these files are the source of truth for
picking the work back up — keep them accurate rather than aspirational.

## Scope decisions already made (don't re-litigate without asking)

- Node.js/Vite role: build tooling only. Do not introduce a backend/server
  or move data off `localStorage` without explicitly raising it first — this
  was a deliberate choice, not a default.
- UI framework: React (function components + hooks, Context + `useReducer`
  for state, no routing library, no Redux).
- `README.md` is the current source of truth for setup/usage instructions
  aimed at humans; `docs/` is the working/process notes aimed at future
  Claude sessions and the project owner tracking progress. Keep both
  accurate, but don't duplicate — `README.md` stays user-facing and brief,
  `docs/` carries the detail.
