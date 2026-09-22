import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <div className="min-h-screen bg-[#070a0f] lg:flex"><AdminSidebar user={user}/><div className="min-w-0 flex-1">{children}</div></div>;
}
