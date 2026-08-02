"use client";

import { FormEvent, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  AuthError,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import Button from "@/components/ui/Button";

type Mode = "signIn" | "signUp";
type Status = "idle" | "submitting" | "error";

const errorMessages: Record<string, string> = {
  "auth/invalid-email": "That email address doesn't look right.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account already exists with that email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/popup-closed-by-user": "Google sign-in was cancelled.",
  "auth/admin-restricted-operation": "New account creation is temporarily disabled. Please contact us to set up your account.",
  "auth/operation-not-allowed": "This sign-in method is temporarily unavailable. Please contact us for help.",
};

function friendlyError(err: unknown): string {
  const code = (err as AuthError)?.code;
  return (code && errorMessages[code]) || "Something went wrong. Please try again.";
}

export default function AuthForm() {
  const [mode, setMode] = useState<Mode>("signIn");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    try {
      if (mode === "signUp") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Fire-and-forget: not blocking sign-up on this, and Google sign-in
        // (the other path) already comes with a verified email from Google.
        sendEmailVerification(cred.user).catch(() => {});
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setStatus("error");
      setError(friendlyError(err));
      return;
    }
    setStatus("idle");
  };

  const handleGoogle = async () => {
    setStatus("submitting");
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setStatus("error");
      setError(friendlyError(err));
      return;
    }
    setStatus("idle");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-sm mx-auto">
      <div className="flex border border-ink/20">
        <button
          type="button"
          onClick={() => setMode("signIn")}
          className={`flex-1 py-2.5 text-sm uppercase tracking-wide transition-colors ${
            mode === "signIn" ? "bg-ink text-ivory" : "text-ink/70"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode("signUp")}
          className={`flex-1 py-2.5 text-sm uppercase tracking-wide transition-colors ${
            mode === "signUp" ? "bg-ink text-ivory" : "text-ink/70"
          }`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-ink/70" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="border border-ink/20 bg-ivory px-4 py-3 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center px-7 py-3 text-sm tracking-wide uppercase bg-ink text-ivory border border-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors disabled:opacity-60"
        >
          {status === "submitting"
            ? "Please wait..."
            : mode === "signUp"
              ? "Create Account"
              : "Sign In"}
        </button>
      </form>

      <div className="flex items-center gap-3 text-ink/40 text-xs uppercase tracking-wide">
        <span className="flex-1 h-px bg-ink/10" />
        or
        <span className="flex-1 h-px bg-ink/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleGoogle}
        disabled={status === "submitting"}
        className="disabled:opacity-60"
      >
        Continue with Google
      </Button>
    </div>
  );
}
