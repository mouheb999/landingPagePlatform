"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { JoinCta } from "@/components/cta/join-cta";

/**
 * Bottom CTA shown on mobile only. It is NOT permanent: it stays hidden over the
 * hero (where the primary CTA already lives) and smoothly slides up once the user
 * scrolls past the hero. It hides again over the closing Join section so it
 * never sits on top of the CTA that section already shows.
 */
export function MobileCta() {
  const tc = useTranslations("common");
  const [pastHero, setPastHero] = useState(false);
  const [atJoin, setAtJoin] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const join = document.getElementById("join");

    const heroObserver = hero
      ? new IntersectionObserver(
          // Show the CTA only once the hero has scrolled out of view.
          ([entry]) => setPastHero(!entry.isIntersecting),
          { threshold: 0 }
        )
      : null;
    if (hero && heroObserver) heroObserver.observe(hero);

    const joinObserver = join
      ? new IntersectionObserver(([entry]) => setAtJoin(entry.isIntersecting), {
          threshold: 0.15,
        })
      : null;
    if (join && joinObserver) joinObserver.observe(join);

    return () => {
      heroObserver?.disconnect();
      joinObserver?.disconnect();
    };
  }, []);

  const visible = pastHero && !atJoin;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-30 transition-all duration-500 ease-out lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <JoinCta className="w-full shadow-glow">{tc("joinUs")}</JoinCta>
    </div>
  );
}
