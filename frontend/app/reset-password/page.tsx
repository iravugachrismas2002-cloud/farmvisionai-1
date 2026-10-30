import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { ResetPasswordForm } from "@/components/auth/password-forms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Reset password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Create a new password"
      description={token ? "Choose a new password. It must be at least 12 characters." : undefined}
      backHref="/login"
      backLabel="Back to sign in"
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-5">
          <Alert variant="destructive">
            <AlertCircle aria-hidden="true" />
            <AlertTitle>No reset token provided</AlertTitle>
            <AlertDescription>Please request a password reset first.</AlertDescription>
          </Alert>
          <Button asChild size="lg" className="w-full">
            <Link href="/forgot-password">Request password reset</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
