import { PublicShell } from "@/components/layout/public-shell";
import { PageHero } from "@/components/public/page-hero";
import { CertificateVerifier } from "@/features/certificates/certificate-verifier";

export default async function VerifyPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const params = await searchParams;
  return <PublicShell><PageHero eyebrow="Certificate Verification" title="Verify a club-issued certificate." description="Each issued certificate can be checked against its public verification record without exposing private student account data."/><section className="px-4 py-12 sm:px-6"><CertificateVerifier initialId={params.id ?? ""}/></section></PublicShell>;
}
