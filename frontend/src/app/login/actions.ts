"use server";
import { redirect } from "next/navigation";
import { apiFetch, clearSessionToken, setSessionToken } from "@/lib/api/server";
import { signInSchema } from "@/lib/validation/auth";
import type { AuthActionState } from "@/lib/action-states";

function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/profile";
}

export async function signInAction(_previousState: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = signInSchema.safeParse({ email: formData.get("email"), password: formData.get("password"), next: formData.get("next") ?? undefined });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid sign-in details." };
  let roles: string[] = [];
  try {
    const data = await apiFetch<{ token: string; user: { roles: string[] } }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email: parsed.data.email, password: parsed.data.password }) });
    await setSessionToken(data.token);
    roles = data.user.roles ?? [];
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Sign in failed." };
  }

  const requested = safeNext(formData.get("next"));
  if (requested !== "/profile") redirect(requested);
  if (roles.includes("SUPER_ADMIN") || roles.includes("ADMIN")) redirect("/admin");
  if (roles.includes("FACULTY")) redirect("/faculty");
  redirect("/profile");
}

export async function signOutAction() { await clearSessionToken(); redirect("/"); }
