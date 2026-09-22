"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { apiFetch } from "@/lib/api/server";
import { requireAdmin } from "@/lib/auth/guards";
export async function adminUpdateProfileAction(formData:FormData){await requireAdmin("MANAGE_MEMBERS");const id=String(formData.get("id")??"");if(!id)return;try{await apiFetch(`/api/admin/users/${id}`,{method:"PATCH",body:JSON.stringify({fullName:String(formData.get("fullName")??""),mobile:String(formData.get("mobile")??""),college:String(formData.get("college")??""),department:String(formData.get("department")??""),year:String(formData.get("year")??""),isActive:String(formData.get("isActive"))==="true"})},true);revalidatePath("/admin/users");}catch{redirect(`/admin/users/${id}?error=update-failed`);}redirect(`/admin/users/${id}?saved=1`);}
