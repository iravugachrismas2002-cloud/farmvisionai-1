"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Cpu, Plus, Tractor } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FarmOption = { id: string; name: string };
type DeviceItem = {
  id: string;
  publicId: string;
  name: string;
  source: "HARDWARE" | "SIMULATOR";
  isEnabled: boolean;
  lastSeenAt?: string | null;
  farm: FarmOption;
};

export default function DevicesPage() {
  const [farms, setFarms] = useState<FarmOption[]>([]);
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [farmsRes, devicesRes] = await Promise.all([
          fetch("/api/farms", { credentials: "include" }),
          fetch("/api/devices", { credentials: "include" }),
        ]);

        if (!farmsRes.ok) {
          if (farmsRes.status === 401 || farmsRes.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load farms");
        }

        if (!devicesRes.ok) {
          if (devicesRes.status === 401 || devicesRes.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load devices");
        }

        if (cancelled) return;

        const farmsData = await farmsRes.json();
        const devicesData = await devicesRes.json();
        setFarms(farmsData.farms ?? []);
        setDevices(devicesData.devices ?? []);
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
        <PageHeader title="My Devices" description="Loading devices..." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
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
        <PageHeader title="My Devices" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load devices</CardTitle>
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

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="My Devices"
        description="Manage your registered devices"
        actions={
          <Button asChild>
            <Link href="/api/devices/register">
              <Plus /> Register device
            </Link>
          </Button>
        }
      />

      {farms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Tractor className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No farms registered.</p>
              <p className="text-sm text-muted-foreground">
                Register a farm first to associate devices.
              </p>
            </div>
            <Button asChild>
              <Link href="/farms">Go to farms</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {farms.length} farm{farms.length !== 1 ? "s" : ""}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/farms">
              <ArrowLeft /> Back to farms
            </Link>
          </Button>
        </div>
      )}

      {devices.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Cpu className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No devices registered yet.</p>
              <p className="text-sm text-muted-foreground">
                A device must be registered before it can report telemetry.
              </p>
            </div>
            <Button asChild>
              <Link href="/api/devices/register">
                <Plus /> Register device
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => (
            <Card key={device.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Cpu className="size-4" aria-hidden="true" />
                  </span>
                  {device.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5">
                  <Tractor className="size-3.5" aria-hidden="true" />
                  {device.farm.name} ┬╖{" "}
                  {device.source === "HARDWARE" ? "Hardware" : "Simulator"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    ID: {device.publicId}
                  </p>
                  {device.lastSeenAt ? (
                    <p className="text-xs text-muted-foreground">
                      Last seen: {new Date(device.lastSeenAt).toLocaleString()}
                    </p>
                  ) : null}
                </div>
                <Badge variant={device.isEnabled ? "default" : "secondary"}>
                  {device.isEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
