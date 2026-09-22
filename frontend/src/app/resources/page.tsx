import { ArrowUpRight, BookOpen, Clock3 } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { resources } from "@/data/mock";

export default function ResourcesPage() {
  return (
    <PublicShell>
      <PageHero eyebrow="Resources" title="Useful material students can return to after an event." description="Roadmaps, slides, recordings, repositories, guides and templates are organized by domain and kept database-driven."/>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((item) => {
            const available = Boolean(item.href);
            const content = <>
              <div className="flex items-start justify-between">
                <BookOpen size={20} className="text-[var(--accent)]"/>
                {available ? <ArrowUpRight size={17} className="text-white/25 transition group-hover:text-white"/> : <Clock3 size={17} className="text-white/20"/>}
              </div>
              <div className="mt-5 text-xs uppercase tracking-[0.14em] text-white/35">{item.category} · {item.type}</div>
              <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-white/45">{item.description}</p>
              {!available ? <span className="mt-4 inline-block rounded-full border border-white/10 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/35">Publishing soon</span> : null}
            </>;

            return available ? (
              <a key={item.id} href={item.href} className="group rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 transition hover:border-white/[0.14]">{content}</a>
            ) : (
              <article key={item.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">{content}</article>
            );
          })}
        </div>
      </section>
    </PublicShell>
  );
}
