"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
  /** Aspect ratio utility class, e.g. "aspect-video" or "aspect-[3/4]". */
  aspect?: string;
}

/**
 * Reusable lazy video. Renders a poster + play button until the user opts in,
 * then mounts the <video> element with preload. Designed for future real
 * uploads — just pass `src` and `poster`.
 */
export function VideoPlayer({
  src = "/videos/hero-placeholder.mp4",
  poster,
  label,
  className,
  aspect = "aspect-video",
}: VideoPlayerProps) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-card",
        aspect,
        className
      )}
    >
      {active ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          controls
          autoPlay
          playsInline
          preload="metadata"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={label ?? "Play video"}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(93,214,44,0.18),transparent_60%),linear-gradient(150deg,#1a1a1a,#0f0f0f)]" />
          )}

          <span className="relative z-10 grid h-20 w-20 place-items-center rounded-full bg-accent text-bg shadow-glow transition-transform duration-300 group-hover:scale-105">
            <Play className="h-8 w-8 translate-x-0.5 fill-bg" />
          </span>

          {label && (
            <span className="absolute bottom-5 start-5 z-10 rounded-full bg-black/50 px-4 py-2 text-sm font-bold text-ink backdrop-blur">
              {label}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
