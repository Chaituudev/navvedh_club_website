import Link from "next/link";
import { ExternalLink, GitBranch, Images } from "lucide-react";
import { primaryNav, siteConfig } from "@/config/site";

export function Footer() {
  const socials = [
    { label: "GitHub", href: siteConfig.socials.github, Icon: GitBranch },
    { label: "LinkedIn", href: siteConfig.socials.linkedin, Icon: ExternalLink },
    { label: "Instagram", href: siteConfig.socials.instagram, Icon: Images },
  ].filter((item) => Boolean(item.href));

  return (
    <footer className="border-t border-white/[0.07] bg-[#07090d]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div className="max-w-md">
          <div className="mb-4 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] font-mono text-xs font-bold text-[var(--accent)]">CSE</span>
            <div>
              <div className="font-semibold text-white">{siteConfig.clubName}</div>
              <div className="text-xs text-white/40">{siteConfig.tagline}</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-white/45">{siteConfig.departmentName}<br />{siteConfig.collegeName}, {siteConfig.location}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">
            {primaryNav.slice(1, 9).map((item) => <Link key={item.href} href={item.href} className="text-sm text-white/45 hover:text-white">{item.label}</Link>)}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Community</h3>
          {socials.length ? (
            <div className="mt-4 flex gap-2">
              {socials.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/55 hover:text-white"><Icon size={18}/></a>)}
            </div>
          ) : <p className="mt-4 text-sm text-white/35">Official social links will appear here once configured.</p>}
          <Link href="/sponsor" className="mt-5 inline-block text-sm font-medium text-[var(--accent)] hover:underline">Partner with the club →</Link>
        </div>
      </div>
      <div className="border-t border-white/[0.06] px-4 py-5 text-center text-xs text-white/35">© {new Date().getFullYear()} {siteConfig.clubName}. Department of CSE, AITRC.</div>
    </footer>
  );
}
