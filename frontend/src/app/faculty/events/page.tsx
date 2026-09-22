import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { requireFaculty } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";
export const dynamic="force-dynamic";
export default async function Page(){await requireFaculty();const {events}=await apiFetch<any>("/api/faculty/events",{},true);return <PublicShell><section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><CalendarDays size={16}/>Faculty Supervision</div><h1 className="mt-3 text-3xl font-semibold">All Club Events</h1><div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{events.map((e:any)=><article key={e._id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><div className="text-xs font-bold uppercase text-[var(--accent)]">{e.category}</div><h2 className="mt-2 font-semibold">{e.name}</h2><div className="mt-2 text-xs text-white/35">{e.status} · {e.isArchived?"Archived":e.isPublished?"Published":"Draft"}</div>{e.slug&&!e.isArchived&&e.isPublished?<Link href={`/events/${e.slug}`} className="mt-4 inline-block text-xs font-semibold text-[var(--accent)]">View public event →</Link>:null}</article>)}</div></section></PublicShell>}
