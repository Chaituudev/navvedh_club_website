import { BookOpen, Boxes, Handshake, Lightbulb, Trophy } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";

const pillars = [
  ["LEARN", "Workshops, guided practice, technical talks and curated resources.", BookOpen],
  ["BUILD", "Projects, prototypes and practical development with real artifacts.", Boxes],
  ["COMPETE", "Hackathons, contests, CTFs, game jams and technical challenges.", Trophy],
  ["CONNECT", "Industry experts, alumni, mentors, communities and companies.", Handshake],
  ["INNOVATE", "Research, entrepreneurship and solutions to relevant problems.", Lightbulb],
] as const;

export default function AboutPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="About" title="A durable technical community for CSE students." description="The club exists to make technical activity continuous: students learn, build, compete, publish work and pass a stronger platform to the next committee." />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            ["Who we are", "A department-level student technical community supported by faculty and built around real participation, not ceremonial membership."],
            ["Mission", "Create repeatable opportunities for students to gain practical skill, work in teams, test ideas and show evidence of what they can do."],
            ["Vision", "Build a respected student innovation platform that can host departmental activity today and credible inter-college activity tomorrow."],
          ].map(([title, copy]) => <article key={title} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><h2 className="text-xl font-semibold text-white">{title}</h2><p className="mt-4 text-sm leading-7 text-white/50">{copy}</p></article>)}
        </div>
      </section>
      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Operating model" title="Five pillars keep the club from becoming a one-event brand." />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">{pillars.map(([name, copy, Icon]) => <article key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><Icon size={20} className="text-[var(--accent)]"/><h3 className="mt-5 text-sm font-bold tracking-[0.14em]">{name}</h3><p className="mt-3 text-sm leading-6 text-white/45">{copy}</p></article>)}</div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Story" title="Start small enough to execute well. Build systems that can scale." />
        <div className="space-y-5 text-sm leading-7 text-white/52">
          <p>The initial departmental hackathon is intentionally a controlled pilot: free registration, roughly 200 participants, manageable team sizes and an offline format. Its job is to prove operations, judging, communication and student engagement.</p>
          <p>The long-term platform is broader. Workshops, coding contests, project showcases, research activity, industry sessions and future inter-college events all use the same website infrastructure and historical archive.</p>
          <p>Future committees should be able to update content and run normal operations through secure dashboards rather than editing source code.</p>
        </div>
      </section>
    </PublicShell>
  );
}
