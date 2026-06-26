"use client";

import { useState, useRef } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  /** YouTube video id (e.g. "oLpBlKO1HNI"). When set, embeds YouTube instead of <video>. */
  youtubeId?: string;
  label?: string;
  className?: string;
  /** Aspect ratio utility class, e.g. "aspect-video" or "aspect-[3/4]". */
  aspect?: string;
}

/**
 * Reusable lazy video. Renders a poster + play button until the user opts in,
 * then mounts the player. Supports either a self-hosted file (`src`) or a
 * YouTube embed (`youtubeId`). The iframe is only injected on click (facade
 * pattern) so it never blocks initial load.
 */
export function VideoPlayer({
  src = "/videos/hero-placeholder.mp4",
  poster,
  youtubeId,
  label,
  className,
  aspect = "aspect-video",
}: VideoPlayerProps) {
  const [active, setActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // For YouTube, default the poster to the video's own thumbnail.
  const resolvedPoster =
    poster ??
    (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : undefined);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/10 bg-surface shadow-card",
        aspect,
        className
      )}
    >
      {active ? (
        youtubeId ? (
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={label ?? "ELMADHI video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
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
        )
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={label ?? "Play video"}
          className="group absolute inset-0 flex h-full w-full items-center justify-center"
        >
          {resolvedPoster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={resolvedPoster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              onError={(e) => {
                // maxresdefault is missing for some videos — fall back to hqdefault.
                if (youtubeId) {
                  const img = e.currentTarget;
                  const fallback = `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
                  if (img.src !== fallback) img.src = fallback;
                }
              }}
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(93,214,44,0.18),transparent_60%),linear-gradient(150deg,#1a1a1a,#0f0f0f)]" />
          )}

          {/* subtle dark veil so the play button always reads clearly */}
          <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />

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
