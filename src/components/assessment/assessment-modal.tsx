"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Drumstick,
  Droplet,
  Flame,
  Gauge,
  Loader2,
  Lock,
  Target,
  Wheat,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitAssessment } from "@/actions/waitlist";
import { computeAssessment } from "@/lib/assessment/calculator";
import { GOAL_TO_WAITLIST } from "@/lib/assessment/mappers";
import {
  ASSESSMENT_QUESTIONS,
  PREMIUM_FEATURES,
  TOTAL_QUESTIONS,
} from "@/lib/assessment/config";
import type {
  ActivityId,
  AssessmentAnswers,
  AssessmentResult,
  BlockerId,
  BodyTypeId,
  ExperienceId,
  Gender,
  GoalId,
  QuestionId,
  SliderQuestion,
} from "@/lib/assessment/types";

type AnswerMap = Partial<Record<QuestionId, string | number>>;
type TranslatedQuestion = { q: string; options: string[] };
type Phase = "quiz" | "result" | "form" | "success";

interface AssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

function assemble(rec: AnswerMap): AssessmentAnswers {
  return {
    goal: rec.goal as GoalId,
    gender: rec.gender as Gender,
    age: Number(rec.age),
    height: Number(rec.height),
    weight: Number(rec.weight),
    activity: rec.activity as ActivityId,
    experience: rec.experience as ExperienceId,
    commitmentDays: Number(rec.commitment_days),
    bodyType: rec.body_type as BodyTypeId,
    blocker: rec.blocker as BlockerId,
  };
}

export function AssessmentModal({ open, onOpenChange }: AssessmentModalProps) {
  const t = useTranslations("assessment");
  const questions = t.raw("questions") as TranslatedQuestion[];

  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [finalAnswers, setFinalAnswers] = useState<AssessmentAnswers | null>(
    null
  );
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const reset = () => {
    setPhase("quiz");
    setStep(0);
    setAnswers({});
    setFinalAnswers(null);
    setResult(null);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const commit = (value: string | number) => {
    const question = ASSESSMENT_QUESTIONS[step];
    const next: AnswerMap = { ...answers, [question.id]: value };
    setAnswers(next);

    if (step < TOTAL_QUESTIONS - 1) {
      setStep((s) => s + 1);
    } else {
      const built = assemble(next);
      setFinalAnswers(built);
      setResult(computeAssessment(built));
      setPhase("result");
    }
  };

  const goBack = () => setStep((s) => Math.max(0, s - 1));

  const progress =
    phase === "quiz" ? ((step + 1) / TOTAL_QUESTIONS) * 100 : 100;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent closeLabel={t("close")} className="p-6 sm:p-8">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("title")}</DialogDescription>

        {phase === "quiz" && (
          <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-accent"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === "quiz" && (
            <QuizStep
              key={`step-${step}`}
              step={step}
              question={questions[step]}
              answers={answers}
              counter={t("counter", { current: step + 1, total: TOTAL_QUESTIONS })}
              units={{
                years: t("units.years"),
                cm: t("units.cm"),
                kg: t("units.kg"),
              }}
              nextLabel={t("next")}
              backLabel={t("back")}
              onCommit={commit}
              onBack={goBack}
            />
          )}

          {phase === "result" && result && finalAnswers && (
            <ResultView
              key="result"
              result={result}
              onContinue={() => setPhase("form")}
            />
          )}

          {phase === "form" && result && finalAnswers && (
            <SignupForm
              key="form"
              result={result}
              answers={finalAnswers}
              onSuccess={() => setPhase("success")}
            />
          )}

          {phase === "success" && (
            <SuccessView
              key="success"
              onClose={() => handleOpenChange(false)}
            />
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Quiz step (choice cards, silhouettes, or slider)
// ---------------------------------------------------------------------------
function QuizStep({
  step,
  question,
  answers,
  counter,
  units,
  nextLabel,
  backLabel,
  onCommit,
  onBack,
}: {
  step: number;
  question: TranslatedQuestion;
  answers: AnswerMap;
  counter: string;
  units: Record<"years" | "cm" | "kg", string>;
  nextLabel: string;
  backLabel: string;
  onCommit: (value: string | number) => void;
  onBack: () => void;
}) {
  const config = ASSESSMENT_QUESTIONS[step];

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mt-6"
    >
      <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
        {counter}
      </span>
      <h3 className="mt-2 text-2xl font-extrabold leading-snug">{question.q}</h3>

      {config.type === "slider" ? (
        <SliderField
          config={config}
          unit={units[config.unit]}
          initial={Number(answers[config.id] ?? config.default)}
          nextLabel={nextLabel}
          onCommit={onCommit}
        />
      ) : config.variant === "silhouettes" ? (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {question.options.map((label, i) => {
            const selected = answers[config.id] === config.optionValues[i];
            return (
              <button
                key={config.optionValues[i]}
                type="button"
                onClick={() => onCommit(config.optionValues[i])}
                className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-sm font-bold transition-all ${
                  selected
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-white/10 bg-bg text-ink hover:border-accent/60 hover:bg-white/5"
                }`}
              >
                <Silhouette level={i} active={selected} />
                <span className="leading-tight">{label}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 grid gap-3">
          {question.options.map((label, i) => {
            const selected = answers[config.id] === config.optionValues[i];
            return (
              <button
                key={config.optionValues[i]}
                type="button"
                onClick={() => onCommit(config.optionValues[i])}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-4 text-start text-base font-bold transition-all ${
                  selected
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-white/10 bg-bg text-ink hover:border-accent/60 hover:bg-white/5"
                }`}
              >
                <span>{label}</span>
                {selected && <Check className="h-5 w-5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {backLabel}
        </button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Slider field (age / height / weight)
// ---------------------------------------------------------------------------
function SliderField({
  config,
  unit,
  initial,
  nextLabel,
  onCommit,
}: {
  config: SliderQuestion;
  unit: string;
  initial: number;
  nextLabel: string;
  onCommit: (value: number) => void;
}) {
  const [value, setValue] = useState(initial);

  return (
    <div className="mt-7">
      <div className="text-center">
        <span className="text-5xl font-extrabold tabular-nums text-ink">
          {value}
        </span>
        <span className="ms-2 text-lg font-bold text-muted">{unit}</span>
      </div>

      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="mt-6 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-accent"
      />
      <div className="mt-2 flex justify-between text-xs font-bold text-muted">
        <span>
          {config.min} {unit}
        </span>
        <span>
          {config.max} {unit}
        </span>
      </div>

      <Button className="mt-7 w-full" onClick={() => onCommit(value)}>
        {nextLabel}
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </Button>
    </div>
  );
}

function Silhouette({ level, active }: { level: number; active: boolean }) {
  const w = 14 + level * 6; // 14 → 38
  return (
    <svg
      viewBox="0 0 60 70"
      className={`h-12 w-auto ${active ? "text-accent" : "text-muted"}`}
      fill="currentColor"
      aria-hidden
    >
      <circle cx="30" cy="11" r="8" />
      <rect x={30 - w / 2} y="22" width={w} height="42" rx={w / 2} />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Result dashboard
// ---------------------------------------------------------------------------
function ResultView({
  result,
  onContinue,
}: {
  result: AssessmentResult;
  onContinue: () => void;
}) {
  const t = useTranslations("assessment.result");
  const tp = useTranslations("assessment.premium");

  const strategyName = t(`strategies.${result.strategy}`);
  const timeline =
    result.timelineWeeks > 0
      ? t("weeksValue", { weeks: result.timelineWeeks })
      : t("ongoing");
  const explanation = t(`explanations.${result.strategy}`, {
    target: result.targetCalories,
    protein: result.macros.protein,
    strategy: strategyName,
    timeline,
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="mt-6"
    >
      <div className="text-center">
        <span className="text-base font-extrabold uppercase tracking-[0.2em] text-accent rtl:tracking-normal rtl:normal-case">
          {t("kicker")}
        </span>
        <h3 className="mt-2 text-2xl font-extrabold leading-snug">
          {t("headline")}
        </h3>
        <p className="mt-2 text-sm text-muted">{t("subhead")}</p>
      </div>

      {/* Calorie cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard
          icon={<Flame className="h-5 w-5" />}
          label={t("maintenanceLabel")}
          value={result.maintenanceCalories.toLocaleString()}
          suffix={t("kcal")}
        />
        <StatCard
          icon={<Target className="h-5 w-5" />}
          label={t("targetLabel")}
          value={result.targetCalories.toLocaleString()}
          suffix={t("kcal")}
          highlight
        />
      </div>

      {/* Macros */}
      <div className="mt-3 grid grid-cols-3 gap-3">
        <StatCard
          icon={<Drumstick className="h-5 w-5" />}
          label={t("proteinLabel")}
          value={String(result.macros.protein)}
          suffix={t("grams")}
        />
        <StatCard
          icon={<Wheat className="h-5 w-5" />}
          label={t("carbsLabel")}
          value={String(result.macros.carbs)}
          suffix={t("grams")}
        />
        <StatCard
          icon={<Droplet className="h-5 w-5" />}
          label={t("fatLabel")}
          value={String(result.macros.fat)}
          suffix={t("grams")}
        />
      </div>

      {/* Strategy / timeline / confidence */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label={t("strategyLabel")}
          value={strategyName}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5" />}
          label={t("timelineLabel")}
          value={timeline}
        />
        <StatCard
          icon={<Gauge className="h-5 w-5" />}
          label={t("confidenceLabel")}
          value={`${result.confidence}%`}
        />
      </div>

      {/* Personalised explanation */}
      <p className="mt-5 rounded-2xl border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-ink/90">
        {explanation}
      </p>

      {/* Premium preview (locked) */}
      <div className="mt-6">
        <h4 className="text-sm font-extrabold uppercase tracking-[0.16em] text-ink/80">
          {tp("title")}
        </h4>
        <p className="mt-1 text-xs text-muted">{tp("subtitle")}</p>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PREMIUM_FEATURES.map((id) => (
            <div
              key={id}
              className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-bg/60 p-3.5"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 text-muted">
                <Lock className="h-4 w-4" />
              </span>
              <span className="select-none text-sm font-bold text-ink/70 blur-[2px]">
                {tp(`features.${id}`)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={onContinue}>
        {t("cta")}
        <ChevronRight className="h-5 w-5 rtl:rotate-180" />
      </Button>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  suffix,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-accent/40 bg-accent/10 shadow-glow"
          : "border-white/10 bg-bg"
      }`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl ${
          highlight ? "bg-accent/20 text-accent" : "bg-white/5 text-accent"
        }`}
      >
        {icon}
      </span>
      <p className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold leading-tight text-ink">
        {value}
        {suffix && (
          <span className="ms-1 text-xs font-bold text-muted">{suffix}</span>
        )}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Signup form (rich payload — auto-fills the computed snapshot)
// ---------------------------------------------------------------------------
function SignupForm({
  result,
  answers,
  onSuccess,
}: {
  result: AssessmentResult;
  answers: AssessmentAnswers;
  onSuccess: () => void;
}) {
  const t = useTranslations("assessment.form");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function action(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await submitAssessment(formData);
      if (res.status === "success") onSuccess();
      else setError(t("errors.generic"));
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="mt-6"
    >
      <h3 className="text-2xl font-extrabold leading-snug">{t("title")}</h3>
      <p className="mt-2 text-sm text-muted">{t("subtitle")}</p>

      <form action={action} className="mt-6 grid gap-4">
        {/* Auto-populated snapshot — the user never edits these. */}
        <input type="hidden" name="goal" value={GOAL_TO_WAITLIST[answers.goal]} />
        <input type="hidden" name="gender" value={answers.gender} />
        <input type="hidden" name="age" value={answers.age} />
        <input type="hidden" name="height" value={answers.height} />
        <input type="hidden" name="weight" value={answers.weight} />
        <input type="hidden" name="activity" value={answers.activity} />
        <input type="hidden" name="experience" value={answers.experience} />
        <input type="hidden" name="bodyType" value={answers.bodyType} />
        <input type="hidden" name="strategy" value={result.strategy} />
        <input
          type="hidden"
          name="maintenanceCalories"
          value={result.maintenanceCalories}
        />
        <input type="hidden" name="targetCalories" value={result.targetCalories} />
        <input type="hidden" name="protein" value={result.macros.protein} />
        <input type="hidden" name="carbs" value={result.macros.carbs} />
        <input type="hidden" name="fat" value={result.macros.fat} />
        <input type="hidden" name="timelineWeeks" value={result.timelineWeeks} />
        <input type="hidden" name="bmr" value={result.bmr} />
        <input type="hidden" name="tdee" value={result.tdee} />
        <input type="hidden" name="bmi" value={result.bmi} />

        <div className="grid gap-2">
          <Label htmlFor="as-name">{t("fullName")}</Label>
          <Input
            id="as-name"
            name="fullName"
            required
            autoComplete="name"
            placeholder={t("fullNamePlaceholder")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="as-email">{t("email")}</Label>
          <Input
            id="as-email"
            name="email"
            type="email"
            required
            inputMode="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="as-whatsapp">{t("whatsapp")}</Label>
          <Input
            id="as-whatsapp"
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
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Success
// ---------------------------------------------------------------------------
function SuccessView({ onClose }: { onClose: () => void }) {
  const t = useTranslations("assessment.form");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="mt-6 flex flex-col items-center justify-center py-6 text-center"
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="h-16 w-16 text-accent" strokeWidth={1.5} />
      <h3 className="mt-4 text-2xl font-extrabold">{t("successTitle")}</h3>
      <p className="mt-3 max-w-sm text-muted">{t("successText")}</p>
      <Button variant="secondary" className="mt-6" onClick={onClose}>
        {t("done")}
      </Button>
    </motion.div>
  );
}
