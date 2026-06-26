import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { MediaCard } from "@/components/media/media-card";

export async function Transformation() {
  const t = await getTranslations("story");
  const pills = t.raw("pills") as string[];

  return (
    <section id="story" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="grid grid-cols-2 gap-3">
          <MediaCard label={t("media.before")} className="aspect-[3/4]" variant="default" />
          <MediaCard label={t("media.after")} className="aspect-[3/4]" variant="accent" />
          <MediaCard
            label={t("media.taekwondo")}
            className="col-span-2 aspect-[16/9]"
            variant="cool"
          />
        </Reveal>

        <Reveal delay={0.1}>
          <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {t("paragraphOne")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            {t("paragraphTwo")}
          </p>
          <h3 className="mt-6 text-xl font-extrabold leading-snug">
            {t("highlight")}
          </h3>

          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/10 bg-surface px-4 py-2 text-sm font-bold"
              >
                {pill}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
