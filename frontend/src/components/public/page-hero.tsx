export function PageHero({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div className="tech-grid absolute inset-0 opacity-35" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p> : null}
        <h1 className="mt-3 max-w-4xl text-balance text-4xl font-semibold tracking-[-0.045em] text-white md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-white/52">{description}</p>
      </div>
    </section>
  );
}
