import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

export async function Problem() {
  const t = await getTranslations("problem");
  const items = t.raw("items") as string[];

  return (
    <section id="problem" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading kicker={t("kicker")} title={t("title")} />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={i} as="article" delay={i * 0.08} className="surface-card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-base font-extrabold text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 font-bold leading-relaxed">{item}</p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-3xl rounded-[24px] bg-surface px-7 py-6 text-center text-lg font-extrabold leading-relaxed shadow-card">
            {t("statement")}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
