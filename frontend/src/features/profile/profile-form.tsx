"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/app/profile/actions";
import { initialProfileState } from "@/lib/action-states";

type Profile = {
  full_name: string | null;
  mobile: string | null;
  college: string | null;
  department: string | null;
  year: string | null;
  prn_student_id: string | null;
  skills: string[] | null;
  github_url: string | null;
  linkedin_url: string | null;
  email_notifications: boolean | null;
};

const inputClass = "mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-sm text-white outline-none focus:border-[var(--accent)]";

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialProfileState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm text-white/60 sm:col-span-2">Full name<input name="fullName" required defaultValue={profile.full_name ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60">Mobile<input name="mobile" defaultValue={profile.mobile ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60">Year<select name="year" required defaultValue={profile.year ?? ""} className={`${inputClass} bg-[#0b0f16]`}><option value="">Select year</option><option>FY</option><option>SY</option><option>TY</option><option>Final Year</option><option>PG</option><option>Other</option></select></label>
      <label className="text-sm text-white/60 sm:col-span-2">College<input name="college" required defaultValue={profile.college ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60 sm:col-span-2">Department<input name="department" required defaultValue={profile.department ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60">PRN / Student ID<input name="prnStudentId" defaultValue={profile.prn_student_id ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60">Skills<input name="skills" defaultValue={(profile.skills ?? []).join(", ")} placeholder="React, Python, Unreal Engine" className={inputClass} /></label>
      <label className="text-sm text-white/60">GitHub URL<input name="githubUrl" type="url" defaultValue={profile.github_url ?? ""} className={inputClass} /></label>
      <label className="text-sm text-white/60">LinkedIn URL<input name="linkedinUrl" type="url" defaultValue={profile.linkedin_url ?? ""} className={inputClass} /></label>
      <label className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 text-sm text-white/60 sm:col-span-2">
        <input name="emailNotifications" type="checkbox" defaultChecked={profile.email_notifications ?? true} className="mt-1 h-4 w-4 accent-[var(--accent)]" />
        <span><strong className="block text-white/80">Club email notifications</strong>Receive general club announcements and event updates. Critical account/security emails are separate.</span>
      </label>
      {state.error ? <p className="text-sm text-red-300 sm:col-span-2">{state.error}</p> : null}
      {state.message ? <p className="text-sm text-emerald-300 sm:col-span-2">{state.message}</p> : null}
      <button disabled={pending} className="min-h-11 rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f] disabled:opacity-60 sm:col-span-2">{pending ? "Saving…" : "Save profile"}</button>
    </form>
  );
}
