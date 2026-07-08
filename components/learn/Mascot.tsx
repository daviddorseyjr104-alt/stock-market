import { cn } from "@/lib/utils";

/**
 * "Sprout", Campus Capital's original mascot: a friendly seedling growing
 * out of a coin. Pure inline SVG in brand greens/violet, no external assets.
 */
export function Mascot({
  size = 96,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={cn("drop-shadow-[0_10px_30px_rgba(57,245,172,0.25)]", className)}
      role="img"
      aria-label="Sprout, the Campus Capital mascot"
    >
      <defs>
        <linearGradient id="cc-mascot-coin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#39f5ac" />
          <stop offset="55%" stopColor="#10e29a" />
          <stop offset="100%" stopColor="#7c5cff" />
        </linearGradient>
        <linearGradient id="cc-mascot-leaf" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#10e29a" />
          <stop offset="100%" stopColor="#7dffca" />
        </linearGradient>
      </defs>

      {/* Coin body */}
      <circle cx="60" cy="70" r="44" fill="url(#cc-mascot-coin)" />
      <circle cx="60" cy="70" r="35" fill="#0d1019" />
      <circle
        cx="60"
        cy="70"
        r="35"
        fill="none"
        stroke="rgba(255,255,255,0.10)"
        strokeWidth="1.5"
      />
      {/* Coin rim highlight */}
      <path
        d="M25 52 A 44 44 0 0 1 60 26"
        fill="none"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Sprout stem */}
      <path
        d="M60 36 C 60 28, 60 22, 60 15"
        fill="none"
        stroke="url(#cc-mascot-leaf)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M60 22 C 49 24, 41 18, 38 7 C 50 5, 58 11, 60 22 Z"
        fill="url(#cc-mascot-leaf)"
      />
      {/* Right leaf */}
      <path
        d="M60 26 C 70 28, 79 22, 82 12 C 71 9, 62 15, 60 26 Z"
        fill="#39f5ac"
        opacity="0.92"
      />

      {/* Eyes */}
      <circle cx="47" cy="66" r="5" fill="#e6fff4" />
      <circle cx="73" cy="66" r="5" fill="#e6fff4" />
      <circle cx="48.5" cy="64.5" r="1.8" fill="#0d1019" />
      <circle cx="74.5" cy="64.5" r="1.8" fill="#0d1019" />

      {/* Smile */}
      <path
        d="M49 80 Q 60 90 71 80"
        fill="none"
        stroke="#39f5ac"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cheeks */}
      <circle cx="39" cy="76" r="3.2" fill="#7c5cff" opacity="0.55" />
      <circle cx="81" cy="76" r="3.2" fill="#7c5cff" opacity="0.55" />

      {/* Sparkles */}
      <path
        d="M100 34 l 2.2 4.6 4.6 2.2 -4.6 2.2 -2.2 4.6 -2.2 -4.6 -4.6 -2.2 4.6 -2.2 Z"
        fill="#7dffca"
        opacity="0.9"
      />
      <circle cx="16" cy="40" r="2.4" fill="#9d7bff" opacity="0.8" />
    </svg>
  );
}
