"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  count: { label: "Active alerts" },
  CRITICAL: { label: "Critical", color: "var(--color-chart-4)" },
  WARNING: { label: "Warning", color: "var(--color-chart-3)" },
  INFO: { label: "Info", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

type Point = { severity: "CRITICAL" | "WARNING" | "INFO"; count: number };

export function AlertsChart({ data }: { data: Point[] }) {
  const rows = data.map((point) => ({
    ...point,
    label: chartConfig[point.severity].label,
    fill: chartConfig[point.severity].color,
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-52 w-full">
      <BarChart data={rows} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={40} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {rows.map((row) => (
            <Cell key={row.severity} fill={row.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
