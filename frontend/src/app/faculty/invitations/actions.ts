"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireFaculty } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";
export async function createInvitationAction(formData:FormData){await requireFaculty();const data=await apiFetch<any>("/api/faculty/invitations",{method:"POST",body:JSON.stringify({eventId:String(formData.get("eventId")??""),guestName:String(formData.get("guestName")??""),guestDesignation:String(formData.get("guestDesignation")??""),guestOrganization:String(formData.get("guestOrganization")??""),guestEmail:String(formData.get("guestEmail")??""),subject:String(formData.get("subject")??""),purpose:String(formData.get("purpose")??""),customMessage:String(formData.get("customMessage")??""),eventDate:String(formData.get("eventDate")??""),eventTime:String(formData.get("eventTime")??""),venue:String(formData.get("venue")??"")})},true);redirect(`/faculty/invitations/${data.invitation._id}`)}
export async function updateInvitationStatusAction(formData:FormData){await requireFaculty();const id=String(formData.get("id")??"");await apiFetch(`/api/faculty/invitations/${id}/status`,{method:"PATCH",body:JSON.stringify({status:String(formData.get("status")??"draft")})},true);revalidatePath("/faculty/invitations");}
