"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api/server";
import { requireUser } from "@/lib/auth/guards";

function fail(slug:string,message:string){redirect(`/hackathons/${slug}?error=${encodeURIComponent(message)}`);}

export async function createTeamAction(formData:FormData){
  const slug=String(formData.get("slug")??"");const eventId=String(formData.get("eventId")??"");const name=String(formData.get("name")??"").trim();
  await requireUser(`/hackathons/${slug}`);
  try{await apiFetch(`/api/hackathons/${eventId}/teams`,{method:"POST",body:JSON.stringify({name})},true);}catch(e){fail(slug,e instanceof Error?e.message:"Could not create team.");}
  revalidatePath(`/hackathons/${slug}`);redirect(`/hackathons/${slug}?saved=team-created`);
}

export async function joinTeamAction(formData:FormData){
  const slug=String(formData.get("slug")??"");const eventId=String(formData.get("eventId")??"");const inviteCode=String(formData.get("inviteCode")??"").trim();
  await requireUser(`/hackathons/${slug}`);
  try{await apiFetch(`/api/hackathons/${eventId}/teams/join`,{method:"POST",body:JSON.stringify({inviteCode})},true);}catch(e){fail(slug,e instanceof Error?e.message:"Could not join team.");}
  revalidatePath(`/hackathons/${slug}`);redirect(`/hackathons/${slug}?saved=team-joined`);
}

export async function confirmTeamAction(formData:FormData){
  const slug=String(formData.get("slug")??"");const eventId=String(formData.get("eventId")??"");const teamId=String(formData.get("teamId")??"");
  await requireUser(`/hackathons/${slug}`);
  try{await apiFetch(`/api/hackathons/${eventId}/teams/${teamId}/confirm`,{method:"POST"},true);}catch(e){fail(slug,e instanceof Error?e.message:"Could not confirm team.");}
  revalidatePath(`/hackathons/${slug}`);redirect(`/hackathons/${slug}?saved=team-confirmed`);
}

export async function selectProblemAction(formData:FormData){
  const slug=String(formData.get("slug")??"");const eventId=String(formData.get("eventId")??"");const teamId=String(formData.get("teamId")??"");const problemId=String(formData.get("problemId")??"");
  await requireUser(`/hackathons/${slug}`);
  try{await apiFetch(`/api/hackathons/${eventId}/teams/${teamId}/problem`,{method:"POST",body:JSON.stringify({problemId})},true);}catch(e){fail(slug,e instanceof Error?e.message:"Could not select problem.");}
  revalidatePath(`/hackathons/${slug}`);redirect(`/hackathons/${slug}?saved=problem-selected`);
}

export async function saveSubmissionAction(formData:FormData){
  const slug=String(formData.get("slug")??"");const eventId=String(formData.get("eventId")??"");const teamId=String(formData.get("teamId")??"");
  await requireUser(`/hackathons/${slug}`);
  const payload={projectTitle:String(formData.get("projectTitle")??""),shortDescription:String(formData.get("shortDescription")??""),detailedDescription:String(formData.get("detailedDescription")??""),githubUrl:String(formData.get("githubUrl")??""),liveDemoUrl:String(formData.get("liveDemoUrl")??""),videoDemoUrl:String(formData.get("videoDemoUrl")??""),pitchDeckUrl:String(formData.get("pitchDeckUrl")??""),technologyStack:String(formData.get("technologyStack")??"").split(",").map(v=>v.trim()).filter(Boolean),finalize:String(formData.get("finalize")??"")==="1"};
  try{await apiFetch(`/api/hackathons/${eventId}/teams/${teamId}/submission`,{method:"PUT",body:JSON.stringify(payload)},true);}catch(e){fail(slug,e instanceof Error?e.message:"Could not save submission.");}
  revalidatePath(`/hackathons/${slug}`);redirect(`/hackathons/${slug}?saved=${payload.finalize?"final-submission":"draft-saved"}`);
}
