"use client";

import { useActionState } from "react";
import { MailCheck } from "lucide-react";
import { processPendingEmailQueueAction } from "@/app/admin/communications/actions";
import { initialCommunicationState } from "@/lib/action-states";

export function EmailQueuePanel({ pendingCount, sentLast24h }: { pendingCount: number; sentLast24h: number }) {
  const [state, action, pending] = useActionState(processPendingEmailQueueAction, initialCommunicationState);
  return (
    <section className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.035] p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-amber-100"><MailCheck size={17}/>Free-tier email queue</div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-lg border border-white/[0.06] bg-black/10 p-3"><div className="text-xl font-semibold text-white">{pendingCount}</div><div className="text-[10px] uppercase tracking-wide text-white/30">pending</div></div>
        <div className="rounded-lg border border-white/[0.06] bg-black/10 p-3"><div className="text-xl font-semibold text-white">{sentLast24h}</div><div className="text-[10px] uppercase tracking-wide text-white/30">sent / 24h</div></div>
      </div>
      <p className="mt-3 text-xs leading-5 text-white/35">The app targets at most 90 email sends per rolling 24 hours, leaving headroom under Resend Free's 100/day limit.</p>
      <form action={action} className="mt-4"><button disabled={pending || pendingCount===0} className="min-h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/70 disabled:opacity-40">{pending ? "Processing…" : "Process pending email"}</button></form>
      {state.error ? <p role="alert" className="mt-3 text-xs leading-5 text-red-200">{state.error}</p> : null}
      {state.message ? <p role="status" className="mt-3 text-xs leading-5 text-emerald-200">{state.message}</p> : null}
    </section>
  );
}
