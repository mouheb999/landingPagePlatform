import { setRequestLocale } from "next-intl/server";
import { AssessmentProvider } from "@/components/assessment/assessment-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Hero } from "@/components/sections/hero";
import { Inside } from "@/components/sections/inside";
import { Pricing } from "@/components/sections/pricing";
import { Transformation } from "@/components/sections/transformation";
import { Waitlist } from "@/components/sections/waitlist";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <AssessmentProvider>
      <Navbar />
      <main>
        {/* Hook, product, proof, price, door.
            Problem, Solution and HowItWorks are still in
            src/components/sections/ with their copy intact — they were three
            more walls of text saying what the next section then showed, and
            HowItWorks had a "join the waitlist" step that no longer exists.
            Add the import and the tag back to restore any of them. */}
        <Hero />
        <Inside />
        <Transformation />
        <Pricing />
        <Waitlist />
      </main>
      <Footer />
      <MobileCta />
    </AssessmentProvider>
  );
}
