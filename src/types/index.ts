export type Gender = "male" | "female";

export type WaitlistGoal =
  | "fat_loss"
  | "muscle_gain"
  | "fitness"
  | "recomposition";

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  age: number | null;
  goal: WaitlistGoal;
  created_at: string;
}

export type WaitlistInsert = Omit<WaitlistEntry, "id" | "created_at">;

export interface AssessmentResult {
  type: "Cut" | "Build" | "Recomp";
  goalIndex: number;
  answers: number[];
}

export type ActionState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string };
