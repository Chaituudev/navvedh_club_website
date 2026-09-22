"use server";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireSuperAdmin } from "@/lib/auth/guards";

export async function updateAccessAction(formData: FormData) {
  await requireSuperAdmin();
  const id=String(formData.get("id")??"");
  const role=String(formData.get("role")??"STUDENT");
  const adminPermissions=formData.getAll("adminPermissions").map(String);
  const isActive=String(formData.get("isActive")??"true")==="true";
  await apiFetch(`/api/super-admin/access/${id}`,{method:"PATCH",body:JSON.stringify({role,adminPermissions,isActive})},true);
  revalidatePath("/admin/access");
}
