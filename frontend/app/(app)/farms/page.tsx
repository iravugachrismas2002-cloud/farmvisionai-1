"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MapPin, Plus, Tractor } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type Farm = {
  id: string;
  name: string;
  locationLabel?: string;
  createdAt?: string;
};

export default function FarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchFarms() {
      try {
        const res = await fetch("/api/farms", {
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            window.location.href = "/login";
            return;
          }
          throw new Error("Failed to load farms");
        }

        if (cancelled) return;

        const data = await res.json();
        setFarms(data.farms ?? []);
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message);
        setLoading(false);
      }
    }

    fetchFarms();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6">
        <PageHeader title="My Farms" description="Loading farms..." />
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
        <PageHeader title="My Farms" />
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Could not load farms</CardTitle>
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
        title="My Farms"
        description="Manage your farms and associated devices."
        actions={
          <Button asChild>
            <Link href="/api/farms/create">
              <Plus /> New farm
            </Link>
          </Button>
        }
      />

      {farms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Tractor className="size-6" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="font-medium">No farms registered yet.</p>
              <p className="text-sm text-muted-foreground">
                Create your first farm to start tracking devices.
              </p>
            </div>
            <Button asChild>
              <Link href="/api/farms/create">
                <Plus /> Create first farm
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {farms.map((farm) => (
            <Card key={farm.id} className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                    <Tractor className="size-4" aria-hidden="true" />
                  </span>
                  {farm.name}
                </CardTitle>
                {farm.locationLabel ? (
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden="true" />
                    {farm.locationLabel}
                  </CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-4">
                <p className="text-xs text-muted-foreground">
                  Created{" "}
                  {new Date(farm.createdAt ?? Date.now()).toLocaleDateString()}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/devices?farmId=${farm.id}`}>View devices</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
