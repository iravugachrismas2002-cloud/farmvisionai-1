import { listAlertsForOwner } from "../../../backend/src/modules/alerts/service";
import { listDevicesForOwner } from "../../../backend/src/modules/devices/service";
import { listFarmsForOwner } from "../../../backend/src/modules/farms/service";

/** A device counts as online if it reported within this window. */
export const DEVICE_ONLINE_WINDOW_MS = 15 * 60 * 1000;

async function safely<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch (error) {
    console.error("[dashboard] data load failed:", error);
    return fallback;
  }
}

export type DashboardAlert = {
  id: string;
  title: string;
  reason: string;
  severity: "INFO" | "WARNING" | "CRITICAL";
  status: "OPEN" | "ACKNOWLEDGED" | "RESOLVED";
  lastTriggeredAt: Date;
  deviceName: string;
  farmName: string;
};

export type DashboardDevice = {
  id: string;
  name: string;
  farmName: string;
  isEnabled: boolean;
  isOnline: boolean;
  lastSeenAt: Date | null;
  temperatureC: number | null;
  humidityPercent: number | null;
  waterLevelPercent: number | null;
  feedLevelPercent: number | null;
};

export type DashboardData = {
  farmCount: number;
  deviceCount: number;
  onlineDeviceCount: number;
  openAlertCount: number;
  criticalAlertCount: number;
  alertsBySeverity: { severity: "CRITICAL" | "WARNING" | "INFO"; count: number }[];
  recentAlerts: DashboardAlert[];
  devices: DashboardDevice[];
};

export async function getDashboardData(ownerId: string): Promise<DashboardData> {
  const [farms, devices, alerts] = await Promise.all([
    safely(() => listFarmsForOwner(ownerId), []),
    safely(() => listDevicesForOwner(ownerId), []),
    safely(() => listAlertsForOwner(ownerId, undefined, 50), []),
  ]);

  const now = Date.now();
  const deviceRows: DashboardDevice[] = devices.map((device) => ({
    id: device.id,
    name: device.name,
    farmName: device.farm.name,
    isEnabled: device.isEnabled,
    isOnline:
      device.isEnabled &&
      device.lastSeenAt !== null &&
      now - device.lastSeenAt.getTime() <= DEVICE_ONLINE_WINDOW_MS,
    lastSeenAt: device.lastSeenAt,
    temperatureC: device.latestState?.temperatureC ?? null,
    humidityPercent: device.latestState?.humidityPercent ?? null,
    waterLevelPercent: device.latestState?.waterLevelPercent ?? null,
    feedLevelPercent: device.latestState?.feedLevelPercent ?? null,
  }));

  const active = alerts.filter((alert) => alert.status !== "RESOLVED");
  const severityCount = (severity: "CRITICAL" | "WARNING" | "INFO") =>
    active.filter((alert) => alert.severity === severity).length;

  return {
    farmCount: farms.length,
    deviceCount: deviceRows.length,
    onlineDeviceCount: deviceRows.filter((device) => device.isOnline).length,
    openAlertCount: alerts.filter((alert) => alert.status === "OPEN").length,
    criticalAlertCount: active.filter((alert) => alert.severity === "CRITICAL").length,
    alertsBySeverity: [
      { severity: "CRITICAL", count: severityCount("CRITICAL") },
      { severity: "WARNING", count: severityCount("WARNING") },
      { severity: "INFO", count: severityCount("INFO") },
    ],
    recentAlerts: alerts.slice(0, 5).map((alert) => ({
      id: alert.id,
      title: alert.title,
      reason: alert.reason,
      severity: alert.severity,
      status: alert.status,
      lastTriggeredAt: alert.lastTriggeredAt,
      deviceName: alert.device.name,
      farmName: alert.device.farm.name,
    })),
    devices: deviceRows.slice(0, 6),
  };
}
