"use client";

import { useActionState } from "react";
import { registerForEventAction } from "@/app/events/actions";
import { initialEventRegistrationState } from "@/lib/action-states";

export function EventRegistrationButton({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(registerForEventAction, initialEventRegistrationState);
  return (
    <div>
      <form action={action}>
        <input type="hidden" name="slug" value={slug} />
        <button disabled={pending} className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--accent)] px-5 text-sm font-bold text-[#07111f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
          {pending ? "Registering…" : "Register for Event"}
        </button>
      </form>
      {state.error ? <p role="alert" className="mt-2 max-w-sm text-xs leading-5 text-red-200">{state.error}</p> : null}
    </div>
  );
}
