import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { EventsBrowser } from "@/features/events/events-browser";
import { apiFetch } from "@/lib/api/server";
import { mapApiEvent } from "@/lib/events";
import type { Event } from "@/types/domain";

export const dynamic = "force-dynamic";
export default async function EventsPage() {
  let events: Event[] = [];
  let error = "";
  try { const response = await apiFetch<{ events: any[] }>("/api/events"); events = response.events.map(mapApiEvent); }
  catch (err) { error = err instanceof Error ? err.message : "Events could not be loaded."; }
  return <PublicShell><PageHero eyebrow="Events" title="Build. Learn. Compete. Connect." description="Explore competitions, workshops, webinars, guest lectures and other NavVedh activities."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{error?<div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{error}</div>:null}<EventsBrowser events={events}/></section></PublicShell>;
}
