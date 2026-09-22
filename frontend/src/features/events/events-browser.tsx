"use client";
import { useMemo, useState } from "react";
import { EventCard } from "@/features/events/event-card";
import type { Event } from "@/types/domain";

export function EventsBrowser({ events }: { events: Event[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(events.map((event) => event.category))).sort()], [events]);
  const [active, setActive] = useState("All");
  const visibleEvents = useMemo(() => active === "All" ? events : events.filter((event) => event.category === active), [active, events]);
  return <><div className="mb-8 flex gap-2 overflow-x-auto pb-2" aria-label="Filter events by category">{categories.map((category) => <button key={category} type="button" aria-pressed={category===active} onClick={()=>setActive(category)} className={`shrink-0 rounded-full border px-3 py-1.5 text-xs transition ${category===active?"border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]":"border-white/10 text-white/45 hover:border-white/20 hover:text-white/75"}`}>{category}</button>)}</div>{visibleEvents.length?<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{visibleEvents.map((event)=><EventCard key={event.id} event={event}/>)}</div>:<div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 text-center text-sm text-white/45">No published events are available in this category yet.</div>}</>;
}
