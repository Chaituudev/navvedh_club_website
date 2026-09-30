"use client";

import { useState } from "react";

type Candidate = {
  _id: string;
  user?: {
    _id?: string;
    fullName?: string;
    email?: string;
  } | string;
};

type ExistingAward = {
  title?: string;
  recipientUser?:
    | {
        _id?: string;
        fullName?: string;
        email?: string;
      }
    | string;
};

function getId(value: unknown): string {
  if (typeof value === "string") return value;

  if (value && typeof value === "object" && "_id" in value) {
    return String(
      (value as { _id?: unknown })._id ?? "",
    );
  }

  return "";
}

function getUserName(candidate: Candidate): string {
  if (typeof candidate.user === "object" && candidate.user) {
    return candidate.user.fullName ?? "Unknown";
  }

  return "Unknown";
}

function getUserEmail(candidate: Candidate): string {
  if (typeof candidate.user === "object" && candidate.user) {
    return candidate.user.email ?? "";
  }

  return "";
}

function getCandidateUserId(candidate: Candidate): string {
  return getId(candidate.user) || candidate._id;
}

export default function AdditionalAwardsFields({
  candidates,
  existingAwards = [],
}: {
  candidates: Candidate[];
  existingAwards?: ExistingAward[];
}) {
  const [rows, setRows] = useState(
    existingAwards.length
      ? existingAwards.map((award) => ({
          title: award.title ?? "",
          recipientUserId: getId(award.recipientUser),
        }))
      : [{ title: "", recipientUserId: "" }],
  );

  function addRow() {
    setRows((current) => [
      ...current,
      {
        title: "",
        recipientUserId: "",
      },
    ]);
  }

  function removeRow(index: number) {
    setRows((current) =>
      current.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="md:col-span-2 rounded-xl border border-white/[0.08] bg-white/[0.015] p-4">
      <div className="mb-3">
        <h4 className="text-sm font-semibold">
          Additional Titles / Awards
        </h4>

        <p className="mt-1 text-xs text-white/35">
          Give an additional title or award to any registered
          participant, including the winner or runner-up.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid gap-3 md:grid-cols-[1fr_1fr_auto]"
          >
            <input
              name="additionalAwardTitle"
              value={row.title}
              onChange={(e) =>
                setRows((current) =>
                  current.map((item, i) =>
                    i === index
                      ? {
                          ...item,
                          title: e.target.value,
                        }
                      : item,
                  ),
                )
              }
              className="min-h-11 rounded-xl border border-white/10 bg-[#0b0f16] px-3 text-sm"
              placeholder="e.g. Best Innovator"
              maxLength={160}
            />

            <select
              name="additionalAwardRecipientId"
              value={row.recipientUserId}
              onChange={(e) =>
                setRows((current) =>
                  current.map((item, i) =>
                    i === index
                      ? {
                          ...item,
                          recipientUserId: e.target.value,
                        }
                      : item,
                  ),
                )
              }
              className="min-h-11 rounded-xl border border-white/10 bg-[#0b0f16] px-3 text-sm"
            >
              <option value="">
                Select participant
              </option>

              {candidates.map((candidate) => (
                <option
                  key={`${index}-${candidate._id}`}
                  value={getCandidateUserId(candidate)}
                >
                  {getUserName(candidate)}
                  {getUserEmail(candidate)
                    ? ` — ${getUserEmail(candidate)}`
                    : ""}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeRow(index)}
              className="min-h-11 rounded-xl border border-white/10 px-4 text-xs text-white/60 hover:bg-white/[0.05]"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRow}
        className="mt-3 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold"
      >
        + Add another title
      </button>
    </div>
  );
}