"use server";

import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ActionState, WaitlistInsert } from "@/types";

// ---------------------------------------------------------------------------
// Shared insert helper
// ---------------------------------------------------------------------------
async function insertWaitlist(row: WaitlistInsert): Promise<ActionState> {
  // Allow the forms to work end-to-end before Supabase is wired up.
  if (!isSupabaseConfigured()) {
    console.info("[waitlist] (no Supabase configured) signup:", row);
    return { status: "success" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("waitlist").insert(row);

    if (error) {
      // Unique violation → already signed up, treat as success for UX.
      if (error.code === "23505") return { status: "success" };
      console.error("[waitlist] insert error:", error);
      return { status: "error", message: "generic" };
    }

    return { status: "success" };
  } catch (err) {
    console.error("[waitlist] unexpected error:", err);
    return { status: "error", message: "generic" };
  }
}

// ---------------------------------------------------------------------------
// Simple section form
// ---------------------------------------------------------------------------
const sectionSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  gender: z.enum(["male", "female"]),
  age: z
    .union([z.coerce.number().int().min(10).max(100), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  goal: z.enum(["fat_loss", "muscle_gain", "fitness", "recomposition"]),
});

export async function joinWaitlist(formData: FormData): Promise<ActionState> {
  const parsed = sectionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    gender: formData.get("gender"),
    age: formData.get("age") ?? "",
    goal: formData.get("goal"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  return insertWaitlist({ ...parsed.data, source: "section" });
}

// ---------------------------------------------------------------------------
// Assessment form (rich payload with computed snapshot)
// ---------------------------------------------------------------------------
const assessmentSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(120),
  whatsapp: z.string().trim().min(5).max(30),
  gender: z.enum(["male", "female"]),
  goal: z.enum(["fat_loss", "muscle_gain", "fitness", "recomposition"]),
  age: z.coerce.number().int().min(10).max(100),
  height: z.coerce.number().int().min(120).max(250),
  weight: z.coerce.number().min(30).max(300),
  activity: z.string().trim().max(40),
  experience: z.string().trim().max(40),
  bodyType: z.string().trim().max(40),
  strategy: z.enum(["cut", "lean_bulk", "recomp", "maintenance"]),
  maintenanceCalories: z.coerce.number().int(),
  targetCalories: z.coerce.number().int(),
  protein: z.coerce.number().int(),
  carbs: z.coerce.number().int(),
  fat: z.coerce.number().int(),
  timelineWeeks: z.coerce.number().int(),
  bmr: z.coerce.number().int(),
  tdee: z.coerce.number().int(),
  bmi: z.coerce.number(),
});

export async function submitAssessment(
  formData: FormData
): Promise<ActionState> {
  const parsed = assessmentSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    gender: formData.get("gender"),
    goal: formData.get("goal"),
    age: formData.get("age"),
    height: formData.get("height"),
    weight: formData.get("weight"),
    activity: formData.get("activity"),
    experience: formData.get("experience"),
    bodyType: formData.get("bodyType"),
    strategy: formData.get("strategy"),
    maintenanceCalories: formData.get("maintenanceCalories"),
    targetCalories: formData.get("targetCalories"),
    protein: formData.get("protein"),
    carbs: formData.get("carbs"),
    fat: formData.get("fat"),
    timelineWeeks: formData.get("timelineWeeks"),
    bmr: formData.get("bmr"),
    tdee: formData.get("tdee"),
    bmi: formData.get("bmi"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  const d = parsed.data;
  return insertWaitlist({
    name: d.fullName,
    email: d.email,
    whatsapp: d.whatsapp,
    gender: d.gender,
    goal: d.goal,
    age: d.age,
    height: d.height,
    weight: d.weight,
    activity: d.activity,
    experience: d.experience,
    body_type: d.bodyType,
    strategy: d.strategy,
    maintenance_calories: d.maintenanceCalories,
    target_calories: d.targetCalories,
    protein: d.protein,
    carbs: d.carbs,
    fat: d.fat,
    timeline_weeks: d.timelineWeeks,
    bmr: d.bmr,
    tdee: d.tdee,
    bmi: d.bmi,
    source: "assessment",
  });
}
