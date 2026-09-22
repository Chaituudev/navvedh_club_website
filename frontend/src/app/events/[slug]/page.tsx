import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, CircleCheck, Clock3, MapPin, Medal, Mic2, Trophy, UsersRound } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { ButtonLink } from "@/components/ui/button-link";
import { StatusBadge } from "@/components/ui/status-badge";
import { EventRegistrationButton } from "@/features/events/event-registration-button";
import { EventShare } from "@/features/events/event-share";
import { apiFetch, ApiError } from "@/lib/api/server";
import { mapApiEvent } from "@/lib/events";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try { const response = await apiFetch<{ event: any }>(`/api/events/${slug}`); const event = mapApiEvent(response.event); return { title: event.name, description: event.description, openGraph: { title: event.name, description: event.description, type: "website" } }; }
  catch { return { title: "Event" }; }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let event;
  try { const response = await apiFetch<{ event: any }>(`/api/events/${slug}`); event = mapApiEvent(response.event); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/events/${event.slug}`;

  return <PublicShell>
    <section className="relative overflow-hidden border-b border-white/[0.06]"><div className="tech-grid absolute inset-0 opacity-35" aria-hidden="true"/><div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8"><div className="flex flex-wrap items-center gap-3"><span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{event.category}</span><StatusBadge status={event.status}/>{event.isFree?<span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/60">Free Registration</span>:null}{event.resultsPublished?<span className="rounded-full border border-yellow-400/20 bg-yellow-400/5 px-3 py-1 text-xs font-semibold text-yellow-200">Results Published</span>:null}</div><h1 className="mt-6 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-white md:text-6xl">{event.name}</h1>{event.tagline?<p className="mt-4 text-xl font-medium text-[var(--accent)]">{event.tagline}</p>:null}<p className="mt-6 max-w-3xl text-base leading-8 text-white/52">{event.description}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row">{event.status==="registration-open"?<EventRegistrationButton slug={event.slug}/>:<ButtonLink href="/profile">My Profile</ButtonLink>}{event.category==="Hackathon"?<ButtonLink href={`/hackathons/${event.slug}`} variant="secondary">Hackathon Workspace</ButtonLink>:null}<ButtonLink href="/events" variant="secondary">Back to Events</ButtonLink></div></div></section>

    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[[CalendarDays,"Date",event.dateLabel],[Clock3,"Mode",event.mode],[MapPin,"Venue",event.venue],[UsersRound,"Team / Capacity",`${event.teamSize??"Individual / configurable"}${event.maxParticipants?` · ${event.maxParticipants} max`:""}`]].map(([Icon,label,value])=>{const C=Icon as typeof CalendarDays;return <div key={String(label)} className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"><C size={18} className="text-[var(--accent)]"/><div className="mt-4 text-xs uppercase tracking-[0.14em] text-white/30">{String(label)}</div><div className="mt-2 text-sm leading-6 text-white/70">{String(value)}</div></div>;})}</div></section>

    <section className="mx-auto grid max-w-7xl gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8"><div className="space-y-14">
      {event.resultsPublished&&(event.winner||event.runnerUp)?<section><h2 className="text-2xl font-semibold text-white">Official Results</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{event.winner?<article className="rounded-3xl border border-yellow-400/20 bg-yellow-400/[0.05] p-6"><Trophy size={28} className="text-yellow-300"/><div className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-yellow-300">Winner</div><h3 className="mt-2 text-2xl font-semibold">{event.winner.name}</h3></article>:null}{event.runnerUp?<article className="rounded-3xl border border-white/[0.12] bg-white/[0.025] p-6"><Medal size={28} className="text-white/65"/><div className="mt-4 text-xs font-bold uppercase tracking-[0.15em] text-white/55">Runner-up</div><h3 className="mt-2 text-2xl font-semibold">{event.runnerUp.name}</h3></article>:null}</div></section>:null}

      {event.speakerName?<section><div className="flex items-center gap-2"><Mic2 className="text-[var(--accent)]" size={20}/><h2 className="text-2xl font-semibold">Speaker / Guest</h2></div><div className="mt-5 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><div className="text-lg font-semibold">{event.speakerName}</div><p className="mt-1 text-sm text-white/45">{[event.speakerDesignation,event.speakerOrganization].filter(Boolean).join(" · ")}</p>{event.speakerTopic?<p className="mt-4 text-sm leading-6 text-white/55">Topic: {event.speakerTopic}</p>:null}</div></section>:null}

      <section><h2 className="text-2xl font-semibold">Tracks</h2>{event.tracks.length?<div className="mt-5 grid gap-3 sm:grid-cols-2">{event.tracks.map((track)=><article key={track.name} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5"><h3 className="font-semibold">{track.name}</h3></article>)}</div>:<p className="mt-4 text-sm text-white/45">Tracks will be announced soon.</p>}</section>
      <section><h2 className="text-2xl font-semibold">Schedule</h2>{event.schedule.length?<ol className="mt-6 border-l border-white/10 pl-6">{event.schedule.map((item)=><li key={`${item.time}-${item.title}`} className="relative pb-7"><span className="absolute -left-[29px] top-1.5 h-2 w-2 rounded-full bg-[var(--accent)]"/><div className="font-mono text-xs text-[var(--accent)]">{item.time}</div><h3 className="mt-1 font-semibold">{item.title}</h3>{item.description?<p className="mt-1 text-sm text-white/45">{item.description}</p>:null}</li>)}</ol>:<p className="mt-4 text-sm text-white/45">Detailed schedule will be published when confirmed.</p>}</section>
      <section><h2 className="text-2xl font-semibold">Rules</h2>{event.rules.length?<ul className="mt-5 space-y-3">{event.rules.map((rule)=><li key={rule} className="flex gap-3 text-sm leading-6 text-white/52"><CircleCheck size={17} className="mt-1 shrink-0 text-[var(--accent)]"/>{rule}</li>)}</ul>:<p className="mt-4 text-sm text-white/45">Rules will be published before the event.</p>}</section>
    </div><aside className="space-y-4 lg:sticky lg:top-24 lg:self-start"><div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><h2 className="font-semibold">Eligibility</h2><p className="mt-3 text-sm leading-6 text-white/48">{event.eligibility}</p>{event.registrationDeadline?<><div className="mt-5 text-xs uppercase tracking-[0.12em] text-white/30">Registration deadline</div><p className="mt-2 text-sm text-white/65">{event.registrationDeadline}</p></>:null}</div>{event.meetingLink?<div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><h2 className="font-semibold">Online Session</h2><a href={event.meetingLink} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-semibold text-[var(--accent)]">Open meeting link →</a></div>:null}<EventShare title={event.name} text={`${event.dateLabel} · ${event.venue}`} url={shareUrl}/><div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><h2 className="font-semibold">Certificates</h2><p className="mt-3 text-sm leading-6 text-white/40">Certificates, badges and special titles appear in the student profile after the event.</p><ButtonLink href="/profile" variant="secondary" className="mt-4 w-full">Open My Profile</ButtonLink></div></aside></section>
  </PublicShell>;
}
