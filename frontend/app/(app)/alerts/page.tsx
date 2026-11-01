"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertCircle, Bell, BellOff, BellRing, CheckCircle2, Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AlertEventItem = {
  id: string;
  eventType: "TRIGGERED" | "ACKNOWLEDGED" | "RESOLVED" | "ESCALATED" | "SEVERITY_CHANGED";
  severity: "INFO" | "WARNING" | "CRITICAL";
  message: string;
  observedValue: number | null;
  thresholdValue: number | null;
  unit: string | null;
  createdAt: string;
  actor: { name: string | null; email: string | null } | null;
};

export type { AlertEventItem };

type Device = {
  id: string;
  publicId: string;
  name: string;
  source: "HARDWARE" | "SIMULATOR";
  farm: { id: string; name: string };
};

export type { Device };

type AlertItem = {
  id: string;
  type: "FEED_LOW" | "WATER_LOW" | "HIGH_TEMPERATURE";
  severity: "INFO" | "WARNING" | "CRITICAL";
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  title: string;
  reason: string;
  suggestedAction: string;
  observedValue: number;
  thresholdValue: number;
  unit: string;
  firstTriggeredAt: string;
  lastTriggeredAt: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
  device: Device;
  events: AlertEventItem[];
};

export type { AlertItem };

const severityVariant = (severity: AlertItem["severity"]) =>
  severity === "CRITICAL"
    ? "destructive"
    : severity === "WARNING"
      ? "secondary"
      : "outline";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAlerts() {
      try {
        const res = await fetch("/api/alerts", {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load alerts");
        }

        if (cancelled) return;

        const data = await res.json();
        setAlerts(data.alerts ?? []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchAlerts();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Alert Center" description="Loading alerts..." />
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
        <PageHeader title="Alert Center" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load alerts</CardTitle>
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

  const activeAlerts = alerts.filter((alert) => alert.status !== "RESOLVED");
  const resolvedAlerts = alerts.filter((alert) => alert.status === "RESOLVED");
  const openAlerts = alerts.filter((alert) => alert.status === "OPEN");
  const acknowledgedAlerts = alerts.filter((alert) => alert.status === "ACKNOWLEDGED");

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Alert Center"
        description="Farm alerts and notifications"
        actions={
          <Button asChild>
            <Link href="/api/alerts/create">
              <Plus /> Create alert
            </Link>
          </Button>
        }
      />

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total alerts"
          value={alerts.length}
          hint="Recorded across your farms"
          icon={Bell}
        />
        <StatCard
          label="Open"
          value={openAlerts.length}
          hint="Awaiting acknowledgement"
          icon={AlertCircle}
          tone={openAlerts.length > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Acknowledged"
          value={acknowledgedAlerts.length}
          hint="Being handled"
          icon={CheckCircle2}
        />
        <StatCard
          label="Resolved"
          value={resolvedAlerts.length}
          hint="Back within thresholds"
          icon={BellOff}
          tone={resolvedAlerts.length > 0 ? "success" : "default"}
        />
      </section>

      {activeAlerts.length === 0 && resolvedAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <BellRing className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No alerts at this time.</p>
              <p className="text-sm text-muted-foreground">
                Telemetry is within normal thresholds.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <section className="space-y-4" aria-label="Open alerts">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
                <AlertCircle className="size-4" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Open Alerts</h2>
              <Badge variant="secondary">{openAlerts.length}</Badge>
            </div>

            {openAlerts.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No open alerts.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {openAlerts.map((alert) => (
                  <Card key={alert.id} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        {alert.title}
                        <Badge variant={severityVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{alert.reason}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm">
                        <span className="font-medium">Suggested:</span>{" "}
                        {alert.suggestedAction}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {alert.device.name} ┬╖ {alert.device.farm.name}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alertAck(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4" aria-label="Resolved alerts">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
              </span>
              <h2 className="text-lg font-semibold tracking-tight">Resolved Alerts</h2>
              <Badge variant="secondary">{resolvedAlerts.length}</Badge>
            </div>

            {resolvedAlerts.length === 0 ? (
              <Card>
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  No resolved alerts.
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {resolvedAlerts.map((alert) => (
                  <Card key={alert.id} className="transition-shadow hover:shadow-md">
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between gap-2">
                        {alert.title}
                        <Badge variant={severityVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{alert.reason}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">
                        Resolved:{" "}
                        {new Date(alert.resolvedAt ?? Date.now()).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

function alertAck(alertId: string) {
  alert("Acknowledge alert functionality would be implemented via API call");
}
