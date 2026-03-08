export const tiers = [
  { rank: "S", color: "#f77982" },
  { rank: "A", color: "#f6be7d" },
  { rank: "B", color: "#f5df7c" },
  { rank: "C", color: "#eef57b" },
  { rank: "D", color: "#b0f57d" },
  { rank: "F", color: "#74eb83" },
];

export function createEmptyTierMap() {
  return Object.fromEntries(tiers.map(({ rank }) => [rank, []]));
}

export function normalizeTierGames(tierGames = {}) {
  const normalized = createEmptyTierMap();

  for (const { rank } of tiers) {
    if (Array.isArray(tierGames[rank])) {
      normalized[rank] = [...tierGames[rank]];
    }
  }

  if (Array.isArray(tierGames.E) && tierGames.E.length > 0) {
    normalized.F = [...tierGames.E, ...normalized.F];
  }

  return normalized;
}
