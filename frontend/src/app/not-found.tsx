import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="tech-grid grid min-h-screen place-items-center px-4 py-10 text-center">
      <section className="max-w-xl">
        <div className="font-mono text-sm text-[var(--accent)]">404</div>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Page not found.</h1>
        <p className="mt-4 text-sm leading-7 text-white/45">The link may be outdated, unpublished or typed incorrectly.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f]">Return home</Link>
      </section>
    </main>
  );
}
