"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Lightbulb, Plus } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RecommendationItem = {
  id: string;
  type: "FEED_CHECK" | "WATER_CHECK" | "HEAT_RESPONSE";
  severity: "INFO" | "WARNING" | "CRITICAL";
  status: "PENDING" | "ACKNOWLEDGED" | "RESOLVED" | "REVIEW_REQUIRED";
  explanation: string;
  suggestedAction: string;
  observedValue?: number;
  thresholdValue?: number;
  unit?: string;
  device: {
    id: string;
    publicId: string;
    name: string;
    source: "HARDWARE" | "SIMULATOR";
    farm: { id: string; name: string };
  };
  ruleVersion?: string;
  createdAt?: string;
  acknowledgedAt?: string | null;
  resolvedAt?: string | null;
};

const severityVariant = (severity: RecommendationItem["severity"]) =>
  severity === "CRITICAL"
    ? "destructive"
    : severity === "WARNING"
      ? "secondary"
      : "outline";

const statusVariant = (status: RecommendationItem["status"]) =>
  status === "ACKNOWLEDGED"
    ? "default"
    : status === "RESOLVED"
      ? "outline"
      : "secondary";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch("/api/recommendations", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to load recommendations");
        const data = await res.json();
        setRecommendations(data.recommendations ?? []);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="Recommendations" description="Loading recommendations..." />
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
        <PageHeader title="Recommendations" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">
              Could not load recommendations
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

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
      <PageHeader
        title="Recommendations"
        description="AI-generated recommendations based on sensor data"
        actions={
          <Button asChild>
            <Link href="/api/recommendations/generate">
              <Lightbulb /> Generate recommendations
            </Link>
          </Button>
        }
      />

      {recommendations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Lightbulb className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No recommendations at this time.</p>
              <p className="text-sm text-muted-foreground">
                Recommendations appear when sensor data crosses prototype thresholds.
              </p>
            </div>
            <Button asChild>
              <Link href="/api/recommendations/generate">
                <Plus /> Generate recommendations
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((rec) => (
            <Card key={rec.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Lightbulb className="size-4" aria-hidden="true" />
                  </span>
                  <span className="capitalize">{rec.type.replace("_", " ")}</span>
                </CardTitle>
                <CardDescription>{rec.explanation}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={severityVariant(rec.severity)}>
                    {rec.severity}
                  </Badge>
                  <Badge variant={statusVariant(rec.status)}>
                    <span className="capitalize">{rec.status.replace("_", " ")}</span>
                  </Badge>
                </div>
                {rec.suggestedAction ? (
                  <p className="text-sm">
                    <span className="font-medium">Action:</span>{" "}
                    {rec.suggestedAction}
                  </p>
                ) : null}
                {rec.observedValue !== undefined &&
                rec.thresholdValue !== undefined ? (
                  <p className="text-xs text-muted-foreground">
                    Observed: {rec.observedValue}
                    {rec.unit ?? ""} ┬╖ Threshold: {rec.thresholdValue}
                    {rec.unit ?? ""}
                  </p>
                ) : null}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    {rec.device.name} ┬╖ {rec.device.farm.name}
                  </p>
                  {rec.acknowledgedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Acknowledged:{" "}
                      {new Date(rec.acknowledgedAt).toLocaleDateString()}
                    </p>
                  ) : null}
                  {rec.resolvedAt ? (
                    <p className="text-xs text-muted-foreground">
                      Resolved:{" "}
                      {new Date(rec.resolvedAt ?? Date.now()).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
