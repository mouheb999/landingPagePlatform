import { getTranslations } from "next-intl/server";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <div>
        <p className="text-6xl font-extrabold text-accent">404</p>
        <a href="/" className={cn(buttonVariants(), "mt-8")}>
          {t("joinWaitlist")}
        </a>
      </div>
    </main>
  );
}
