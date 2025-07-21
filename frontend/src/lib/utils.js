import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Returns the current streak (consecutive days up to today with count > 0) from heatmap data.
 * @param {Array<{date: string | Date, count: number}>} heatmapData
 * @returns {number}
 */
export function getCurrentStreakFromHeatmapData(heatmapData) {
  if (!Array.isArray(heatmapData) || heatmapData.length === 0) return 0;
  // Sort by date ascending
  const sorted = [...heatmapData].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let streak = 0;
  for (let i = sorted.length - 1; i >= 0; i--) {
    if (sorted[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
