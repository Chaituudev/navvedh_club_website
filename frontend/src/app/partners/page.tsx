import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { ButtonLink } from "@/components/ui/button-link";
import { partners } from "@/data/mock";

export default function PartnersPage() {
  return <PublicShell><PageHero eyebrow="Partners" title="Professional partnership placement without sponsor clutter." description="Partners can support events through technology, mentoring, knowledge, food, cloud credits, hiring access and other useful contributions."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-3">{partners.map((partner) => <article key={partner.id} className="grid min-h-56 place-items-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] p-6 text-center"><div><div className="font-mono text-2xl font-black text-white/30">{partner.shortName}</div><h2 className="mt-4 text-sm font-semibold text-white/70">{partner.level}</h2><p className="mt-2 text-xs text-white/35">Partner slot available</p></div></article>)}</div><div className="mt-8"><ButtonLink href="/sponsor">Become a Partner</ButtonLink></div></section></PublicShell>;
}
