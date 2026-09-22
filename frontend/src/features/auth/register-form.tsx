"use client";

import { useActionState } from "react";
import { registerAction } from "@/app/register/actions";
import { initialAuthState } from "@/lib/action-states";
import { siteConfig } from "@/config/site";

export function RegisterForm({ disabled = false }: { disabled?: boolean }) {
  const [state, action, pending] = useActionState(registerAction, initialAuthState);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm text-white/70">Full Name<input disabled={disabled} name="fullName" required autoComplete="name" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)]" /></label>
      <label className="block text-sm text-white/70">Email<input disabled={disabled} name="email" type="email" required autoComplete="email" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)]" /></label>
      <label className="block text-sm text-white/70">College<input disabled={disabled} name="college" defaultValue={siteConfig.collegeName} required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)]" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-white/70">Department<input disabled={disabled} name="department" defaultValue="Computer Science & Engineering" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)]" /></label>
        <label className="block text-sm text-white/70">Year<select disabled={disabled} name="year" defaultValue="" required className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-[#0a0e15] px-4 text-white outline-none focus:border-[var(--accent)]"><option value="" disabled>Select year</option><option value="FY">FY</option><option value="SY">SY</option><option value="TY">TY</option><option value="Final Year">Final Year</option><option value="PG">PG</option><option value="Other">Other</option></select></label>
      </div>
      <label className="block text-sm text-white/70">Password<input disabled={disabled} name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/25 px-4 text-white outline-none focus:border-[var(--accent)]" /></label>
      {state.error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{state.message}</p> : null}
      <button type="submit" disabled={pending || disabled} className="min-h-12 w-full rounded-xl bg-[var(--accent)] text-sm font-bold text-[#07111f] disabled:cursor-not-allowed disabled:opacity-60">{disabled ? "API setup required" : pending ? "Creating account…" : "Create Account"}</button>
      <p className="text-xs leading-5 text-white/35">This account becomes your identity for event registrations, teams, attendance, certificates and club activity history.</p>
    </form>
  );
}
