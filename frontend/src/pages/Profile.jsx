import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  ChevronDown,
  LayoutGrid,
  List,
  CheckCircle,
  Clock,
  Bookmark,
  Crown,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/navbar";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const challenges = [
    {
      title: "Two Sum",
      description:
        "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target..",
      difficulty: "Easy",
      tags: ["Arrays", "Hash Table"],
      status: "Complete",
    },
    {
      title: "Longest Palindrome",
      description:
        "Identify the longest palindromic substring in a given string using dynamic programming.",
      difficulty: "Medium",
      tags: ["Strings", "Dynamic Programming"],
      status: "In Progress",
    },
    {
      title: "Median Arrays",
      description:
        "Your task is to efficiently find the median of the combined dataset. The solution should have a time complexity of O(lo...",
      difficulty: "Hard",
      tags: ["Arrays", "Binary Search"],
      status: "Todo",
    },
    {
      title: "Path Sum",
      description:
        "Calculate the minimum path sum in a grid, moving only right or downward.",
      difficulty: "Medium",
      tags: ["Grid", "Dynamic Programming"],
      status: "In Progress",
    },
    {
      title: "Cycle Detection",
      description:
        "Detect if a directed graph contains a cycle using depth-first search.",
      difficulty: "Hard",
      tags: ["Graphs", "Depth-First Search"],
      status: "Todo",
    },
    {
      title: "Climbing Stairs",
      description:
        "Determine the total ways to climb a staircase with 1 or 2 steps at a time.",
      difficulty: "Easy",
      tags: ["Dynamic Programming", "Recursion"],
      status: "Complete",
    },
    {
      title: "Merge Intervals",
      description:
        "Merge all overlapping intervals in a given list and return a new list of non-overlapping intervals.",
      difficulty: "Hard",
      tags: ["Arrays", "Sorting"],
      status: "Todo",
    },
    {
      title: "Meeting Rooms",
      description:
        "Given a list of meeting time intervals, determine if a person can attend all meetings without overlap.",
      difficulty: "Easy",
      tags: ["Arrays", "Intervals"],
      status: "Complete",
    },
    {
      title: "Rotting Oranges",
      description:
        "Determine the minimum time required to rot all oranges in a grid. Fresh oranges adjacent to rotten ones rot in one unit of...",
      difficulty: "Medium",
      tags: ["Grid", "BFS"],
      status: "In Progress",
    },
  ];

  // Define month and weekday labels
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const WEEKDAYS_LABELS = ["Mon", "", "Wed", "", "Fri", "", ""];
  const MONTH_DAYS_APPROX = {
    Jan: 31,
    Feb: 28,
    Mar: 31,
    Apr: 30,
    May: 31,
    Jun: 30,
    Jul: 31,
  };

  let totalDaysInHeatmap = 0;
  const monthGridItems = [];
  let currentDayOffset = 0;
  MONTHS.forEach((monthName) => {
    const daysInMonth = MONTH_DAYS_APPROX[monthName];
    monthGridItems.push(
      <div
        key={monthName}
        className="text-center text-muted-foreground"
        style={{ gridColumn: `${currentDayOffset + 1} / span ${daysInMonth}` }}
      >
        {monthName}
      </div>
    );
    totalDaysInHeatmap += daysInMonth;
    currentDayOffset += daysInMonth;
  });

  const generatedHeatmapGridData = Array(7)
    .fill(0)
    .map(() => Array(totalDaysInHeatmap).fill(0));
  let dayCounter = 0;
  MONTHS.forEach((monthName) => {
    const daysInMonth = MONTH_DAYS_APPROX[monthName];
    for (let d = 0; d < daysInMonth; d++) {
      for (let w = 0; w < 7; w++) {
        let activityLevel = 0;
        if (dayCounter % 7 === w) activityLevel = 4;
        else if (dayCounter % 10 < 3) activityLevel = 3;
        else if (dayCounter % 5 === 0) activityLevel = 2;
        else if (dayCounter % 3 === 0) activityLevel = 1;
        generatedHeatmapGridData[w][dayCounter] = activityLevel;
      }
      dayCounter++;
    }
  });

  // Use theme classes for activity levels
  const getActivityColor = (level) => {
    switch (level) {
      case 0:
        return "bg-muted";
      case 1:
        return "bg-accent/40";
      case 2:
        return "bg-accent/70";
      case 3:
        return "bg-primary/60";
      case 4:
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  // Use theme classes for difficulty
  const getDifficultyBadgeColors = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-success text-success-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "Hard":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Use theme classes for status
  const getStatusBadgeColors = (status) => {
    switch (status) {
      case "Complete":
        return "bg-success/80 text-success-foreground";
      case "In Progress":
        return "bg-warning/80 text-warning-foreground";
      case "Todo":
        return "bg-muted text-muted-foreground border border-border";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Complete":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "In Progress":
        return <Clock className="w-4 h-4 text-warning" />;
      case "Todo":
        return <Bookmark className="w-4 h-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  // Check if it's a leap year
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  // Set the year for the heatmap (current year or demo year)
  const year = new Date().getFullYear();
  // For demo, use an empty object for data
  const data = {};

  // Generate activity level (0-4) based on data or random for demo
  const getActivityLevel = (month, day) => {
    const key = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    if (data[key] !== undefined) {
      return Math.min(4, Math.max(0, data[key]));
    }
    // Demo data - random activity levels
    return Math.floor(Math.random() * 5);
  };

  // Generate all days for the year and organize by weeks
  const generateWeeklyData = () => {
    const weeks = {};
    let currentWeek = 0;
    for (let month = 1; month <= 7; month++) {
      const daysInMonth =
        month === 2 && isLeapYear(year) ? 29 : getDaysInMonth(month, year);
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = (date.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0
        if (!weeks[currentWeek]) {
          weeks[currentWeek] = {};
        }
        weeks[currentWeek][dayOfWeek] = {
          month,
          day,
          level: getActivityLevel(month, day),
        };
        // Move to next week on Sunday
        if (dayOfWeek === 6) {
          currentWeek++;
        }
      }
      // If month ends mid-week, continue to next week
      if (Object.keys(weeks[currentWeek] || {}).length > 0) {
        currentWeek++;
      }
    }
    return weeks;
  };

  const weeklyData = generateWeeklyData();
  const totalWeeks = Object.keys(weeklyData).length;

  // Calculate month positions based on weeks
  const getMonthPositions = () => {
    const positions = {};
    let weekIndex = 0;
    for (let month = 1; month <= 7; month++) {
      const startWeek = weekIndex;
      const daysInMonth =
        month === 2 && isLeapYear(year) ? 29 : getDaysInMonth(month, year);
      let tempWeek = weekIndex;
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day);
        const dayOfWeek = (date.getDay() + 6) % 7;
        if (dayOfWeek === 6 || day === daysInMonth) {
          tempWeek++;
        }
      }
      const endWeek = tempWeek - 1;
      const monthName = months[month - 1];
      positions[monthName] = {
        start: startWeek,
        width: Math.max(1, endWeek - startWeek + 1),
      };
      weekIndex = tempWeek;
    }
    return positions;
  };

  const monthPositions = getMonthPositions();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">
            Hello {username} 👋🏻
          </h1>
          <p className="text-muted-foreground">
            Ready to tackle today's coding challenges?
          </p>
        </div>

        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Challenge Progress Card */}
          <Card className="shadow-sm bg-card border border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-primary">
                Challenge Progress
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>TOTAL CHALLENGES</span>
                <span className="font-semibold text-primary">184</span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden">
                <div
                  className="bg-success"
                  style={{ width: "45.6%" }}
                  title="84 Easy"
                ></div>
                <div
                  className="bg-warning"
                  style={{ width: "32.6%" }}
                  title="60 Medium"
                ></div>
                <div
                  className="bg-destructive"
                  style={{ width: "21.7%" }}
                  title="40 Hard"
                ></div>
              </div>
              <div className="grid grid-cols-3 text-sm text-primary">
                <div className="flex flex-col items-start">
                  <span className="font-semibold">84</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-success"></span>{" "}
                    Easy
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">60</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>{" "}
                    Medium
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-semibold">40</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-destructive"></span>{" "}
                    Hard
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Card */}
          {/* <Card className="shadow-sm bg-card border border-border lg:col-span-2">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold text-primary">Activity</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative overflow-x-auto">
                <div className="flex mb-3 ml-12">
                  {months.map((month) => {
                    const position = monthPositions[month];
                    if (!position) return null;

                    return (
                      <div
                        key={month}
                        className="text-sm text-muted-foreground"
                        style={{
                          width: `${position.width * 12}px`,
                          marginLeft: position.start === 0 ? "0" : "2px",
                        }}
                      >
                        {month}
                      </div>
                    );
                  })}
                </div>

                <div className="flex">
                  <div className="w-12 flex flex-col">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                      <div
                        key={dayIndex}
                        className="h-3 flex items-center text-xs text-muted-foreground mb-1"
                      >
                        {dayIndex === 0
                          ? "Mon"
                          : dayIndex === 2
                            ? "Wed"
                            : dayIndex === 4
                              ? "Fri"
                              : ""}
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-0.5">
                    {Array.from({ length: totalWeeks }, (_, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                          const dayData = weeklyData[weekIndex]?.[dayIndex];

                          return (
                            <div
                              key={dayIndex}
                              className={`w-2.5 h-2.5 rounded-sm ${
                                dayData
                                  ? getActivityColor(dayData.level)
                                  : "bg-transparent"
                              }`}
                              title={
                                dayData
                                  ? `${dayData.month}/${dayData.day}/${year}: ${dayData.level} activities`
                                  : ""
                              }
                            ></div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              ;
            </CardContent>
          </Card> */}

          {/* Streak Card */}
          <Card className="shadow-sm bg-card border border-border flex flex-col items-center justify-center p-6 text-center lg:col-span-1">
            <Crown className="w-16 h-16 text-primary" />
            <h3 className="text-3xl font-bold text-primary mt-4">12 days</h3>
            <p className="text-sm text-muted-foreground">Best: 30</p>
          </Card>

          {/* XP Points Card */}
          <Card className="shadow-sm bg-card border border-border flex flex-col items-center justify-center p-6 text-center lg:col-span-1">
            <Star className="w-16 h-16 text-accent" />
            <h3 className="text-3xl font-bold text-primary mt-4">2,450 XP</h3>
            <p className="text-sm text-muted-foreground">Level 8</p>
          </Card>
        </div>

        {/* Search and Filters Section */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6">
          <div className="relative flex-1 w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search challenges..."
              className="pl-9 pr-4 py-2 rounded-md border border-border focus:ring-2 focus:ring-primary focus:border-primary w-full bg-background text-foreground"
            />
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3 justify-end w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-primary bg-transparent border-border"
                >
                  All Difficulties <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Easy</DropdownMenuItem>
                <DropdownMenuItem>Medium</DropdownMenuItem>
                <DropdownMenuItem>Hard</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-primary bg-transparent border-border"
                >
                  All Tag <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Arrays</DropdownMenuItem>
                <DropdownMenuItem>Strings</DropdownMenuItem>
                <DropdownMenuItem>Dynamic Programming</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-1 text-primary bg-transparent border-border"
                >
                  All Status <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Complete</DropdownMenuItem>
                <DropdownMenuItem>In Progress</DropdownMenuItem>
                <DropdownMenuItem>Todo</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className="text-primary bg-transparent border-border"
            >
              Reset
            </Button>
            <div className="flex border border-border rounded-md overflow-hidden">
              <Button
                variant="secondary"
                className="rounded-none px-3 py-2 flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <LayoutGrid className="w-4 h-4" /> Grid View
              </Button>
              <Button
                variant="ghost"
                className="rounded-none px-3 py-2 flex items-center gap-1 text-primary hover:bg-muted"
              >
                <List className="w-4 h-4" /> List View
              </Button>
            </div>
          </div>
        </div>

        {/* Challenge Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {challenges.map((challenge, index) => (
            <Card
              key={index}
              className="shadow-sm p-4 space-y-3 bg-card border border-border"
            >
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-semibold text-primary">
                  {challenge.title}
                </h4>
                <Badge
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadgeColors(challenge.difficulty)}`}
                >
                  {challenge.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {challenge.description}
              </p>
              <div className="flex flex-wrap gap-2 items-center justify-between pt-2">
                <div className="flex flex-wrap gap-1">
                  {challenge.tags.map((tag, tagIdx) => (
                    <Badge
                      key={tagIdx}
                      variant="outline"
                      className="px-2 py-0.5 rounded-md text-xs text-muted-foreground bg-muted border-border"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Badge
                  className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeColors(challenge.status)}`}
                >
                  {getStatusIcon(challenge.status)} {challenge.status}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 text-sm text-muted-foreground mt-6">
          <span>1-10 (of 100)</span>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-md bg-transparent border-border"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8 rounded-md bg-transparent border-border"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
