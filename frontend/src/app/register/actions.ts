"use server";
import { redirect } from "next/navigation";
import { apiFetch, setSessionToken } from "@/lib/api/server";
import { registerSchema } from "@/lib/validation/auth";
import type { AuthActionState } from "@/lib/action-states";
export async function registerAction(_previousState:AuthActionState,formData:FormData):Promise<AuthActionState>{
 const parsed=registerSchema.safeParse({fullName:formData.get("fullName"),email:formData.get("email"),password:formData.get("password"),college:formData.get("college"),department:formData.get("department"),year:formData.get("year")});
 if(!parsed.success)return{error:parsed.error.issues[0]?.message??"Check the registration form."};
 try{const data=await apiFetch<{token:string}>("/api/auth/register",{method:"POST",body:JSON.stringify(parsed.data)});await setSessionToken(data.token);}catch(error){return{error:error instanceof Error?error.message:"Registration failed."};}
 redirect("/profile?welcome=1");
}
