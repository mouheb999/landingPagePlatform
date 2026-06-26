import { getTranslations } from "next-intl/server";
import { LogoMark } from "./logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-page flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
        <p className="flex items-center gap-2.5 font-bold">
          <LogoMark className="h-6 w-auto" />
          <span>
            <span className="text-accent">ELMADHI</span> — {t("tagline")}
          </span>
        </p>
        <p className="text-sm text-muted">
          © {year} ELMADHI. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
