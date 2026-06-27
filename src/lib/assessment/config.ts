// ---------------------------------------------------------------------------
// Assessment configuration
// ---------------------------------------------------------------------------
// The single source of truth for the questionnaire *structure*. Display text
// (questions, option labels, units) is resolved from i18n at render time and
// is index-aligned with `optionValues` here. Add / reorder questions by
// editing this array + the matching `assessment.questions` i18n array.

import type {
  ActivityId,
  AssessmentQuestion,
  StrategyId,
} from "./types";

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: "goal",
    type: "choice",
    optionValues: ["lose_fat", "build_muscle", "recomp", "health"],
  },
  {
    id: "gender",
    type: "choice",
    optionValues: ["male", "female"],
  },
  {
    id: "age",
    type: "slider",
    min: 16,
    max: 70,
    step: 1,
    default: 25,
    unit: "years",
  },
  {
    id: "height",
    type: "slider",
    min: 140,
    max: 220,
    step: 1,
    default: 175,
    unit: "cm",
  },
  {
    id: "weight",
    type: "slider",
    min: 35,
    max: 200,
    step: 1,
    default: 75,
    unit: "kg",
  },
  {
    id: "activity",
    type: "choice",
    optionValues: [
      "sedentary",
      "light",
      "moderate",
      "very_active",
      "extremely_active",
    ],
  },
  {
    id: "experience",
    type: "choice",
    optionValues: ["first_time", "beginner", "experienced", "consistent"],
  },
  {
    id: "commitment_days",
    type: "choice",
    optionValues: ["2", "3", "4", "5", "6"],
  },
  {
    id: "body_type",
    type: "choice",
    variant: "silhouettes",
    optionValues: ["very_lean", "overweight", "skinny_fat", "average", "obese"],
  },
  {
    id: "blocker",
    type: "choice",
    optionValues: [
      "what_to_eat",
      "eating_too_much",
      "commitment",
      "where_to_start",
      "no_results",
    ],
  },
];

export const TOTAL_QUESTIONS = ASSESSMENT_QUESTIONS.length;

// ---------------------------------------------------------------------------
// Calculation constants
// ---------------------------------------------------------------------------

/** Mifflin-St Jeor activity multipliers, keyed by activity level. */
export const ACTIVITY_MULTIPLIERS: Record<ActivityId, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

/** Calorie adjustment applied to maintenance for each strategy. */
export const CALORIE_ADJUSTMENT: Record<StrategyId, number> = {
  cut: -0.2, // 20% deficit
  lean_bulk: 0.1, // 10% surplus
  recomp: 0, // maintenance
  maintenance: 0,
};

/** Protein target (g per kg of bodyweight) per strategy. */
export const PROTEIN_PER_KG: Record<StrategyId, number> = {
  cut: 2.2,
  lean_bulk: 2.0,
  recomp: 2.2,
  maintenance: 1.8,
};

/** Fat target (g per kg of bodyweight) — constant across strategies. */
export const FAT_PER_KG = 0.8;

export const CALORIES_PER_GRAM = {
  protein: 4,
  carbs: 4,
  fat: 9,
} as const;

/** Premium feature cards shown locked under the result. IDs map to i18n. */
export const PREMIUM_FEATURES = [
  "meal_plan",
  "workout_plan",
  "progress_tracking",
  "food_logger",
  "coaching",
] as const;

export type PremiumFeatureId = (typeof PREMIUM_FEATURES)[number];
