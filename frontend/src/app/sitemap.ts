import type { MetadataRoute } from "next";
import { events, projects } from "@/data/mock";
import { getSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const publicRoutes = ["", "/about", "/events", "/projects", "/achievements", "/team", "/partners", "/sponsor", "/gallery", "/resources", "/join", "/contact", "/verify"];
  return [
    ...publicRoutes.map((route) => ({ url: `${base}${route}`, changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : 0.7 })),
    ...events.map((event) => ({ url: `${base}/events/${event.slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
