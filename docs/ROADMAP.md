# Improvement roadmap

Prioritized by value/impact to users, given the current architecture
(client-only, `localStorage`, no backend). Written 2026-10-18. Update this
file (check items off, add new ones, re-prioritize) as work lands — see
`CLAUDE.md` for the standing rule on keeping this current.

Status legend: `[ ]` not started · `[~]` in progress · `[x]` shipped (move
shipped items to `CHANGELOG.md` and remove or strike them here once noted
there).

## High impact — trust, safety, who can use this at all

- [x] **Backup-loss warning.** Shipped 2026-10-18 — see `CHANGELOG.md`.
- [x] **True offline PWA.** Shipped 2026-10-18 via `vite-plugin-pwa` — see
      `CHANGELOG.md`.
- [ ] **Mobile UX audit.** No dedicated pass has been done since the React
      refactor on narrow-width behavior for the two-column Statement table,
      ratio grids, and SVG charts. Likely the primary device for this
      audience.
- [ ] **App-level lock (PIN/passcode).** Net worth and debt data sit in
      plain `localStorage`, visible to anyone with access to the
      device/browser profile. Optional, client-side-only hashed PIN gate.
- [ ] **Manual dark-mode toggle.** CSS fully supports `data-theme="dark"`
      but nothing in the UI sets it — it only follows OS preference today.

## Medium impact — deepens the core value

- [ ] **Categorized budget in Plan tab.** Income/expenses are currently
      single totals, not categorized, so ratios are only as good as a
      number computed elsewhere by the user.
- [ ] **Undo after delete.** Double-tap confirm (`ConfirmButton`) prevents
      accidents but there's no "Undo" snackbar afterward.
- [ ] **Multi-currency per asset.** Currently one currency per sheet; no way
      to hold e.g. foreign stocks or crypto without manual conversion before
      entry.
- [ ] **Goal projections.** Check/extend goal cards to project a completion
      date from the current contribution rate, not just target vs. saved.
- [ ] **More charts.** Only net-worth history and asset-allocation donut
      exist today; a debt-payoff-over-time or spending-trend chart would
      round out Plan/Liabilities.

## Lower impact — polish

- [ ] **Accessibility pass on SVG charts** (donut, history line) — verify
      screen-reader text alternatives beyond the top-level `aria-label`.
- [ ] **Shareable net-worth card** (image export, no PII).
- [ ] **Multi-profile/household support** — bigger lift, scope only if there
      is a real use case for it.
