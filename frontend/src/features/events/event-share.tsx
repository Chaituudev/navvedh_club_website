"use client";

import {
  Copy,
  ExternalLink,
  Share2,
} from "lucide-react";

import { useState } from "react";

type EventShareProps = {
  title: string;
  text: string;
  url: string;
};

export function EventShare({
  title,
  text,
  url,
}: EventShareProps) {
  const [copied, setCopied] =
    useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        url,
      );

      setCopied(true);

      window.setTimeout(
        () => setCopied(false),
        2000,
      );
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (
      typeof navigator !== "undefined" &&
      navigator.share
    ) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch {
        // User cancelled sharing.
      }

      return;
    }

    await copyLink();
  }

  function openExternal(
    targetUrl: string,
  ) {
    window.open(
      targetUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  const encodedText =
    encodeURIComponent(text);

  const encodedUrl =
    encodeURIComponent(url);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Native share */}

      <button
        type="button"
        onClick={nativeShare}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        <Share2 size={16} />

        Share
      </button>

      {/* WhatsApp */}

      <button
        type="button"
        onClick={() =>
          openExternal(
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        <ExternalLink size={15} />

        WhatsApp
      </button>

      {/* LinkedIn */}

      <button
        type="button"
        onClick={() =>
          openExternal(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        <ExternalLink size={15} />

        LinkedIn
      </button>

      {/* Facebook */}

      <button
        type="button"
        onClick={() =>
          openExternal(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
          )
        }
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        <ExternalLink size={15} />

        Facebook
      </button>

      {/* Copy */}

      <button
        type="button"
        onClick={copyLink}
        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
      >
        <Copy size={15} />

        {copied
          ? "Copied!"
          : "Copy Link"}
      </button>
    </div>
  );
}