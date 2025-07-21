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
  let today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find the last entry
  const lastEntry = sorted[sorted.length - 1];
  const lastDate = new Date(lastEntry.date);
  lastDate.setHours(0, 0, 0, 0);

  // If last entry is today and count > 0, count streak as usual
  if (lastDate.getTime() === today.getTime() && lastEntry.count > 0) {
    for (let i = sorted.length - 1; i >= 0; i--) {
      if (sorted[i].count > 0) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // If last entry is today and count == 0, or last entry is before today,
  // show the previous streak (until midnight)
  // Find the last day with count > 0, going backwards
  let i = sorted.length - 1;
  // If today is present and count is 0, skip today
  if (lastDate.getTime() === today.getTime() && lastEntry.count === 0) {
    i--;
  }
  for (; i >= 0; i--) {
    if (sorted[i].count > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
