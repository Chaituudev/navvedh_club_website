import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import type { Event } from "@/types/domain";

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition duration-200 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.04]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{event.category}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-white">{event.name}</h3>
        </div>
        <StatusBadge status={event.status} />
      </div>
      <p className="mt-4 flex-1 text-sm leading-6 text-white/50">{event.description}</p>
      <div className="mt-6 grid gap-2 text-xs text-white/48">
        <div className="flex items-center gap-2"><CalendarDays size={15} />{event.dateLabel}</div>
        <div className="flex items-center gap-2"><MapPin size={15} />{event.venue}</div>
        {event.maxParticipants ? <div className="flex items-center gap-2"><Users size={15} />Up to {event.maxParticipants} participants</div> : null}
      </div>
      <Link href={`/events/${event.slug}`} className="mt-6 inline-flex min-h-11 items-center justify-between rounded-xl border border-white/[0.08] px-4 text-sm font-semibold text-white transition group-hover:border-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] group-hover:text-[var(--accent)]">
        View event <ArrowUpRight size={16} />
      </Link>
    </article>
  );
}
