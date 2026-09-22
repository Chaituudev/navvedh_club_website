import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">{eyebrow}</p> : null}
        <h2 className="text-balance text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">{title}</h2>
        {description ? <p className="mt-4 max-w-xl text-pretty text-sm leading-7 text-white/55 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
