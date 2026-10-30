"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { FormMessage } from "@/components/auth/form-message";

type AuthMode = "login" | "register";

type AuthResponse = {
  message?: string;
  error?: string;
  issues?: Array<{ path: string; message: string }>;
};

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isRegistration = mode === "register";
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    const data = new FormData(form);
    const payload = isRegistration
      ? {
          firstName: String(data.get("firstName") ?? ""),
          lastName: String(data.get("lastName") ?? ""),
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        }
      : {
          email: String(data.get("email") ?? ""),
          password: String(data.get("password") ?? ""),
        };

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setIsError(true);
        setMessage(
          result.issues?.[0]?.message ?? result.error ?? "The request could not be completed.",
        );
        return;
      }

      setMessage(result.message ?? "The request completed.");
      if (mode === "login") router.push("/dashboard");
      if (isRegistration) form.reset();
    } catch {
      setIsError(true);
      setMessage("FarmVision could not be reached. Check the connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate={false}>
      {isRegistration ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="Jane"
              autoComplete="given-name"
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Mukamana"
              autoComplete="family-name"
              maxLength={80}
              required
            />
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@farm.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          {!isRegistration ? (
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Forgot password?
            </Link>
          ) : null}
        </div>
        <PasswordInput
          id="password"
          name="password"
          placeholder={isRegistration ? "At least 12 characters" : "Your password"}
          autoComplete={isRegistration ? "new-password" : "current-password"}
          minLength={isRegistration ? 12 : 1}
          maxLength={128}
          required
        />
        {isRegistration ? (
          <p className="text-xs text-muted-foreground">Use at least 12 characters.</p>
        ) : null}
      </div>

      {message ? <FormMessage isError={isError} message={message} /> : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? "Please wait…" : isRegistration ? "Create farmer account" : "Sign in"}
      </Button>
    </form>
  );
}

export function EmailVerification({ token }: { token: string }) {
  const [message, setMessage] = useState("Verifying your email…");
  const [isError, setIsError] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [hasVerified, setHasVerified] = useState(false);
  const verificationStarted = useRef(false);

  const verify = useCallback(async () => {
    setMessage("Verifying your email…");
    setIsError(false);
    setIsPending(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const result = (await response.json()) as AuthResponse;
      if (!response.ok) {
        setIsError(true);
        setMessage(result.error ?? "This verification link is invalid or expired.");
        return;
      }
      setHasVerified(true);
      setMessage(result.message ?? "Your email was verified.");
    } catch {
      setIsError(true);
      setMessage("FarmVision could not be reached. Check the connection and try again.");
    } finally {
      setIsPending(false);
    }
  }, [token]);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;
    void verify();
  }, [verify]);

  return (
    <div className="space-y-5">
      {isPending ? (
        <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm" role="status">
          <Loader2 className="size-4 animate-spin text-primary" aria-hidden="true" />
          {message}
        </div>
      ) : (
        <FormMessage
          isError={isError}
          title={isError ? "Verification failed" : "Email verified"}
          message={message}
        />
      )}
      {isError && !hasVerified && !isPending ? (
        <Button variant="outline" type="button" onClick={() => void verify()} className="w-full">
          Try again
        </Button>
      ) : null}
      {hasVerified ? (
        <Button asChild size="lg" className="w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      ) : null}
    </div>
  );
}
