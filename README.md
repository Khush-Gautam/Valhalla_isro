# Urban Heat Intelligence System (UHIS)

A decision-support dashboard for ISRO PS1 — detects urban heat hotspots, explains heat
drivers, and simulates cooling interventions with before/after impact visualization.

## Stack
- React 18 + Vite
- Tailwind CSS (custom dark "geo-intelligence" theme)
- Recharts (driver bar chart, before/after line chart)
- Custom CSS-grid heatmap (no map tile dependency — works offline, zero API keys)

## Folder structure
```
uhis/
├── src/
│   ├── components/
│   │   ├── HeatmapGrid.jsx      interactive color-coded city grid
│   │   ├── InfoPanel.jsx        cell detail + AI-style explanation panel
│   │   ├── SimulationPanel.jsx  intervention toggles + budget slider
│   │   └── Charts.jsx           Recharts driver bar + before/after line chart
│   ├── data/
│   │   └── mockData.js          deterministic mock grid generator (40 cells)
│   ├── utils/
│   │   ├── heatScore.js         HeatScore formula, normalization, explanation text
│   │   └── simulation.js        intervention effects, cost, budget logic
│   ├── App.jsx                  layout + state wiring
│   ├── main.jsx                 React entry point
│   └── index.css                Tailwind + theme base styles
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

## Run locally
```bash
npm install
npm run dev
```
Then open the printed local URL (typically http://localhost:5173).

To build a production bundle:
```bash
npm run build
npm run preview
```

## How it works

**Heat score formula** (`src/utils/heatScore.js`), exactly as specified:
```
HeatScore = 0.4 × BuildingDensity + 0.3 × RoadDensity − 0.5 × Vegetation + 0.2 × Temperature
```
The raw output is normalized to a 0–100 scale and bucketed into cool (<35),
moderate (35–64), and hotspot (≥65).

**Simulation** (`src/utils/simulation.js`): each intervention applies a deterministic
mid-point temperature reduction (trees −1 to −3°C, cool roofs −0.5 to −2°C, reflective
roads −0.3 to −1.5°C) and adjusts the underlying density/vegetation values that feed
back into the heat score. Stacking multiple interventions applies a small diminishing-
returns factor for realism. The budget slider estimates per-cell intervention cost and
flags when the sector can't be fully covered at the current allocation.

**Before/after**: toggling the view mode switches the heatmap, info panel, and metrics
between baseline and simulated state; the bottom line chart always plots both series
per cell for direct comparison.

## Notes
- All data is mocked and deterministic (seeded), so results are reproducible across
  reloads — no backend or external API required.
- Designed to be read as a geospatial intelligence tool: dark thermal palette, monospace
  data readouts, scan-line accents, live hotspot pulse animation.
