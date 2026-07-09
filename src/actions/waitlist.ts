"use server";

import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { notifyNewSignup } from "@/lib/notify/telegram";
import type { ActionState, WaitlistInsert } from "@/types";

// ---------------------------------------------------------------------------
// Spam trap (honeypot)
// ---------------------------------------------------------------------------
// A hidden form field no human ever sees. Bots that auto-fill every input
// populate it; when it arrives non-empty we silently drop the submission
// (return success so the bot learns nothing, but never touch the DB/Telegram).
const HONEYPOT_FIELD = "company_url";

function isHoneypotTripped(formData: FormData): boolean {
  const trap = formData.get(HONEYPOT_FIELD);
  return typeof trap === "string" && trap.trim().length > 0;
}

// ---------------------------------------------------------------------------
// Shared insert helper
// ---------------------------------------------------------------------------
async function insertWaitlist(row: WaitlistInsert): Promise<ActionState> {
  // Allow the forms to work end-to-end before Supabase is wired up.
  if (!isSupabaseConfigured()) {
    console.info("[waitlist] (no Supabase configured) signup:", row);
    await notifyNewSignup(row);
    return { status: "success" };
  }

  try {
    const supabase = await createClient();
    // join_waitlist() inserts the row and returns { seq, duplicate }. It runs
    // security-definer so we can read back the incremental signup number
    // without opening the table for reads. Duplicates are handled inside the
    // function (returns the original seq + duplicate:true) instead of erroring.
    const { data, error } = await supabase.rpc("join_waitlist", {
      payload: row,
    });

    if (error) {
      console.error("[waitlist] insert error:", error);
      return { status: "error", message: "generic" };
    }

    const result = (data ?? {}) as { seq?: number | null; duplicate?: boolean };
    await notifyNewSignup(row, {
      seq: result.seq ?? null,
      duplicate: result.duplicate ?? false,
    });
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
  whatsapp: z.string().trim().min(5).max(30),
});

export async function joinWaitlist(formData: FormData): Promise<ActionState> {
  if (isHoneypotTripped(formData)) return { status: "success" };

  const parsed = sectionSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
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
  if (isHoneypotTripped(formData)) return { status: "success" };

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
