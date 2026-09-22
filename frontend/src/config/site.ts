import type { ClubStat } from "@/types/domain";

export const siteConfig = {
  clubName: "[CLUB NAME]",
  tagline: "Build. Learn. Compete. Innovate.",
  collegeName: "Adarsh Institute of Technology & Research Centre",
  collegeShortName: "AITRC",
  departmentName: "Department of Computer Science & Engineering",
  location: "Vita, Maharashtra",
  description:
    "The technical community of the Computer Science & Engineering Department at AITRC — built for students who learn by building, competing and sharing.",
  email: "cseclub@aitrc.example",
  accentHex: "#6EA8FE",
  socials: {
    github: "",
    linkedin: "",
    instagram: "",
  },
  stats: [
    { label: "Students", value: "200+", helper: "community reach" },
    { label: "Events", value: "10+", helper: "planned & completed" },
    { label: "Projects", value: "50+", helper: "student builds" },
    { label: "Partners", value: "—", helper: "open for collaboration" },
  ] satisfies ClubStat[],
} as const;

export const primaryNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Events", href: "/events" },
  { label: "Projects", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
  { label: "Team", href: "/team" },
  { label: "Partners", href: "/partners" },
  { label: "Gallery", href: "/gallery" },
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
] as const;
