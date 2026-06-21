"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { scrollToWaitlist } from "@/lib/scroll";

/**
 * Sticky bottom CTA shown on mobile only. Hides once the waitlist section is
 * in view so it never overlaps the form.
 */
export function MobileCta() {
  const tc = useTranslations("common");
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const target = document.getElementById("waitlist");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`fixed inset-x-3 bottom-3 z-30 transition-all duration-300 lg:hidden ${
        hidden ? "pointer-events-none translate-y-24 opacity-0" : "opacity-100"
      }`}
    >
      <Button onClick={scrollToWaitlist} className="w-full shadow-glow">
        {tc("joinWaitlist")}
      </Button>
    </div>
  );
}
