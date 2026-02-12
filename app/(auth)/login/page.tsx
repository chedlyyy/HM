"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/shop";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push(callbackUrl);
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
        <div className="mb-6 space-y-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Access your Hamdi Shop account to comment and rate products.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-900 disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Create one
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

