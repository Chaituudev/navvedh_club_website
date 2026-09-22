"use server";
import { z } from "zod";
import { apiFetch } from "@/lib/api/server";
import type { ContactActionState } from "@/lib/action-states";

const schema = z.object({ name: z.string().trim().min(2).max(100), email: z.string().trim().toLowerCase().email(), topic: z.string().min(1).max(80), message: z.string().trim().min(10).max(5000), website: z.string().max(0).optional() });

export async function submitContactMessage(_previous: ContactActionState, formData: FormData): Promise<ContactActionState> {
  const parsed = schema.safeParse({ name: formData.get("name"), email: formData.get("email"), topic: formData.get("topic"), message: formData.get("message"), website: formData.get("website") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the contact form." };
  if (parsed.data.website) return { message: "Message received." };
  try {
    await apiFetch("/api/forms/contact", { method: "POST", body: JSON.stringify(parsed.data) });
    return { message: "Message sent successfully." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Message failed." };
  }
}
