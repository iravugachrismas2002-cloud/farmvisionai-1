import Link from "next/link";
import { Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardDevice } from "@/lib/dashboard-data";
import { cn, formatRelativeTime } from "@/lib/utils";

function reading(value: number | null, unit: string) {
  return value === null ? "—" : `${Math.round(value * 10) / 10}${unit}`;
}

function StatusBadge({ device }: { device: DashboardDevice }) {
  if (!device.isEnabled) return <Badge variant="secondary">Disabled</Badge>;
  return (
    <Badge variant="outline" className={cn(device.isOnline ? "border-primary/40 text-primary" : "text-muted-foreground")}>
      <span
        className={cn("size-1.5 rounded-full", device.isOnline ? "bg-primary" : "bg-muted-foreground")}
        aria-hidden="true"
      />
      {device.isOnline ? "Online" : "Offline"}
    </Badge>
  );
}

export function DevicesOverview({ devices }: { devices: DashboardDevice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devices</CardTitle>
        <CardDescription>Latest reading from each device.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/devices">Manage</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {devices.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Cpu className="size-8 text-muted-foreground" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-medium">No devices yet</p>
              <p className="text-sm text-muted-foreground">Register a sensor device to start receiving readings.</p>
            </div>
            <Button asChild size="sm">
              <Link href="/devices">Add a device</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Temp</TableHead>
                <TableHead className="text-right">Humidity</TableHead>
                <TableHead className="text-right">Water</TableHead>
                <TableHead className="text-right">Last seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>
                    <p className="font-medium">{device.name}</p>
                    <p className="text-xs text-muted-foreground">{device.farmName}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge device={device} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{reading(device.temperatureC, "°C")}</TableCell>
                  <TableCell className="text-right tabular-nums">{reading(device.humidityPercent, "%")}</TableCell>
                  <TableCell className="text-right tabular-nums">{reading(device.waterLevelPercent, "%")}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {device.lastSeenAt ? formatRelativeTime(device.lastSeenAt) : "Never"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
