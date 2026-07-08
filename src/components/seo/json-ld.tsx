import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elmadhi.com";

export async function JsonLd({ locale }: { locale: Locale }) {
  const tm = await getTranslations({ locale, namespace: "metadata" });

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ELMADHI",
    url: SITE_URL,
    description: tm("description"),
    logo: `${SITE_URL}/og-image.png`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
    />
  );
}
