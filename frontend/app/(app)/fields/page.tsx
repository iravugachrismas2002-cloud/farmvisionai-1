"use client";

import Link from "next/link";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CloudSun,
  Cpu,
  Droplets,
  Home,
  Layers,
  Plus,
  Sprout,
  Tractor,
  TrendingUp,
  Wheat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActuatorStateBadge } from "@/components/ui/actuator-state-badge";

type FieldSectionItem = {
  id: string;
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

const FIELDS_ITEMS: FieldSectionItem[] = [
  { id: "fields-dashboard", href: "/fields", label: "Dashboard", icon: Home, description: "Field operations overview" },
  { id: "fields-list", href: "/fields/fields", label: "Fields", icon: Wheat, description: "Manage farm fields and zones" },
  { id: "fields-crops", href: "/fields/crops", label: "Crops", icon: Sprout, description: "Crop types, stages, yield potential" },
  { id: "fields-irrigation", href: "/fields/irrigation", label: "Irrigation", icon: Droplets, description: "Control irrigation systems" },
  { id: "fields-soil", href: "/fields/soil", label: "Soil", icon: Layers, description: "Soil moisture, nutrients, pH" },
  { id: "fields-weather", href: "/fields/weather", label: "Weather", icon: CloudSun, description: "Weather monitoring and forecasts" },
  { id: "fields-automation", href: "/fields/automation", label: "Automation", icon: Tractor, description: "Field automation systems" },
  { id: "fields-analytics", href: "/fields/analytics", label: "Analytics", icon: TrendingUp, description: "Field reports and yield predictions" },
];

const FIELD_DEVICES = [
  { id: "field-1", name: "Field A-1", deviceId: "ESP32-F-001", crop: "Maize", signal: 94 },
  { id: "field-2", name: "Field A-2", deviceId: "ESP32-F-002", crop: "Beans", signal: 87 },
  { id: "field-3", name: "Field B-1", deviceId: "ESP32-F-003", crop: "Irish Potato", signal: 91 },
  { id: "field-4", name: "Field B-2", deviceId: "ESP32-F-004", crop: "Cassava", signal: 84 },
  { id: "field-5", name: "Field C-1", deviceId: "ESP32-F-005", crop: "Banana", signal: 89 },
  { id: "field-6", name: "Field C-2", deviceId: "ESP32-F-006", crop: "Coffee", signal: 76 },
  { id: "field-7", name: "Field D-1", deviceId: "ESP32-F-007", crop: "Tea", signal: 93 },
];

const FIELDS = [
  { id: "f-1", name: "North Field A", crop: "Maize", size: "4.2 ha", moisture: "61%", status: "Healthy", controller: "ESP32-F-001" },
  { id: "f-2", name: "North Field B", crop: "Beans", size: "3.1 ha", moisture: "42%", status: "Healthy", controller: "ESP32-F-002" },
  { id: "f-3", name: "West Field C", crop: "Irish Potato", size: "5.5 ha", moisture: "34%", status: "Warning", controller: "ESP32-F-003" },
  { id: "f-4", name: "West Field D", crop: "Cassava", size: "6.8 ha", moisture: "58%", status: "Healthy", controller: "ESP32-F-004" },
  { id: "f-5", name: "East Field E", crop: "Banana", size: "7.2 ha", moisture: "72%", status: "Warning", controller: "ESP32-F-005" },
  { id: "f-6", name: "East Field F", crop: "Coffee", size: "3.9 ha", moisture: "45%", status: "Healthy", controller: "ESP32-F-006" },
  { id: "f-7", name: "South Field G", crop: "Tea", size: "8.1 ha", moisture: "67%", status: "Healthy", controller: "ESP32-F-007" },
];

export default function FieldsPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Field Operations Center"
        description="Fields, crops, irrigation, soil, weather, and field automation"
        actions={
          <Button>
            <Plus /> Add field
          </Button>
        }
      />

      {/* Executive Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Fields" value="14" icon={Wheat} tone="default" />
        <StatCard label="Healthy" value="12" icon={CheckCircle2} tone="success" />
        <StatCard label="Warning" value="2" icon={AlertTriangle} tone="warning" />
        <StatCard label="Critical" value="0" icon={AlertCircle} tone="danger" />
      </div>

      {/* Field Sections */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {FIELDS_ITEMS.map((item) => (
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

      {/* Soil Moisture & Irrigation */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-info/15 text-info">
                  <Layers className="size-4" aria-hidden="true" />
                </span>
                Average Soil Moisture
              </span>
              <Badge variant="outline" className="bg-info/10 text-info">61%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-info" style={{ width: "61%" }} />
            </div>
            <p className="text-sm text-muted-foreground">
              Optimal range: 40-70%. 2 fields below threshold.
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
                Irrigation Systems
              </span>
              <Badge variant="outline" className="bg-primary/10 text-primary">Online</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: "100%" }} />
            </div>
            <p className="text-sm text-muted-foreground">
              7 active irrigation zones across 14 fields
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Field ESP32 Controllers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Cpu className="size-4" aria-hidden="true" />
              </span>
              Field ESP32 Controllers
            </span>
            <Badge variant="outline" className="bg-primary/10 text-primary">7 Online</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {FIELD_DEVICES.map((device) => (
              <div key={device.id} className="rounded-lg border bg-background/50 p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-xs font-medium text-foreground">{device.name}</p>
                  <span
                    className={`text-xs font-bold ${
                      device.signal > 80 ? "text-primary" : device.signal > 60 ? "text-warning" : "text-destructive"
                    }`}
                  >
                    {device.signal}%
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{device.deviceId}</p>
                <p className="text-xs text-muted-foreground">{device.crop}</p>
                <div className="mt-2">
                  <StatusBadge status="online" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Wheat className="size-4" aria-hidden="true" />
            </span>
            All Fields
          </CardTitle>
          <CardDescription>Registered fields across the farm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Field</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Crop</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Size</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Moisture</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Controller</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {FIELDS.map((field) => (
                  <tr key={field.id} className="transition-colors hover:bg-accent">
                    <td className="px-3 py-3 text-sm font-medium text-foreground">{field.name}</td>
                    <td className="px-3 py-3 text-sm text-foreground">{field.crop}</td>
                    <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{field.size}</td>
                    <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{field.moisture}</td>
                    <td className="px-3 py-3 text-sm">
                      {field.status === "Warning" ? (
                        <StatusBadge status="warning" />
                      ) : (
                        <Badge variant="default">{field.status}</Badge>
                      )}
                    </td>
                    <td className="px-3 py-3 font-mono text-sm text-muted-foreground">{field.controller}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
