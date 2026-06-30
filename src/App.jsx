import React, { useMemo, useState } from "react";
import HeatmapGrid from "./components/HeatmapGrid";
import InfoPanel from "./components/InfoPanel";
import SimulationPanel from "./components/SimulationPanel";
import { BeforeAfterChart } from "./components/Charts";
import { mockData } from "./data/mockData";
import { heatScore } from "./utils/heatScore";
import { applyInterventions } from "./utils/simulation";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [active, setActive] = useState({ trees: false, coolRoofs: false, reflectiveRoads: false });
  const [budget, setBudget] = useState(50);
  const [viewMode, setViewMode] = useState("before"); // "before" | "after"

  const beforeCells = mockData;

  const afterCells = useMemo(
    () => beforeCells.map((c) => applyInterventions(c, active)),
    [active]
  );

  const anyActive = active.trees || active.coolRoofs || active.reflectiveRoads;
  const displayCells = viewMode === "after" && anyActive ? afterCells : beforeCells;

  const selectedBefore = beforeCells.find((c) => c.id === selectedId) || null;
  const selectedAfter = afterCells.find((c) => c.id === selectedId) || null;
  const selectedDisplay = viewMode === "after" && anyActive ? selectedAfter : selectedBefore;

  const avgBefore = avgTemp(beforeCells);
  const avgAfter = avgTemp(afterCells);

  const comparisonData = beforeCells.map((c, i) => ({
    zone: `#${c.id}`,
    before: c.temperature,
    after: afterCells[i].temperature,
  }));

  function toggleIntervention(key) {
    setActive((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  function resetSimulation() {
    setActive({ trees: false, coolRoofs: false, reflectiveRoads: false });
    setViewMode("before");
  }

  return (
    <div className="min-h-screen bg-base-950 text-slate-200 font-sans">
      <Header anyActive={anyActive} viewMode={viewMode} setViewMode={setViewMode} avgBefore={avgBefore} avgAfter={avgAfter} />

      <main className="max-w-[1500px] mx-auto px-5 py-5 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-5 min-h-[480px]">
          <div className="min-h-[480px]">
            <HeatmapGrid
              cells={displayCells}
              selectedId={selectedId}
              onSelect={setSelectedId}
              mode={viewMode === "after" && anyActive ? "after" : "before"}
            />
          </div>
          <div className="min-h-[480px]">
            <InfoPanel
              cell={selectedDisplay}
              beforeCell={viewMode === "after" && anyActive ? selectedBefore : null}
            />
          </div>
        </div>

        <SimulationPanel
          active={active}
          onToggle={toggleIntervention}
          budget={budget}
          onBudgetChange={setBudget}
          cellCount={mockData.length}
          avgBefore={avgBefore}
          avgAfter={anyActive ? avgAfter : null}
          onReset={resetSimulation}
        />

        <div className="rounded-lg border border-base-600/60 bg-base-900 p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
                Before vs after impact
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Per-cell surface temperature comparison across the monitored sector
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono text-slate-500">Sector average delta</p>
              <p className="text-sm font-mono font-semibold text-emerald-400">
                -{Math.round((avgBefore - avgAfter) * 10) / 10}°C
              </p>
            </div>
          </div>
          <BeforeAfterChart data={comparisonData} />
        </div>
      </main>

      <footer className="max-w-[1500px] mx-auto px-5 pb-6 pt-2">
        <p className="text-[10px] font-mono text-slate-700">
          Urban Heat Intelligence System &middot; deterministic model,
          mock satellite-derived grid data
        </p>
      </footer>
    </div>
  );
}

function avgTemp(cells) {
  return cells.reduce((sum, c) => sum + c.temperature, 0) / cells.length;
}

function Header({ anyActive, viewMode, setViewMode, avgBefore, avgAfter }) {
  const hotCount = mockData.filter((c) => heatScore(c) >= 65).length;

  return (
    <header className="border-b border-base-600/60 bg-base-900/80 backdrop-blur sticky top-0 z-30">
      <div className="max-w-[1500px] mx-auto px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-gradient-to-br from-thermal-hot to-thermal-cool flex items-center justify-center shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-100 leading-tight">
              Urban Heat Intelligence System
            </h1>
            <p className="text-[11px] font-mono text-slate-500">
               &middot; Heat hotspot detection &amp; cooling decision support
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4 text-[11px] font-mono text-slate-400 mr-2">
            <span>
              Active hotspots: <span className="text-thermal-hot font-semibold">{hotCount}</span>
            </span>
            <span>
              Sector avg: <span className="text-slate-200 font-semibold">{Math.round(avgBefore * 10) / 10}&deg;C</span>
            </span>
          </div>

          <div className="flex items-center rounded-md border border-base-600 overflow-hidden text-xs font-mono">
            <button
              onClick={() => setViewMode("before")}
              className={`px-3 py-1.5 transition-colors ${
                viewMode === "before" ? "bg-base-700 text-slate-100" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Before
            </button>
            <button
              onClick={() => setViewMode("after")}
              disabled={!anyActive}
              className={`px-3 py-1.5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                viewMode === "after" ? "bg-emerald-500/20 text-emerald-400" : "text-slate-500 hover:text-slate-300"
              }`}
            >
              After
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
