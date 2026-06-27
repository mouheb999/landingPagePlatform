"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { joinWaitlist } from "@/actions/waitlist";

export function WaitlistForm() {
  const t = useTranslations("waitlist.form");

  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function action(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await joinWaitlist(formData);
      if (result.status === "success") {
        setSuccess(true);
      } else {
        setError(t("errors.generic"));
      }
    });
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center justify-center rounded-[28px] border border-accent/30 bg-accent/5 p-10 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="h-14 w-14 text-accent" strokeWidth={1.5} />
        <h3 className="mt-4 text-2xl font-extrabold">{t("successTitle")}</h3>
        <p className="mt-2 text-muted">{t("successText")}</p>
      </motion.div>
    );
  }

  return (
    <form action={action} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="wl-name">{t("name")}</Label>
        <Input
          id="wl-name"
          name="name"
          required
          minLength={2}
          autoComplete="name"
          placeholder={t("namePlaceholder")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="wl-email">{t("email")}</Label>
        <Input
          id="wl-email"
          name="email"
          type="email"
          required
          inputMode="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="wl-whatsapp">{t("whatsapp")}</Label>
        <Input
          id="wl-whatsapp"
          name="whatsapp"
          type="tel"
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder={t("whatsappPlaceholder")}
        />
      </div>

      {error && (
        <p className="text-sm font-bold text-red-400" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>
    </form>
  );
}
