import Image from "next/image";
import { cn, initials } from "@/lib/utils";

const sizes = {
  xs: "h-7 w-7 text-[10px]",
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

const pixels: Record<keyof typeof sizes, number> = {
  xs: 28,
  sm: 36,
  md: 44,
  lg: 64,
  xl: 96,
};

export function Avatar({
  name,
  gradient,
  src,
  size = "md",
  ring,
  className,
}: {
  name: string;
  gradient: string;
  /** Uploaded picture. Falls back to initials on a gradient when absent. */
  src?: string;
  size?: keyof typeof sizes;
  ring?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br font-bold text-ink-950",
        gradient,
        sizes[size],
        ring && "ring-2 ring-white/10 ring-offset-2 ring-offset-ink-950",
        className,
      )}
      aria-hidden
    >
      {src ? (
        // Avatars are user-uploaded and may be data: URLs or Supabase Storage
        // URLs, neither of which the Next image optimizer should touch.
        <Image
          src={src}
          alt=""
          width={pixels[size]}
          height={pixels[size]}
          unoptimized
          className="h-full w-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </div>
  );
}
