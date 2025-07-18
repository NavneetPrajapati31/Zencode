"use client";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const data = [
  { name: "Mon", hours: 4 },
  { name: "Tue", hours: 6 },
  { name: "Wed", hours: 5 },
  { name: "Thu", hours: 7 },
  { name: "Fri", hours: 5 },
  { name: "Sat", hours: 3 },
  { name: "Sun", hours: 2 },
];

export default function ProgressChart() {
  return (
    <ChartContainer
      config={{
        hours: {
          label: "Coding Hours",
          color: "hsl(var(--chart-3))", // Using chart-3 for amber tone
        },
      }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary))" />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
          <YAxis stroke="hsl(var(--foreground))" />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="hours"
            fill="var(--color-hours)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
