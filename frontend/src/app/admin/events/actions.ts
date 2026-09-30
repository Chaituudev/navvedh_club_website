"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";

function optionalNumber(value:FormDataEntryValue|null){const t=typeof value==="string"?value.trim():"";if(!t)return null;const n=Number(t);return Number.isFinite(n)?n:null;}
function optionalDate(value:FormDataEntryValue|null){const t=typeof value==="string"?value.trim():"";if(!t)return null;const d=new Date(t);return Number.isNaN(d.getTime())?null:d.toISOString();}

export async function createEventAction(formData:FormData){await requireAdmin("MANAGE_EVENTS");const name=String(formData.get("name")??"").trim();if(!name)redirect("/admin/events?error=Event name is required");await apiFetch("/api/admin/events",{method:"POST",body:JSON.stringify({name,slug:String(formData.get("slug")??"").trim(),tagline:String(formData.get("tagline")??"").trim(),description:String(formData.get("description")??"").trim(),category:String(formData.get("category")??"Other"),status:String(formData.get("status")??"upcoming"),startsAt:optionalDate(formData.get("startsAt")),endsAt:optionalDate(formData.get("endsAt")),registrationDeadline:optionalDate(formData.get("registrationDeadline")),venue:String(formData.get("venue")??"").trim(),mode:String(formData.get("mode")??"Offline"),eligibility:String(formData.get("eligibility")??"").trim(),teamMin:optionalNumber(formData.get("teamMin"))??1,teamMax:optionalNumber(formData.get("teamMax"))??1,maxParticipants:optionalNumber(formData.get("maxParticipants")),isFree:formData.get("isFree")==="on",isHackathon:formData.get("isHackathon")==="on",isPublished:formData.get("isPublished")==="on",tracks:String(formData.get("tracks")??"").split(",").map(v=>v.trim()).filter(Boolean),rules:String(formData.get("rules")??"").split("\n").map(v=>v.trim()).filter(Boolean),speakerName:String(formData.get("speakerName")??"").trim(),speakerDesignation:String(formData.get("speakerDesignation")??"").trim(),speakerOrganization:String(formData.get("speakerOrganization")??"").trim(),speakerTopic:String(formData.get("speakerTopic")??"").trim(),guestEmail:String(formData.get("guestEmail")??"").trim(),meetingLink:String(formData.get("meetingLink")??"").trim(),facultyCoordinator:String(formData.get("facultyCoordinator")??"").trim()})},true);revalidatePath("/events");revalidatePath("/admin/events");redirect("/admin/events?created=1");}

export async function updateEventStatusAction(formData:FormData){await requireAdmin("MANAGE_EVENTS");const id=String(formData.get("eventId")??"");await apiFetch(`/api/admin/event-management/${id}/status`,{method:"PATCH",body:JSON.stringify({status:String(formData.get("status")??"")})},true);revalidatePath("/admin/events");revalidatePath("/events");}
export async function toggleEventPublishAction(formData:FormData){await requireAdmin("MANAGE_EVENTS");const id=String(formData.get("eventId")??"");await apiFetch(`/api/admin/event-management/${id}/publish`,{method:"PATCH",body:JSON.stringify({isPublished:String(formData.get("publish"))==="true"})},true);revalidatePath("/admin/events");revalidatePath("/events");}
export async function archiveEventAction(formData:FormData){await requireAdmin("MANAGE_EVENTS");const id=String(formData.get("eventId")??"");await apiFetch(`/api/admin/event-management/${id}/archive`,{method:"PATCH"},true);revalidatePath("/admin/events");revalidatePath("/events");revalidatePath("/profile");}
export async function restoreEventAction(formData:FormData){await requireAdmin("MANAGE_EVENTS");const id=String(formData.get("eventId")??"");await apiFetch(`/api/admin/event-management/${id}/restore`,{method:"PATCH"},true);revalidatePath("/admin/events");}
export async function saveEventResultsAction(formData:FormData){
  await requireAdmin("MANAGE_RESULTS");
  const id=String(formData.get("eventId")??"");
  const titles=formData.getAll("additionalAwardTitle");
  const recipients=formData.getAll("additionalAwardRecipientId");
  const additionalAwards=titles.map((title,index)=>({
    title:String(title??"").trim(),
    recipientUserId:String(recipients[index]??"").trim(),
  })).filter((award)=>award.title&&award.recipientUserId);

  try{
    await apiFetch(`/api/admin/event-management/${id}/results`,{
      method:"POST",
      body:JSON.stringify({
        winnerUserId:String(formData.get("winnerUserId")??""),
        runnerUpUserId:String(formData.get("runnerUpUserId")??""),
        winnerRecognition:String(formData.get("winnerRecognition")??""),
        runnerUpRecognition:String(formData.get("runnerUpRecognition")??""),
        additionalAwards,
        resultsPublished:true
      })
    },true);
  }catch(e){
    redirect(`/admin/events?error=${encodeURIComponent(e instanceof Error?e.message:"Could not save results")}`)
  }
  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/profile");
  redirect("/admin/events?results=1");
}
