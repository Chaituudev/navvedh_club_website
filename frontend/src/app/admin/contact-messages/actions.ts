"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireAdmin,requireSuperAdmin } from "@/lib/auth/guards";
export async function updateContactMessageStatusAction(formData:FormData){await requireAdmin("MANAGE_CONTACTS");const id=String(formData.get("id")??"");await apiFetch(`/api/admin/contact/${id}`,{method:"PATCH",body:JSON.stringify({status:String(formData.get("status")??"")})},true);revalidatePath("/admin/contact-messages");}
export async function broadcastContactMessageAction(formData:FormData){await requireSuperAdmin();const id=String(formData.get("id")??"");await apiFetch(`/api/super-admin/contact/${id}/broadcast`,{method:"POST",body:JSON.stringify({title:String(formData.get("title")??""),body:String(formData.get("body")??""),role:String(formData.get("role")??"")||undefined,years:formData.getAll("years").map(String),departments:formData.getAll("departments").map(String),userIds:formData.getAll("userIds").map(String)})},true);revalidatePath("/admin/contact-messages");revalidatePath("/announcements");}
