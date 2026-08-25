"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  Activity,
  Dumbbell,
  HelpCircle,
  ImageIcon,
  Salad,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: LucideIcon[] = [Activity, Dumbbell, Salad, HelpCircle];

/**
 * One screenshot per feature, in the order the copy lists them.
 *
 * Same convention as `MediaCard`: drop a real PNG at the path and it replaces
 * the placeholder on its own, no code change. A missing file is not a broken
 * section — `onError` falls back to the same styled frame the rest of the site
 * uses for art that has not arrived yet.
 *
 * Shoot these at a phone aspect (9:19.5-ish) with the status bar included. They
 * are rendered ~280px wide, so 2x is plenty.
 */
const SCREEN_SRC = [
  "/screens/analysis.png",
  "/screens/workout.png",
  "/screens/diet.png",
  "/screens/qa.png",
];

/** How long each screen holds before the next one slides in. */
const DWELL_MS = 4200;

type Feature = { title: string; desc: string };

export function InsideShowcase({ features }: { features: Feature[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  /** Set once the visitor picks a screen themselves — their choice wins. */
  const [tookOver, setTookOver] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const rootRef = useRef<HTMLDivElement>(null);

  // Only animate while the section is actually on screen. A carousel cycling
  // in a tab nobody is looking at is pure battery drain on the phones most of
  // these visitors are holding.
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || tookOver || hovering || !inView) return;
    const timer = setInterval(
      () => setActive((i) => (i + 1) % features.length),
      DWELL_MS,
    );
    return () => clearInterval(timer);
  }, [reduceMotion, tookOver, hovering, inView, features.length]);

  return (
    <div
      ref={rootRef}
      className="mt-12 grid items-center gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-16"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* ---- The phone ---- */}
      <div className="relative mx-auto w-[248px] sm:w-[286px]">
        {/* Accent bloom behind the device. Sits under everything and is purely
            atmospheric, so it is hidden from assistive tech. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent/20 blur-3xl"
        />

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-[9/19.5] overflow-hidden rounded-[2.5rem] border border-hairline bg-surface shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] ring-1 ring-white/5"
        >
          {/* Notch. Small, and the same colour as the frame — enough to read as
              a phone without pretending to be one specific handset. */}
          <div
            aria-hidden
            className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black/80"
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              {SCREEN_SRC[active] && !failed[active] ? (
                <Image
                  src={SCREEN_SRC[active]}
                  alt={features[active]?.title ?? ""}
                  fill
                  sizes="286px"
                  className="object-cover"
                  onError={() => setFailed((f) => ({ ...f, [active]: true }))}
                  priority={active === 0}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-[linear-gradient(145deg,#2a2a2a,#141414)] px-6 text-center">
                  <ImageIcon className="h-7 w-7 text-muted" strokeWidth={1.5} />
                  <span className="text-sm font-bold text-muted">
                    {features[active]?.title}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ---- The features, doubling as the controls ---- */}
      <ul className="flex flex-col gap-3">
        {features.map((feature, i) => {
          const Icon = ICONS[i] ?? Activity;
          const isActive = i === active;
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setActive(i);
                  setTookOver(true);
                }}
                aria-current={isActive}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors duration-300 sm:p-5",
                  isActive
                    ? "border-accent/40 bg-accent/5"
                    : "border-hairline bg-surface/60 hover:border-hairline hover:bg-surface",
                )}
              >
                <span
                  className={cn(
                    "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-300",
                    isActive
                      ? "bg-accent/15 text-accent"
                      : "bg-white/5 text-muted group-hover:text-accent",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </span>

                <span className="min-w-0">
                  <span className="block text-base font-extrabold">
                    {feature.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {feature.desc}
                  </span>
                </span>
              </button>

              {/* Timer bar under the open item: says the thing moves on its own
                  before it does, so the change reads as designed rather than as
                  the page doing something behind the visitor's back. Keyed on
                  `active` so it restarts with each screen. */}
              {isActive && !reduceMotion && !tookOver && (
                <motion.div
                  key={`bar-${active}`}
                  aria-hidden
                  className="mx-4 h-0.5 origin-left rounded-full bg-accent/50 sm:mx-5"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: inView && !hovering ? 1 : 0 }}
                  transition={{
                    duration: inView && !hovering ? DWELL_MS / 1000 : 0,
                    ease: "linear",
                  }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
