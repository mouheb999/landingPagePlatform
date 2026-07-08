import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

type Step = { title: string; desc: string };

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="how" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal
              key={i}
              as="article"
              delay={i * 0.07}
              className="surface-card p-6"
            >
              <span className="text-sm font-extrabold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-base font-extrabold leading-snug">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.desc}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
