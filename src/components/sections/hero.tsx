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

      <div className="container-page relative flex flex-col items-center text-center">
        <Reveal className="max-w-3xl">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            {t("eyebrow")}
          </span>
          <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            {t("copy")}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="relative mt-10 w-full max-w-3xl sm:mt-12">
          <VideoPlayer
            youtubeId="oLpBlKO1HNI"
            label={t("videoLabel")}
            aspect="aspect-video"
          />

          <div className="absolute -bottom-4 start-4 flex items-center gap-2 rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm font-extrabold shadow-card sm:start-6">
            <Dumbbell className="h-4 w-4 text-accent" />
            {t("badgeTwo")}
          </div>
          <div className="absolute -top-4 end-4 rounded-2xl border border-white/10 bg-surface px-4 py-3 text-sm font-extrabold shadow-card sm:end-6">
            <span className="me-1 text-accent">●</span>
            {t("badgeOne")}
          </div>
        </Reveal>

        <Reveal delay={0.25} className="mt-10 flex w-full max-w-3xl flex-col items-center sm:mt-12">
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
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
            className="mt-4 text-accent hover:bg-transparent hover:text-accent-hover"
          >
            {t("assessmentCta")}
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </AssessmentTrigger>
        </Reveal>
      </div>
    </section>
  );
}
