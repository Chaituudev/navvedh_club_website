import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { ProjectsBrowser } from "@/features/projects/projects-browser";
import { projects } from "@/data/mock";

export default function ProjectsPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Projects" title="A permanent portfolio of what students build." description="Projects remain discoverable after workshops, contests and hackathons end, giving the department a living technical record instead of disposable event pages." />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProjectsBrowser projects={projects} />
      </section>
    </PublicShell>
  );
}
