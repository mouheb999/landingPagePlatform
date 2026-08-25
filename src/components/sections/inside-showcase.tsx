"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
 * render ~286px wide, so 2x is plenty.
 */
const SCREEN_SRC = [
  "/screens/analysis.png",
  "/screens/workout.png",
  "/screens/diet.png",
  "/screens/qa.png",
];

/** How long each screen holds before the next one takes over. */
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

  const current = features[active];

  return (
    <div
      ref={rootRef}
      className="mt-10 flex flex-col items-center"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/*
        The switcher, above the phone.

        It used to sit underneath, which on a phone meant scrolling past a tall
        device frame to reach it and then finding the last row parked behind the
        sticky CTA bar. Controls belong in front of the thing they control.
        Icons only, so all four fit one thumb-width row at any width without
        wrapping or scrolling.
      */}
      <div
        role="tablist"
        aria-label={current?.title}
        className="flex items-center gap-2 rounded-full border border-hairline bg-surface/70 p-1.5 backdrop-blur"
      >
        {features.map((feature, i) => {
          const Icon = ICONS[i] ?? Activity;
          const isActive = i === active;
          return (
            <button
              key={i}
              role="tab"
              type="button"
              aria-selected={isActive}
              // The visible label lives under the phone, so the control itself
              // has to carry the name for anyone not looking at the screen.
              aria-label={feature.title}
              onClick={() => {
                setActive(i);
                setTookOver(true);
              }}
              className={cn(
                "relative grid h-12 w-12 place-items-center rounded-full transition-colors duration-300 sm:h-14 sm:w-14",
                isActive
                  ? "bg-accent text-bg"
                  : "text-muted hover:bg-white/5 hover:text-ink",
              )}
            >
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2} />

              {/* Countdown pulse on the open tab: says the thing is about to
                  move before it moves, so the change reads as designed rather
                  than as the page wandering off on its own. */}
              {isActive && !reduceMotion && !tookOver && (
                <motion.span
                  key={`ring-${active}`}
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-2 ring-accent/40"
                  initial={{ opacity: 0.9, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.45 }}
                  transition={{
                    duration: DWELL_MS / 1000,
                    ease: "linear",
                    repeat: hovering || !inView ? 0 : Infinity,
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* The phone */}
      <div className="relative mt-8 w-[248px] sm:w-[286px]">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 scale-125 rounded-full bg-accent/20 blur-3xl"
        />

        <motion.div
          animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          role="tabpanel"
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
                  alt={current?.title ?? ""}
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
                    {current?.title}
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/*
        Only the open feature's words — one title and one line, where four
        descriptions used to stack. The fixed min-height keeps the phone from
        hopping as captions of different lengths swap in.
      */}
      <div className="mt-7 flex min-h-[5.5rem] max-w-md items-start justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="text-lg font-extrabold sm:text-xl">
              {current?.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {current?.desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
