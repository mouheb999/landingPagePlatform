// ---------------------------------------------------------------------------
// Assessment calculation engine
// ---------------------------------------------------------------------------
// Pure functions: given typed answers, produce a fully computed result.
// No UI, no i18n, no I/O — deterministic and unit-testable. This is the
// "intelligence" of the free assessment (BMR/TDEE, macros, and an opinionated
// recommendation that does NOT blindly trust the user's stated goal).

import {
  ACTIVITY_MULTIPLIERS,
  CALORIES_PER_GRAM,
  CALORIE_ADJUSTMENT,
  FAT_PER_KG,
  PROTEIN_PER_KG,
} from "./config";
import type {
  AssessmentAnswers,
  AssessmentResult,
  GoalId,
  MacroBreakdown,
  StrategyId,
} from "./types";

const round = (n: number) => Math.round(n);
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/** Mifflin-St Jeor basal metabolic rate. */
export function calcBMR(answers: AssessmentAnswers): number {
  const { weight, height, age, gender } = answers;
  const base = 10 * weight + 6.25 * height - 5 * age;
  return base + (gender === "male" ? 5 : -161);
}

/** Total daily energy expenditure = BMR × activity factor (= maintenance). */
export function calcTDEE(answers: AssessmentAnswers): number {
  return calcBMR(answers) * ACTIVITY_MULTIPLIERS[answers.activity];
}

export function calcBMI(answers: AssessmentAnswers): number {
  const h = answers.height / 100;
  return answers.weight / (h * h);
}

/** Naive 1:1 mapping from a stated goal to a strategy (before overrides). */
function naiveStrategy(goal: GoalId): StrategyId {
  switch (goal) {
    case "lose_fat":
      return "cut";
    case "build_muscle":
      return "lean_bulk";
    case "recomp":
      return "recomp";
    case "health":
      return "maintenance";
  }
}

/**
 * Opinionated recommendation. Combines stated goal with body-type, BMI,
 * training experience and activity so we can override unrealistic choices
 * (e.g. "build muscle" while obese → cut first).
 */
export function recommendStrategy(answers: AssessmentAnswers): StrategyId {
  const bmi = calcBMI(answers);
  const { goal, bodyType } = answers;

  const highBodyFat =
    bodyType === "obese" || bodyType === "overweight" || bmi >= 27;
  const underweight = bmi < 18.5 || bodyType === "very_lean";
  const skinnyFat = bodyType === "skinny_fat";

  switch (goal) {
    case "lose_fat":
      // Already lean and wants to lose fat → recomp serves them better.
      if (underweight) return "recomp";
      return "cut";

    case "build_muscle":
      if (highBodyFat) return "cut"; // strip fat before a clean bulk
      if (skinnyFat) return "recomp";
      return "lean_bulk";

    case "recomp":
      if (highBodyFat) return "cut";
      if (underweight) return "lean_bulk";
      return "recomp";

    case "health":
      if (highBodyFat) return "cut";
      if (underweight) return "lean_bulk";
      if (skinnyFat) return "recomp";
      return "maintenance";
  }
}

export function calcMacros(
  targetCalories: number,
  weight: number,
  strategy: StrategyId
): MacroBreakdown {
  const protein = round(PROTEIN_PER_KG[strategy] * weight);
  const fat = round(FAT_PER_KG * weight);

  const proteinCals = protein * CALORIES_PER_GRAM.protein;
  const fatCals = fat * CALORIES_PER_GRAM.fat;
  const remaining = Math.max(0, targetCalories - proteinCals - fatCals);
  const carbs = round(remaining / CALORIES_PER_GRAM.carbs);

  return { protein, carbs, fat };
}

/**
 * Rough but realistic timeline (in weeks) to a sensible body-composition
 * milestone, derived from the size of the deficit / surplus.
 */
function estimateTimelineWeeks(
  answers: AssessmentAnswers,
  strategy: StrategyId,
  maintenance: number,
  target: number
): number {
  const h = answers.height / 100;

  if (strategy === "cut") {
    const targetWeight = 24 * h * h; // upper end of a healthy BMI
    const excess = answers.weight - targetWeight;
    const weeklyLossKg = (Math.abs(maintenance - target) * 7) / 7700;
    if (excess <= 0 || weeklyLossKg <= 0) return 12;
    return clamp(round(excess / weeklyLossKg), 8, 52);
  }

  if (strategy === "lean_bulk") {
    const targetWeight = 22 * h * h;
    const gap = targetWeight - answers.weight;
    const weeklyGainKg = 0.25;
    if (gap <= 0) return 16;
    return clamp(round(gap / weeklyGainKg), 12, 52);
  }

  if (strategy === "recomp") return 20;
  return 0; // maintenance — ongoing
}

/** Confidence the inputs map to a reliable estimate (data-quality heuristic). */
function confidenceScore(answers: AssessmentAnswers, bmi: number): number {
  let c = 92;
  if (bmi < 16 || bmi > 40) c -= 6;
  if (answers.age < 18 || answers.age > 65) c -= 3;
  if (answers.experience === "first_time") c -= 2;
  return clamp(c, 80, 97);
}

/** Run the full engine. Single entry point used by the UI. */
export function computeAssessment(answers: AssessmentAnswers): AssessmentResult {
  const bmr = calcBMR(answers);
  const tdee = calcTDEE(answers);
  const bmi = calcBMI(answers);

  const strategy = recommendStrategy(answers);
  const overridden = strategy !== naiveStrategy(answers.goal);

  const maintenanceCalories = round(tdee);
  const targetCalories = round(tdee * (1 + CALORIE_ADJUSTMENT[strategy]));
  const macros = calcMacros(targetCalories, answers.weight, strategy);
  const timelineWeeks = estimateTimelineWeeks(
    answers,
    strategy,
    maintenanceCalories,
    targetCalories
  );

  return {
    bmr: round(bmr),
    tdee: round(tdee),
    maintenanceCalories,
    targetCalories,
    macros,
    strategy,
    bmi: Math.round(bmi * 10) / 10,
    timelineWeeks,
    confidence: confidenceScore(answers, bmi),
    overridden,
  };
}
