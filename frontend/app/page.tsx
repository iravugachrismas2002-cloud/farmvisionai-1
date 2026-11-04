import Link from "next/link";
import { ArrowRight, Droplets, Eye, Lightbulb, ScanSearch, Wheat } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AskFarmVisionAI from "@/components/dashboard/ask-farmvisionai";

const capabilities = [
  {
    icon: Eye,
    title: "Observe",
    description: "Bring farm and sensor observations into one clear view.",
  },
  {
    icon: ScanSearch,
    title: "Understand",
    description: "Review transparent alerts with the measurements behind them.",
  },
  {
    icon: Lightbulb,
    title: "Decide",
    description: "Use practical, human-reviewed prompts to guide next steps.",
  },
];

const snapshot = [
  { icon: Wheat, label: "Feed level", hint: "Review latest reading" },
  { icon: Droplets, label: "Water supply", hint: "Check source device" },
];

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(60rem_30rem_at_20%_-10%,hsl(var(--primary)/0.22),transparent_60%),radial-gradient(40rem_25rem_at_90%_10%,hsl(var(--info)/0.14),transparent_60%)]"
      />

      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-md">
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
          aria-label="Main navigation"
        >
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-5 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:pt-24">
          <div className="space-y-7">
            <Badge variant="outline" className="gap-2 border-primary/40 px-3 py-1 text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              Agricultural intelligence
            </Badge>
            <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Better farm decisions start with{" "}
              <span className="text-primary">clearer signals.</span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              FarmVision brings farm records and sensor observations together, helping farmers understand what
              is happening and decide what to check next.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="h-11 px-6">
                <Link href="/register">
                  Get started <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 px-6">
                <Link href="/login">I already have an account</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Designed for farmers · Transparent prototype insights · Human-led decisions
            </p>
          </div>

          <Card
            className="relative gap-5 border-border/80 bg-card/80 shadow-2xl shadow-primary/5 backdrop-blur"
            aria-label="Illustration of connected farm observations"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
                  </span>
                  Farm snapshot
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] tracking-widest">
                  DEMO VIEW
                </Badge>
              </div>
              <CardDescription>Signals inform decisions.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {snapshot.map(({ icon: Icon, label, hint }) => (
                <div key={label} className="space-y-3 rounded-lg border bg-background/60 p-4">
                  <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="font-medium">Observation</p>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="border-t border-border/60 bg-card/40">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
            <div className="mb-10 max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                A practical starting point
              </p>
              <h2 className="text-3xl font-semibold tracking-tight">From observation to informed action</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }, index) => (
                <Card key={title} className="transition-colors hover:border-primary/50">
                  <CardHeader>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-muted-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
            <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
              FarmVision is under active development. Sensor thresholds and recommendations are prototypes,
              not validated agronomic or veterinary guidance; no device actions are executed automatically.
            </p>
          </div>
        </section>
      </main>

      <AskFarmVisionAI />

        <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <BrandLogo />
          <span>Agricultural intelligence, built around the farmer.</span>
        </div>
      </footer>
    </div>
  );
}
