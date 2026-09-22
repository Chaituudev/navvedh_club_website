"use server";
import { redirect } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api/server";
import { requireUser } from "@/lib/auth/guards";
import type { EventRegistrationState } from "@/lib/action-states";

export async function registerForEventAction(_previous: EventRegistrationState, formData: FormData): Promise<EventRegistrationState> {
  const slug = String(formData.get("slug") ?? "");
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) return { error: "Invalid event." };
  await requireUser(`/events/${slug}`);
  try {
    const { event } = await apiFetch<any>(`/api/events/${slug}`);
    await apiFetch(`/api/events/${event._id}/register`, { method: "POST" }, true);
  } catch (error) {
    if (error instanceof ApiError && error.status === 409 && error.message.toLowerCase().includes("already")) redirect("/profile?registered=already");
    return { error: error instanceof Error ? error.message : "Registration failed." };
  }
  redirect("/profile?registered=1");
}
