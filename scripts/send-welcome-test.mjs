// One-off: send the welcome email to a single test inbox so we can eyeball it
// before any wider send. Run with:
//   node --experimental-strip-types --env-file=.env.local scripts/send-welcome-test.mjs
//
// Optionally pass a different recipient/name:
//   node ... scripts/send-welcome-test.mjs someone@example.com "Full Name"

const to = process.argv[2] || "mou.heb142003@gmail.com";
const name = process.argv[3] || "Mohamed";

const { sendWelcomeEmail, isEmailConfigured } = await import(
  "../src/lib/notify/email.ts"
);

if (!isEmailConfigured()) {
  console.error(
    "GMAIL_USER / GMAIL_APP_PASSWORD not set. Add them to .env.local and re-run."
  );
  process.exit(1);
}

console.log(`Sending welcome email → ${to} ...`);
const ok = await sendWelcomeEmail(to, name);
console.log(ok ? "✅ Sent." : "❌ Failed (see error above).");
process.exit(ok ? 0 : 1);
