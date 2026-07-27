"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, ArrowRight, Loader2, AlertCircle, Lock, Eye, EyeOff } from "lucide-react";
import { api, setTokens } from "@/lib/api";
import { useStore } from "@/lib/store";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain a digit");
      return;
    }

    setLoading(true);
    try {

      if (isRegister) {
        const username = `user_${Date.now().toString(36)}`;
        const res = await api.register(trimmed, username, password);
        if (res?.access_token) {
          await handleSuccess(res);
          return;
        }
      }

      const loginRes = await api.login(trimmed, password);
      if (loginRes?.access_token) {
        await handleSuccess(loginRes);
        return;
      }

      if (!isRegister) {
        const username = `user_${Date.now().toString(36)}`;
        const regRes = await api.register(trimmed, username, password);
        if (regRes?.access_token) {
          await handleSuccess(regRes);
          return;
        }
      }

      setError("Login failed. Check your credentials.");
    } catch (err: any) {
      const msg = err?.message || err?.detail || "Authentication failed";
      if (typeof msg === "string") {
        if (msg.includes("uppercase")) setError("Password needs an uppercase letter (A-Z)");
        else if (msg.includes("digit")) setError("Password needs a number (0-9)");
        else if (msg.includes("8 characters")) setError("Password must be at least 8 characters");
        else if (msg.includes("already exists")) setError("Email already registered. Try logging in.");
        else if (msg.includes("invalid") || msg.includes("Invalid")) setError("Invalid email or password");
        else setError(msg);
      } else {
        setError("Connection failed. Check if the server is running.");
      }
    }
    setLoading(false);
  };

  const handleSuccess = async (res: { access_token: string; refresh_token: string }) => {
    setTokens(res.access_token, res.refresh_token);
    try {
      const me = await api.getMe();
      if (me) useStore.getState().setUser(me);
    } catch {}
    toast.success("Welcome to GoTot!");
    router.push(redirect);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-500/5 rounded-full blur-3xl" />
      </div>
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <span className="text-white font-black text-xl">G</span>
            </div>
            <span className="text-3xl font-black tracking-tight">
              <span className="text-gradient">GoTot</span>
            </span>
          </a>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isRegister ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {isRegister ? "Sign up for free downloads" : "Sign in to continue downloading"}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="you@example.com"
                  autoFocus
                  autoComplete="email"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-base"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="8+ chars, A-Z, 0-9"
                  required
                  minLength={8}
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="mt-1.5 text-xs text-gray-400">Min 8 characters · 1 uppercase letter · 1 number</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email.trim() || password.length < 8}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 active:scale-[0.98] text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 text-base"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isRegister ? "Create Account" : "Sign In"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(""); }}
              className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all text-sm"
            >
              {isRegister ? "Sign in to existing account" : "Create new account"}
            </button>

            <p className="text-center">
              <button
                type="button"
                onClick={async () => {
                  setEmail("demo@gotot.app");
                  setPassword("Demo1234");
                }}
                className="text-xs text-primary-600 hover:underline font-medium"
              >
                Use demo account
              </button>
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to GoTot's{" "}
          <a href="/terms" className="underline hover:text-gray-600 dark:hover:text-gray-300">Terms</a>
          {" "}and{" "}
          <a href="/privacy" className="underline hover:text-gray-600 dark:hover:text-gray-300">Privacy</a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-pulse text-gray-400">Loading...</div></div>}>
      <LoginContent />
    </Suspense>
  );
}
