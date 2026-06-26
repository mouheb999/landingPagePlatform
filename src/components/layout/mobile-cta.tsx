"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { scrollToWaitlist } from "@/lib/scroll";

/**
 * Bottom CTA shown on mobile only. It is NOT permanent: it stays hidden over the
 * hero (where the primary CTA already lives) and smoothly slides up once the user
 * scrolls past the hero. It hides again over the waitlist section so it never
 * duplicates or overlaps the form.
 */
export function MobileCta() {
  const tc = useTranslations("common");
  const [pastHero, setPastHero] = useState(false);
  const [atWaitlist, setAtWaitlist] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const waitlist = document.getElementById("waitlist");

    const heroObserver = hero
      ? new IntersectionObserver(
          // Show the CTA only once the hero has scrolled out of view.
          ([entry]) => setPastHero(!entry.isIntersecting),
          { threshold: 0 }
        )
      : null;
    if (hero && heroObserver) heroObserver.observe(hero);

    const waitlistObserver = waitlist
      ? new IntersectionObserver(
          ([entry]) => setAtWaitlist(entry.isIntersecting),
          { threshold: 0.15 }
        )
      : null;
    if (waitlist && waitlistObserver) waitlistObserver.observe(waitlist);

    return () => {
      heroObserver?.disconnect();
      waitlistObserver?.disconnect();
    };
  }, []);

  const visible = pastHero && !atWaitlist;

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-30 transition-all duration-500 ease-out lg:hidden ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-24 opacity-0"
      }`}
    >
      <Button onClick={scrollToWaitlist} className="w-full shadow-glow">
        {tc("joinWaitlist")}
      </Button>
    </div>
  );
}
