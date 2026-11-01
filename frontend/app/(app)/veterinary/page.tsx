"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarDays, ClipboardList, FileCheck, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type VetProfile = {
  id: string;
  name: string;
  specialization:
    | "SMALL_ANIMAL"
    | "LARGE_ANIMAL"
    | "POULTRY"
    | "SWINE"
    | "EQINE"
    | "PUBLIC_HEALTH";
  yearsExperience: number;
  farmId?: string;
  isAvailable: boolean;
  rating: number;
  totalConsultations: number;
  createdAt: string;
  updatedAt: string;
};

type Appointment = {
  id: string;
  vetId: string;
  farmerId: string;
  farmId: string;
  title: string;
  description: string;
  scheduledAt: string;
  durationMinutes: number;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  reason: string;
  createdAt: string;
  updatedAt: string;
};

type MedicalRecord = {
  id: string;
  appointmentId: string;
  vetId: string;
  farmerId: string;
  farmId: string;
  title: string;
  description: string;
  observations: string;
  diagnosedConditions: string[];
  recommendedActions: string[];
  createdAt: string;
  updatedAt: string;
};

type ConsentRecord = {
  id: string;
  farmerId: string;
  vetId: string;
  scope:
    | "MEDICAL_RECORDS"
    | "DATA_SHARING"
    | "CONSULTATION_NOTES"
    | "TELEMEDICINE";
  status: "PENDING" | "GRANTED" | "WITHDRAWN";
  grantedAt?: string;
  revokedAt?: string;
  createdAt: string;
};

type AvailableTimeSlot = {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
};

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (["GRANTED", "CONFIRMED", "COMPLETED"].includes(status)) {
    return "default";
  }
  if (["PENDING", "IN_PROGRESS"].includes(status)) {
    return "secondary";
  }
  if (["WITHDRAWN", "CANCELLED"].includes(status)) {
    return "destructive";
  }
  return "outline";
}

export default function VeterinaryPage() {
  const [vetProfiles, setVetProfiles] = useState<VetProfile[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [consentRecords, setConsentRecords] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Appointment["status"] | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [vetsRes, appointmentsRes, recordsRes, consentRes] = await Promise.all([
          fetch("/api/vets", { credentials: "include" }),
          fetch("/api/appointments", { credentials: "include" }),
          fetch("/api/medical-records", { credentials: "include" }),
          fetch("/api/consents", { credentials: "include" }),
        ]);

        if (!vetsRes.ok && cancelled === false) {
          if (vetsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load veterinarians");
        }

        if (!appointmentsRes.ok && cancelled === false) {
          if (appointmentsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load appointments");
        }

        if (!recordsRes.ok && cancelled === false) {
          if (recordsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load medical records");
        }

        if (!consentRes.ok && cancelled === false) {
          if (consentRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load consent records");
        }

        if (cancelled) return;

        const vetsData = await vetsRes.json();
        const appointmentsData = await appointmentsRes.json();
        const recordsData = await recordsRes.json();
        const consentData = await consentRes.json();

        if (cancelled) return;

        setVetProfiles(vetsData.vets ?? []);
        setAppointments(appointmentsData.appointments ?? []);
        setMedicalRecords(recordsData.records ?? []);
        setConsentRecords(consentData.consents ?? []);
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
        <PageHeader
          title="Veterinary Platform"
          description="Loading veterinary data..."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="space-y-3">
                <div className="h-6 w-1/3 rounded bg-secondary" />
                <div className="h-3 w-1/2 rounded bg-secondary" />
              </CardContent>
            </Card>
          ))}
        </div>
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
        <PageHeader title="Veterinary Platform" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">
              Could not load veterinary data
            </CardTitle>
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

  // Filter appointments
  const filteredAppointments = appointments.filter(
    (a) => !filterStatus || a.status === filterStatus,
  );

  // Compute stats
  const totalVets = vetProfiles.length;
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "COMPLETED",
  ).length;
  const pendingConsents = consentRecords.filter(
    (c) => c.status === "PENDING",
  ).length;

  // Available vets (available = true)
  const availableVets = vetProfiles.filter((v) => v.isAvailable);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Veterinary Platform"
        description="Animal Health & Consultations"
      />

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{totalVets}</p>
            <p className="text-sm text-muted-foreground">Veterinarians</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{totalAppointments}</p>
            <p className="text-sm text-muted-foreground">Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{completedAppointments}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{availableVets.length}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-2xl font-semibold">{pendingConsents}</p>
            <p className="text-sm text-muted-foreground">Consent pending</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/vets"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Stethoscope className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Veterinarians
              </span>
            </Link>
            <Link
              href="/appointments"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <CalendarDays className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">Appointments</span>
            </Link>
            <Link
              href="/medical-records"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ClipboardList className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Medical Records
              </span>
            </Link>
            <Link
              href="/consents"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <FileCheck className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Consent Management
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Veterinarians Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Stethoscope className="size-4" aria-hidden="true" />
            </span>
            Veterinarians
          </CardTitle>
          <CardDescription>
            {totalVets} registered veterinarians
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalVets === 0 ? (
            <p className="text-sm text-muted-foreground">
              No veterinarians registered yet. Add vet profiles to get started.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {vetProfiles.map((vet) => (
                <div
                  key={vet.id}
                  className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{vet.name}</p>
                    <Badge variant="outline">{vet.specialization}</Badge>
                  </div>
                  <Badge
                    variant={vet.isAvailable ? "default" : "secondary"}
                    className="mt-2"
                  >
                    {vet.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                  {!vet.isAvailable ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Not currently accepting appointments
                    </p>
                  ) : null}
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href={`/vet/${vet.id}`}>View Profile</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appointments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarDays className="size-4" aria-hidden="true" />
            </span>
            Appointments
          </CardTitle>
          <CardDescription>
            {totalAppointments} appointments scheduled
          </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No appointments scheduled. Request a consultation with a
              veterinarian.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">{appointment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Dr.
                      {vetProfiles.find((v) => v.id === appointment.vetId)
                        ?.name || "Unknown"}
                      {" ┬╖ "}
                      Farm: {appointment.farmId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.reason}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    {appointment.status === "PENDING" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/appointment/confirm/${appointment.id}`)
                        }
                      >
                        Confirm
                      </Button>
                    ) : null}
                    {appointment.status === "CONFIRMED" ? (
                      <Button
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/appointment/in-progress/${appointment.id}`)
                        }
                      >
                        In Progress
                      </Button>
                    ) : null}
                    {appointment.status === "COMPLETED" ? (
                      <Button size="sm" variant="outline" disabled>
                        Completed
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Medical Records Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ClipboardList className="size-4" aria-hidden="true" />
            </span>
            Medical Records
          </CardTitle>
          <CardDescription>
            {medicalRecords.length} records from consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {medicalRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No medical records yet. Consultations will generate records.
            </p>
          ) : (
            <div className="space-y-3">
              {medicalRecords.map((record) => (
                <div key={record.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{record.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Appointment: {record.appointmentId}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {record.description}
                  </p>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Observations:</span>{" "}
                    <span className="text-muted-foreground">
                      {record.observations}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-medium">
                      Diagnosed conditions:
                    </span>
                    {record.diagnosedConditions.map((cond, i) => (
                      <Badge key={i} variant="outline">
                        {cond}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-sm font-medium">
                      Recommended actions:
                    </span>
                    {record.recommendedActions.map((action, i) => (
                      <Badge key={i} variant="outline">
                        {action}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Created: {new Date(record.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Consent Management Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileCheck className="size-4" aria-hidden="true" />
            </span>
            Consent Management
          </CardTitle>
          <CardDescription>
            {pendingConsents} pending consent requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {consentRecords.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No consent records yet. Request consent to access medical records
              and share data.
            </p>
          ) : (
            <div className="space-y-3">
              {consentRecords.map((consent) => (
                <div
                  key={consent.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
                >
                  <div className="min-w-0 space-y-1">
                    <p className="font-medium">{consent.scope}</p>
                    <p className="text-sm text-muted-foreground">
                      {consent.scope} access{" "}
                      {"granted" in consent ? "granted" : "pending"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {new Date(consent.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(consent.status)}>
                      {consent.status}
                    </Badge>
                    {consent.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/consent/grant/${consent.id}`)
                          }
                        >
                          Grant
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `/consent/decline/${consent.id}`)
                          }
                        >
                          Decline
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
          <Button asChild>
            <Link href="/consent/request">Request Consent</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
