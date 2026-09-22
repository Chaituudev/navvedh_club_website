"use client";

import { useActionState } from "react";
import { BadgeCheck, Search, ShieldCheck, ShieldX } from "lucide-react";
import { verifyCertificateAction } from "@/app/verify/actions";
import { initialCertificateLookupState } from "@/lib/action-states";

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value));
  } catch {
    return value;
  }
}

export function CertificateVerifier({ initialId = "" }: { initialId?: string }) {
  const [state, action, pending] = useActionState(verifyCertificateAction, initialCertificateLookupState);
  const valid = state.result?.verificationStatus === "valid";

  return (
    <div className="mx-auto max-w-2xl">
      <form action={action} className="rounded-2xl border border-white/[0.09] bg-white/[0.03] p-5 md:p-7">
        <label htmlFor="certificate-id" className="text-sm font-semibold text-white">Certificate verification ID</label>
        <p className="mt-1 text-sm text-white/45">Enter the exact ID printed on the certificate or encoded in its QR code.</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input id="certificate-id" name="certificateId" defaultValue={initialId} required placeholder="AITRC-TECH-YYYY-..." className="min-h-12 flex-1 rounded-xl border border-white/10 bg-black/20 px-4 text-sm text-white outline-none placeholder:text-white/25 focus:border-[var(--accent)]" />
          <button disabled={pending} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f] disabled:opacity-60" type="submit"><Search size={17} />{pending ? "Checking…" : "Verify"}</button>
        </div>
      </form>

      {state.result ? (
        <div className={`mt-5 rounded-2xl border p-6 ${valid ? "border-emerald-400/20 bg-emerald-400/[0.05]" : "border-red-400/20 bg-red-400/[0.05]"}`} role="status">
          <div className={`flex items-center gap-3 ${valid ? "text-emerald-300" : "text-red-200"}`}>{valid ? <BadgeCheck/> : <ShieldX/>}<span className="font-semibold">{valid ? "VALID CERTIFICATE" : "CERTIFICATE REVOKED"}</span></div>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div><dt className="text-white/35">Student Name</dt><dd className="mt-1 text-white">{state.result.recipientName}</dd></div>
            <div><dt className="text-white/35">Event</dt><dd className="mt-1 text-white">{state.result.eventName || "Club activity"}</dd></div>
            <div><dt className="text-white/35">Role / Award</dt><dd className="mt-1 text-white">{state.result.awardName || state.result.roleType}</dd></div>
            <div><dt className="text-white/35">Certificate Number</dt><dd className="mt-1 break-all text-white">{state.result.certificateNumber}</dd></div>
            <div><dt className="text-white/35">Issue Date</dt><dd className="mt-1 text-white">{formatDate(state.result.issuedAt)}</dd></div>
          </dl>
          <p className="mt-5 flex items-center gap-2 text-xs text-white/40"><ShieldCheck size={14}/>Verification uses a restricted server-side database function and does not expose private profile data.</p>
        </div>
      ) : null}

      {state.error ? <div className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/[0.04] p-5 text-sm text-rose-200" role="alert">{state.error}</div> : null}
    </div>
  );
}
