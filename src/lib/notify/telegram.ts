import type { WaitlistInsert } from "@/types";

/**
 * Fire a Telegram message to the project owner when someone joins the waitlist.
 * Best-effort: if the bot env vars are missing or the call fails, we log and
 * move on — a notification problem must never break a signup.
 */
export async function notifyNewSignup(row: WaitlistInsert): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const lines: (string | null)[] = [
    "🎉 New ELMADHI waitlist signup",
    "",
    row.name ? `👤 Name: ${row.name}` : null,
    row.email ? `📧 Email: ${row.email}` : null,
    row.whatsapp ? `📱 WhatsApp: ${row.whatsapp}` : null,
    row.source ? `🔖 Source: ${row.source}` : null,
  ];

  // Richer context for full assessment submissions.
  if (row.source === "assessment") {
    if (row.goal) lines.push(`🎯 Goal: ${row.goal}`);
    if (row.strategy) lines.push(`📐 Strategy: ${row.strategy}`);
    if (row.target_calories) lines.push(`🔥 Target: ${row.target_calories} kcal`);
  }

  const text = lines.filter(Boolean).join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("[telegram] notify failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[telegram] notify error:", err);
  }
}
