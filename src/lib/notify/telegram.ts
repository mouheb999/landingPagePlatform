import type { WaitlistInsert } from "@/types";

/**
 * Fire a Telegram message to the project owner when someone joins the waitlist.
 * Best-effort: if the bot env vars are missing or the call fails, we log and
 * move on — a notification problem must never break a signup.
 */
export async function notifyNewSignup(
  row: WaitlistInsert,
  meta?: { seq?: number | null; duplicate?: boolean }
): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIdRaw = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatIdRaw) return;

  // Support one or many recipients: TELEGRAM_CHAT_ID may hold a single id or a
  // comma-separated list (e.g. "123456,789012") so multiple people get pinged.
  const chatIds = chatIdRaw
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  if (chatIds.length === 0) return;

  const seq = meta?.seq ?? null;
  const duplicate = meta?.duplicate ?? false;
  const numberTag = seq ? ` #${seq}` : "";
  const header = duplicate
    ? `🔁 Repeat signup${seq ? ` (already${numberTag})` : ""}`
    : `🎉 New ELMADHI waitlist signup${numberTag}`;

  const lines: (string | null)[] = [
    header,
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

  // Fire to every recipient; one failure must not stop the others.
  await Promise.allSettled(
    chatIds.map(async (chatId) => {
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              chat_id: chatId,
              text,
              disable_web_page_preview: true,
            }),
          }
        );
        if (!res.ok) {
          console.error(
            `[telegram] notify failed for ${chatId}:`,
            res.status,
            await res.text()
          );
        }
      } catch (err) {
        console.error(`[telegram] notify error for ${chatId}:`, err);
      }
    })
  );
}
