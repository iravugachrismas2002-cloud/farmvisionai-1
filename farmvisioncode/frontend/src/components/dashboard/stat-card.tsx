import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "danger";
};

const toneClasses: Record<NonNullable<StatCardProps["tone"]>, string> = {
  default: "bg-secondary text-foreground",
  success: "bg-primary/15 text-primary",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "default" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-3xl font-semibold tabular-nums tracking-tight">{value}</p>
          {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", toneClasses[tone])}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  );
}
