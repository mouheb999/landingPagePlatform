"use server";

import { z } from "zod";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { ActionState } from "@/types";

const schema = z.object({
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
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    gender: formData.get("gender"),
    age: formData.get("age") ?? "",
    goal: formData.get("goal"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  // Allow the form to work end-to-end before Supabase is wired up.
  if (!isSupabaseConfigured()) {
    console.info("[waitlist] (no Supabase configured) signup:", parsed.data);
    return { status: "success" };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("waitlist").insert(parsed.data);

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
