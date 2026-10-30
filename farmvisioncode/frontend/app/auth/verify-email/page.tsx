import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/auth/auth-shell";
import { EmailVerification } from "@/components/auth/auth-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const metadata: Metadata = { title: "Verify email" };

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string | string[] }>;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <AuthShell
      eyebrow="Email verification"
      title="Confirm your email"
      backHref="/login"
      backLabel="Return to sign in"
    >
      {token ? (
        <EmailVerification token={token} />
      ) : (
        <Alert variant="destructive">
          <AlertCircle aria-hidden="true" />
          <AlertTitle>Link is incomplete</AlertTitle>
          <AlertDescription>
            This verification link is missing its token. Open the complete link from your email.
          </AlertDescription>
        </Alert>
      )}
    </AuthShell>
  );
}
