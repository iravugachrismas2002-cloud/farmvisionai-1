"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/auth/password-input";
import { FormMessage } from "@/components/auth/form-message";

type AuthResponse = {
  message?: string;
  error?: string;
  emailSent?: boolean;
  resetToken?: string;
};

export function ForgotPasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setIsError(false);
    setIsSubmitting(true);

    const email = String(new FormData(form).get("email") ?? "");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setIsError(true);
        setMessage(result.error ?? "The request could not be completed.");
        return;
      }

      setMessage(
        result.message ?? "If an account exists for this email, a password reset link has been sent.",
      );
      if (result.resetToken) setResetToken(result.resetToken);
      form.reset();
    } catch {
      setIsError(true);
      setMessage("FarmVision could not be reached. Check the connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" placeholder="you@farm.com" autoComplete="email" required />
      </div>

      {message ? <FormMessage isError={isError} message={message} /> : null}

      {resetToken ? (
        <div className="space-y-2 rounded-lg border border-dashed bg-card p-4 text-sm">
          <p className="font-medium">Reset token (local development only)</p>
          <code className="block break-all rounded bg-background px-2 py-1.5 text-xs">{resetToken}</code>
          <p className="text-muted-foreground">
            Open{" "}
            <Link
              href={`/reset-password?token=${encodeURIComponent(resetToken)}`}
              className="text-primary hover:underline"
            >
              the reset page
            </Link>{" "}
            to choose a new password.
          </p>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? "Sending…" : "Send reset link"}
      </Button>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setMessage(null);
    setIsError(false);

    const data = new FormData(form);
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }
    if (password.length < 12) {
      setIsError(true);
      setMessage("Password must be at least 12 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const result = (await response.json()) as AuthResponse;

      if (!response.ok) {
        setIsError(true);
        setMessage(result.error ?? "The request could not be completed.");
        return;
      }

      setMessage(result.message ?? "Your password has been reset successfully.");
      setIsDone(true);
      form.reset();
    } catch {
      setIsError(true);
      setMessage("FarmVision could not be reached. Check the connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isDone) {
    return (
      <div className="space-y-5">
        <FormMessage isError={false} title="Password updated" message={message ?? ""} />
        <Button asChild size="lg" className="w-full">
          <Link href="/login">Continue to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <PasswordInput
          id="password"
          name="password"
          placeholder="At least 12 characters"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Repeat your new password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
        />
      </div>

      {message ? <FormMessage isError={isError} message={message} /> : null}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="animate-spin" aria-hidden="true" /> : null}
        {isSubmitting ? "Resetting…" : "Reset password"}
      </Button>
    </form>
  );
}
