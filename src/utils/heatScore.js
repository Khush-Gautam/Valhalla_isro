// Deterministic Heat Risk Score calculation
// HeatScore = 0.4*BuildingDensity + 0.3*RoadDensity - 0.5*Vegetation + 0.2*Temperature
// Normalized to 0-100

// Using percentage-scale inputs (0-100) for building/road/vegetation density,
// and raw Celsius for temperature, matching the spec formula directly:
// HeatScore = 0.4*BuildingDensity + 0.3*RoadDensity - 0.5*Vegetation + 0.2*Temperature
export function heatScore(cell) {
  const building = cell.buildingDensity * 100; // 0-100
  const road = cell.roadDensity * 100; // 0-100
  const veg = cell.vegetation * 100; // 0-100
  const temp = cell.temperature; // celsius

  const raw = 0.4 * building + 0.3 * road - 0.5 * veg + 0.2 * temp;

  return clamp(Math.round(normalizeRaw(raw)), 0, 100);
}

// Empirically calibrated normalization across realistic value ranges
// raw ranges roughly from -10 (lush, low density, cool) to 55 (dense, hot, bare)
function normalizeRaw(raw) {
  const min = -10;
  const max = 55;
  return ((raw - min) / (max - min)) * 100;
}

export function heatCategory(score) {
  if (score >= 65) return "hotspot";
  if (score >= 35) return "moderate";
  return "cool";
}

export function heatColor(score) {
  if (score >= 65) return "#e24b4a"; // red
  if (score >= 35) return "#ef9f27"; // amber/yellow
  return "#378ade"; // blue
}

export function driverBreakdown(cell) {
  return [
    { name: "Vegetation", value: Math.round(cell.vegetation * 100) },
    { name: "Buildings", value: Math.round(cell.buildingDensity * 100) },
    { name: "Roads", value: Math.round(cell.roadDensity * 100) },
  ];
}

export function explainCell(cell, score) {
  const category = heatCategory(score);
  const veg = cell.vegetation;
  const bld = cell.buildingDensity;
  const rd = cell.roadDensity;

  const drivers = [];
  if (bld > 0.55) drivers.push("dense built-up infrastructure");
  if (rd > 0.45) drivers.push("high road surface coverage");
  if (veg < 0.25) drivers.push("low vegetation cover");
  if (veg > 0.5) drivers.push("substantial green cover moderating heat");

  if (category === "hotspot") {
    return `This area is experiencing high heat risk (score ${score}/100) primarily due to ${drivers
      .slice(0, 2)
      .join(" and ") || "dense urban surfaces"}. Surface temperature is elevated at ${cell.temperature}°C, indicating limited natural cooling capacity.`;
  }
  if (category === "moderate") {
    return `This zone shows moderate heat stress (score ${score}/100). A mix of built surfaces and ${
      veg > 0.3 ? "moderate vegetation" : "limited greenery"
    } keeps conditions from escalating to critical levels, though intervention could improve resilience.`;
  }
  return `This area maintains a cool profile (score ${score}/100), supported by ${
    veg > 0.4 ? "strong vegetation cover" : "lower built density"
  } that helps regulate local surface temperature at ${cell.temperature}°C.`;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
