import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic at "/", English at "/en"
  localePrefix: "as-needed",
  // Always open Arabic at "/"; don't auto-redirect to /en based on the
  // visitor's browser language. Users switch to English manually.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
