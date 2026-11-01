"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/app/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActuatorCard } from "@/components/ui/actuator-card";
import { ActuatorConfirmDialog } from "@/components/ui/actuator-confirm-dialog";
import { Esp32StatusCard } from "@/components/ui/esp32-status-card";
import { SafetyInterlockAlert } from "@/components/ui/safety-interlock-alert";
import { AuditTrailList } from "@/components/ui/audit-trail-list";
import { CommandProgressIndicator } from "@/components/ui/command-progress-indicator";
import { ActuatorStateBadge } from "@/components/ui/actuator-state-badge";

type Actuator = {
  id: string;
  name: string;
  type: "PUMP" | "FAN" | "LIGHT" | "VALVE" | "MOTOR" | "HEATER";
  controllerId: string;
  state: "OFF" | "PENDING" | "RUNNING" | "STOPPING" | "ERROR" | "OFFLINE";
  runtimeMinutes?: number;
  progressPercent?: number;
  lastCommand?: string;
  lastCommandAgo?: string;
  interlockReason?: string;
};

type Esp32Controller = {
  deviceId: string;
  name: string;
  location: string;
  firmware: string;
  signalPercent: number;
  lastHeartbeatAgoSeconds: number;
  powerSource: string;
};

type AuditEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  actuator?: string;
  controller?: string;
  confirmed?: boolean;
  confirmedAt?: string;
};

const MOCK_CONTROLLER: Esp32Controller = {
  deviceId: "ESP32-FARM-001",
  name: "Main Controller",
  location: "Greenhouse A",
  firmware: "v1.0.0",
  signalPercent: 92,
  lastHeartbeatAgoSeconds: 2,
  powerSource: "External Power",
};

const MOCK_ACTUATORS: Actuator[] = [
  {
    id: "pump-001",
    name: "Water Pump",
    type: "PUMP",
    controllerId: "ESP32-FARM-001",
    state: "RUNNING",
    runtimeMinutes: 12,
    lastCommand: "START",
    lastCommandAgo: "12 min ago",
  },
  {
    id: "fan-001",
    name: "Ventilation Fan",
    type: "FAN",
    controllerId: "ESP32-FARM-001",
    state: "OFF",
    lastCommand: "STOP",
    lastCommandAgo: "4 h ago",
  },
  {
    id: "light-001",
    name: "Lighting System",
    type: "LIGHT",
    controllerId: "ESP32-FARM-001",
    state: "RUNNING",
    lastCommand: "START",
    lastCommandAgo: "2 h ago",
  },
  {
    id: "valve-001",
    name: "Water Valve",
    type: "VALVE",
    controllerId: "ESP32-FARM-001",
    state: "PENDING",
    progressPercent: 72,
    lastCommand: "OPEN",
    lastCommandAgo: "30 sec ago",
    interlockReason: "Water tank below minimum threshold (12%)",
  },
];

const MOCK_AUDIT: AuditEntry[] = [
  {
    id: "audit-001",
    timestamp: "10:05:11",
    user: "Christmas",
    action: "Started Water Pump",
    actuator: "pump-001",
    controller: "ESP32-FARM-001",
    confirmed: true,
    confirmedAt: "10:05:13",
  },
  {
    id: "audit-002",
    timestamp: "10:07:44",
    user: "ESP32-FARM-001",
    action: "Command Confirmed",
    actuator: "pump-001",
    controller: "ESP32-FARM-001",
    confirmed: true,
    confirmedAt: "10:07:44",
  },
  {
    id: "audit-003",
    timestamp: "10:18:12",
    user: "Christmas",
    action: "Stopped Water Pump",
    actuator: "pump-001",
    controller: "ESP32-FARM-001",
    confirmed: true,
    confirmedAt: "10:18:14",
  },
  {
    id: "audit-004",
    timestamp: "10:18:14",
    user: "ESP32-FARM-001",
    action: "Command Confirmed",
    actuator: "pump-001",
    controller: "ESP32-FARM-001",
    confirmed: true,
    confirmedAt: "10:18:14",
  },
];

export default function ActuatorsPage() {
  const [actuators, setActuators] = useState<Actuator[]>(MOCK_ACTUATORS);
  const [controllerStatus, setControllerStatus] = useState<"ONLINE" | "UNSTABLE" | "OFFLINE" | "UNKNOWN">("ONLINE");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmActuator, setConfirmActuator] = useState<Actuator | null>(null);
  const [commandStage, setCommandStage] = useState<"idle" | "sent" | "acknowledged" | "executing" | "confirmed" | "error" | "timeout">("idle");
  const [commandMessage, setCommandMessage] = useState("");

  const handleToggleActuator = useCallback((actuator: Actuator, desiredState: "RUNNING" | "OFF") => {
    const isStarting = desiredState === "RUNNING";
    setConfirmActuator(actuator);
    setConfirmOpen(true);
    setCommandStage("sent");
    setCommandMessage(
      isStarting
        ? `Command sent to ${actuator.controllerId}. Waiting for ESP32 acknowledgment...`
        : `Stop command sent to ${actuator.controllerId}. Waiting for ESP32 acknowledgment...`
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (!confirmActuator) return;
    setCommandStage("acknowledged");
    setCommandMessage("ESP32 acknowledged command. Executing on controller...");
    setTimeout(() => {
      setCommandStage("executing");
      setCommandMessage("Actuator executing command on ESP32 controller...");
      setTimeout(() => {
        setCommandStage("confirmed");
        setCommandMessage("ESP32 confirmed execution. Dashboard updated.");
        setActuators((prev) =>
          prev.map((a) =>
            a.id === confirmActuator!.id
              ? {
                  ...a,
                  state: confirmActuator!.state === "OFF" ? "RUNNING" : "OFF",
                  lastCommand: confirmActuator!.state === "OFF" ? "START" : "STOP",
                  lastCommandAgo: "Just now",
                }
              : a
          )
        );
        setConfirmActuator(null);
        setConfirmOpen(false);
      }, 1500);
    }, 1000);
  }, [confirmActuator]);

  const handleCancel = useCallback(() => {
    setConfirmOpen(false);
    setConfirmActuator(null);
    setCommandStage("idle");
    setCommandMessage("");
  }, []);

  const safetyRules = [
    {
      rule: "Controller Online",
      satisfied: controllerStatus === "ONLINE",
      reason: controllerStatus !== "ONLINE" ? "ESP32 controller is not reachable" : undefined,
    },
    {
      rule: "No Active Fault",
      satisfied: true,
    },
  ];

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Actuators"
        description="Hardware control and safety interlocks"
      />
      <Breadcrumbs items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Actuators", href: "/actuators" }]} />

      {/* Controller Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>ESP32 Controller</CardTitle>
          <CardDescription>Main farm controller status and heartbeat</CardDescription>
        </CardHeader>
        <Esp32StatusCard
          deviceId={MOCK_CONTROLLER.deviceId}
          name={MOCK_CONTROLLER.name}
          location={MOCK_CONTROLLER.location}
          firmware={MOCK_CONTROLLER.firmware}
          signalPercent={MOCK_CONTROLLER.signalPercent}
          lastHeartbeatAgoSeconds={MOCK_CONTROLLER.lastHeartbeatAgoSeconds}
          powerSource={MOCK_CONTROLLER.powerSource}
          onHeartbeatUpdate={setControllerStatus}
        />
      </Card>

      {/* Safety Interlocks */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Interlocks</CardTitle>
          <CardDescription>Preconditions that must be met before actuator commands are accepted</CardDescription>
        </CardHeader>
        <SafetyInterlockAlert
          actuatorName="Selected Actuator"
          canStart={controllerStatus === "ONLINE"}
          blockingReason={controllerStatus !== "ONLINE" ? "Controller is not online" : undefined}
          rules={safetyRules}
        />
      </Card>

      {/* Command Progress */}
      {commandStage !== "idle" && (
        <Card>
          <CardHeader>
            <CardTitle>Command Progress</CardTitle>
            <CardDescription>Real-time command execution status</CardDescription>
          </CardHeader>
          <CommandProgressIndicator
            stage={commandStage}
            message={commandMessage}
            actuatorName={confirmActuator?.name}
          />
        </Card>
      )}

      {/* Actuator Grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {actuators.map((actuator) => (
          <ActuatorCard
            key={actuator.id}
            id={actuator.id}
            name={actuator.name}
            type={actuator.type}
            controllerId={actuator.controllerId}
            state={actuator.state}
            runtimeMinutes={actuator.runtimeMinutes}
            progressPercent={actuator.progressPercent}
            lastCommand={actuator.lastCommand}
            lastCommandAgo={actuator.lastCommandAgo}
            interlockReason={actuator.interlockReason}
            onToggle={(desiredState) => handleToggleActuator(actuator, desiredState)}
            onConfirm={handleConfirm}
          />
        ))}
      </div>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Every actuator action is logged and verified</CardDescription>
        </CardHeader>
        <AuditTrailList entries={MOCK_AUDIT} />
      </Card>

      {/* Confirmation Dialog */}
      <ActuatorConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        actuatorName={confirmActuator?.name ?? ""}
        deviceId={confirmActuator?.controllerId ?? ""}
        actuatorType={confirmActuator?.type ?? ""}
        currentState={confirmActuator?.state === "RUNNING" ? "RUNNING" : "OFF"}
        desiredState={confirmActuator ? (confirmActuator.state === "OFF" ? "RUNNING" : "OFF") : "RUNNING"}
        expectedAction={confirmActuator?.state === "OFF" ? "Start Irrigation" : "Stop Irrigation"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
