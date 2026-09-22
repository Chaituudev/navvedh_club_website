"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireUser } from "@/lib/auth/guards";
import { profileSchema } from "@/lib/validation/auth";
import type { ProfileActionState } from "@/lib/action-states";

export async function updateProfileAction(_previousState: ProfileActionState, formData: FormData): Promise<ProfileActionState> {
  const parsed = profileSchema.safeParse({
    fullName: formData.get("fullName"), mobile: formData.get("mobile") ?? "", college: formData.get("college"),
    department: formData.get("department"), year: formData.get("year"), prnStudentId: formData.get("prnStudentId") ?? "",
    skills: formData.get("skills") ?? "", githubUrl: formData.get("githubUrl") ?? "", linkedinUrl: formData.get("linkedinUrl") ?? "",
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check your profile details." };
  await requireUser();
  try {
    await apiFetch("/api/profile", {
      method: "PATCH",
      body: JSON.stringify({ ...parsed.data, skills: parsed.data.skills ? parsed.data.skills.split(",").map(v => v.trim()).filter(Boolean).slice(0, 30) : [], emailNotifications: formData.get("emailNotifications") === "on" }),
    }, true);
    revalidatePath("/profile");
    return { message: "Profile updated." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Profile update failed." };
  }
}
