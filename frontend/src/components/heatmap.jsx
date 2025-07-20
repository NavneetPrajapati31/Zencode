"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ChevronDown } from "lucide-react";

// Helper to get month short name
const getMonthName = (monthIndex) =>
  [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ][monthIndex];

// Helper to get color class for a day
const getDayColor = (count) => {
  if (count === 0) return "bg-gh-heatmap-inactive";
  if (count >= 1 && count <= 5) return "bg-gh-heatmap-green-1";
  if (count >= 6 && count <= 10) return "bg-gh-heatmap-green-2";
  if (count >= 11 && count <= 20) return "bg-gh-heatmap-green-3";
  return "bg-gh-heatmap-green-4";
};

const generateHeatmapData = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate the start date (365 days ago)
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // 365 days total (including today)

  // Generate all days in our range
  const allDays = [];
  let totalSubmissions = 0;
  let totalActiveDays = 0;
  let maxStreak = 0;
  let currentStreak = 0;
  let lastActive = false;

  let date = new Date(startDate);
  while (date <= today) {
    const count = Math.floor(Math.random() * 25);
    allDays.push({
      date: new Date(date),
      count,
      dayOfWeek: date.getDay(), // 0 = Sunday, 1 = Monday, etc.
      month: date.getMonth(),
    });

    totalSubmissions += count;
    if (count > 0) {
      totalActiveDays++;
      currentStreak = lastActive ? currentStreak + 1 : 1;
      lastActive = true;
    } else {
      currentStreak = 0;
      lastActive = false;
    }
    if (currentStreak > maxStreak) maxStreak = currentStreak;

    date.setDate(date.getDate() + 1);
  }

  // Group days by month and create week columns for each month
  const monthGroups = new Map();

  allDays.forEach((day) => {
    const monthKey = day.month;
    if (!monthGroups.has(monthKey)) {
      monthGroups.set(monthKey, []);
    }
    monthGroups.get(monthKey).push(day);
  });

  // Convert to ordered array of months
  const months = Array.from(monthGroups.entries())
    .sort(([a], [b]) => {
      // Handle year wrap-around (e.g., if we start in Feb and go to next Jan)
      const aDate = allDays.find((d) => d.month === a).date;
      const bDate = allDays.find((d) => d.month === b).date;
      return aDate.getTime() - bDate.getTime();
    })
    .map(([monthIndex, days]) => ({
      month: monthIndex,
      name: getMonthName(monthIndex),
      days: days.sort((a, b) => a.date.getTime() - b.date.getTime()),
    }));

  // Create week columns for each month
  const weekColumns = [];
  let globalWeekIndex = 0;

  months.forEach((monthData, monthIndex) => {
    const monthDays = monthData.days;
    if (monthDays.length === 0) return;

    // Determine starting day of week position
    let startDayOfWeek = 0; // Default to Sunday (top row)

    if (monthIndex > 0) {
      // For subsequent months, continue from where the previous month left off
      const prevMonth = months[monthIndex - 1];
      const lastDayOfPrevMonth = prevMonth.days[prevMonth.days.length - 1];
      startDayOfWeek = (lastDayOfPrevMonth.dayOfWeek + 1) % 7;
    } else {
      // For the first month, start from the actual day of week of the first day
      startDayOfWeek = monthDays[0].dayOfWeek;
    }

    let currentColumn = [];
    let currentDayPosition = startDayOfWeek;
    let dayIndex = 0;

    // Fill the month's days into week columns
    while (dayIndex < monthDays.length) {
      // Fill current column up to position where we need to place the next day
      while (
        currentColumn.length < currentDayPosition &&
        currentColumn.length < 7
      ) {
        currentColumn.push(null); // Empty slot
      }

      // Add the actual day if we have space in this column
      if (currentColumn.length < 7) {
        currentColumn.push(monthDays[dayIndex]);
        dayIndex++;
        currentDayPosition++;
      }

      // If column is full or we've placed all days, finalize this column
      if (currentColumn.length === 7 || dayIndex === monthDays.length) {
        // Fill remaining slots in column with null if not full
        while (currentColumn.length < 7) {
          currentColumn.push(null);
        }

        weekColumns.push({
          days: [...currentColumn],
          month: monthData.month,
          monthName: monthData.name,
          weekIndex: globalWeekIndex,
          isFirstWeekOfMonth:
            weekColumns.length === 0 ||
            weekColumns[weekColumns.length - 1]?.month !== monthData.month,
        });

        currentColumn = [];
        currentDayPosition = 0; // Reset to top for next column
        globalWeekIndex++;
      }
    }
  });

  return {
    weekColumns,
    months: months.map((m) => ({ name: m.name, month: m.month })),
    totalSubmissions,
    totalActiveDays,
    maxStreak,
  };
};

// Generate month labels based on week columns
const getMonthLabels = (weekColumns) => {
  const labels = [];
  const seenMonths = new Set();

  weekColumns.forEach((column, index) => {
    // Find first non-null day to determine the month
    const firstDay = column.days.find((day) => day !== null);
    if (firstDay && !seenMonths.has(firstDay.month)) {
      labels.push({
        name: getMonthName(firstDay.month),
        weekIndex: index,
        month: firstDay.month,
      });
      seenMonths.add(firstDay.month);
    }
  });

  return labels;
};

export default function Heatmap() {
  const { weekColumns, totalSubmissions, totalActiveDays, maxStreak } =
    React.useMemo(generateHeatmapData, []);
  const monthLabels = React.useMemo(
    () => getMonthLabels(weekColumns),
    [weekColumns]
  );

  return (
    <Card className="w-full max-w-4xl bg-transparent text-gh-text-light rounded-none border-none shadow-none !gap-0">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-sm">{totalSubmissions}</span>{" "}
          submissions in the past one year
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Total active days:{" "}
            <span className="font-semibold text-gh-text-light">
              {totalActiveDays}
            </span>
          </span>
          <span>
            Max streak:{" "}
            <span className="font-semibold text-gh-text-light">
              {maxStreak}
            </span>
          </span>
        </div>
      </CardHeader>
      <div className="pt-6">
        <div className="relative overflow-x-auto no-scrollbar pb-6 h-full">
          {/* Day labels (Sun, Mon, Tue, etc.) */}
          {/* <div
            className="flex flex-col mr-2 text-xs text-gh-text-muted"
            style={{ float: "left" }}
          >
            <div style={{ height: "18px" }}></div>{" "}
            <div className="flex flex-col gap-0.5">
              <div className="h-3 flex items-center">Sun</div>
              <div className="h-3 flex items-center">Mon</div>
              <div className="h-3 flex items-center">Tue</div>
              <div className="h-3 flex items-center">Wed</div>
              <div className="h-3 flex items-center">Thu</div>
              <div className="h-3 flex items-center">Fri</div>
              <div className="h-3 flex items-center">Sat</div>
            </div>
          </div> */}

          {/* Heatmap grid */}
          <div className="flex">
            {weekColumns.map((column, weekIdx) => (
              <div
                key={weekIdx}
                className={`flex flex-col gap-0.5 ${
                  column.isFirstWeekOfMonth && weekIdx > 0
                    ? "ml-4"
                    : weekIdx > 0
                      ? "ml-0.5"
                      : ""
                }`}
              >
                {column.days.map((day, dayIdx) => {
                  if (!day) {
                    // Empty slot - render as invisible placeholder to maintain structure
                    return <div key={`empty-${dayIdx}`} className="w-3 h-3" />;
                  }

                  return (
                    <TooltipProvider key={`${day.date.getTime()}-${dayIdx}`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            tabIndex={0}
                            aria-label={`${day.count} submissions on ${day.date.toDateString()}`}
                            className={`w-3 h-3 rounded-xs ${getDayColor(day.count)} cursor-pointer`}
                          />
                        </TooltipTrigger>
                        <TooltipContent className="bg-gray-700 text-white text-xs p-1 rounded-md">
                          <span>
                            {day.count} submissions on {day.date.toDateString()}
                          </span>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Month labels */}
          <div className="flex ml-6 mt-4 relative" style={{ height: "18px" }}>
            {monthLabels.map((month) => {
              const left = month.weekIndex * 16;
              return (
                <span
                  key={`${month.name}-${month.weekIndex}-${month.month}`}
                  className="absolute text-xs text-muted-foreground"
                  style={{ left: `${left}px` }}
                >
                  {month.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
