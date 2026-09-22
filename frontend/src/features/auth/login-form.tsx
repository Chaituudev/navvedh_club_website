"use client";

import { useActionState } from "react";
import { signInAction } from "@/app/login/actions";
import { initialAuthState } from "@/lib/action-states";

export function LoginForm({ next = "/profile", disabled = false }: { next?: string; disabled?: boolean }) {
  const [state, action, pending] = useActionState(signInAction, initialAuthState);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <label className="block text-sm text-white/70">
        Email
        <input name="email" type="email" autoComplete="email" required disabled={disabled} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50" />
      </label>
      <label className="block text-sm text-white/70">
        Password
        <input name="password" type="password" autoComplete="current-password" required disabled={disabled} className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50" />
      </label>
      {state.error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      <button type="submit" disabled={pending || disabled} className="min-h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-bold text-[#07111f] disabled:cursor-not-allowed disabled:opacity-60">
        {disabled ? "API setup required" : pending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
