import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic at "/", English at "/en"
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
