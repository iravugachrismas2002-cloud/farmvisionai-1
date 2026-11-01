"use client";

import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  Bot,
  CheckCircle2,
  Droplets,
  Home,
  PawPrint,
  Thermometer,
  Warehouse,
  Wheat,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActuatorStateBadge } from "@/components/ui/actuator-state-badge";

type LivestockSectionItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

const LIVESTOCK_ITEMS: LivestockSectionItem[] = [
  { id: "livestock-dashboard", href: "/livestock", label: "Dashboard", icon: Home, description: "Livestock operations overview" },
  { id: "livestock-animals", href: "/livestock/animals", label: "Animals", icon: PawPrint, description: "Individual animal records" },
  { id: "livestock-barns", href: "/livestock/barns", label: "Barns", icon: Warehouse, description: "Barn structures and capacity" },
  { id: "livestock-feed", href: "/livestock/feed", label: "Feed", icon: Wheat, description: "Feed levels and schedules" },
  { id: "livestock-water", href: "/livestock/water", label: "Water", icon: Droplets, description: "Water levels and watering" },
  { id: "livestock-environment", href: "/livestock/environment", label: "Environment", icon: Thermometer, description: "Temperature, humidity, ammonia" },
  { id: "livestock-automation", href: "/livestock/automation", label: "Automation", icon: Bot, description: "Feeder, fan, water pump" },
  { id: "livestock-analytics", href: "/livestock/analytics", label: "Analytics", icon: BarChart3, description: "Livestock reports" },
];

const LIVESTOCK_DEVICES = [
  { id: "barn-a", name: "Barn A", deviceId: "ESP32-LS-001", location: "Dairy Barn", signal: 94 },
  { id: "barn-b", name: "Barn B", deviceId: "ESP32-LS-002", location: "Beef Barn", signal: 88 },
  { id: "barn-c", name: "Barn C", deviceId: "ESP32-LS-003", location: "Calf Barn", signal: 91 },
];

export default function LivestockPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Livestock Operations Center"
        description="Animal health, barns, feed, water, environment, and automation"
      />

      {/* Executive Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Animals" value="1,250" icon={PawPrint} tone="default" />
        <StatCard label="Healthy" value="1,190" icon={CheckCircle2} tone="success" />
        <StatCard label="Under Observation" value="42" icon={AlertTriangle} tone="warning" />
        <StatCard label="Critical" value="18" icon={AlertCircle} tone="danger" />
      </div>

      {/* Livestock Sections */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LIVESTOCK_ITEMS.map((item) => (
          <Link key={item.id} href={item.href} className="group">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <item.icon className="size-4" aria-hidden="true" />
                  </span>
                  {item.label}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Feed & Water Levels */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-info/15 text-info">
                  <Wheat className="size-4" aria-hidden="true" />
                </span>
                Feed Level
              </span>
              <Badge variant="outline" className="bg-info/10 text-info">78%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-info" style={{ width: "78%" }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Sufficient for 5.2 days at current consumption rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Droplets className="size-4" aria-hidden="true" />
                </span>
                Water Level
              </span>
              <Badge variant="outline" className="bg-primary/10 text-primary">92%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: "92%" }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Sufficient for 12.4 days at current consumption rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Barn Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Warehouse className="size-4" aria-hidden="true" />
              </span>
              Barn Conditions
            </span>
            <Badge variant="outline" className="bg-primary/10 text-primary">Normal</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                <Thermometer className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Temperature</p>
                <p className="text-lg font-semibold tabular-nums tracking-tight">22.5┬░C</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                <Droplets className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Humidity</p>
                <p className="text-lg font-semibold tabular-nums tracking-tight">58%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Wind className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">Ammonia</p>
                <p className="text-lg font-semibold tabular-nums tracking-tight text-primary">12 ppm</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ESP32 Controllers for Livestock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Bot className="size-4" aria-hidden="true" />
              </span>
              ESP32 Controllers ΓÇö Livestock
            </span>
            <Badge variant="outline" className="bg-primary/10 text-primary">3 Online</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {LIVESTOCK_DEVICES.map((device) => (
              <div key={device.id} className="rounded-lg border bg-background/50 p-3">
                <p className="text-xs font-medium text-foreground">{device.name}</p>
                <p className="font-mono text-xs text-muted-foreground">{device.deviceId}</p>
                <p className="text-xs text-muted-foreground">{device.location}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`text-xs font-bold ${
                      device.signal > 80 ? "text-primary" : device.signal > 60 ? "text-warning" : "text-destructive"
                    }`}
                  >
                    {device.signal}%
                  </span>
                  <StatusBadge status="online" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <AlertCircle className="size-4" aria-hidden="true" />
            </span>
            Quick Actions
          </CardTitle>
          <CardDescription>Common livestock operations shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Button className="w-full">
              <PawPrint /> Add Animal
            </Button>
            <Button variant="secondary" className="w-full">
              <Wheat /> Order Feed
            </Button>
            <Button variant="secondary" className="w-full">
              <Droplets /> Check Water
            </Button>
            <Button variant="secondary" className="w-full">
              <Bot /> Run Automation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
