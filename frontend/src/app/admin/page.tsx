import Link from "next/link";
import { CalendarDays, FileBadge, LayoutDashboard, Mail, UsersRound, Boxes, Award } from "lucide-react";
import { requireAdmin } from "@/lib/auth/guards";
import { apiFetch } from "@/lib/api/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await requireAdmin("VIEW_ADMIN_DASHBOARD");
  const params = await searchParams;
  let stats = { users: 0, events: 0, registrations: 0, teams: 0, submissions: 0, certificates: 0, applications: 0, messages: 0 };
  let error = "";
  try { ({ stats } = await apiFetch<any>("/api/admin/dashboard", {}, true)); } catch (e) { error = e instanceof Error ? e.message : "Admin data could not be loaded."; }
  const isSuper = user.roles.includes("SUPER_ADMIN");
  const can = (permission: string) => isSuper || user.adminPermissions.includes(permission);
  const cards = [
    ["Registered Profiles", stats.users, UsersRound], ["Events", stats.events, CalendarDays], ["Registrations", stats.registrations, UsersRound],
    ["Teams", stats.teams, UsersRound], ["Submissions", stats.submissions, Boxes], ["Certificates", stats.certificates, FileBadge],
  ] as const;
  const shortcuts = [
    can("MANAGE_EVENTS") ? ["Events", "/admin/events", CalendarDays, "Create, update, archive and publish events."] : null,
    can("MANAGE_MEMBERS") ? ["Users & profiles", "/admin/users", UsersRound, "Search students and manage profile status."] : null,
    can("MANAGE_ANNOUNCEMENTS") ? ["Communications", "/admin/communications", Mail, "Send targeted in-app announcements."] : null,
    can("MANAGE_CERTIFICATES") ? ["Certificates & badges", "/admin/certificates", Award, "Issue certificates and special recognition."] : null,
    isSuper ? ["Access control", "/admin/access", UsersRound, "Assign Admin authority and Faculty roles."] : null,
  ].filter(Boolean) as Array<[string,string,typeof UsersRound,string]>;
  return <main className="p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--accent)]"><LayoutDashboard size={15}/>Administration</div><h1 className="mt-3 text-3xl font-semibold">Club operations dashboard</h1><p className="mt-2 text-sm text-white/40">Signed in as {user.email}. Your visible modules follow Super Admin authority settings.</p></div><Link href="/" className="text-sm text-white/50">View public site →</Link></div>
    {params.error ? <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">You do not have authority for that module.</p> : null}
    {error ? <p className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{cards.map(([label,value,Icon]) => <div key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"><Icon size={18} className="text-[var(--accent)]"/><div className="mt-5 text-3xl font-semibold">{value}</div><div className="mt-1 text-sm text-white/42">{label}</div></div>)}</section>
    <section className="mt-6 grid gap-4 xl:grid-cols-3">{shortcuts.map(([label,href,Icon,copy])=><Link key={href} href={href} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"><Icon className="text-[var(--accent)]"/><h2 className="mt-5 text-lg font-semibold">{label}</h2><p className="mt-2 text-sm text-white/40">{copy}</p></Link>)}</section>
  </main>;
}
