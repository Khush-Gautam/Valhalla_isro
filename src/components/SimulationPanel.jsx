import React from "react";
import { INTERVENTIONS, totalCost, affordableCellCount } from "../utils/simulation";

export default function SimulationPanel({
  active,
  onToggle,
  budget,
  onBudgetChange,
  cellCount,
  avgBefore,
  avgAfter,
  onReset,
}) {
  const cost = totalCost(active, cellCount);
  const overBudget = cost > budget;
  const affordable = affordableCellCount(active, budget, cellCount);
  const anyActive = active.trees || active.coolRoofs || active.reflectiveRoads;

  return (
    <div className="rounded-lg border border-base-600/60 bg-base-900 p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            Cooling intervention simulator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Toggle interventions to model city-wide temperature reduction
          </p>
        </div>
        {anyActive && (
          <button
            onClick={onReset}
            className="text-[11px] font-mono text-slate-400 hover:text-slate-200 border border-base-600 hover:border-base-500 rounded px-2.5 py-1.5 transition-colors"
          >
            Reset simulation
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <InterventionCard
          config={INTERVENTIONS.trees}
          icon={<TreeIcon />}
          active={active.trees}
          onClick={() => onToggle("trees")}
        />
        <InterventionCard
          config={INTERVENTIONS.coolRoofs}
          icon={<RoofIcon />}
          active={active.coolRoofs}
          onClick={() => onToggle("coolRoofs")}
        />
        <InterventionCard
          config={INTERVENTIONS.reflectiveRoads}
          icon={<RoadIcon />}
          active={active.reflectiveRoads}
          onClick={() => onToggle("reflectiveRoads")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-center pt-3 border-t border-base-600/60">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-mono uppercase tracking-wide text-slate-500">
              Budget allocation
            </label>
            <span className="text-sm font-mono font-semibold text-cyan-glow tabular-nums">
              ₹{budget.toLocaleString("en-IN")} cr
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={budget}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            className="w-full accent-cyan-glow"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-600 mt-1">
            <span>₹0 cr</span>
            <span>₹100 cr</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-right">
            <p className="text-slate-500">Est. cost</p>
            <p className={`font-semibold ${overBudget ? "text-thermal-hot" : "text-slate-200"}`}>
              ₹{cost.toLocaleString("en-IN")} cr
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Coverage</p>
            <p className="font-semibold text-slate-200">
              {overBudget ? `${affordable}/${cellCount}` : `${cellCount}/${cellCount}`} cells
            </p>
          </div>
          {avgAfter != null && (
            <div className="text-right">
              <p className="text-slate-500">Avg temp drop</p>
              <p className="font-semibold text-emerald-400">
                -{Math.round((avgBefore - avgAfter) * 10) / 10}°C
              </p>
            </div>
          )}
        </div>
      </div>

      {overBudget && (
        <p className="text-[11px] font-mono text-thermal-mod mt-3 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-thermal-mod" />
          Budget covers {affordable} of {cellCount} cells at current selection — increase
          allocation for full sector coverage.
        </p>
      )}
    </div>
  );
}

function InterventionCard({ config, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-lg border p-3 transition-all duration-150 ${
        active
          ? "border-cyan-glow/50 bg-cyan-glow/10 shadow-glow"
          : "border-base-600/60 bg-base-850 hover:border-base-500"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={active ? "text-cyan-glow" : "text-slate-400"}>{icon}</span>
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
            active ? "bg-cyan-glow border-cyan-glow" : "border-base-500"
          }`}
        >
          {active && <span className="w-1.5 h-1.5 rounded-full bg-base-950" />}
        </span>
      </div>
      <p className="text-sm font-medium text-slate-200">{config.label}</p>
      <p className="text-[11px] font-mono text-slate-500 mt-0.5">
        -{config.tempDelta[0]}&deg; to -{config.tempDelta[1]}&deg;C &middot; ₹
        {config.costPerCell}cr/cell
      </p>
    </button>
  );
}

function TreeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22v-7" strokeLinecap="round" />
      <path d="M12 13a5 5 0 1 0-4.5-7.3A4 4 0 0 0 8 13h4Z" />
      <path d="M12 13a5 5 0 1 1 4.5-7.3A4 4 0 0 1 16 13h-4Z" />
    </svg>
  );
}
function RoofIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 11 12 4l9 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 20v-5h6v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function RoadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20 9 4h6l5 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 10h2M10 15h4" strokeLinecap="round" />
    </svg>
  );
}
