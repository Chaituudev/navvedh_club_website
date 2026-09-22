"use client";

import { useActionState } from "react";
import { submitJoinApplication } from "@/app/join/actions";
import { initialJoinState } from "@/lib/action-states";

const input = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-[var(--accent)]";

export function JoinClubForm() {
  const [state, action, pending] = useActionState(submitJoinApplication, initialJoinState);
  return (
    <form action={action} className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 md:p-8">
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-medium text-white/70">Full Name<input name="fullName" required autoComplete="name" className={input}/></label>
        <label className="text-sm font-medium text-white/70">Email<input name="email" type="email" required autoComplete="email" className={input}/></label>
        <label className="text-sm font-medium text-white/70">Phone<input name="phone" type="tel" autoComplete="tel" className={input}/></label>
        <label className="text-sm font-medium text-white/70">Year<input name="year" required placeholder="FY / SY / TY / Final Year" className={input}/></label>
        <label className="text-sm font-medium text-white/70">Department<input name="department" required defaultValue="Computer Science & Engineering" className={input}/></label>
        <label className="text-sm font-medium text-white/70">Preferred Domain<input name="preferredDomain" placeholder="AI/ML, Web, Game Dev…" className={input}/></label>
        <label className="text-sm font-medium text-white/70 sm:col-span-2">Skills<input name="skills" placeholder="React, Python, C++, Design…" className={input}/></label>
        <label className="text-sm font-medium text-white/70">GitHub<input name="github" type="url" placeholder="https://github.com/..." className={input}/></label>
        <label className="text-sm font-medium text-white/70">LinkedIn / Portfolio<input name="linkedinPortfolio" type="url" placeholder="https://..." className={input}/></label>
      </div>
      <label className="mt-5 block text-sm font-medium text-white/70">Preferred Team<select name="preferredTeam" className={`${input} bg-[#0b0f16]`} defaultValue="Technical"><option>Technical</option><option>Design</option><option>Events</option><option>Marketing</option><option>Sponsorship</option><option>Content</option><option>Photography</option><option>Operations</option></select></label>
      <label className="mt-5 block text-sm font-medium text-white/70">Why do you want to join?<textarea name="motivation" required minLength={20} rows={5} className={`${input} py-3`}/></label>
      {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      {state.message ? <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{state.message}</p> : null}
      <button disabled={pending} className="mt-6 min-h-12 rounded-xl bg-[var(--accent)] px-6 text-sm font-bold text-[#07111f] disabled:opacity-60">{pending ? "Submitting…" : "Submit Application"}</button>
    </form>
  );
}
