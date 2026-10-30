import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BellRing, Cpu, Plus, Radio, Tractor } from "lucide-react";
import { getCurrentUser } from "../../../../backend/src/server/auth/current-user";
import { AlertsChart } from "@/components/dashboard/alerts-chart";
import { DevicesOverview } from "@/components/dashboard/devices-overview";
import { RecentAlerts } from "@/components/dashboard/recent-alerts";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardData } from "@/lib/dashboard-data";

export const metadata: Metadata = { title: "Dashboard" };

function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const data = await getDashboardData(user.id);
  const firstName = (user.name ?? user.email ?? "").split(/[\s@]/)[0];
  const activeAlerts = data.alertsBySeverity.reduce((total, point) => total + point.count, 0);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {greeting()}
            {firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">Here is what is happening across your farms.</p>
        </div>
        <Button asChild>
          <Link href="/farms">
            <Plus /> New farm
          </Link>
        </Button>
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Farms" value={data.farmCount} hint="Registered to your account" icon={Tractor} />
        <StatCard
          label="Devices"
          value={data.deviceCount}
          hint={data.deviceCount === 0 ? "None registered yet" : `${data.onlineDeviceCount} reporting in the last 15 min`}
          icon={Cpu}
        />
        <StatCard
          label="Online now"
          value={data.deviceCount === 0 ? "—" : `${data.onlineDeviceCount}/${data.deviceCount}`}
          hint="Devices with a recent reading"
          icon={Radio}
          tone={data.deviceCount > 0 && data.onlineDeviceCount === 0 ? "warning" : "success"}
        />
        <StatCard
          label="Open alerts"
          value={data.openAlertCount}
          hint={data.criticalAlertCount > 0 ? `${data.criticalAlertCount} critical` : "No critical alerts"}
          icon={BellRing}
          tone={data.criticalAlertCount > 0 ? "danger" : data.openAlertCount > 0 ? "warning" : "default"}
        />
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <DevicesOverview devices={data.devices} />
        </div>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>Alerts by severity</CardTitle>
            <CardDescription>Open and acknowledged alerts.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeAlerts === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">No active alerts to chart.</p>
            ) : (
              <AlertsChart data={data.alertsBySeverity} />
            )}
          </CardContent>
        </Card>
      </div>

      <RecentAlerts alerts={data.recentAlerts} />
    </div>
  );
}
