"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";
export async function issueCertificateAction(formData:FormData){await requireAdmin("MANAGE_CERTIFICATES");try{await apiFetch("/api/admin/certificates",{method:"POST",body:JSON.stringify({userId:String(formData.get("userId")??""),eventId:String(formData.get("eventId")??""),certificateType:String(formData.get("certificateType")??"Participation"),awardName:String(formData.get("awardName")??""),recognitionType:String(formData.get("recognitionType")??"")||undefined,recognitionTitle:String(formData.get("recognitionTitle")??""),recognitionDescription:String(formData.get("recognitionDescription")??"")})},true);}catch(e){redirect(`/admin/certificates?error=${encodeURIComponent(e instanceof Error?e.message:"Certificate generation failed")}`)}revalidatePath("/admin/certificates");revalidatePath("/profile");redirect("/admin/certificates?issued=1");}
export async function revokeCertificateAction(formData:FormData){await requireAdmin("MANAGE_CERTIFICATES");await apiFetch(`/api/admin/certificates/${String(formData.get("id"))}/revoke`,{method:"PATCH",body:JSON.stringify({reason:"Revoked by administrator."})},true);revalidatePath("/admin/certificates");}
