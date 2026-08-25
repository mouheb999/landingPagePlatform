import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { InsideShowcase } from "./inside-showcase";

type Feature = { title: string; desc: string };

/**
 * "Inside ELMADHI" — four claims about the product, next to the product.
 *
 * This was four icon cards and nothing else, which asked a visitor to take the
 * whole thing on description. The claims are unchanged and still come from the
 * same `inside.features` copy; what is new is that picking one shows the screen
 * it is talking about. Showing the app is the argument.
 *
 * The showcase is a Client Component because it animates and responds to taps,
 * so the copy is read here on the server and handed down as plain data.
 */
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

        <Reveal>
          <InsideShowcase features={features} />
        </Reveal>
      </div>
    </section>
  );
}
