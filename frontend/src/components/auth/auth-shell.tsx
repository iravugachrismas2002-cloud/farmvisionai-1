import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Activity, ShieldCheck, Sprout } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const highlights = [
  {
    icon: Sprout,
    title: "One view of your farm",
    text: "Farm records and sensor observations, together.",
  },
  {
    icon: Activity,
    title: "Transparent alerts",
    text: "See the measurements behind every alert.",
  },
  {
    icon: ShieldCheck,
    title: "Human-led decisions",
    text: "Prompts guide you. Nothing runs automatically.",
  },
];

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
  backLabel?: string;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
  backHref = "/",
  backLabel = "Back to FarmVision",
}: AuthShellProps) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60rem_40rem_at_-10%_-10%,hsl(var(--primary)/0.22),transparent_60%),radial-gradient(40rem_30rem_at_110%_110%,hsl(var(--info)/0.14),transparent_60%)]"
        />
        <BrandLogo className="relative" />

        <div className="relative max-w-md space-y-8">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-balance">
              Better farm decisions start with{" "}
              <span className="text-primary">clearer signals.</span>
            </h2>
            <p className="text-muted-foreground">
              FarmVision helps farmers understand what is happening and decide what to check next.
            </p>
          </div>
          <ul className="space-y-5">
            {highlights.map(({ icon: Icon, title: itemTitle, text }) => (
              <li key={itemTitle} className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-primary">
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-medium">{itemTitle}</span>
                  <span className="block text-sm text-muted-foreground">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative max-w-md text-xs text-muted-foreground">
          FarmVision is under active development. Recommendations are prototypes, not validated agronomic or
          veterinary guidance.
        </p>
      </aside>

      <section className="flex flex-col px-5 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <BrandLogo className="lg:invisible" />
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            {backLabel}
          </Link>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {children}
          {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </section>
    </main>
  );
}
