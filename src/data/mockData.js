// Mock urban grid data for the Urban Heat Intelligence System
// 40 cells arranged as an 8x5 grid representing a city sector

const ZONE_NAMES = [
  "Sector A", "Industrial Belt", "Old Town", "CBD Core", "Riverside",
  "Tech Park", "Residential N", "Market District", "Highway Corridor", "Green Quarter",
  "Residential S", "Transit Hub", "University Zone", "Warehouse Row", "Civic Center",
  "Suburb East", "Slum Cluster", "Suburb West", "Lakefront", "Stadium Zone",
];

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateMockData(rows = 5, cols = 8) {
  const rand = seededRandom(42);
  const cells = [];
  let id = 1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // create spatial heat clusters - center-ish cells run hotter (urban core)
      const centerBias =
        1 - (Math.abs(r - rows / 2) / rows + Math.abs(c - cols / 2) / cols);

      const buildingDensity = clamp(0.25 + centerBias * 0.5 + rand() * 0.25, 0.05, 0.95);
      const roadDensity = clamp(0.2 + centerBias * 0.4 + rand() * 0.3, 0.05, 0.9);
      const vegetation = clamp(0.7 - centerBias * 0.5 - rand() * 0.3, 0.02, 0.85);
      const baseTemp = 30 + centerBias * 10 + buildingDensity * 4 - vegetation * 5 + rand() * 3;

      cells.push({
        id,
        row: r,
        col: c,
        zone: ZONE_NAMES[(id - 1) % ZONE_NAMES.length],
        temperature: round1(clamp(baseTemp, 26, 48)),
        vegetation: round2(vegetation),
        buildingDensity: round2(buildingDensity),
        roadDensity: round2(roadDensity),
      });
      id++;
    }
  }
  return cells;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}
function round1(v) {
  return Math.round(v * 10) / 10;
}
function round2(v) {
  return Math.round(v * 100) / 100;
}

export const GRID_ROWS = 5;
export const GRID_COLS = 8;
export const mockData = generateMockData(GRID_ROWS, GRID_COLS);
