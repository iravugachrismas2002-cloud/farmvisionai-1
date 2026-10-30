import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Join FarmVision"
      title="Create a farmer account"
      description="Verify your email, then wait for administrator approval before signing in."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
          <span className="mt-3 block text-xs">
            Registration is currently for farmers. Other roles are assigned by an administrator.
          </span>
        </>
      }
    >
      <AuthForm mode="register" />
    </AuthShell>
  );
}
