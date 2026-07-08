import { getTranslations } from "next-intl/server";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { WaitlistCta } from "@/components/waitlist/waitlist-cta";

type Plan = {
  name: string;
  price: string;
  highlight?: string;
  features: string[];
};

export async function Pricing() {
  const t = await getTranslations("pricing");
  const plans = t.raw("plans") as Plan[];

  return (
    <section id="pricing" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-6 lg:grid-cols-2">
          {plans.map((plan, i) => {
            const featured = i === plans.length - 1;
            return (
              <Reveal
                key={plan.name}
                as="article"
                delay={i * 0.08}
                className={cn(
                  "surface-card relative flex flex-col p-7 transition-transform duration-300 sm:p-9",
                  featured
                    ? "bg-[linear-gradient(155deg,#1b271f,#202020)] ring-2 ring-accent lg:-translate-y-2 lg:scale-[1.03]"
                    : "hover:-translate-y-1.5"
                )}
              >
                {featured && (
                  <span className="absolute -top-3 start-7 inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1 text-xs font-extrabold uppercase tracking-wide text-bg rtl:tracking-normal">
                    <Sparkles className="h-3.5 w-3.5" />
                    {t("mostPopular")}
                  </span>
                )}

                <h3 className="text-lg font-extrabold uppercase tracking-wide rtl:tracking-normal">
                  {plan.name}
                </h3>

                <div className="mt-4 flex items-end gap-1.5">
                  <span className="text-5xl font-extrabold leading-none">
                    {plan.price}
                  </span>
                  <span className="pb-1 text-lg font-bold text-accent">
                    {t("currency")}
                  </span>
                  <span className="pb-1.5 text-sm font-medium text-muted">
                    {t("perMonth")}
                  </span>
                </div>

                <div className="my-7 h-px bg-white/10" />

                <ul className="flex flex-1 flex-col gap-3.5">
                  {plan.highlight && (
                    <li className="flex items-center gap-3 font-extrabold text-accent">
                      <Sparkles className="h-5 w-5 shrink-0" strokeWidth={2.2} />
                      {plan.highlight}
                    </li>
                  )}
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm font-semibold leading-relaxed sm:text-base"
                    >
                      <span
                        className={cn(
                          "mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full",
                          featured
                            ? "bg-accent text-bg"
                            : "bg-accent/12 text-accent"
                        )}
                      >
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <WaitlistCta
                  variant={featured ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  {t("cta")}
                </WaitlistCta>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
