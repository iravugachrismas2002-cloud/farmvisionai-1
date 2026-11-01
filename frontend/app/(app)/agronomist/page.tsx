"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ClipboardList, FileText, Lightbulb, Plus, Tractor } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Farm = {
  id: string;
  name: string;
  locationLabel?: string;
  createdAt?: string;
};

type AdvisoryNote = {
  id: string;
  farmId: string;
  agronomistId: string;
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

type RecommendationReview = {
  id: string;
  recommendationId: string;
  agronomistId: string;
  farmerId: string;
  status: "PENDING" | "APPROVED" | "CHANGES_REQUESTED" | "NOT_RECOMMENDED" | "ACCEPTED_BY_FARMER" | "DECLINED_BY_FARMER";
  createdAt: string;
  updatedAt: string;
  message?: string;
};

type FarmAccessRequest = {
  id: string;
  farmId: string;
  agronomistId: string;
  farmerId: string;
  status: "PENDING" | "APPROVED" | "DECLINED" | "REVOKED";
  requestedAt: string;
  decidedAt?: string;
  message?: string;
};

type ActiveFarm = {
  id: string;
  name: string;
  publicId: string;
  locationLabel?: string;
  deviceCount: number;
  lastSeenAt?: string;
};

function statusVariant(
  status: string,
): "default" | "secondary" | "destructive" | "outline" {
  if (["APPROVED", "ACTIVE", "ACCEPTED_BY_FARMER"].includes(status)) {
    return "default";
  }
  if (status === "PENDING") {
    return "secondary";
  }
  if (
    [
      "DECLINED",
      "REVOKED",
      "CHANGES_REQUESTED",
      "NOT_RECOMMENDED",
      "DECLINED_BY_FARMER",
    ].includes(status)
  ) {
    return "destructive";
  }
  return "outline";
}

export default function AgronomistPage() {
  const [farms, setFarms] = useState<ActiveFarm[]>([]);
  const [accessRequests, setAccessRequests] = useState<FarmAccessRequest[]>([]);
  const [advisoryNotes, setAdvisoryNotes] = useState<AdvisoryNote[]>([]);
  const [recommendationReviews, setRecommendationReviews] = useState<RecommendationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const [farmsRes, accessRes, notesRes, reviewsRes] = await Promise.all([
          fetch("/api/farms", { credentials: "include" }),
          fetch("/api/access-requests", { credentials: "include" }),
          fetch("/api/advisory-notes", { credentials: "include" }),
          fetch("/api/recommendation-reviews", { credentials: "include" }),
        ]);

        if (!farmsRes.ok && cancelled === false) {
          if (farmsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load farms");
        }

        if (!accessRes.ok && cancelled === false) {
          if (accessRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load access requests");
        }

        if (!notesRes.ok && cancelled === false) {
          if (notesRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load advisory notes");
        }

        if (!reviewsRes.ok && cancelled === false) {
          if (reviewsRes.status === 401) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load recommendation reviews");
        }

        if (cancelled) return;

        const farmsData = await farmsRes.json();
        const accessData = await accessRes.json();
        const notesData = await notesRes.json();
        const reviewsData = await reviewsRes.json();

        if (cancelled) return;

        setFarms(farmsData.farms ?? []);
        setAccessRequests(accessData.requests ?? []);
        setAdvisoryNotes(notesData.notes ?? []);
        setRecommendationReviews(reviewsData.reviews ?? []);
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
          title="Agri-Vision Dashboard"
          description="Loading agronomist data..."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="space-y-3">
                <div className="h-3 w-1/2 rounded bg-secondary" />
                <div className="h-6 w-1/3 rounded bg-secondary" />
                <div className="h-3 w-2/3 rounded bg-secondary" />
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
        <PageHeader title="Agri-Vision Dashboard" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">
              Could not load agronomist data
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

  // Compute summary stats
  const pendingAccessRequests = accessRequests.filter(
    (a) => a.status === "PENDING",
  ).length;
  // Count all access requests (status comes from FarmAdvisorAccessStatus: PENDING | ACTIVE | DECLINED | REVOKED)
  const totalAccessRequests = accessRequests.length;
  const activeFarms = farms.filter((f) => f.deviceCount > 0);
  const totalAdvisoryNotes = advisoryNotes.length;
  const pendingReviews = recommendationReviews.filter(
    (r) => r.status === "PENDING",
  ).length;

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Agri-Vision Dashboard"
        description="Agronomist overview"
      />

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Managed Farms</p>
            <p className="text-2xl font-semibold">{activeFarms.length}</p>
            <p className="text-xs text-muted-foreground">
              farms with active devices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Access Requests</p>
            <p className="text-2xl font-semibold">{pendingAccessRequests}</p>
            <p className="text-xs text-muted-foreground">
              {pendingAccessRequests} pending{" "}
              {pendingAccessRequests !== 1 ? "requests" : "request"} ┬╖{" "}
              {totalAccessRequests} total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">Advisory Notes</p>
            <p className="text-2xl font-semibold">{totalAdvisoryNotes}</p>
            <p className="text-xs text-muted-foreground">notes published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-1">
            <p className="text-sm text-muted-foreground">
              Recommendation Reviews
            </p>
            <p className="text-2xl font-semibold">{pendingReviews}</p>
            <p className="text-xs text-muted-foreground">pending review</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Link
              href="/api/access-requests"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <ClipboardList className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Access Requests
              </span>
              <Badge>{pendingAccessRequests}</Badge>
            </Link>
            <Link
              href="/managed-farms"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Tractor className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">Managed Farms</span>
              <Badge>{activeFarms.length}</Badge>
            </Link>
            <Link
              href="/recommendation-reviews"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Lightbulb className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Recommendation Reviews
              </span>
              <Badge>{pendingReviews}</Badge>
            </Link>
            <Link
              href="/advisory-notes"
              className="flex items-center gap-3 rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <FileText className="size-4" aria-hidden="true" />
              </span>
              <span className="flex-1 text-sm font-medium">
                Advisory Notes
              </span>
              <Badge>{totalAdvisoryNotes}</Badge>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Access Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ClipboardList className="size-4" aria-hidden="true" />
            </span>
            Access Requests
          </CardTitle>
          <CardDescription>
            {pendingAccessRequests} pending of {totalAccessRequests} total
            requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accessRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No access requests at this time.
            </p>
          ) : (
            <div className="space-y-3">
              {accessRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="font-medium">Farm:</span>{" "}
                      {request.farmId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">From Farmer:</span>{" "}
                      {request.farmerId}
                    </p>
                    {request.message ? (
                      <p className="text-sm text-muted-foreground">
                        {request.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={statusVariant(request.status)}>
                      {request.status}
                    </Badge>
                    {request.status === "PENDING" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            (window.location.href = `/agronomist/approve-access/${request.id}`)
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            (window.location.href = `/agronomist/decline-access/${request.id}`)
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
        </CardContent>
      </Card>

      {/* Managed Farms Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Tractor className="size-4" aria-hidden="true" />
            </span>
            Managed Farms
          </CardTitle>
          <CardDescription>
            Farms you manage that have connected devices.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {farms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No farms under your management yet. Request access or wait for
              approvals.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {farms.map((farm) => (
                <div
                  key={farm.id}
                  className="rounded-lg border p-4 transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{farm.name}</p>
                    {farm.locationLabel ? (
                      <Badge variant="outline">{farm.locationLabel}</Badge>
                    ) : null}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <p>
                      {farm.deviceCount} device
                      {farm.deviceCount !== 1 ? "s" : ""} connected
                    </p>
                    {farm.lastSeenAt ? (
                      <p>Last seen: {new Date(farm.lastSeenAt).toLocaleString()}</p>
                    ) : null}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href={`/agronomist/farm/${farm.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advisory Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <FileText className="size-4" aria-hidden="true" />
            </span>
            Advisory Notes
          </CardTitle>
          <CardDescription>
            {totalAdvisoryNotes} notes for your managed farms.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {advisoryNotes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No advisory notes yet. Create your first note for a managed farm.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {advisoryNotes.map((note) => (
                <div key={note.id} className="rounded-lg border p-4">
                  <p className="font-medium">{note.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Farm: {note.farmId}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {note.body}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Created: {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
          <Button asChild>
            <Link href="/agronomist/create-note">
              <Plus /> Create New Note
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recommendation Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Lightbulb className="size-4" aria-hidden="true" />
            </span>
            Recommendation Reviews
          </CardTitle>
          <CardDescription>{pendingReviews} pending review</CardDescription>
        </CardHeader>
        <CardContent>
          {recommendationReviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No recommendation reviews at this time.
            </p>
          ) : (
            <div className="space-y-3">
              {recommendationReviews.map((review) => (
                <div key={review.id} className="rounded-lg border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm">
                      <span className="font-medium">Recommendation:</span>{" "}
                      {review.recommendationId}
                    </p>
                    <Badge variant={statusVariant(review.status)}>
                      {review.status}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {review.message || "No message submitted."}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Created: {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                  {review.status === "PENDING" ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          (window.location.href = `/agronomist/approve-review/${review.id}`)
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/agronomist/request-changes/${review.id}`)
                        }
                      >
                        Request Changes
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          (window.location.href = `/agronomist/decline-review/${review.id}`)
                        }
                      >
                        Decline
                      </Button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
