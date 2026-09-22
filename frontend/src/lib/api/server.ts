import { cookies } from "next/headers";

const API_BASE = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");
const COOKIE_NAME = "club_session";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status = 500) { super(message); this.status = status; }
}

export function getApiBase() { return API_BASE; }
export function isApiConfigured() { return Boolean(process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === "development"); }

export async function getSessionToken() {
  return (await cookies()).get(COOKIE_NAME)?.value ?? "";
}

export async function setSessionToken(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionToken() {
  (await cookies()).delete(COOKIE_NAME);
}

export async function apiFetch<T>(path: string, init: RequestInit = {}, authenticated = false): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (authenticated) {
    const token = await getSessionToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  } catch {
    throw new ApiError("The backend API could not be reached. Start the Express server or check API_URL.", 503);
  }
  const text = await response.text();
  let body: any = {};
  if (text) { try { body = JSON.parse(text); } catch { body = { error: text }; } }
  if (!response.ok) throw new ApiError(body.error || `API request failed (${response.status}).`, response.status);
  return body as T;
}
