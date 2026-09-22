import { Images } from "lucide-react";
import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { galleryAlbums } from "@/data/mock";

export default function GalleryPage() {
  return <PublicShell><PageHero eyebrow="Gallery" title="Event memories, organized as albums." description="Photos are grouped by event so the gallery remains useful years later instead of becoming an unstructured image dump."/><section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{galleryAlbums.map((album) => <article key={album.id} className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"><div className="grid aspect-[16/10] place-items-center bg-[linear-gradient(135deg,rgba(110,168,254,.10),rgba(255,255,255,.01))]"><Images size={42} className="text-white/15"/></div><div className="p-5"><div className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{album.year} · {album.photoCount} photos</div><h2 className="mt-2 text-xl font-semibold">{album.title}</h2><p className="mt-3 text-sm leading-6 text-white/45">{album.description}</p></div></article>)}</div></section></PublicShell>;
}
