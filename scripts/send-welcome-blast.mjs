// One-time backfill: send the welcome email to everyone already in the CSV
// export of the waitlist. Safe to re-run — it keeps a local sent-log and skips
// anyone already emailed, plus obvious test rows.
//
//   node --experimental-strip-types --env-file=.env.local \
//     scripts/send-welcome-blast.mjs "C:/Users/MSI/Downloads/waitlist_rows.csv"
//
// Add --dry to preview who WOULD be emailed without sending anything:
//   node ... scripts/send-welcome-blast.mjs <csv> --dry

import { readFileSync, existsSync, appendFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const csvPath = process.argv[2];
const dryRun = process.argv.includes("--dry");
const SENT_LOG = join(__dirname, ".welcome-sent.log");
const THROTTLE_MS = 2500; // gentle pacing so Gmail doesn't flag a burst

// Obvious test/placeholder addresses we never want to email.
const SKIP_EXACT = new Set([
  "user1@gmail.com",
  "user21@gmail.com",
  "bigboss@gmail.com",
]);
function looksLikeTest(email) {
  if (SKIP_EXACT.has(email)) return true;
  return /^user\d+@|^test@|@test\.|@example\./i.test(email);
}

if (!csvPath || !existsSync(csvPath)) {
  console.error("Usage: node ... send-welcome-blast.mjs <path-to-csv> [--dry]");
  process.exit(1);
}

// --- tiny CSV parser (handles quoted fields + commas inside quotes) ---------
function parseCsv(text) {
  const rows = [];
  let field = "";
  let record = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { record.push(field); field = ""; }
    else if (c === "\n") { record.push(field); rows.push(record); field = ""; record = []; }
    else if (c === "\r") { /* ignore */ }
    else field += c;
  }
  if (field.length > 0 || record.length > 0) { record.push(field); rows.push(record); }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim() !== ""));
}

const raw = readFileSync(csvPath, "utf8");
const rows = parseCsv(raw);
const header = rows.shift().map((h) => h.trim().toLowerCase());
const emailIdx = header.indexOf("email");
const nameIdx = header.indexOf("name");
const firstIdx = header.indexOf("first_name");
if (emailIdx === -1) {
  console.error("CSV has no 'email' column. Found:", header.join(", "));
  process.exit(1);
}

// Load already-sent set from the log.
const alreadySent = new Set(
  existsSync(SENT_LOG)
    ? readFileSync(SENT_LOG, "utf8").split("\n").map((l) => l.trim().toLowerCase()).filter(Boolean)
    : []
);

// Build a de-duplicated recipient list.
const seen = new Set();
const recipients = [];
for (const r of rows) {
  const email = (r[emailIdx] || "").trim().toLowerCase();
  if (!email || !email.includes("@")) continue;
  if (seen.has(email)) continue;
  seen.add(email);
  const name = (nameIdx > -1 ? r[nameIdx] : "") || (firstIdx > -1 ? r[firstIdx] : "");
  recipients.push({ email, name: (name || "").trim() });
}

const toSend = recipients.filter(
  (r) => !looksLikeTest(r.email) && !alreadySent.has(r.email)
);
const skipped = recipients.filter(
  (r) => looksLikeTest(r.email) || alreadySent.has(r.email)
);

console.log(`CSV rows: ${rows.length}`);
console.log(`Unique emails: ${recipients.length}`);
console.log(`Skipping (test/already-sent): ${skipped.length}`);
console.log(`To send: ${toSend.length}`);
console.log("");

if (dryRun) {
  console.log("--- DRY RUN (nothing sent) ---");
  toSend.forEach((r, i) => console.log(`${i + 1}. ${r.email}  ${r.name ? "(" + r.name + ")" : ""}`));
  process.exit(0);
}

const { sendWelcomeEmail, isEmailConfigured } = await import(
  "../src/lib/notify/email.ts"
);
if (!isEmailConfigured()) {
  console.error("GMAIL_USER / GMAIL_APP_PASSWORD not set in .env.local.");
  process.exit(1);
}

if (!existsSync(SENT_LOG)) writeFileSync(SENT_LOG, "");

let ok = 0;
let fail = 0;
for (let i = 0; i < toSend.length; i++) {
  const { email, name } = toSend[i];
  process.stdout.write(`[${i + 1}/${toSend.length}] ${email} ... `);
  const sent = await sendWelcomeEmail(email, name);
  if (sent) {
    appendFileSync(SENT_LOG, email + "\n");
    ok++;
    console.log("✅");
  } else {
    fail++;
    console.log("❌");
  }
  if (i < toSend.length - 1) await new Promise((res) => setTimeout(res, THROTTLE_MS));
}

console.log("");
console.log(`Done. Sent: ${ok}, Failed: ${fail}. Log: ${SENT_LOG}`);
process.exit(fail > 0 ? 1 : 0);
