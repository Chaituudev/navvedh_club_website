import { ArrowRight, BookOpen, Boxes, Handshake, Images, Lightbulb, Trophy, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { ButtonLink } from "@/components/ui/button-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { EventCard } from "@/features/events/event-card";
import { ProjectCard } from "@/features/projects/project-card";
import { achievements, galleryAlbums, partners, projects } from "@/data/mock";
import { apiFetch } from "@/lib/api/server";
import { mapApiEvent } from "@/lib/events";
import type { Event } from "@/types/domain";

const pillars = [
  { name: "LEARN", copy: "Workshops, learning sessions and technical talks.", icon: BookOpen },
  { name: "BUILD", copy: "Projects and practical development that creates evidence of skill.", icon: Boxes },
  { name: "COMPETE", copy: "Hackathons, coding competitions, CTFs and challenges.", icon: Trophy },
  { name: "CONNECT", copy: "Industry experts, alumni, mentors and companies.", icon: Handshake },
  { name: "INNOVATE", copy: "Research, entrepreneurship and real-world problem solving.", icon: Lightbulb },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let events: Event[] = [];
  try {
    const response = await apiFetch<{ events: any[] }>("/api/events");
    events = response.events.map(mapApiEvent);
  } catch {
    events = [];
  }
  const featured = events[0];
  return (
    <PublicShell>
      <Hero />
      <Stats />

      {featured ? (
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Featured Event" title={featured.name} description="The latest published NavVedh event from the live event database." />
        <div className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[linear-gradient(135deg,rgba(110,168,254,.11),rgba(255,255,255,.015)_55%)] p-6 md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-[var(--accent)]">{featured.tagline}</p>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">{featured.description}</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/65">{featured.category}</span>
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/65">{featured.mode}</span>
                <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/65">{featured.dateLabel}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <ButtonLink href={`/events/${featured.slug}`} variant="secondary">View Event</ButtonLink>
              {featured.status === "registration-open" ? <ButtonLink href={`/events/${featured.slug}`}>Register Now <ArrowRight className="ml-2" size={16} /></ButtonLink> : null}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 rounded-3xl border border-white/[0.08] bg-white/[0.02] p-7 md:grid-cols-[.8fr_1.2fr] md:p-10">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">About the club</p><h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">Technical activity that compounds over time.</h2></div>
          <div><p className="text-sm leading-7 text-white/52">The club is designed as permanent infrastructure for the CSE department: events create opportunities, projects preserve evidence of work, achievements record outcomes, resources support learning, and future committees operate the platform through admin tools instead of editing code.</p><ButtonLink href="/about" variant="ghost" className="mt-4 px-0">How the club works →</ButtonLink></div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What the club does" title="A technical community, not an events calendar." description="Events create momentum. Projects, resources, achievements and peer learning create continuity after the event ends." />
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {pillars.map(({ name, copy, icon: Icon }) => (
              <article key={name} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                <Icon className="text-[var(--accent)]" size={20} />
                <h3 className="mt-5 text-sm font-bold tracking-[0.12em] text-white">{name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/45">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Events" title="Upcoming technical activity" description="Each event gets its own page, registration state, announcements and historical record." action={<ButtonLink href="/events" variant="ghost">All events →</ButtonLink>} />
        <div className="grid gap-4 lg:grid-cols-3">{events.slice(0,3).map((event) => <EventCard key={event.id} event={event} />)}</div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Projects" title="What students build should outlive the event." description="The project showcase becomes a permanent technical portfolio for the department." action={<ButtonLink href="/projects" variant="ghost">Browse projects →</ButtonLink>} />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{projects.map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Achievements" title="Verified work deserves a permanent record." action={<ButtonLink href="/achievements" variant="ghost">All achievements →</ButtonLink>} />
        <div className="grid gap-3 md:grid-cols-3">{achievements.map((item) => <article key={item.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><div className="flex items-start gap-4"><Trophy className="mt-1 shrink-0 text-[var(--accent)]" size={18}/><div><h3 className="font-semibold text-white">{item.title}</h3><p className="mt-1 text-sm text-white/45">{item.personOrTeam} · {item.year}</p><p className="mt-3 text-sm leading-6 text-white/45">{item.description}</p></div></div></article>)}</div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Community" title="A curated visual history, organized by event." description="Albums keep photos discoverable without turning the site into an unstructured image feed." action={<ButtonLink href="/gallery" variant="ghost">Open gallery →</ButtonLink>} />
          <div className="grid gap-4 md:grid-cols-3">{galleryAlbums.map((album) => <article key={album.id} className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]"><div className="grid aspect-[16/9] place-items-center bg-[linear-gradient(135deg,rgba(110,168,254,.10),rgba(255,255,255,.01))]"><Images size={32} className="text-white/15"/></div><div className="p-5"><div className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{album.year}</div><h3 className="mt-2 font-semibold text-white">{album.title}</h3><p className="mt-2 text-sm leading-6 text-white/42">{album.description}</p></div></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Partners" title="Built to support serious collaboration." description="Sponsor placement is restrained and professional. No participant data access is promised or implied." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{partners.map((partner) => <div key={partner.id} className="grid min-h-32 place-items-center rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.015] p-4 text-center"><div><div className="font-mono text-lg font-bold text-white/35">{partner.shortName}</div><div className="mt-2 text-xs text-white/35">{partner.level}</div></div></div>)}</div>
        <ButtonLink href="/sponsor" variant="secondary" className="mt-5">Explore partnership options</ButtonLink>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_7%,transparent)] p-7 md:p-10">
          <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
            <div><UsersRound className="text-[var(--accent)]"/><h2 className="mt-4 text-3xl font-semibold tracking-[-0.035em] text-white">Help build the club from the beginning.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-white/50">Join technical, design, event, content, sponsorship or operations work. Roles should reflect real work, not decorative titles.</p></div>
            <ButtonLink href="/join">Join the Club</ButtonLink>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
