import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export async function Waitlist() {
  const t = await getTranslations("waitlist");

  return (
    <section id="waitlist" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="surface-card mx-auto max-w-2xl overflow-hidden bg-[linear-gradient(150deg,#1b271f,#202020)] p-7 text-center sm:p-10 lg:p-12">
          <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
            {t("kicker")}
          </span>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
            {t("headline")}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">{t("text")}</p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-bg/50 p-6 text-start sm:p-8">
            <WaitlistForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
