"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";
export async function createRecognitionAction(formData:FormData){await requireAdmin("MANAGE_CERTIFICATES");await apiFetch("/api/admin/recognitions",{method:"POST",body:JSON.stringify({userId:String(formData.get("userId")??""),eventId:String(formData.get("eventId")??""),type:String(formData.get("type")??"BADGE"),title:String(formData.get("title")??""),description:String(formData.get("description")??""),icon:String(formData.get("icon")??"award")})},true);revalidatePath("/admin/recognitions");revalidatePath("/profile");}
export async function revokeRecognitionAction(formData:FormData){await requireAdmin("MANAGE_CERTIFICATES");await apiFetch(`/api/admin/recognitions/${String(formData.get("id"))}/revoke`,{method:"PATCH"},true);revalidatePath("/admin/recognitions");revalidatePath("/profile");}
