"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, Cloud, Droplets, Thermometer, Wheat, Waves } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AnalyticsReading = {
  temperatureC: number | null;
  humidityPercent: number | null;
  feedLevelPercent: number | null;
  waterLevelPercent: number | null;
  observedAt: string;
};

type AnalyticsRange = "24h" | "7d" | "30d" | "90d";

export type AnalyticsResponse = {
  temperature: {
    meanC: number | null;
    minC: number | null;
    maxC: number | null;
    sampleCount: number;
  };
  humidity: {
    meanPercent: number | null;
    minPercent: number | null;
    maxPercent: number | null;
    sampleCount: number;
  };
  feedLevel: {
    observedDecreasePercentagePoints: number | null;
    increaseIntervalCount: number;
    intervalCount: number;
  };
  waterLevel: {
    observedDecreasePercentagePoints: number | null;
    increaseIntervalCount: number;
    intervalCount: number;
  };
  feedWeight: {
    observedDecreaseGrams: number | null;
    increaseIntervalCount: number;
    intervalCount: number;
  };
};

const RANGES: AnalyticsRange[] = ["24h", "7d", "30d", "90d"];

export default function AnalyticsPage() {
  const [range, setRange] = useState<AnalyticsRange>("24h");
  const [readings, setReadings] = useState<AnalyticsReading[]>([]);
  const [response, setResponse] = useState<
    | {
        temperature: {
          meanC: number | null;
          minC: number | null;
          maxC: number | null;
          sampleCount: number;
        };
        humidity: {
          meanPercent: number | null;
          minPercent: number | null;
          maxPercent: number | null;
          sampleCount: number;
        };
        feedLevel: {
          observedDecreasePercentagePoints: number | null;
          increaseIntervalCount: number;
          intervalCount: number;
        };
        waterLevel: {
          observedDecreasePercentagePoints: number | null;
          increaseIntervalCount: number;
          intervalCount: number;
        };
        feedWeight: {
          observedDecreaseGrams: number | null;
          increaseIntervalCount: number;
          intervalCount: number;
        };
      }
    | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await fetch(`/api/analytics?range=${range}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load analytics");
        const data = await res.json();
        setResponse(data);
        // Convert aggregated data to readings for display
        const readings: AnalyticsReading[] = [];
        if (data?.temperature?.sampleCount > 0) {
          readings.push({
            temperatureC: data.temperature.meanC,
            humidityPercent: data.humidity?.meanPercent,
            feedLevelPercent: data.feedLevel?.observedDecreasePercentagePoints != null ? null : null,
            waterLevelPercent: data.waterLevel?.observedDecreasePercentagePoints != null ? null : null,
            observedAt: new Date().toISOString(),
          });
        }
        setReadings(readings);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [range]);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Historical Analytics" description="Loading analytics data..." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="space-y-3">
                <div className="h-4 w-2/3 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
                <div className="h-3 w-3/4 rounded bg-secondary" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Historical Analytics" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load analytics</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Use non-null assertions since we've checked loading and error states
  const tempStats = response?.temperature;
  const humidityStats = response?.humidity;
  const feedStats = response?.feedLevel;
  const waterStats = response?.waterLevel;
  const feedWeightStats = response?.feedWeight;

  // Defensive: ensure we have data, fallback to defaults
  const tempSampleCount = tempStats?.sampleCount ?? 0;
  const humiditySampleCount = humidityStats?.sampleCount ?? 0;
  const feedIntervalCount = feedStats?.intervalCount ?? 0;
  const waterIntervalCount = waterStats?.intervalCount ?? 0;

  const hasTempData = tempSampleCount > 0;
  const hasHumidityData = humiditySampleCount > 0;
  const hasFeedData = feedIntervalCount > 0;
  const hasWaterData = waterIntervalCount > 0;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Historical Analytics"
        description="Environmental history and measurements"
        actions={
          <div className="inline-flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
            {RANGES.map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={range === option ? "default" : "ghost"}
                onClick={() => setRange(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        }
      />

      {response ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Temperature (mean)"
            value={hasTempData ? `${tempStats!.meanC!.toFixed(1)}┬░C` : "No data"}
            hint={
              hasTempData
                ? `Min ${tempStats!.minC!.toFixed(1)}┬░C ┬╖ Max ${tempStats!.maxC!.toFixed(1)}┬░C`
                : "No samples in range"
            }
            icon={Thermometer}
          />
          <StatCard
            label="Humidity (mean)"
            value={hasHumidityData ? `${humidityStats!.meanPercent!.toFixed(1)}%` : "No data"}
            hint={
              hasHumidityData
                ? `Min ${humidityStats!.minPercent!.toFixed(1)}% ┬╖ Max ${humidityStats!.maxPercent!.toFixed(1)}%`
                : "No samples in range"
            }
            icon={Cloud}
          />
          <StatCard
            label="Feed level decrease"
            value={
              hasFeedData
                ? `${feedStats!.observedDecreasePercentagePoints!.toFixed(1)} pp`
                : "No data"
            }
            hint={`${feedStats?.increaseIntervalCount ?? 0} increase intervals ┬╖ ${feedIntervalCount} total`}
            icon={Wheat}
            tone={hasFeedData ? "warning" : "default"}
          />
          <StatCard
            label="Water level decrease"
            value={
              hasWaterData
                ? `${waterStats!.observedDecreasePercentagePoints!.toFixed(1)} pp`
                : "No data"
            }
            hint={`${waterStats?.increaseIntervalCount ?? 0} increase intervals ┬╖ ${waterIntervalCount} total`}
            icon={Droplets}
            tone={hasWaterData ? "warning" : "default"}
          />
          <StatCard
            label="Feed weight decrease"
            value={
              feedWeightStats?.observedDecreaseGrams != null
                ? `${feedWeightStats.observedDecreaseGrams.toFixed(1)} g`
                : "No data"
            }
            hint={`${feedWeightStats?.increaseIntervalCount ?? 0} increase intervals ┬╖ ${
              feedWeightStats?.intervalCount ?? 0
            } total`}
            icon={Waves}
          />
          <StatCard
            label="Temperature samples"
            value={tempSampleCount.toLocaleString()}
            hint="Readings in selected range"
            icon={Activity}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Activity className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No analytics data available for the selected range.</p>
              <p className="text-sm text-muted-foreground">
                Try a wider range or make sure your devices are reporting readings.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Readings ({range})</CardTitle>
          <CardDescription>
            Aggregated measurements captured for the selected time range.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {readings.length > 0 ? (
            <ul className="divide-y">
              {readings.map((reading, idx) => (
                <li
                  key={idx}
                  className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2 text-sm"
                >
                  <span className="tabular-nums text-muted-foreground">
                    {new Date(reading.observedAt).toLocaleTimeString()}
                  </span>
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Thermometer className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    {reading.temperatureC !== null ? `${reading.temperatureC.toFixed(1)}┬░C` : "ΓÇö"}
                  </span>
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Cloud className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    {reading.humidityPercent !== null
                      ? `${reading.humidityPercent.toFixed(1)}%`
                      : "ΓÇö"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No readings for this range.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
