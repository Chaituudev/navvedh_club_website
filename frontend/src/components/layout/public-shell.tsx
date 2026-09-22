import type { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getCurrentUser } from "@/lib/auth/guards";

export async function PublicShell({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <><Navbar user={user}/><main>{children}</main><Footer/></>;
}
