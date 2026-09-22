"use server";
import { z } from "zod";
import { apiFetch } from "@/lib/api/server";
import type { JoinActionState } from "@/lib/action-states";

const schema = z.object({
  fullName: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), phone: z.string().trim().max(20).optional(),
  year: z.string().trim().min(1).max(30), department: z.string().trim().min(2).max(120), skills: z.string().trim().max(1000).optional(),
  preferredDomain: z.string().trim().max(100).optional(), github: z.string().trim().max(300).optional(), linkedinPortfolio: z.string().trim().max(300).optional(),
  preferredTeam: z.string().min(1), motivation: z.string().trim().min(10).max(3000), website: z.string().max(0).optional(),
});

export async function submitJoinApplication(_previous: JoinActionState, formData: FormData): Promise<JoinActionState> {
  const parsed = schema.safeParse({
    fullName: formData.get("fullName"), email: formData.get("email"), phone: formData.get("phone") ?? "", year: formData.get("year"),
    department: formData.get("department"), skills: formData.get("skills") ?? "", preferredDomain: formData.get("preferredDomain") ?? "",
    github: formData.get("github") ?? "", linkedinPortfolio: formData.get("linkedinPortfolio") ?? "", preferredTeam: formData.get("preferredTeam"),
    motivation: formData.get("motivation"), website: formData.get("website") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the application." };
  if (parsed.data.website) return { message: "Application received." };
  try {
    await apiFetch("/api/forms/join", { method: "POST", body: JSON.stringify({
      fullName: parsed.data.fullName, email: parsed.data.email, phone: parsed.data.phone, year: parsed.data.year, department: parsed.data.department,
      skills: parsed.data.skills, preferredDomain: parsed.data.preferredDomain, githubUrl: parsed.data.github, linkedinUrl: parsed.data.linkedinPortfolio,
      portfolioUrl: "", preferredTeam: parsed.data.preferredTeam, motivation: parsed.data.motivation,
    }) });
    return { message: "Application submitted successfully." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Application failed." };
  }
}
