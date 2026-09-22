import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { JoinClubForm } from "@/features/forms/join-club-form";

export default function JoinPage() {
  return <PublicShell><PageHero eyebrow="Join Club" title="Join to contribute, not just collect a title." description="Applications help the committee understand what you can do, what you want to learn and where you can reliably contribute."/><section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8"><JoinClubForm/></section></PublicShell>;
}
