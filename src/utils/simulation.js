// Simulation logic for cooling interventions
// Each intervention modifies cell properties and resulting temperature

export const INTERVENTIONS = {
  trees: {
    key: "trees",
    label: "Increase tree cover",
    icon: "tree",
    tempDelta: [1, 3], // °C reduction range
    vegBoost: 0.1, // +10% vegetation
    costPerCell: 1.2, // crore per cell
  },
  coolRoofs: {
    key: "coolRoofs",
    label: "Cool roof implementation",
    icon: "roof",
    tempDelta: [0.5, 2],
    buildingEfficiency: 0.05,
    costPerCell: 0.8,
  },
  reflectiveRoads: {
    key: "reflectiveRoads",
    label: "Reflective roads",
    icon: "road",
    tempDelta: [0.3, 1.5],
    roadEfficiency: 0.04,
    costPerCell: 0.6,
  },
};

// Deterministic mid-point delta (avoids randomness for reproducible demo)
function midDelta(range) {
  return (range[0] + range[1]) / 2;
}

export function applyInterventions(cell, activeInterventions) {
  let tempReduction = 0;
  let vegetation = cell.vegetation;
  let buildingDensity = cell.buildingDensity;
  let roadDensity = cell.roadDensity;

  if (activeInterventions.trees) {
    tempReduction += midDelta(INTERVENTIONS.trees.tempDelta);
    vegetation = Math.min(0.95, vegetation + INTERVENTIONS.trees.vegBoost);
  }
  if (activeInterventions.coolRoofs) {
    tempReduction += midDelta(INTERVENTIONS.coolRoofs.tempDelta);
    buildingDensity = Math.max(
      0.05,
      buildingDensity - INTERVENTIONS.coolRoofs.buildingEfficiency
    );
  }
  if (activeInterventions.reflectiveRoads) {
    tempReduction += midDelta(INTERVENTIONS.reflectiveRoads.tempDelta);
    roadDensity = Math.max(
      0.05,
      roadDensity - INTERVENTIONS.reflectiveRoads.roadEfficiency
    );
  }

  // diminishing returns when stacking 2+ interventions (realistic, not purely additive)
  const activeCount = Object.values(activeInterventions).filter(Boolean).length;
  if (activeCount >= 2) {
    tempReduction *= 0.9;
  }
  if (activeCount >= 3) {
    tempReduction *= 0.92;
  }

  const newTemp = Math.max(20, cell.temperature - tempReduction);

  return {
    ...cell,
    temperature: Math.round(newTemp * 10) / 10,
    vegetation: Math.round(vegetation * 100) / 100,
    buildingDensity: Math.round(buildingDensity * 100) / 100,
    roadDensity: Math.round(roadDensity * 100) / 100,
    tempReduction: Math.round(tempReduction * 10) / 10,
  };
}

export function totalCost(activeInterventions, cellCount) {
  let costPerCell = 0;
  if (activeInterventions.trees) costPerCell += INTERVENTIONS.trees.costPerCell;
  if (activeInterventions.coolRoofs) costPerCell += INTERVENTIONS.coolRoofs.costPerCell;
  if (activeInterventions.reflectiveRoads)
    costPerCell += INTERVENTIONS.reflectiveRoads.costPerCell;
  return Math.round(costPerCell * cellCount * 10) / 10;
}

export function affordableCellCount(activeInterventions, budget, totalCells) {
  let costPerCell = 0;
  if (activeInterventions.trees) costPerCell += INTERVENTIONS.trees.costPerCell;
  if (activeInterventions.coolRoofs) costPerCell += INTERVENTIONS.coolRoofs.costPerCell;
  if (activeInterventions.reflectiveRoads)
    costPerCell += INTERVENTIONS.reflectiveRoads.costPerCell;
  if (costPerCell === 0) return 0;
  return Math.min(totalCells, Math.floor(budget / costPerCell));
}
