"use client";
import { Copy, Facebook, Linkedin, Share2 } from "lucide-react";
import { useState } from "react";

export function EventShare({ title, text, url }: { title: string; text: string; url: string }) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title}\n${text}`);

  async function nativeShare() {
    if (navigator.share) {
      await navigator.share({ title, text, url }).catch(() => undefined);
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
    <h2 className="font-semibold text-white">Share Event</h2>
    <p className="mt-2 text-sm text-white/40">Invite friends or share the event on your social handles.</p>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button type="button" onClick={nativeShare} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-semibold text-white/65"><Share2 size={14}/>Share</button>
      <button type="button" onClick={copy} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-semibold text-white/65"><Copy size={14}/>{copied?"Copied":"Copy link"}</button>
      <a target="_blank" rel="noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-semibold text-white/65"><Linkedin size={14}/>LinkedIn</a>
      <a target="_blank" rel="noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs font-semibold text-white/65"><Facebook size={14}/>Facebook</a>
      <a target="_blank" rel="noreferrer" href={`https://wa.me/?text=${encodedText}%0A${encodedUrl}`} className="col-span-2 inline-flex min-h-10 items-center justify-center rounded-xl border border-white/10 text-xs font-semibold text-white/65">WhatsApp</a>
    </div>
  </div>;
}
