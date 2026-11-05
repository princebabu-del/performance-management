# Lumber Performance Management — HR Admin prototype

Clickable prototype of the Performance module (review cycles, templates, crew reviews,
worker check-in), rendered inside the Lumber top nav.

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173 (auto-opens)
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

Requires Node 20+.

## Project structure

```
.
├── index.html                  # Page shell: markup only, links styles + scripts
├── src/
│   └── styles/
│       ├── main.css            # Entry stylesheet — @imports the files below IN ORDER
│       ├── 00-reset.css
│       ├── 01-base.css         # Design tokens (:root vars) + base layout
│       ├── 02-lumber-production.css
│       ├── …                   # One file per feature layer
│       └── 14-topbar.css       # Lumber top nav
├── public/                     # Served as-is at the site root (copied to dist/)
│   ├── assets/
│   │   └── lumber-logo.svg     # Favicon / logo
│   ├── components/             # Reusable UI components (plain JS + CSS, linked from index.html)
│   │   └── banners/            # Info / warning / error / gray notes — see its README.md
│   └── js/
│       ├── app.js              # Core: helpers, demo data, router, views (layers V1–V5)
│       ├── layers/             # Later feature layers, loaded in numeric order
│       │   ├── 01-assign-groups.js
│       │   ├── …
│       │   └── 12-create-then-assign.js
│       └── topnav.js           # Vanilla port of reference/TopNav.tsx
├── reference/
│   └── TopNav.tsx              # Source React/MUI topbar the vanilla nav is ported from (not built)
└── legacy/
    └── Performance_HR_Admin.html   # Original single-file prototype, kept for comparison
```

## How the code is organised

- **CSS** is bundled by Vite from `src/styles/main.css`. Files are layered: later
  files override earlier ones, so keep the `@import` order when adding new files.
- **JS** is plain (non-module) scripts sharing one global scope. That is intentional:
  - the markup calls functions through inline handlers (`onclick="resetDemo()"`), so they must be global;
  - each file in `layers/` *overrides* functions/views defined before it
    (e.g. `V.home = () => …`, `render = function(){…}`), so **load order in `index.html` matters**.
- `app.js` is kept as one file on purpose: it re-declares some `function`s
  (e.g. `init`, `renderNav`, `openPacket`), and splitting it would change which
  version wins. To refactor it, first convert repeated declarations to assignments.
- Because the scripts live in `public/`, Vite serves/copies them without bundling.
  Edits trigger a page reload in dev.

## Adding a feature

1. Styles → new file in `src/styles/` + an `@import` at the end of `main.css`.
2. Behaviour → new file in `public/js/layers/` (next number) + a `<script>` tag in
   `index.html` after the last layer and before `topnav.js`.
3. Images, icons, fonts → `public/assets/`, referenced as `/assets/<file>`.
