"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";
import { useAssessment } from "@/components/assessment/assessment-context";
import { scrollToWaitlist } from "@/lib/scroll";

const LINKS = [
  { id: "problem", key: "problem" },
  { id: "inside", key: "inside" },
  { id: "story", key: "story" },
  { id: "waitlist", key: "waitlist" },
] as const;

export function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const { open } = useAssessment();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-colors duration-300",
        scrolled
          ? "border-b border-white/10 bg-bg/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-page flex min-h-[76px] items-center justify-between gap-6">
        <a href="#top" aria-label="ELMADHI">
          <Logo />
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 lg:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              type="button"
              onClick={() => handleNavClick(link.id)}
              className="text-sm font-bold text-muted transition-colors hover:text-ink"
            >
              {t(link.key)}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <Button variant="secondary" size="sm" onClick={open}>
            {tc("freeAssessment")}
          </Button>
          <Button size="sm" onClick={scrollToWaitlist}>
            {tc("joinWaitlist")}
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={t("menu")}
          aria-expanded={menuOpen}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-white/10 bg-bg/95 backdrop-blur-xl lg:hidden">
          <div className="container-page flex flex-col gap-4 py-6">
            {LINKS.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="text-start text-base font-bold text-ink"
              >
                {t(link.key)}
              </button>
            ))}
            <div className="flex items-center justify-between pt-2">
              <span className="text-sm font-bold text-muted">{t("language")}</span>
              <LanguageSwitcher />
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setMenuOpen(false);
                open();
              }}
            >
              {tc("freeAssessment")}
            </Button>
            <Button
              onClick={() => {
                setMenuOpen(false);
                scrollToWaitlist();
              }}
            >
              {tc("joinWaitlist")}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
