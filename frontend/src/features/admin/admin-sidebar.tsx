"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Award, CalendarDays, FileBadge, Inbox, LayoutDashboard, Mail, Menu, Settings2, Shield, UserRoundPlus, UsersRound, X } from "lucide-react";
import type { ClubUser } from "@/lib/auth/guards";

type Item = { label:string; href:string; icon:any; permission?:string; superOnly?:boolean };
const items:Item[]=[
  {label:"Dashboard",href:"/admin",icon:LayoutDashboard,permission:"VIEW_ADMIN_DASHBOARD"},
  {label:"Users & Profiles",href:"/admin/users",icon:UsersRound,permission:"MANAGE_MEMBERS"},
  {label:"Events",href:"/admin/events",icon:CalendarDays,permission:"MANAGE_EVENTS"},
  {label:"Certificates",href:"/admin/certificates",icon:FileBadge,permission:"MANAGE_CERTIFICATES"},
  {label:"Badges & Titles",href:"/admin/recognitions",icon:Award,permission:"MANAGE_CERTIFICATES"},
  {label:"Communications",href:"/admin/communications",icon:Mail,permission:"MANAGE_ANNOUNCEMENTS"},
  {label:"Club Applications",href:"/admin/applications",icon:UserRoundPlus,permission:"MANAGE_MEMBERS"},
  {label:"Contact Inbox",href:"/admin/contact-messages",icon:Inbox,permission:"MANAGE_CONTACTS"},
  {label:"Access Control",href:"/admin/access",icon:Shield,superOnly:true},
  {label:"Categories & Options",href:"/admin/system-options",icon:Settings2,superOnly:true},
];

export function AdminSidebar({ user }: { user: ClubUser | null }) {
  const pathname=usePathname(); const [open,setOpen]=useState(false);
  if(pathname==="/admin/login") return null;
  const superAdmin=Boolean(user?.roles.includes("SUPER_ADMIN"));
  const visible=items.filter((item)=>item.superOnly?superAdmin:(superAdmin||!item.permission||user?.adminPermissions.includes(item.permission)));
  const nav=<nav className="space-y-1">{visible.map((item)=>{const Icon=item.icon;const active=item.href==="/admin"?pathname===item.href:pathname.startsWith(item.href);return <Link onClick={()=>setOpen(false)} key={item.href} href={item.href} className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm ${active?"bg-white/[0.07] text-white":"text-white/50 hover:bg-white/[0.04] hover:text-white"}`}><Icon size={17}/>{item.label}</Link>;})}</nav>;
  return <><div className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#080b10]/95 px-4 py-3 backdrop-blur lg:hidden"><div className="flex items-center justify-between"><Link href="/admin" className="font-semibold">NavVedh Admin</Link><button onClick={()=>setOpen(v=>!v)} className="grid h-11 w-11 place-items-center rounded-xl border border-white/10">{open?<X size={20}/>:<Menu size={20}/>}</button></div>{open?<div className="mt-3 border-t border-white/[0.07] pt-3">{nav}</div>:null}</div><aside className="hidden w-72 shrink-0 border-r border-white/[0.07] bg-[#080b10] lg:block"><div className="sticky top-0 h-screen overflow-y-auto p-4"><Link href="/" className="mb-6 block rounded-xl border border-white/[0.07] bg-white/[0.025] p-4"><div className="font-semibold">NavVedh Admin</div><div className="mt-1 text-xs text-white/35">{superAdmin?"Super Admin Console":"Permission-based console"}</div></Link>{nav}</div></aside></>;
}
