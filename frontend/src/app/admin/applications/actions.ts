"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireAdmin } from "@/lib/auth/guards";
export async function updateClubApplicationStatusAction(formData:FormData){await requireAdmin();const id=String(formData.get("id")??"");const status=String(formData.get("status")??"");if(!id)return;await apiFetch(`/api/admin/applications/${id}`,{method:"PATCH",body:JSON.stringify({status})},true);revalidatePath("/admin/applications");}
