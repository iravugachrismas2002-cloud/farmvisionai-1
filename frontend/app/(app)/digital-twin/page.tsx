"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, ArrowRight, Eye, Radio, Settings, TrendingDown, TriangleAlert, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SensorDataPoint = {
  id: string;
  deviceId: string;
  timestamp: string;
  temperatureC?: number;
  humidityPercent?: number;
  feedLevelPercent?: number;
  waterLevelPercent?: number;
  feedWeightGrams?: number;
  messageId: string;
  source: "HARDWARE" | "SIMULATOR";
};

type DigitalBaseline = {
  id: string;
  farmId: string;
  parameter: "TEMPERATURE" | "HUMIDITY" | "FEED_CONSUMPTION" | "WATER_CONSUMPTION";
  baselineValue: number;
  upperThreshold: number;
  lowerThreshold: number;
  createdAt: string;
  updatedAt: string;
};

type PredictionAlert = {
  id: string;
  deviceId: string;
  type: "FEED_DEPLETION" | "WATER_DEPLETION" | "TEMPERATURE_EXTREME" | "HUMIDITY_ISSUE";
  severity: "INFO" | "WARNING" | "CRITICAL";
  predictedAt: string;
  message: string;
  confidence: number;
};

type CrossFarmComparison = {
  farmId: string;
  farmName: string;
  parameter: "TEMPERATURE" | "HUMIDITY" | "FEED" | "WATER";
  currentValue: number;
  farmAverage: number;
  topFarm: string;
  topValue: number;
  percentile: number;
};

const severityVariant = (severity: PredictionAlert["severity"]) =>
  severity === "CRITICAL"
    ? "destructive"
    : severity === "WARNING"
      ? "secondary"
      : "outline";

function ReadingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
  count,
}: {
  icon: LucideIcon;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {typeof count === "number" ? <Badge variant="secondary">{count}</Badge> : null}
    </div>
  );
}

export default function DigitalTwinPage() {
  const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);
  const [baselines, setBaselines] = useState<DigitalBaseline[]>([]);
  const [predictions, setPredictions] = useState<PredictionAlert[]>([]);
  const [crossFarmData, setCrossFarmData] = useState<CrossFarmComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mqttConnected, setMqttConnected] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [
          sensorsRes,
          baselinesRes,
          predictionsRes,
          crossFarmRes,
        ] = await Promise.all([
          fetch("/api/sensor-data", { credentials: "include" }),
          fetch("/api/baselines", { credentials: "include" }),
          fetch("/api/predictions", { credentials: "include" }),
          fetch("/api/cross-farm", { credentials: "include" }),
        ]);

        if (!sensorsRes.ok && cancelled === false) {
          if (sensorsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load sensor data");
        }

        if (!baselinesRes.ok && cancelled === false) {
          if (baselinesRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load baselines");
        }

        if (!predictionsRes.ok && cancelled === false) {
          if (predictionsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load predictions");
        }

        if (!crossFarmRes.ok && cancelled === false) {
          if (crossFarmRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load cross-farm data");
        }

        if (cancelled) return;

        const sensorsData = await sensorsRes.json();
        const baselinesData = await baselinesRes.json();
        const predictionsData = await predictionsRes.json();
        const crossFarmData = await crossFarmRes.json();

        if (cancelled) return;

        setSensorData(sensorsData.sensorData ?? []);
        setBaselines(baselinesData.baselines ?? []);
        setPredictions(predictionsData.predictions ?? []);
        setCrossFarmData(crossFarmData.comparisons ?? []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Digital Twin 2.0" description="Loading digital twin data..." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="space-y-3">
                <div className="h-4 w-2/3 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
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
        <PageHeader title="Digital Twin 2.0" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load digital twin data</CardTitle>
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

  const quickActions = [
    { href: "/mqtt/settings", label: "MQTT Settings", icon: Settings },
    { href: "/digital-twin/baselines", label: "Manage Baselines", icon: Activity },
    { href: "/predictions/active", label: "View Predictions", icon: Eye },
    { href: "/cross-farm/compare", label: "Cross-Farm Compare", icon: TrendingDown },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Digital Twin 2.0"
        description="Farm Simulation & Predictive Analytics"
        actions={
          <>
            <Badge variant={mqttConnected ? "default" : "secondary"}>
              <Radio />
              {mqttConnected ? "MQTT Connected" : "MQTT Disconnected"}
            </Badge>
            <Button onClick={() => (window.location.href = "/mqtt/connect")}>
              <Radio /> Connect/Disconnect
            </Button>
          </>
        }
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active Sensors"
          value={sensorData.length}
          hint="Live readings from MQTT"
          icon={Radio}
          tone={sensorData.length > 0 ? "success" : "default"}
        />
        <StatCard
          label="Baselines Active"
          value={baselines.length}
          hint="Thresholds being monitored"
          icon={Activity}
        />
        <StatCard
          label="Predictive Alerts"
          value={predictions.length}
          hint={
            predictions.some((p) => p.severity === "CRITICAL")
              ? "Critical alerts present"
              : "Within normal parameters"
          }
          icon={TriangleAlert}
          tone={
            predictions.some((p) => p.severity === "CRITICAL")
              ? "danger"
              : predictions.some((p) => p.severity === "WARNING")
                ? "warning"
                : "default"
          }
        />
        <StatCard
          label="Cross-Farm Comparisons"
          value={crossFarmData.length}
          hint="Parameters benchmarked across farms"
          icon={Wheat}
        />
      </section>

      <div className="space-y-6">
        {/* Real-time Sensor Feed */}
        <section aria-label="Real-time sensor feed" className="space-y-4">
          <SectionHeading icon={Radio} title="Real-time Sensor Feed" count={sensorData.length} />
          {sensorData.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No real-time sensor data. MQTT connection may be pending.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {sensorData.map((reading) => (
                <Card key={reading.id}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      {reading.deviceId}
                      <Badge variant={reading.source === "HARDWARE" ? "outline" : "secondary"}>
                        {reading.source}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {new Date(reading.timestamp).toLocaleTimeString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {reading.temperatureC !== undefined && (
                      <ReadingRow label="Temperature" value={`${reading.temperatureC.toFixed(1)}°C`} />
                    )}
                    {reading.humidityPercent !== undefined && (
                      <ReadingRow label="Humidity" value={`${reading.humidityPercent.toFixed(1)}%`} />
                    )}
                    {reading.feedLevelPercent !== undefined && (
                      <ReadingRow label="Feed" value={`${reading.feedLevelPercent.toFixed(1)}%`} />
                    )}
                    {reading.waterLevelPercent !== undefined && (
                      <ReadingRow label="Water" value={`${reading.waterLevelPercent.toFixed(1)}%`} />
                    )}
                    {reading.feedWeightGrams !== undefined && (
                      <ReadingRow label="Feed weight" value={`${reading.feedWeightGrams}g`} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Predictive Alerts */}
        <section aria-label="Predictive alerts" className="space-y-4">
          <SectionHeading
            icon={TriangleAlert}
            title="Predictive Alerts"
            count={predictions.length}
          />
          {predictions.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No predictive alerts at this time. All systems within normal parameters.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {predictions.map((prediction) => (
                <Card key={prediction.id}>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between gap-2">
                      {prediction.type}
                      <Badge variant={severityVariant(prediction.severity)}>
                        {prediction.severity}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{prediction.message}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <span className="text-muted-foreground">Confidence</span>
                      <span className="font-semibold tabular-nums">
                        {prediction.confidence.toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Predicted: {new Date(prediction.predictedAt).toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Cross-Farm Analytics */}
        <section aria-label="Cross-farm analytics" className="space-y-4">
          <SectionHeading
            icon={TrendingDown}
            title="Cross-Farm Analytics"
            count={crossFarmData.length}
          />
          {crossFarmData.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                No cross-farm comparison data available.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {crossFarmData.map((comparison) => (
                <Card key={comparison.farmId}>
                  <CardHeader>
                    <CardTitle>{comparison.farmName}</CardTitle>
                    <CardDescription>{comparison.parameter}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <ReadingRow label="Current" value={String(comparison.currentValue)} />
                    <ReadingRow label="Average" value={String(comparison.farmAverage)} />
                    <p className="text-sm font-medium">
                      {comparison.percentile}% above avg
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section aria-label="Quick actions" className="space-y-4">
          <SectionHeading icon={ArrowRight} title="Quick Actions" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Button
                key={action.href}
                variant="outline"
                className="h-auto justify-start gap-3 p-4"
                asChild
              >
                <Link href={action.href}>
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <action.icon className="size-4" aria-hidden="true" />
                  </span>
                  {action.label}
                </Link>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
