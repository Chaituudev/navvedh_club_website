"use server";
import { redirect } from "next/navigation";
import { apiFetch, setSessionToken, clearSessionToken } from "@/lib/api/server";
import { signInSchema } from "@/lib/validation/auth";
import type { AuthActionState } from "@/lib/action-states";
export async function adminSignInAction(_previousState:AuthActionState,formData:FormData):Promise<AuthActionState>{
 const parsed=signInSchema.safeParse({email:formData.get("email"),password:formData.get("password"),next:"/admin"});if(!parsed.success)return{error:parsed.error.issues[0]?.message??"Invalid sign-in details."};
 try{const data=await apiFetch<{token:string;user:{roles:string[]}}>("/api/auth/login",{method:"POST",body:JSON.stringify({email:parsed.data.email,password:parsed.data.password})});if(!data.user.roles.some(r=>r==="ADMIN"||r==="SUPER_ADMIN")){await clearSessionToken();return{error:"This account does not have administrator access."};}await setSessionToken(data.token);}catch(error){return{error:error instanceof Error?error.message:"Admin sign in failed."};}redirect("/admin");
}
