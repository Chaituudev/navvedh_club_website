export type EventStatus = "upcoming" | "registration-open" | "registration-closed" | "ongoing" | "completed";
export type EventCategory = string;

export interface ClubStat { label: string; value: string; helper?: string; }
export interface EventTrack { name: string; description: string; }
export interface EventScheduleItem { time: string; title: string; description?: string; }
export interface FaqItem { question: string; answer: string; }

export interface Event {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  status: EventStatus;
  dateLabel: string;
  startAt?: string;
  endAt?: string;
  venue: string;
  mode: "Offline" | "Online" | "Hybrid";
  eligibility: string;
  registrationDeadline?: string;
  teamSize?: string;
  maxParticipants?: number;
  isFeatured?: boolean;
  isFree?: boolean;
  isArchived?: boolean;
  tracks: EventTrack[];
  schedule: EventScheduleItem[];
  rules: string[];
  faqs: FaqItem[];
  recognition: string[];
  announcements: string[];
  winner?: { id: string; name: string };
  runnerUp?: { id: string; name: string };
  resultsPublished?: boolean;
  speakerName?: string;
  speakerDesignation?: string;
  speakerOrganization?: string;
  speakerTopic?: string;
  meetingLink?: string;
  facultyCoordinator?: string;
}

export interface Project { id: string; slug: string; name: string; description: string; category: "AI/ML" | "Web" | "App" | "Game Development" | "Cybersecurity" | "IoT" | "Research" | "Other"; stack: string[]; team: string[]; event?: string; award?: string; githubUrl?: string; demoUrl?: string; }
export interface Achievement { id: string; title: string; category: string; personOrTeam: string; year: number; description: string; featured?: boolean; }
export interface ClubMember { id: string; name: string; role: string; group: "Faculty" | "Core Committee" | "Domain Team"; year?: string; githubUrl?: string; linkedinUrl?: string; }
export interface Partner { id: string; name: string; level: string; shortName: string; }
export interface ResourceItem { id: string; title: string; category: string; type: "Roadmap" | "Slides" | "Recording" | "Repository" | "Guide" | "Template" | "Tool"; description: string; href: string; }
export interface GalleryAlbum { id: string; title: string; year: number; event: string; photoCount: number; description: string; }
