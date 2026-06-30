import React from "react";
import { heatScore, heatCategory, heatColor, driverBreakdown, explainCell } from "../utils/heatScore";
import DriverBarChart from "./Charts";

export default function InfoPanel({ cell, beforeCell }) {
  if (!cell) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center px-6 rounded-lg border border-base-600/60 bg-base-900">
        <div className="w-12 h-12 rounded-full border border-base-600 flex items-center justify-center mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-glow animate-pulseSlow" />
        </div>
        <p className="text-sm font-medium text-slate-300">No cell selected</p>
        <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
          Select a grid cell on the left to inspect temperature, heat risk score and driver
          breakdown.
        </p>
      </div>
    );
  }

  const score = heatScore(cell);
  const category = heatCategory(score);
  const color = heatColor(score);
  const drivers = driverBreakdown(cell);
  const explanation = explainCell(cell, score);

  const tempDelta = beforeCell ? Math.round((beforeCell.temperature - cell.temperature) * 10) / 10 : 0;
  const scoreDelta = beforeCell ? heatScore(beforeCell) - score : 0;

  return (
    <div className="h-full flex flex-col rounded-lg border border-base-600/60 bg-base-900 overflow-y-auto">
      <div className="p-4 border-b border-base-600/60">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
              Location ID #{String(cell.id).padStart(3, "0")}
            </p>
            <h3 className="text-base font-semibold text-slate-100 mt-0.5">{cell.zone}</h3>
          </div>
          <span
            className="text-[10px] font-mono font-semibold uppercase tracking-wide px-2 py-1 rounded"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {category}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 border-b border-base-600/60">
        <Metric
          label="Temperature"
          value={`${cell.temperature}°C`}
          delta={beforeCell ? `${tempDelta > 0 ? "-" : "+"}${Math.abs(tempDelta)}°C` : null}
          deltaGood={tempDelta > 0}
        />
        <Metric
          label="Heat risk score"
          value={`${score}/100`}
          delta={beforeCell ? `${scoreDelta > 0 ? "-" : "+"}${Math.abs(scoreDelta)}` : null}
          deltaGood={scoreDelta > 0}
        />
      </div>

      <div className="p-4 border-b border-base-600/60">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-3">
          Driver breakdown
        </p>
        <DriverBarChart data={drivers} />
        <div className="grid grid-cols-3 gap-2 mt-3">
          {drivers.map((d) => (
            <div key={d.name} className="rounded border border-base-600/60 bg-base-850 px-2 py-1.5">
              <p className="text-[10px] text-slate-500">{d.name}</p>
              <p className="text-sm font-mono font-semibold text-slate-200">{d.value}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 flex-1">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-glow" />
          AI driver analysis
        </p>
        <div className="rounded-md border border-cyan-glow/20 bg-cyan-glow/5 p-3">
          <p className="text-[13px] leading-relaxed text-slate-300">{explanation}</p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value, delta, deltaGood }) {
  return (
    <div className="rounded border border-base-600/60 bg-base-850 px-3 py-2.5">
      <p className="text-[10px] text-slate-500">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-lg font-mono font-semibold text-slate-100 tabular-nums">{value}</p>
        {delta && (
          <span
            className={`text-[11px] font-mono font-medium ${
              deltaGood ? "text-emerald-400" : "text-slate-500"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}
