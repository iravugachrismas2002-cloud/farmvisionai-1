import Link from "next/link";
import { BellOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardAlert } from "@/lib/dashboard-data";
import { cn, formatRelativeTime } from "@/lib/utils";

const severityStyles: Record<DashboardAlert["severity"], { dot: string; label: string; badge: string }> = {
  CRITICAL: { dot: "bg-destructive", label: "Critical", badge: "border-destructive/40 text-destructive" },
  WARNING: { dot: "bg-warning", label: "Warning", badge: "border-warning/40 text-warning" },
  INFO: { dot: "bg-info", label: "Info", badge: "border-info/40 text-info" },
};

export function RecentAlerts({ alerts }: { alerts: DashboardAlert[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent alerts</CardTitle>
        <CardDescription>Latest threshold alerts from your devices.</CardDescription>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/alerts">View all</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8 text-center">
            <BellOff className="size-8 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">No alerts</p>
            <p className="text-sm text-muted-foreground">Alerts appear here when a device reading crosses a threshold.</p>
          </div>
        ) : (
          <ul className="divide-y">
            {alerts.map((alert) => {
              const style = severityStyles[alert.severity];
              return (
                <li key={alert.id} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", style.dot)} aria-hidden="true" />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium">{alert.title}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeTime(alert.lastTriggeredAt)}
                      </span>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{alert.reason}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className={style.badge}>
                        {style.label}
                      </Badge>
                      {alert.status !== "OPEN" ? (
                        <Badge variant="secondary">{alert.status === "ACKNOWLEDGED" ? "Acknowledged" : "Resolved"}</Badge>
                      ) : null}
                      <span>
                        {alert.deviceName} · {alert.farmName}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
