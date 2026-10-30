import Link from "next/link";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("inline-flex items-center gap-2.5 font-semibold tracking-tight text-foreground", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <Sprout className="size-5" aria-hidden="true" />
      </span>
      <span className="text-lg">
        FarmVision<span className="text-primary"> AI</span>
      </span>
    </Link>
  );
}
