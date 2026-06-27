export type Gender = "male" | "female";

export type WaitlistGoal =
  | "fat_loss"
  | "muscle_gain"
  | "fitness"
  | "recomposition";

export type WaitlistStrategy = "cut" | "lean_bulk" | "recomp" | "maintenance";

export type WaitlistSource = "section" | "assessment";

export interface WaitlistEntry {
  id: string;
  name: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  whatsapp: string | null;
  country: string | null;
  gender: Gender | null;
  age: number | null;
  goal: WaitlistGoal | null;
  // Assessment snapshot (only set for assessment-sourced signups).
  height: number | null;
  weight: number | null;
  activity: string | null;
  experience: string | null;
  body_type: string | null;
  strategy: WaitlistStrategy | null;
  maintenance_calories: number | null;
  target_calories: number | null;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  timeline_weeks: number | null;
  bmr: number | null;
  tdee: number | null;
  bmi: number | null;
  source: WaitlistSource;
  created_at: string;
}

export type WaitlistInsert = Partial<Omit<WaitlistEntry, "id" | "created_at">> & {
  email: string;
};

export type ActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };
