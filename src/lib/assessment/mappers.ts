// Bridges the assessment domain to the waitlist persistence model.
import type { WaitlistGoal } from "@/types";
import type { GoalId } from "./types";

/** Stated assessment goal → the waitlist `goal` enum stored in Supabase. */
export const GOAL_TO_WAITLIST: Record<GoalId, WaitlistGoal> = {
  lose_fat: "fat_loss",
  build_muscle: "muscle_gain",
  recomp: "recomposition",
  health: "fitness",
};
