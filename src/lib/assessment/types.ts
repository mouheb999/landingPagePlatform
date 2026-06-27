// ---------------------------------------------------------------------------
// Assessment domain model
// ---------------------------------------------------------------------------
// Pure data types shared by the config, the calculation engine, and the UI.
// No React, no i18n, no side effects — this is the contract everything else
// agrees on. Reusable for the premium onboarding flow later.

export type Gender = "male" | "female";

export type GoalId = "lose_fat" | "build_muscle" | "recomp" | "health";

export type ActivityId =
  | "sedentary"
  | "light"
  | "moderate"
  | "very_active"
  | "extremely_active";

export type ExperienceId =
  | "first_time"
  | "beginner"
  | "experienced"
  | "consistent";

export type BodyTypeId =
  | "very_lean"
  | "skinny_fat"
  | "average"
  | "overweight"
  | "obese";

export type BlockerId =
  | "what_to_eat"
  | "eating_too_much"
  | "commitment"
  | "where_to_start"
  | "no_results";

export type StrategyId = "cut" | "lean_bulk" | "recomp" | "maintenance";

export type QuestionId =
  | "goal"
  | "gender"
  | "age"
  | "height"
  | "weight"
  | "activity"
  | "experience"
  | "commitment_days"
  | "body_type"
  | "blocker";

// ---------------------------------------------------------------------------
// Question definitions (structure only — display text lives in i18n)
// ---------------------------------------------------------------------------

export type SliderUnit = "years" | "cm" | "kg";

interface BaseQuestion {
  id: QuestionId;
}

export interface ChoiceQuestion extends BaseQuestion {
  type: "choice";
  /** Stable option IDs, index-aligned with the translated `options` array. */
  optionValues: string[];
  /** Render hint — silhouette grid vs. plain stacked cards. */
  variant?: "cards" | "silhouettes";
}

export interface SliderQuestion extends BaseQuestion {
  type: "slider";
  min: number;
  max: number;
  step: number;
  default: number;
  unit: SliderUnit;
}

export type AssessmentQuestion = ChoiceQuestion | SliderQuestion;

// ---------------------------------------------------------------------------
// Collected answers + computed result
// ---------------------------------------------------------------------------

export interface AssessmentAnswers {
  goal: GoalId;
  gender: Gender;
  age: number;
  height: number; // cm
  weight: number; // kg
  activity: ActivityId;
  experience: ExperienceId;
  commitmentDays: number;
  bodyType: BodyTypeId;
  blocker: BlockerId;
}

export interface MacroBreakdown {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
}

export interface AssessmentResult {
  bmr: number;
  tdee: number;
  maintenanceCalories: number;
  targetCalories: number;
  macros: MacroBreakdown;
  strategy: StrategyId;
  bmi: number;
  timelineWeeks: number;
  confidence: number; // 0–100
  /** True when the engine overrode the user's stated goal (e.g. bulk → cut). */
  overridden: boolean;
}
