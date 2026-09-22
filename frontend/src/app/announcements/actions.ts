"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";
export async function markAnnouncementReadAction(formData:FormData){await requireUser("/announcements");const id=String(formData.get("id")??"");if(!id)return;await apiFetch(`/api/announcements/${id}/read`,{method:"PATCH"},true);revalidatePath("/announcements");revalidatePath("/profile");}
export async function markAllAnnouncementsReadAction(){await requireUser("/announcements");await apiFetch("/api/announcements/read/all",{method:"PATCH"},true);revalidatePath("/announcements");revalidatePath("/profile");}
