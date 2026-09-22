import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", className }: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
        variant === "primary" && "bg-[var(--accent)] text-[#07111f] shadow-[0_12px_40px_rgba(110,168,254,0.20)] hover:-translate-y-0.5 hover:brightness-105",
        variant === "secondary" && "border border-white/12 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.07]",
        variant === "ghost" && "text-white/70 hover:bg-white/[0.05] hover:text-white",
        className,
      )}
    >
      {children}
    </Link>
  );
}
