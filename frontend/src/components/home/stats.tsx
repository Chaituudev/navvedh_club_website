import { siteConfig } from "@/config/site";

export function Stats() {
  return (
    <section className="border-b border-white/[0.06] bg-black/10">
      <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
        {siteConfig.stats.map((stat, index) => (
          <div key={stat.label} className={`py-7 ${index % 2 ? "pl-5 sm:pl-7" : "pr-5 sm:pr-7"} ${index > 0 ? "lg:border-l lg:border-white/[0.06] lg:pl-7" : ""}`}>
            <div className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{stat.value}</div>
            <div className="mt-1 text-sm font-medium text-white/60">{stat.label}</div>
            <div className="mt-1 text-xs text-white/30">{stat.helper}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
