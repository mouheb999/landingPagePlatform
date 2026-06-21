import { setRequestLocale } from "next-intl/server";
import { AssessmentProvider } from "@/components/assessment/assessment-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { MobileCta } from "@/components/layout/mobile-cta";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Solution } from "@/components/sections/solution";
import { Inside } from "@/components/sections/inside";
import { HowItWorks } from "@/components/sections/how-it-works";
import { QA } from "@/components/sections/qa";
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
        <Hero />
        <Problem />
        <Solution />
        <Inside />
        <HowItWorks />
        <QA />
        <Transformation />
        <Waitlist />
      </main>
      <Footer />
      <MobileCta />
    </AssessmentProvider>
  );
}
