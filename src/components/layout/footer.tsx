import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { LogoMark } from "./logo";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-page flex flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-start">
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

        <div className="flex w-full justify-center border-t border-white/5 pt-6">
          <a
            href="https://motion-one-kappa.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-3"
          >
            <span className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted/50 transition group-hover:text-muted">
              {t("developedBy")}
              <Image
                src="/motion.png"
                alt="Motion"
                width={715}
                height={354}
                className="h-5 w-auto opacity-50 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted/40 transition group-hover:text-accent">
              {t("agencyCta")}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
