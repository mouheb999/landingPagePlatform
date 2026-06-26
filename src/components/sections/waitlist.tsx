import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export async function Waitlist() {
  const t = await getTranslations("waitlist");
  const benefits = t.raw("benefits") as string[];

  return (
    <section id="waitlist" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <Reveal className="surface-card overflow-hidden bg-[linear-gradient(150deg,#1b271f,#202020)] p-7 sm:p-10 lg:p-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="text-sm font-extrabold uppercase tracking-[0.2em] text-accent">
                {t("kicker")}
              </span>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                {t("headline")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">{t("text")}</p>

              <h3 className="mt-8 text-sm font-extrabold uppercase tracking-[0.14em] text-ink/80">
                {t("benefitsTitle")}
              </h3>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2.5 text-sm font-bold">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-bg/50 p-6 sm:p-8">
              <WaitlistForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
