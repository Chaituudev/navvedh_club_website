"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/app/contact/actions";
import { initialContactState } from "@/lib/action-states";

const cls = "mt-2 min-h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-white outline-none focus:border-[var(--accent)]";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, initialContactState);
  return (
    <form action={action} className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 md:p-8">
      <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm text-white/70">Name<input name="name" required autoComplete="name" className={cls}/></label>
        <label className="text-sm text-white/70">Email<input name="email" required type="email" autoComplete="email" className={cls}/></label>
      </div>
      <label className="mt-5 block text-sm text-white/70">Topic<select name="topic" className={`${cls} bg-[#0b0f16]`} defaultValue="General"><option>General</option><option>Event</option><option>Sponsorship</option><option>Speaker / Mentor</option><option>Technical issue</option></select></label>
      <label className="mt-5 block text-sm text-white/70">Message<textarea name="message" required minLength={10} rows={7} className={`${cls} py-3`}/></label>
      {state.error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      {state.message ? <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{state.message}</p> : null}
      <button disabled={pending} className="mt-6 min-h-12 rounded-xl bg-[var(--accent)] px-6 text-sm font-bold text-[#07111f] disabled:opacity-60">{pending ? "Sending…" : "Send Message"}</button>
    </form>
  );
}
