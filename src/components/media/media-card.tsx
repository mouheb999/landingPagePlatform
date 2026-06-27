import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaCardProps {
  label: string;
  /** Optional image source. When omitted, a styled placeholder is shown. */
  src?: string;
  /** Optional caption rendered as a badge on top of the image. */
  caption?: string;
  className?: string;
  variant?: "default" | "accent" | "cool";
}

const variantBg: Record<NonNullable<MediaCardProps["variant"]>, string> = {
  default: "bg-[linear-gradient(145deg,#2a2a2a,#141414)]",
  accent: "bg-[linear-gradient(145deg,rgba(93,214,44,0.35),rgba(51,116,24,0.5))]",
  cool: "bg-[linear-gradient(145deg,#23323d,#141d24)]",
};

/**
 * Placeholder media card for the transformation gallery. Drop a real `src` in
 * later and the label/placeholder disappears automatically.
 */
export function MediaCard({
  label,
  src,
  caption,
  className,
  variant = "default",
}: MediaCardProps) {
  return (
    <div
      className={cn(
        "relative grid place-items-center overflow-hidden rounded-[24px] border border-white/10 p-4 text-center",
        variantBg[variant],
        className
      )}
    >
      {src && caption && (
        <span className="absolute start-3 top-3 z-10 rounded-full bg-bg/80 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink backdrop-blur-sm">
          {caption}
        </span>
      )}
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={label} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-ink/80">
          <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
          <span className="text-sm font-extrabold leading-snug">{label}</span>
        </div>
      )}
    </div>
  );
}
