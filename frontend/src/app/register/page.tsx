import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { RegisterForm } from "@/features/auth/register-form";
import { isApiConfigured } from "@/lib/api/server";
export default function RegisterPage(){const configured=isApiConfigured();return <main className="tech-grid grid min-h-screen place-items-center px-4 py-10"><AuthCard title="Create student account" description="One profile follows your club activity across events, projects, attendance and certificates." footer={<>Already registered? <Link href="/login" className="font-semibold text-[var(--accent)]">Sign in</Link></>}>{!configured?<div className="mb-4 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">Start the Express backend and set <code>API_URL</code>.</div>:null}<RegisterForm disabled={!configured}/></AuthCard></main>}
