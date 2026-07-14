"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { AvatarError, uploadAvatar } from "@/lib/avatar";

export function AvatarPicker({
  value,
  onChange,
  userId,
  fallback,
  gradient = "from-capital-400 to-violet-500",
  className,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
  userId?: string;
  /** Initials shown until a picture is chosen. */
  fallback: string;
  gradient?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      onChange(await uploadAvatar(file, userId));
    } catch (e) {
      setError(
        e instanceof AvatarError ? e.message : "That image couldn't be uploaded.",
      );
    } finally {
      setBusy(false);
      // Let the same file be re-picked after an error.
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={value ? "Change profile picture" : "Add a profile picture"}
        className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full focus-visible:ring-focus"
      >
        {value ? (
          <Image
            src={value}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "flex h-full w-full items-center justify-center bg-gradient-to-br font-display text-2xl font-bold text-ink-950",
              gradient,
            )}
          >
            {fallback}
          </span>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-ink-950/60 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin text-white" aria-hidden />
          ) : (
            <Camera className="h-5 w-5 text-white" aria-hidden />
          )}
        </span>
      </button>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="rounded-xl border border-white/12 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:border-white/25 hover:text-white disabled:opacity-50"
          >
            {value ? "Change photo" : "Upload a photo"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="inline-flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-medium text-white/45 transition-colors hover:text-rose-300"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Remove
            </button>
          )}
        </div>
        <p className="mt-1.5 text-xs text-white/35">
          {error ? (
            <span className="text-rose-400">{error}</span>
          ) : (
            "PNG, JPG or WebP. We'll crop it to a square."
          )}
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => pick(e.target.files?.[0])}
      />
    </div>
  );
}
