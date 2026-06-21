import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elmadhi.com";

export async function JsonLd({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "qa" });
  const tm = await getTranslations({ locale, namespace: "metadata" });

  const questions = t.raw("questions") as string[];

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ELMADHI",
    url: SITE_URL,
    description: tm("description"),
    logo: `${SITE_URL}/og-image.png`,
  };

  // Only the genuine questions (skip the "suggest a question" prompt) get a
  // generic answer pointing users to the assessment.
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.slice(0, 4).map((q) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: tm("description"),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}
