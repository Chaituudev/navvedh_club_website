"use client";

import { useActionState, useMemo, useState } from "react";
import { Mail, Megaphone, Search, Send, UsersRound } from "lucide-react";
import {
  createCommunicationAction,
} from "@/app/admin/communications/actions";
import { initialCommunicationState } from "@/lib/action-states";

type ProfileOption = {
  id: string;
  full_name: string | null;
  email: string;
  year: string | null;
  college: string | null;
  department: string | null;
};

type EventOption = { id: string; name: string };

const field =
  "mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#0b0f16] px-3 text-sm text-white outline-none focus:border-[var(--accent)]";

function unique(values: Array<string | null>) {
  return [...new Set(values.filter((value): value is string => Boolean(value)))].sort();
}

export function CommunicationComposer({
  profiles,
  events,
}: {
  profiles: ProfileOption[];
  events: EventOption[];
}) {
  const [state, action, pending] = useActionState(
    createCommunicationAction,
    initialCommunicationState,
  );
  const [mode, setMode] = useState<"all" | "filters" | "specific">("filters");
  const [search, setSearch] = useState("");

  const years = useMemo(() => unique(profiles.map((profile) => profile.year)), [profiles]);
  const colleges = useMemo(() => unique(profiles.map((profile) => profile.college)), [profiles]);
  const departments = useMemo(() => unique(profiles.map((profile) => profile.department)), [profiles]);
  const visibleProfiles = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return profiles.slice(0, 80);
    return profiles
      .filter((profile) =>
        [profile.full_name, profile.email, profile.college, profile.department, profile.year]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query)),
      )
      .slice(0, 80);
  }, [profiles, search]);

  return (
    <form action={action} className="space-y-6">
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-center gap-2">
          <UsersRound size={18} className="text-[var(--accent)]" />
          <h2 className="font-semibold text-white">1. Choose audience</h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            ["all", "Everyone", "All active registered profiles"],
            ["filters", "By category", "Year, college, department or event"],
            ["specific", "Specific students", "Select individual profiles"],
          ].map(([value, label, helper]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-xl border p-4 transition ${
                mode === value
                  ? "border-[var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_8%,transparent)]"
                  : "border-white/[0.07] bg-black/10"
              }`}
            >
              <input
                type="radio"
                name="recipientMode"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value as typeof mode)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-white">{label}</span>
              <span className="mt-1 block text-xs leading-5 text-white/35">{helper}</span>
            </label>
          ))}
        </div>

        {mode === "filters" ? (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <fieldset className="rounded-xl border border-white/[0.06] p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-white/40">Year</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {years.length ? years.map((year) => (
                  <label key={year} className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-white/60">
                    <input name="years" value={year} type="checkbox" className="accent-[var(--accent)]" />
                    {year}
                  </label>
                )) : <span className="text-xs text-white/30">No profile data yet.</span>}
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-white/[0.06] p-4">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-white/40">Department</legend>
              <div className="mt-2 flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                {departments.map((department) => (
                  <label key={department} className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-white/60">
                    <input name="departments" value={department} type="checkbox" className="accent-[var(--accent)]" />
                    {department}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-white/[0.06] p-4 lg:col-span-2">
              <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-white/40">College</legend>
              <div className="mt-2 flex max-h-36 flex-wrap gap-2 overflow-y-auto">
                {colleges.map((college) => (
                  <label key={college} className="flex items-center gap-2 rounded-lg border border-white/[0.07] px-3 py-2 text-xs text-white/60">
                    <input name="colleges" value={college} type="checkbox" className="accent-[var(--accent)]" />
                    {college}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="text-sm text-white/55">
              Registered for event
              <select name="eventId" defaultValue="" className={field}>
                <option value="">Any / not event-specific</option>
                {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
              </select>
            </label>

            <label className="text-sm text-white/55">
              Registration status
              <select name="registrationStatus" defaultValue="" className={field}>
                <option value="">Any status</option>
                <option value="registered">Registered</option>
                <option value="confirmed">Confirmed</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </label>
          </div>
        ) : null}

        {mode === "specific" ? (
          <div className="mt-5">
            <label className="relative block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, email, college, department…" className="min-h-11 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-sm text-white outline-none focus:border-[var(--accent)]" />
            </label>
            <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-white/[0.07]">
              {visibleProfiles.map((profile) => (
                <label key={profile.id} className="flex cursor-pointer items-start gap-3 border-b border-white/[0.05] p-3 last:border-b-0 hover:bg-white/[0.025]">
                  <input name="selectedProfileIds" value={profile.id} type="checkbox" className="mt-1 accent-[var(--accent)]" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-white">{profile.full_name || "Unnamed profile"}</span>
                    <span className="block truncate text-xs text-white/35">{profile.email} · {profile.year || "Year —"} · {profile.college || "College —"}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <div className="flex items-center gap-2"><Megaphone size={18} className="text-[var(--accent)]" /><h2 className="font-semibold">2. Compose message</h2></div>
        <div className="mt-4 grid gap-4">
          <label className="text-sm text-white/55">Announcement title<input name="title" required maxLength={120} className={field} placeholder="Hackathon registration deadline extended" /></label>
          <label className="text-sm text-white/55">Email subject<input name="subject" required maxLength={160} className={field} placeholder="[CLUB NAME] — Registration update" /></label>
          <label className="text-sm text-white/55">Message<textarea name="body" required rows={8} maxLength={12000} className={`${field} py-3`} placeholder="Write the announcement or update…" /></label>
        </div>
      </section>

      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
        <h2 className="font-semibold">3. Delivery channels</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 rounded-xl border border-white/[0.07] p-4">
            <input name="channels" value="announcement" type="checkbox" defaultChecked className="mt-1 accent-[var(--accent)]" />
            <Megaphone size={18} className="mt-0.5 text-[var(--accent)]" />
            <span><strong className="block text-sm text-white">In-platform announcement</strong><span className="mt-1 block text-xs leading-5 text-white/35">Appears in the selected students’ profile notifications.</span></span>
          </label>
          <label className="flex items-start gap-3 rounded-xl border border-white/[0.07] p-4">
            <input name="channels" value="email" type="checkbox" className="mt-1 accent-[var(--accent)]" />
            <Mail size={18} className="mt-0.5 text-[var(--accent)]" />
            <span><strong className="block text-sm text-white">Email</strong><span className="mt-1 block text-xs leading-5 text-white/35">Email delivery is disabled in this beta until Resend is configured; in-app announcements work now.</span></span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-5">
        <h2 className="font-semibold text-amber-100">4. Final confirmation</h2>
        <p className="mt-2 text-sm leading-6 text-white/40">Audience selection is resolved again on the server when you send. Type <strong className="text-white">SEND</strong> to prevent accidental broadcasts.</p>
        <input name="confirmation" required autoComplete="off" className={`${field} max-w-xs`} placeholder="Type SEND" />
      </section>

      {state.error ? <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{state.message}</p> : null}

      <button disabled={pending} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f] disabled:cursor-not-allowed disabled:opacity-60">
        <Send size={17} />{pending ? "Resolving audience and sending…" : "Publish / Send"}
      </button>
    </form>
  );
}
