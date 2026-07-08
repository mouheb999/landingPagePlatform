import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Cairo, Tajawal } from "next/font/google";
import { routing, type Locale } from "@/i18n/routing";
import { JsonLd } from "@/components/seo/json-ld";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elmadhi.com";

export const viewport: Viewport = {
  themeColor: "#0f0f0f",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: locale === "ar" ? "/" : `/${locale}`,
      languages: {
        ar: "/",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      siteName: "ELMADHI",
      locale: locale === "ar" ? "ar_TN" : "en_US",
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: locale === "ar" ? "/" : `/${locale}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "ELMADHI" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("ogTitle"),
      description: t("ogDescription"),
      images: ["/og-image.png"],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const messages = await getMessages();

  return (
    <html lang={locale} dir={dir} className={`${cairo.variable} ${tajawal.variable}`}>
      <body className="font-sans bg-bg text-ink antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <JsonLd locale={locale as Locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
