import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { VideoPlayer } from "@/components/media/video-player";
import { Reveal } from "@/components/ui/reveal";
import { AssessmentTrigger } from "@/components/assessment/assessment-trigger";
import { cn } from "@/lib/utils";

export async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      <div className="glow-accent pointer-events-none absolute -top-32 start-1/2 h-[600px] w-[600px] -translate-x-1/2 rtl:translate-x-1/2" />

      <div className="container-page relative flex flex-col items-center text-center">
        <Reveal className="max-w-3xl px-2 sm:px-0">
          <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
            {t("eyebrow")}
          </span>
          <h1 className="mt-6 text-balance text-[2rem] font-extrabold leading-[1.18] tracking-tight sm:text-5xl sm:leading-[1.15] lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {t("copy")}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-12 w-full max-w-3xl sm:mt-14">
          <VideoPlayer
            youtubeId="oLpBlKO1HNI"
            label={t("videoLabel")}
            aspect="aspect-video"
          />
        </Reveal>

        <Reveal delay={0.25} className="mt-10 flex w-full max-w-3xl flex-col items-center">
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
            className="group mt-5 border border-accent/30 bg-accent/5 text-accent transition-colors hover:bg-accent/10 hover:text-accent-hover"
          >
            {t("assessmentCta")}
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
          </AssessmentTrigger>
        </Reveal>
      </div>
    </section>
  );
}
