"use client";

import { useMemo, useState } from "react";
import { ProjectCard } from "@/features/projects/project-card";
import type { Project } from "@/types/domain";

const categories: Array<"All" | Project["category"]> = [
  "All",
  "AI/ML",
  "Web",
  "App",
  "Game Development",
  "Cybersecurity",
  "IoT",
  "Research",
  "Other",
];

export function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<(typeof categories)[number]>("All");

  const visibleProjects = useMemo(
    () => active === "All" ? projects : projects.filter((project) => project.category === active),
    [active, projects],
  );

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2" aria-label="Filter projects by category">
        {categories.map((category) => {
          const selected = category === active;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(category)}
              className={`rounded-full border px-3 py-1.5 text-xs transition ${selected ? "border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]" : "border-white/10 text-white/45 hover:border-white/20 hover:text-white/75"}`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {visibleProjects.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 text-center text-sm text-white/45">
          No published projects are available in this category yet.
        </div>
      )}
    </>
  );
}
