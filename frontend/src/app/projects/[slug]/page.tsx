import { notFound } from "next/navigation";
import { GitBranch, ExternalLink } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { projects } from "@/data/mock";

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <PublicShell>
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">{project.category}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-white md:text-5xl">{project.name}</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-white/52">{project.description}</p>
        <div className="mt-8 aspect-[16/7] rounded-3xl border border-white/[0.08] bg-[linear-gradient(135deg,rgba(110,168,254,.12),rgba(255,255,255,.015))]" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><h2 className="text-xl font-semibold">Project record</h2><p className="mt-3 text-sm leading-7 text-white/48">This permanent project record is designed to preserve verified team members, event association, screenshots, repository links and awards as the club portfolio grows.</p></div>
          <aside className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><h2 className="font-semibold">Technology stack</h2><div className="mt-4 flex flex-wrap gap-2">{project.stack.map((tech) => <span key={tech} className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/55">{tech}</span>)}</div><div className="mt-6 space-y-3">{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent)]"><GitBranch size={16}/>GitHub repository</a> : null}{project.demoUrl ? <a href={project.demoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-[var(--accent)]"><ExternalLink size={16}/>Live demo</a> : null}</div></aside>
        </div>
      </section>
    </PublicShell>
  );
}
