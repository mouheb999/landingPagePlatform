import { getTranslations } from "next-intl/server";
import { ArrowLeft, Dumbbell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { VideoPlayer } from "@/components/media/video-player";
import { Reveal } from "@/components/ui/reveal";
import { AssessmentTrigger } from "@/components/assessment/assessment-trigger";
import { cn } from "@/lib/utils";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section id="top" className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-28">
      <div className="glow-accent pointer-events-none absolute -top-32 start-1/2 h-[600px] w-[600px] -translate-x-1/2 rtl:translate-x-1/2" />

      <div className="container-page relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </span>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {t("copy")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="#waitlist" className={cn(buttonVariants({ size: "lg" }))}>
              {t("primaryCta")}
            </a>
            <a
              href="#how"
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
            >
              {t("secondaryCta")}
            </a>
          </div>

          <AssessmentTrigger
            variant="ghost"
            size="sm"
            className="mt-4 px-0 text-accent hover:bg-transparent hover:text-accent-hover"
          >
            {t("assessmentCta")}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </AssessmentTrigger>
        </Reveal>

        <Reveal delay={0.15} className="relative">
          <VideoPlayer label={t("videoLabel")} aspect="aspect-[4/5] sm:aspect-[4/5]" />

          <div className="absolute -bottom-4 start-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm font-extrabold shadow-card sm:start-6">
            <Dumbbell className="h-4 w-4 text-accent" />
            {t("badgeTwo")}
          </div>
          <div className="absolute -top-4 end-4 rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm font-extrabold shadow-card sm:end-6">
            <span className="me-1 text-accent">●</span>
            {t("badgeOne")}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
