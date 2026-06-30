import React, { useState } from "react";
import { heatScore, heatColor, heatCategory } from "../utils/heatScore";
import { GRID_ROWS, GRID_COLS } from "../data/mockData";

export default function HeatmapGrid({ cells, selectedId, onSelect, mode }) {
  const [hovered, setHovered] = useState(null);

  const counts = cells.reduce(
    (acc, cell) => {
      const score = heatScore(cell);
      const cat = heatCategory(score);
      acc[cat] += 1;
      return acc;
    },
    { cool: 0, moderate: 0, hotspot: 0 }
  );

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-200 uppercase">
            {mode === "after" ? "Post-intervention thermal grid" : "City thermal grid"}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Sector overview &middot; {GRID_ROWS * GRID_COLS} monitored cells &middot; 30m resolution
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <LegendDot color="#378ade" label={`Cool (${counts.cool})`} />
          <LegendDot color="#ef9f27" label={`Moderate (${counts.moderate})`} />
          <LegendDot color="#e24b4a" label={`Hotspot (${counts.hotspot})`} />
        </div>
      </div>

      <div className="relative flex-1 rounded-lg border border-base-600/60 bg-base-900 bg-grid overflow-hidden">
        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-cyan-glow/5 to-transparent animate-scan pointer-events-none" />

        <div
          className="grid h-full w-full p-3 gap-1.5"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${GRID_ROWS}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            const score = heatScore(cell);
            const color = heatColor(score);
            const isSelected = selectedId === cell.id;
            const isHovered = hovered === cell.id;

            return (
              <button
                key={cell.id}
                onClick={() => onSelect(cell.id)}
                onMouseEnter={() => setHovered(cell.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-[3px] transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-cyan-glow"
                style={{
                  backgroundColor: color,
                  opacity: isSelected ? 1 : 0.78,
                  transform: isHovered || isSelected ? "scale(1.06)" : "scale(1)",
                  boxShadow: isSelected
                    ? `0 0 0 2px #06070a, 0 0 0 4px ${color}, 0 0 16px ${color}88`
                    : isHovered
                    ? `0 0 10px ${color}66`
                    : "none",
                  zIndex: isSelected || isHovered ? 10 : 1,
                }}
                aria-label={`Cell ${cell.id}, ${score} heat score`}
              >
                {score >= 65 && (
                  <span className="absolute inset-0 rounded-[3px] animate-pulseSlow bg-thermal-hot/30" />
                )}

                {isHovered && (
                  <div
                    className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-base-600 bg-base-850 px-2.5 py-1.5 shadow-panel pointer-events-none"
                  >
                    <p className="text-[11px] font-mono font-semibold text-slate-100">
                      {cell.zone}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400">
                      {cell.temperature}&deg;C &middot; score {score}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-base-850" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-[10px] font-mono text-slate-600">
        Click a cell to inspect heat drivers &middot; hover for quick readout
      </p>
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <span className="flex items-center gap-1.5 text-slate-400">
      <span
        className="inline-block w-2.5 h-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
