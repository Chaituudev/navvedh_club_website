import { redirect } from "next/navigation";
import { apiFetch, clearSessionToken } from "@/lib/api/server";

export type ClubUser = {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  college: string;
  department: string;
  year: string;
  prnStudentId: string;
  skills: string[];
  githubUrl: string;
  linkedinUrl: string;
  profileImageUrl: string;
  emailNotifications: boolean;
  isActive: boolean;
  roles: Array<"SUPER_ADMIN" | "ADMIN" | "FACULTY" | "STUDENT">;
  adminPermissions: string[];
};

export async function getCurrentUser(): Promise<ClubUser | null> {
  try {
    const { user } = await apiFetch<{ user: ClubUser }>("/api/auth/me", {}, true);
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(next = "/profile") {
  const user = await getCurrentUser();
  if (!user) {
    await clearSessionToken();
    redirect(`/login?next=${encodeURIComponent(next)}`);
    throw new Error("Redirect failed");
  }
  return { user };
}

export async function requireAdmin(permission?: string) {
  const { user } = await requireUser("/admin");
  const isSuper = user.roles.includes("SUPER_ADMIN");
  const isAdmin = user.roles.includes("ADMIN");
  if (!isSuper && !isAdmin) redirect("/admin/login?error=not-authorized");
  if (permission && !isSuper && !user.adminPermissions.includes(permission)) redirect("/admin?error=permission");
  return { user };
}

export async function requireSuperAdmin() {
  const { user } = await requireUser("/admin/access");
  if (!user.roles.includes("SUPER_ADMIN")) redirect("/admin?error=super-admin-required");
  return { user };
}

export async function requireFaculty() {
  const { user } = await requireUser("/faculty");
  if (!user.roles.some((role) => role === "FACULTY" || role === "SUPER_ADMIN")) redirect("/profile");
  return { user };
}
