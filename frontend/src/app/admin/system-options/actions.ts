"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireSuperAdmin } from "@/lib/auth/guards";
export async function createOptionAction(formData:FormData){await requireSuperAdmin();await apiFetch("/api/super-admin/system-options",{method:"POST",body:JSON.stringify({group:String(formData.get("group")??"EVENT_CATEGORY"),value:String(formData.get("value")??""),label:String(formData.get("label")??""),description:String(formData.get("description")??""),sortOrder:Number(formData.get("sortOrder")??0)})},true);revalidatePath("/admin/system-options");}
export async function toggleOptionAction(formData:FormData){await requireSuperAdmin();await apiFetch(`/api/super-admin/system-options/${String(formData.get("id"))}`,{method:"PATCH",body:JSON.stringify({isActive:String(formData.get("active"))==="true"})},true);revalidatePath("/admin/system-options");}
