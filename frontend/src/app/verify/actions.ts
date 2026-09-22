"use server";
import { z } from "zod";
import { apiFetch } from "@/lib/api/server";
import type { CertificateLookupState } from "@/lib/action-states";

const schema = z.object({ certificateId: z.string().trim().min(6).max(120) });
export async function verifyCertificateAction(_previous: CertificateLookupState, formData: FormData): Promise<CertificateLookupState> {
  const parsed = schema.safeParse({ certificateId: formData.get("certificateId") });
  if (!parsed.success) return { error: "Enter a valid certificate ID." };
  try {
    const { certificate } = await apiFetch<any>(`/api/certificates/verify/${encodeURIComponent(parsed.data.certificateId)}`);
    return { result: certificate };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Certificate verification failed." };
  }
}
