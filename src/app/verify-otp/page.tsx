"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/login");
    }
  }, [email, router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setError("OTP resent successfully!");
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 text-center shadow-2xl backdrop-blur-lg dark:bg-slate-900/80">
          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg
                className="h-10 w-10 text-emerald-600 dark:text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
              Verified!
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Redirecting to your dashboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-lg dark:bg-slate-900/80">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
            <Image
              src="/web-images/agribot-logo.svg"
              alt="Agri-Tech Logo"
              width={56}
              height={56}
              className="h-14 w-14"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
            Verify Your Email
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            We sent a code to <span className="font-semibold">{email}</span>
          </p>
        </div>

        {/* Error/Success Message */}
        {error && (
          <div
            className={`rounded-lg p-4 text-sm ${
              error.includes("success")
                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            }`}
          >
            {error}
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Verification Code
            </label>
            <input
              id="otp"
              type="text"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="mt-1 block w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-center text-2xl font-bold tracking-widest text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
              placeholder="000000"
            />
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Enter the 6-digit code
            </p>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-lg bg-emerald-600 py-3 font-semibold text-white shadow-lg transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={loading}
              className="font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-50 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Resend
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <div className="text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  );
}
