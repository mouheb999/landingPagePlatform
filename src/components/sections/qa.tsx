import { getTranslations } from "next-intl/server";
import { Plus, ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { AssessmentTrigger } from "@/components/assessment/assessment-trigger";

export async function QA() {
  const t = await getTranslations("qa");
  const questions = t.raw("questions") as string[];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="surface-card grid gap-10 bg-[linear-gradient(150deg,#1a1a1a,#202020)] p-7 sm:p-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
              {t("kicker")}
            </span>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">{t("copy")}</p>

            <AssessmentTrigger className="mt-7">{t("cta")}</AssessmentTrigger>
          </div>

          <div className="grid content-start gap-3">
            {questions.map((q, i) => {
              const isLast = i === questions.length - 1;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-bg/40 px-5 py-4 font-bold"
                >
                  <span>{q}</span>
                  {isLast ? (
                    <ArrowLeft className="h-5 w-5 shrink-0 text-accent rtl:rotate-180" />
                  ) : (
                    <Plus className="h-5 w-5 shrink-0 text-accent" />
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
