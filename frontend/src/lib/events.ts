import type { Event, EventStatus } from "@/types/domain";

const statuses: EventStatus[] = ["upcoming", "registration-open", "registration-closed", "ongoing", "completed"];
function formatDate(value?: string | null) {
  if (!value) return "Date TBA";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date TBA";
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export function mapApiEvent(raw: any): Event {
  const status: EventStatus = statuses.includes(raw.status) ? raw.status : "upcoming";
  const mode: "Offline" | "Online" | "Hybrid" = raw.mode === "Online" || raw.mode === "Hybrid" ? raw.mode : "Offline";
  const teamSize = raw.teamMin && raw.teamMax ? (raw.teamMin === raw.teamMax ? `${raw.teamMin} member${raw.teamMin === 1 ? "" : "s"}` : `${raw.teamMin}–${raw.teamMax} members`) : undefined;
  return {
    id: String(raw._id ?? raw.id ?? ""), slug: raw.slug ?? "", name: raw.name ?? "Untitled Event", tagline: raw.tagline ?? "", description: raw.description ?? "",
    category: raw.category ?? "Other", status, dateLabel: formatDate(raw.startsAt), startAt: raw.startsAt ?? undefined, endAt: raw.endsAt ?? undefined,
    venue: raw.venue || "Venue TBA", mode, eligibility: raw.eligibility || "Eligibility details will be announced.",
    registrationDeadline: raw.registrationDeadline ? formatDate(raw.registrationDeadline) : undefined, teamSize, maxParticipants: raw.maxParticipants ?? undefined,
    isFree: raw.isFree ?? true, isArchived: Boolean(raw.isArchived),
    tracks: Array.isArray(raw.tracks) ? raw.tracks.map((track: string) => ({ name: track, description: "" })) : [],
    schedule: Array.isArray(raw.schedule) ? raw.schedule.map((item: any) => ({ time: item.time ?? "", title: item.label ?? item.title ?? "", description: item.detail ?? item.description ?? "" })) : [],
    rules: Array.isArray(raw.rules) ? raw.rules : [],
    faqs: Array.isArray(raw.faqs) ? raw.faqs.map((faq: any) => ({ question: faq.question ?? "", answer: faq.answer ?? "" })) : [],
    recognition: Array.isArray(raw.awards) ? raw.awards.map((award: any) => typeof award === "string" ? award : (award?.description ? `${award.title}: ${award.description}` : award?.title ?? "")).filter(Boolean) : [],
    announcements: [],
    winner: raw.winnerUser ? { id: String(raw.winnerUser._id ?? raw.winnerUser), name: raw.winnerUser.fullName ?? "Winner" } : undefined,
    runnerUp: raw.runnerUpUser ? { id: String(raw.runnerUpUser._id ?? raw.runnerUpUser), name: raw.runnerUpUser.fullName ?? "Runner-up" } : undefined,
    resultsPublished: Boolean(raw.resultsPublished),
    speakerName: raw.speakerName ?? "", speakerDesignation: raw.speakerDesignation ?? "", speakerOrganization: raw.speakerOrganization ?? "", speakerTopic: raw.speakerTopic ?? "", meetingLink: raw.meetingLink ?? "", facultyCoordinator: raw.facultyCoordinator ?? "",
  };
}
