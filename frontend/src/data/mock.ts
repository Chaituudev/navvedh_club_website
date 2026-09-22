import type {
  Achievement,
  ClubMember,
  Event,
  GalleryAlbum,
  Partner,
  Project,
  ResourceItem,
} from "@/types/domain";

export const events: Event[] = [
  {
    id: "evt-dept-hack-2026",
    slug: "department-hackathon-2026",
    name: "Department Hackathon 2026",
    tagline: "One day. Real problems. Working solutions.",
    description:
      "A free, offline build sprint for CSE students to form teams, choose from multiple problem statements and ship a working prototype within the event window.",
    category: "Hackathon",
    status: "registration-open",
    dateLabel: "October 2026 · Date to be announced",
    venue: "AITRC Campus, Vita",
    mode: "Offline",
    eligibility: "CSE students of AITRC; exact year eligibility configurable by organizers.",
    registrationDeadline: "To be announced",
    teamSize: "3–4 members",
    maxParticipants: 200,
    isFeatured: true,
    isFree: true,
    tracks: [
      { name: "AI/ML", description: "Applied intelligence, automation and data-driven solutions." },
      { name: "Web & Cloud", description: "Modern web products, APIs, cloud-native and platform ideas." },
      { name: "Cybersecurity", description: "Security tooling, awareness, defensive systems and CTF-inspired builds." },
      { name: "Open Innovation", description: "Strong solutions that do not fit a predefined technology track." },
    ],
    schedule: [
      { time: "08:30", title: "Check-in & team confirmation" },
      { time: "09:15", title: "Opening briefing & problem release" },
      { time: "09:45", title: "Development begins" },
      { time: "14:00", title: "Midpoint review", description: "Mentor check-in and blocker escalation." },
      { time: "18:00", title: "Submission window" },
      { time: "19:00", title: "Final presentations" },
      { time: "20:15", title: "Results & recognition" },
    ],
    rules: [
      "Registration is free; there is no participation fee.",
      "Teams must stay within the configured team-size limit for this event.",
      "Projects must be substantially developed during the hackathon window unless a rule explicitly permits prior boilerplate.",
      "All submissions must include a working repository or equivalent source submission before the deadline.",
      "Organizer and judge decisions are final for the event.",
    ],
    faqs: [
      { question: "Is there a cash prize?", answer: "No cash prize is guaranteed. The event focuses on certificates, recognition and sponsor-provided benefits when available." },
      { question: "Is registration free?", answer: "Yes. The department-level hackathon is planned as a free event." },
      { question: "Can sponsors add rewards later?", answer: "Yes. Sponsored merchandise, credits, subscriptions, internships or cash awards can be added without changing the event structure." },
    ],
    recognition: [
      "Winner certificate",
      "Runner-up certificates",
      "Participation certificates",
      "Best Innovation",
      "Best Technical Implementation",
      "Best UI/UX",
      "Best Social Impact",
    ],
    announcements: ["Registration planning is in progress. Final date and problem statements will be published here."],
  },
  {
    id: "evt-ai-workshop-2026",
    slug: "ai-workshop-2026",
    name: "Applied AI Workshop",
    tagline: "From prompt to prototype.",
    description: "A practical session on building small AI-enabled applications with modern APIs and evaluation habits.",
    category: "AI/ML",
    status: "upcoming",
    dateLabel: "November 2026",
    venue: "CSE Lab, AITRC",
    mode: "Offline",
    eligibility: "AITRC students",
    isFree: true,
    tracks: [{ name: "AI/ML", description: "Hands-on application development." }],
    schedule: [{ time: "10:00", title: "Workshop begins" }, { time: "15:15", title: "Mini build challenge" }],
    rules: ["Bring a laptop if available.", "Follow the lab usage policy."],
    faqs: [{ question: "Do I need prior AI experience?", answer: "No. Basic programming familiarity is enough." }],
    recognition: ["Attendance certificate subject to eligibility"],
    announcements: [],
  },
  {
    id: "evt-coding-2026",
    slug: "coding-competition-2026",
    name: "CodeSprint #01",
    tagline: "Think fast. Code clean.",
    description: "A timed competitive programming contest covering implementation, logic and data structures.",
    category: "Competitive Programming",
    status: "upcoming",
    dateLabel: "December 2026",
    venue: "AITRC Campus",
    mode: "Offline",
    eligibility: "AITRC students",
    isFree: true,
    tracks: [{ name: "Competitive Programming", description: "DSA, problem solving and implementation." }],
    schedule: [{ time: "11:00", title: "Contest starts" }, { time: "13:00", title: "Contest ends" }],
    rules: ["Individual participation unless announced otherwise."],
    faqs: [],
    recognition: ["Top performer certificates", "Participation record"],
    announcements: [],
  },
  {
    id: "evt-intercollege-2027",
    slug: "intercollege-hackathon-2027",
    name: "Inter-College Hackathon 2027",
    tagline: "Built after proving the model locally.",
    description: "A future inter-college edition designed to scale the same event engine to external teams, partners, judges and larger logistics.",
    category: "Hackathon",
    status: "upcoming",
    dateLabel: "2027 · Planning roadmap",
    venue: "AITRC Campus",
    mode: "Offline",
    eligibility: "Inter-college eligibility to be announced",
    teamSize: "Configurable per event",
    isFree: true,
    tracks: [{ name: "Multi-track", description: "Tracks will be published with the event." }],
    schedule: [],
    rules: [],
    faqs: [],
    recognition: ["Awards & Recognition — details to be announced"],
    announcements: [],
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    slug: "campus-energy-monitor",
    name: "Campus Energy Monitor",
    description: "A dashboard concept for tracking lab energy usage and identifying abnormal consumption patterns.",
    category: "IoT",
    stack: ["Next.js", "PostgreSQL", "Sensors"],
    team: ["Student Team Alpha"],
    event: "Project Showcase",
  },
  {
    id: "proj-2",
    slug: "secure-note-lab",
    name: "Secure Note Lab",
    description: "A student-built security exercise exploring encrypted storage, access control and threat modelling.",
    category: "Cybersecurity",
    stack: ["TypeScript", "WebCrypto", "PostgreSQL"],
    team: ["Student Team Beta"],
    event: "Cybersecurity Session",
  },
  {
    id: "proj-3",
    slug: "vision-assist",
    name: "Vision Assist",
    description: "An accessibility prototype that combines computer vision and concise audio descriptions.",
    category: "AI/ML",
    stack: ["Python", "Computer Vision", "FastAPI"],
    team: ["Student Team Gamma"],
    award: "Featured prototype",
  },
];

export const achievements: Achievement[] = [
  { id: "ach-1", title: "Hackathon Finalist", category: "Hackathon", personOrTeam: "Student Team", year: 2026, description: "Placeholder record for a verified student competition achievement.", featured: true },
  { id: "ach-2", title: "Research Publication", category: "Research", personOrTeam: "CSE Student Group", year: 2026, description: "Placeholder record for a department research publication." },
  { id: "ach-3", title: "Open Source Contribution", category: "Open Source", personOrTeam: "CSE Contributor", year: 2026, description: "Placeholder record for a meaningful upstream contribution." },
];

export const members: ClubMember[] = [
  { id: "m-1", name: "Faculty Coordinator", role: "Faculty Coordinator", group: "Faculty" },
  { id: "m-2", name: "Student Lead", role: "President / Student Lead", group: "Core Committee", year: "Final Year" },
  { id: "m-3", name: "Technical Lead", role: "Technical Lead", group: "Core Committee", year: "Final Year" },
  { id: "m-4", name: "Event Lead", role: "Event Lead", group: "Core Committee", year: "Third / Final Year" },
];

export const partners: Partner[] = [
  { id: "p-1", name: "Partner slots open", level: "Technology Partner", shortName: "OPEN" },
  { id: "p-2", name: "Partner slots open", level: "Knowledge Partner", shortName: "OPEN" },
  { id: "p-3", name: "Partner slots open", level: "Community Partner", shortName: "OPEN" },
];

export const resources: ResourceItem[] = [
  { id: "r-1", title: "Git & GitHub Workshop Starter", category: "Git/GitHub", type: "Guide", description: "A concise starter guide for branching, pull requests and collaboration habits.", href: "" },
  { id: "r-2", title: "Web Development Roadmap", category: "Web Development", type: "Roadmap", description: "A maintainable learning path from web fundamentals to full-stack deployment.", href: "" },
  { id: "r-3", title: "Hackathon Pitch Template", category: "Hackathons", type: "Template", description: "A short structure for presenting problem, approach, demo, impact and next steps.", href: "" },
  { id: "r-4", title: "Research Reading Checklist", category: "Research", type: "Guide", description: "Questions to ask while reading papers and comparing claims, methods and evidence.", href: "" },
];

export const galleryAlbums: GalleryAlbum[] = [
  { id: "g-1", title: "Department Hackathon 2026", year: 2026, event: "Department Hackathon 2026", photoCount: 0, description: "Album will open after the event; no stock photography is used as a substitute." },
  { id: "g-2", title: "AI Workshop", year: 2026, event: "Applied AI Workshop", photoCount: 0, description: "Event photos will be curated into a focused album." },
  { id: "g-3", title: "CodeSprint", year: 2026, event: "CodeSprint #01", photoCount: 0, description: "Contest photos and winner moments will be added after verification." },
];

export function getEventBySlug(slug: string) {
  return events.find((event) => event.slug === slug);
}
