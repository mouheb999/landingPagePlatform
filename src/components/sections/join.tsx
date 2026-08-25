import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { JoinCta } from "@/components/cta/join-cta";

/**
 * The closing block. The sticky mobile bar watches for its id to know when to
 * get out of the way, and the nav anchor points at it. There is no list to join
 * any more — the platform is open, and this is the door.
 */
export async function Join() {
  const t = await getTranslations("join");
  const tc = await getTranslations("common");

  return (
    <section id="join" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="surface-card mx-auto max-w-2xl overflow-hidden bg-[linear-gradient(150deg,#1b271f,#202020)] p-7 text-center sm:p-10 lg:p-12">
          <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("text")}</p>

          <JoinCta size="lg" className="mt-8 w-full shadow-glow sm:w-auto sm:px-12">
            {tc("joinUs")}
          </JoinCta>
        </Reveal>
      </div>
    </section>
  );
}
