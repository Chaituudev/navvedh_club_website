import { cn, formatEventStatus } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const active = status === "registration-open" || status === "ongoing";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide",
        active
          ? "border-[color:color-mix(in_srgb,var(--accent)_35%,transparent)] bg-[color:color-mix(in_srgb,var(--accent)_10%,transparent)] text-[var(--accent)]"
          : "border-white/10 bg-white/[0.035] text-white/65",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-[var(--accent)]" : "bg-white/35")} />
      {formatEventStatus(status)}
    </span>
  );
}
