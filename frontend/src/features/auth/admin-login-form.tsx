"use client";

import { useActionState } from "react";
import { adminSignInAction } from "@/app/admin/login/actions";
import { initialAuthState } from "@/lib/action-states";

export function AdminLoginForm({ disabled = false }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState(adminSignInAction, initialAuthState);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm text-white/70">Admin email<input name="email" type="email" required disabled={disabled} autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50" /></label>
      <label className="block text-sm text-white/70">Password<input name="password" type="password" required disabled={disabled} autoComplete="current-password" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50" /></label>
      {state.error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      <button disabled={pending || disabled} className="min-h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-bold text-[#07111f] disabled:cursor-not-allowed disabled:opacity-60">{disabled ? "API setup required" : pending ? "Checking access…" : "Sign in to Admin"}</button>
      <p className="text-xs leading-5 text-white/35">The admin page is separate, but authentication is shared. Only accounts with ADMIN or SUPER_ADMIN role are accepted.</p>
    </form>
  );
}
