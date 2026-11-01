"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Brain,
  CalendarClock,
  Droplets,
  Gauge,
  ListChecks,
  ShieldAlert,
  TrendingDown,
  TriangleAlert,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DepletionStatus =
  | "ESTIMATED"
  | "INSUFFICIENT_DATA"
  | "NO_DECLINE"
  | "NO_SUSTAINED_DECLINE"
  | "RESET_AFFECTED"
  | "AT_ZERO";

type FeedAnalysis = {
  observedWeightChange: {
    observedDecreaseGrams: number | null;
    sampleCount: number;
    declineIntervalCount: number;
    resetIntervalCount: number;
    limitation: string;
  };
  performance: {
    score: number | null;
    explanation: string;
  };
};

type WaterAnalysis = {
  currentLevelPercent: number | null;
  dailyDeclinePercentagePoints: number | null;
  estimatedZeroAt: string | null;
  sampleCount: number;
  declineIntervalCount: number;
  coverageHours: number | null;
  asOf: string;
  limitation: string;
};

type RiskAnalysis = {
  explanation: string;
  score: number | null;
  policyVersion: string | null;
  signals?: Array<{
    id: string;
    title: string;
    severity: string;
    status: string;
    observedValue: number;
    unit: string;
    thresholdValue: number;
    observedAt: string;
    provenanceNote: string;
    source: string;
  }>;
};

type Recommendation = {
  id: string;
  title: string;
  reason: string;
  suggestedAction: string;
  evidence: {
    currentValue: number;
    dailyDeclinePercentagePoints: number;
    sampleCount: number;
    declineIntervalCount: number;
  };
  provenance: {
    source: "SIMULATOR" | "HARDWARE";
    observedAt: string;
    formulaVersion: string;
  };
};

type DeviceDetail = {
  id: string;
  name: string;
  farmId: string;
  farmName: string;
  source: "HARDWARE" | "SIMULATOR";
  isEnabled: boolean;
  depletionForecast: {
    status: DepletionStatus;
    currentLevelPercent: number | null;
    dailyDeclinePercentagePoints: number | null;
    estimatedZeroAt: string | null;
    daysUntilZero: number | null;
    sampleCount: number;
    declineIntervalCount: number;
    coverageHours: number | null;
    asOf: string;
  };
  analysis: {
    feed: FeedAnalysis;
    water: WaterAnalysis;
    risk: RiskAnalysis;
  };
  recommendations: Recommendation[];
};

type FarmDetail = {
  id: string;
  name: string;
  devices: Array<{
    id: string;
    name: string;
    source: "HARDWARE" | "SIMULATOR";
    isEnabled: boolean;
  }>;
};

type IntelligenceResponse = {
  farms: FarmDetail[];
  devices: DeviceDetail[];
};

function forecastStatusVariant(
  status: DepletionStatus,
): "destructive" | "secondary" | "outline" | "default" {
  switch (status) {
    case "AT_ZERO":
      return "destructive";
    case "ESTIMATED":
      return "default";
    case "INSUFFICIENT_DATA":
      return "outline";
    default:
      return "secondary";
  }
}

function severityVariant(severity: string): "destructive" | "secondary" | "outline" {
  const normalized = severity.toUpperCase();
  if (normalized === "CRITICAL") return "destructive";
  if (normalized === "WARNING") return "secondary";
  return "outline";
}

export default function IntelligencePage() {
  const [intelligence, setIntelligence] = useState<IntelligenceResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchIntelligence() {
      try {
        const res = await fetch("/api/intelligence", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load intelligence");
        const data = await res.json() as IntelligenceResponse;
        setIntelligence(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchIntelligence();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Intelligence & Forecasts" description="Loading intelligence data..." />
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
        <PageHeader title="Intelligence & Forecasts" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load intelligence</CardTitle>
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

  if (!intelligence || intelligence.devices.length === 0) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Intelligence & Forecasts" />
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Brain className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No devices found.</p>
              <p className="text-sm text-muted-foreground">
                Register a device to view its intelligence.
              </p>
            </div>
            <Button asChild>
              <Link href="/devices">Register device</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const device = intelligence.devices[0];
  const farm = intelligence.farms.find((f) => f.id === device.farmId);

  const forecast = device.depletionForecast;
  const feed = device.analysis?.feed;
  const water = device.analysis?.water;
  const risk = device.analysis?.risk;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Intelligence & Forecasts"
        description="AI-powered insights and depletion forecasts"
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Brain className="size-4" aria-hidden="true" />
            </span>
            {farm?.name} ┬╖ {device.name}
          </CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {device.source === "HARDWARE" ? "Hardware" : "Simulator"}
            </Badge>
            <Badge variant={forecastStatusVariant(forecast.status)}>
              {forecast.status}
            </Badge>
            {device.isEnabled ? (
              <Badge variant="secondary">Enabled</Badge>
            ) : (
              <Badge variant="outline">Disabled</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Depletion Forecast</h3>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Current level"
                value={
                  forecast.currentLevelPercent !== null
                    ? `${forecast.currentLevelPercent.toFixed(1)}%`
                    : "N/A"
                }
                hint="Latest observed level"
                icon={Gauge}
              />
              <StatCard
                label="Decline rate"
                value={
                  forecast.dailyDeclinePercentagePoints !== null
                    ? `${forecast.dailyDeclinePercentagePoints.toFixed(2)} pp/day`
                    : "N/A"
                }
                hint="Daily percentage point decline"
                icon={TrendingDown}
                tone={forecast.dailyDeclinePercentagePoints !== null ? "warning" : "default"}
              />
              <StatCard
                label="Estimated 0% crossing"
                value={
                  forecast.estimatedZeroAt && forecast.status === "ESTIMATED"
                    ? new Date(forecast.estimatedZeroAt).toLocaleDateString()
                    : "Not available"
                }
                hint="Projected depletion date"
                icon={CalendarClock}
              />
              <StatCard
                label="Coverage"
                value={
                  forecast.coverageHours !== null
                    ? `${forecast.coverageHours.toFixed(1)} h`
                    : "No data"
                }
                hint={`${forecast.sampleCount.toLocaleString()} samples ┬╖ ${forecast.declineIntervalCount} declining intervals`}
                icon={Gauge}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Wheat className="size-4 text-primary" aria-hidden="true" />
                  Feed Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <StatCard
                    label="Observed weight change"
                    value={
                      feed?.observedWeightChange?.observedDecreaseGrams !== null &&
                      feed?.observedWeightChange?.observedDecreaseGrams !== undefined
                        ? `${feed.observedWeightChange.observedDecreaseGrams.toFixed(1)} g`
                        : "N/A"
                    }
                    hint={`${feed?.observedWeightChange?.sampleCount ?? 0} samples ┬╖ ${
                      feed?.observedWeightChange?.declineIntervalCount ?? 0
                    } decline intervals`}
                    icon={Wheat}
                  />
                  <StatCard
                    label="Performance score"
                    value={
                      feed?.performance.score !== null && feed?.performance.score !== undefined
                        ? `${feed.performance.score}/100`
                        : "Not rated"
                    }
                    hint="Feed efficiency rating"
                    icon={Brain}
                    tone={
                      feed?.performance.score == null
                        ? "default"
                        : feed.performance.score >= 70
                          ? "success"
                          : feed.performance.score >= 40
                            ? "warning"
                            : "danger"
                    }
                  />
                </div>
                {feed?.observedWeightChange?.limitation ? (
                  <p className="text-xs text-muted-foreground">
                    {feed.observedWeightChange.limitation}
                  </p>
                ) : null}
                {feed?.performance.explanation ? (
                  <p className="text-sm text-muted-foreground">
                    {feed.performance.explanation}
                  </p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Droplets className="size-4 text-primary" aria-hidden="true" />
                  Water Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <StatCard
                    label="Current level"
                    value={
                      water?.currentLevelPercent !== null && water?.currentLevelPercent !== undefined
                        ? `${water.currentLevelPercent.toFixed(1)}%`
                        : "N/A"
                    }
                    hint={`Updated ${
                      water?.asOf ? new Date(water.asOf).toLocaleString() : "ΓÇö"
                    }`}
                    icon={Droplets}
                  />
                  <StatCard
                    label="Decline rate"
                    value={
                      water?.dailyDeclinePercentagePoints !== null &&
                      water?.dailyDeclinePercentagePoints !== undefined
                        ? `${water.dailyDeclinePercentagePoints.toFixed(2)} pp/day`
                        : "N/A"
                    }
                    hint={`Est. 0%: ${
                      water?.estimatedZeroAt
                        ? new Date(water.estimatedZeroAt).toLocaleDateString()
                        : "not available"
                    }`}
                    icon={TrendingDown}
                    tone={water?.dailyDeclinePercentagePoints ? "warning" : "default"}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {water?.sampleCount ?? 0} samples ┬╖ {water?.declineIntervalCount ?? 0} decline
                  intervals
                </p>
                {water?.limitation ? (
                  <p className="text-xs text-muted-foreground">{water.limitation}</p>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldAlert className="size-4 text-primary" aria-hidden="true" />
                  Risk Signals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {risk?.score !== null && risk?.score !== undefined ? (
                  <StatCard
                    label="Risk score"
                    value={`${risk.score}/100`}
                    hint={
                      risk.policyVersion ? `Policy ${risk.policyVersion}` : "Current policy"
                    }
                    icon={TriangleAlert}
                    tone={
                      risk.score >= 70 ? "danger" : risk.score >= 40 ? "warning" : "success"
                    }
                  />
                ) : null}
                {risk?.explanation ? (
                  <p className="text-sm text-muted-foreground">{risk.explanation}</p>
                ) : null}
                {risk?.signals != null && risk.signals.length > 0 ? (
                  <ul className="space-y-2">
                    {risk.signals.map((signal) => (
                      <li
                        key={signal.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5 text-sm"
                      >
                        <span className="font-medium">{signal.title}</span>
                        <Badge variant={severityVariant(signal.severity)}>
                          {signal.severity}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No active risk signals.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ListChecks className="size-4 text-primary" aria-hidden="true" />
                Review Prompts
              </CardTitle>
              <CardDescription>Recommended actions for this device.</CardDescription>
            </CardHeader>
            <CardContent>
              {device.recommendations.length > 0 ? (
                <ul className="space-y-3">
                  {device.recommendations.map((prompt: Recommendation) => (
                    <li key={prompt.id} className="rounded-lg border p-3 text-sm">
                      <p className="font-medium">{prompt.title}</p>
                      <p className="mt-1 text-muted-foreground">{prompt.reason}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No review prompts available.
                </p>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
