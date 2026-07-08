import { getTranslations } from "next-intl/server";
import {
  Activity,
  Dumbbell,
  Salad,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";

const ICONS: LucideIcon[] = [Activity, Dumbbell, Salad, HelpCircle];

type Feature = { title: string; desc: string };

export async function Inside() {
  const t = await getTranslations("inside");
  const features = t.raw("features") as Feature[];

  return (
    <section id="inside" className="scroll-mt-24 py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          kicker={t("kicker")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = ICONS[i] ?? Activity;
            return (
              <Reveal
                key={i}
                as="article"
                delay={(i % 4) * 0.08}
                className="surface-card group p-6 transition-transform duration-300 hover:-translate-y-1.5"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/10 text-accent">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <h3 className="mt-5 text-lg font-extrabold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {feature.desc}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
