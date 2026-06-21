import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export async function Solution() {
  const t = await getTranslations("solution");
  const checks = t.raw("checks") as string[];

  return (
    <section className="py-20 sm:py-28">
      <div className="container-page grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="surface-card bg-[linear-gradient(145deg,#1b271f,#202020)] p-8 sm:p-10">
          <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {t("paragraphOne")}
          </p>
          <p className="mt-4 text-lg font-bold leading-relaxed text-ink">
            {t("paragraphTwo")}
          </p>
        </Reveal>

        <div className="grid gap-3">
          {checks.map((check, i) => (
            <Reveal
              key={i}
              delay={i * 0.06}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-surface p-4 font-bold"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                <Check className="h-5 w-5" />
              </span>
              {check}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
