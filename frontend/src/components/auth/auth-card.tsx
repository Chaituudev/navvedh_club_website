import Link from "next/link";
import { LockKeyhole } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export function AuthCard({ title, description, children, footer }: { title: string; description: string; children: ReactNode; footer: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/30 md:p-8">
      <Link href="/" className="mb-8 inline-flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--accent)] font-mono text-xs font-black text-[#07111f]">CSE</span><span className="text-sm font-semibold text-white">{siteConfig.clubName}</span></Link>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--accent)]"><LockKeyhole size={15}/>Secure account</div>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-white/45">{description}</p>
      <div className="mt-7">{children}</div>
      <div className="mt-6 border-t border-white/[0.07] pt-5 text-sm text-white/45">{footer}</div>
    </div>
  );
}
