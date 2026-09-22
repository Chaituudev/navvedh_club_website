import { ArrowRight, CodeXml, Cpu, GitBranch, SquareTerminal } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";
import { siteConfig } from "@/config/site";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/[0.06]">
      <div className="tech-grid absolute inset-0 -z-20 opacity-55" aria-hidden="true" />
      <div className="glow-orb absolute left-1/2 top-10 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-[rgba(110,168,254,.18)]" aria-hidden="true" />
      <div className="mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-24">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/20 px-3 py-1.5 text-xs font-medium text-white/55 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Official technical community · AITRC CSE
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            {siteConfig.clubName}
          </h1>
          <p className="mt-5 text-xl font-medium tracking-[-0.02em] text-[var(--accent)] sm:text-2xl">{siteConfig.tagline}</p>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-white/55 sm:text-lg">
            We bring developers, builders and innovators together through hackathons, workshops, competitions and real-world projects.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/events">Explore Events <ArrowRight className="ml-2" size={17} /></ButtonLink>
            <ButtonLink href="/join" variant="secondary">Join the Club</ButtonLink>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:mx-0">
          <div className="rounded-3xl border border-white/[0.09] bg-[#0a0e14]/85 p-3 shadow-2xl shadow-black/40 backdrop-blur">
            <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-3 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" /><span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              <span className="ml-3 font-mono text-[11px] text-white/30">community.ts</span>
            </div>
            <div className="space-y-4 p-4 font-mono text-sm leading-7">
              <p><span className="text-fuchsia-300">const</span> <span className="text-blue-300">club</span> <span className="text-white/50">=</span> <span className="text-white/50">{'{'}</span></p>
              <p className="pl-5"><span className="text-white/55">learn:</span> <span className="text-emerald-300">true</span>,</p>
              <p className="pl-5"><span className="text-white/55">build:</span> <span className="text-emerald-300">true</span>,</p>
              <p className="pl-5"><span className="text-white/55">compete:</span> <span className="text-emerald-300">true</span>,</p>
              <p className="pl-5"><span className="text-white/55">connect:</span> <span className="text-emerald-300">true</span>,</p>
              <p className="pl-5"><span className="text-white/55">innovate:</span> <span className="text-emerald-300">true</span></p>
              <p className="text-white/50">{'}'}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[CodeXml, Cpu, GitBranch, SquareTerminal].map((Icon, index) => <div key={index} className="grid aspect-square place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.025] text-white/35"><Icon size={20} /></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
