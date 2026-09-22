import Link from "next/link";
import { ArrowUpRight, ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/types/domain";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 transition hover:border-white/[0.14] hover:bg-white/[0.04]">
      <div className="mb-5 aspect-[16/9] rounded-xl border border-white/[0.06] bg-[linear-gradient(135deg,rgba(110,168,254,0.12),rgba(255,255,255,0.015))] p-5">
        <div className="flex h-full items-end justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--accent)]">{project.category}</span>
          <span className="text-xs text-white/30">project://{project.slug}</span>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-white">{project.name}</h3>
      <p className="mt-3 text-sm leading-6 text-white/50">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-xs text-white/50">{tech}</span>)}</div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">View project <ArrowUpRight size={15} /></Link>
        {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><GitBranch size={16} />GitHub</a> : null}
        {project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"><ExternalLink size={16} />Demo</a> : null}
      </div>
    </article>
  );
}
