"use client";

import Link from "next/link";
import { TriangleAlert } from "lucide-react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="tech-grid grid min-h-screen place-items-center px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-red-400/15 bg-[#0b0f16]/95 p-7 text-center shadow-2xl">
        <TriangleAlert className="mx-auto text-red-300" size={30}/>
        <h1 className="mt-5 text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-white/45">The page hit an unexpected runtime error. If this happened during login or database setup, open the setup diagnostic first.</p>
        {error.digest ? <p className="mt-3 font-mono text-xs text-white/25">Reference: {error.digest}</p> : null}
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button onClick={reset} className="min-h-11 rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f]">Try again</button>
          <Link href="/setup" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-white/70">Check setup</Link>
          <Link href="/" className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-white/70">Home</Link>
        </div>
      </section>
    </main>
  );
}
