import { Mail, MapPin, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { ContactForm } from "@/features/forms/contact-form";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  return <PublicShell><PageHero eyebrow="Contact" title="One professional contact point for students, speakers and partners." description="The public site avoids publishing unnecessary personal phone numbers; committee contact details can be managed centrally."/><section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8"><div className="space-y-3">{[[Mail, "Email", siteConfig.email], [MapPin, "Department", `${siteConfig.departmentName}, ${siteConfig.collegeName}, ${siteConfig.location}`], [UsersRound, "Coordinators", "Faculty and student coordinator details will be published when confirmed."]].map(([Icon,label,value]) => { const I=Icon as typeof Mail; return <div key={String(label)} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><I size={18} className="text-[var(--accent)]"/><div className="mt-4 text-xs uppercase tracking-[0.14em] text-white/30">{String(label)}</div><p className="mt-2 text-sm leading-6 text-white/60">{String(value)}</p></div>;})}</div><ContactForm/></section></PublicShell>;
}
