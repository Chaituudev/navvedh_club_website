import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
export const dynamic="force-dynamic";
export default async function UnknownAdminSection(){await requireAdmin();notFound();}
