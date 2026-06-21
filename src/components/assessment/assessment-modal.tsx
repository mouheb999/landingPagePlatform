"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { scrollToWaitlist } from "@/lib/scroll";

type QuizQuestion = { q: string; options: string[] };

interface AssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssessmentModal({ open, onOpenChange }: AssessmentModalProps) {
  const t = useTranslations("assessment");
  const questions = useMemo(() => t.raw("questions") as QuizQuestion[], [t]);
  const total = questions.length;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setDone(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const choose = (optionIndex: number) => {
    const nextAnswers = [...answers];
    nextAnswers[step] = optionIndex;
    setAnswers(nextAnswers);

    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      setDone(true);
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  // Result type derives from the first question's chosen index — locale-safe.
  const goalIndex = answers[0] ?? 0;
  const resultType =
    goalIndex === 0 ? t("result.types.cut") : goalIndex === 1 ? t("result.types.build") : t("result.types.recomp");
  const goalLabel = questions[0]?.options[goalIndex] ?? "";

  const progress = done ? 100 : ((step + 1) / total) * 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent closeLabel={t("close")} className="p-6 sm:p-8">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("title")}</DialogDescription>

        {/* Progress bar */}
        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-accent"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!done ? (
            <motion.div
              key={`step-${step}`}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6"
            >
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                {t("counter", { current: step + 1, total })}
              </span>
              <h3 className="mt-2 text-2xl font-extrabold leading-snug">
                {questions[step].q}
              </h3>

              <div className="mt-5 grid gap-3">
                {questions[step].options.map((option, i) => {
                  const selected = answers[step] === i;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => choose(i)}
                      className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-start text-base font-bold transition-all ${
                        selected
                          ? "border-accent bg-accent/10 text-ink"
                          : "border-white/10 bg-bg text-ink hover:border-accent/60 hover:bg-white/5"
                      }`}
                    >
                      <span>{option}</span>
                      {selected && <Check className="h-5 w-5 text-accent" />}
                    </button>
                  );
                })}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={goBack}
                  className="mt-5 text-sm font-bold text-muted transition-colors hover:text-ink"
                >
                  {t("back")}
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-center"
            >
              <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-accent">
                {t("result.kicker")}
              </span>
              <div className="mx-auto mt-4 grid h-28 w-28 place-items-center rounded-full bg-accent/15 text-2xl font-extrabold text-accent shadow-glow">
                {resultType}
              </div>
              <h3 className="mt-5 text-2xl font-extrabold">{t("result.title")}</h3>
              <p className="mt-3 text-muted">{t("result.text", { goal: goalLabel })}</p>
              <Button
                className="mt-6 w-full"
                onClick={() => {
                  handleOpenChange(false);
                  scrollToWaitlist();
                }}
              >
                {t("result.cta")}
                <ChevronRight className="h-5 w-5 rtl:rotate-180" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
