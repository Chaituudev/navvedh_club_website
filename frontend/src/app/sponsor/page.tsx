import { BriefcaseBusiness, CodeXml, GraduationCap, Handshake, Megaphone, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { ButtonLink } from "@/components/ui/button-link";

const benefits = [
  ["Brand visibility", "Website, event and certificate placement where appropriate.", Megaphone],
  ["Technical engagement", "Sponsor problem statements, API/product usage and workshops.", CodeXml],
  ["Mentoring & judging", "Participate through expert mentoring or judging roles.", GraduationCap],
  ["Recruitment connection", "Meet relevant student builders without automatic access to private participant data.", BriefcaseBusiness],
  ["Community access", "Engage with developers, project teams and technical audiences.", UsersRound],
  ["Flexible partnership", "Technology, knowledge, cloud, food, hiring and supporting partnership formats.", Handshake],
] as const;

export default function SponsorPage() {
  return <PublicShell><PageHero eyebrow="Sponsor / Partner" title="Support technical activity students can actually use." description="The club offers structured ways for companies and communities to contribute to student learning, events, projects and recruiting visibility."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{benefits.map(([title, copy, Icon]) => <article key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><Icon size={20} className="text-[var(--accent)]"/><h2 className="mt-5 text-lg font-semibold">{title}</h2><p className="mt-3 text-sm leading-6 text-white/45">{copy}</p></article>)}</div><div className="mt-10 rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 md:p-9"><h2 className="text-2xl font-semibold">Partnership actions</h2><p className="mt-3 max-w-3xl text-sm leading-7 text-white/48">A sponsorship deck can describe event reach, branding inventory, speaking/mentoring options, sponsor-supported rewards and privacy expectations. Participant contact data is not a default sponsor benefit.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><ButtonLink href="/contact">Become a Partner</ButtonLink><ButtonLink href="/contact" variant="secondary">Request Sponsorship Deck</ButtonLink><ButtonLink href="/contact" variant="ghost">Contact Sponsorship Team</ButtonLink></div></div></section></PublicShell>;
}
