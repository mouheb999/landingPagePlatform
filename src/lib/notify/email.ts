import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import nodemailer, { type Transporter } from "nodemailer";

// ---------------------------------------------------------------------------
// Gmail SMTP welcome email
// ---------------------------------------------------------------------------
// Sends a branded Arabic welcome email FROM the project owner's Gmail account,
// authenticated with a Google "App Password" (never the real account password).
// Because Google itself signs the outgoing mail, it passes SPF/DKIM/DMARC and
// lands in the inbox — this is the only legitimate way to send "from" a
// @gmail.com address.
//
// Env:
//   GMAIL_USER          e.g. mou.heb142003@gmail.com
//   GMAIL_APP_PASSWORD  the 16-char app password (spaces removed)
//
// Best-effort by design: if env is missing or a send fails, we log and move on.
// A welcome-email problem must NEVER break a signup (same rule as Telegram).

const BRAND = {
  bg: "#0f0f0f",
  surface: "#202020",
  accent: "#5dd62c",
  ink: "#f8f8f8",
  muted: "rgba(248,248,248,0.65)",
  hairline: "rgba(255,255,255,0.10)",
};

// Same stack as the landing page (tailwind.config.ts): Cairo first.
const FONT_STACK = "'Cairo','Tajawal','Segoe UI',Tahoma,Arial,sans-serif";

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  if (!user || !pass) return null;

  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return cachedTransporter;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
}

// Resolve the real logo (public/logo.png) so we can embed it inline. Cached.
let logoBufferChecked = false;
let logoBuffer: Buffer | null = null;
function getLogoBuffer(): Buffer | null {
  if (logoBufferChecked) return logoBuffer;
  logoBufferChecked = true;
  try {
    const p = join(process.cwd(), "public", "logo.png");
    if (existsSync(p)) logoBuffer = readFileSync(p);
  } catch {
    logoBuffer = null;
  }
  return logoBuffer;
}

const SUBJECT = "أهلا بيك في منصة ELMADHI 🎉 إنت من الأوائل!";
const LOGO_CID = "elmadhi-logo";

/**
 * Builds the branded Arabic (RTL) welcome email as HTML. Table-based + inline
 * styles for maximum email-client compatibility (Gmail, Outlook, Apple Mail).
 * `logoSrc` is either a cid: reference (embedded attachment) or a remote URL.
 */
function buildHtml(name: string | null | undefined, logoSrc: string): string {
  const greeting = name && name.trim() ? `أهلا ${name.trim()} 👋` : "أهلا بيك 👋";

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&display=swap" rel="stylesheet" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800&display=swap');
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body, .email-bg { background-color: ${BRAND.bg} !important; }
</style>
<title>ELMADHI</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};color:${BRAND.ink};font-family:${FONT_STACK};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">حجزت بلاصتك بنجاح. أول ما تفتح المنصة، نبعثولك إيميل وتلقى تقييمك حاضر. 🚀</div>
  <table role="presentation" class="email-bg" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND.bg}" style="background-color:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center" bgcolor="${BRAND.bg}">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="${BRAND.surface}" style="max-width:560px;background-color:${BRAND.surface};border:1px solid ${BRAND.hairline};border-radius:20px;overflow:hidden;">
          <!-- Header / logo -->
          <tr>
            <td align="center" style="padding:36px 32px 4px 32px;">
              <img src="${logoSrc}" alt="ELMADHI" height="40" style="height:40px;width:auto;display:inline-block;vertical-align:middle;" />
              <div style="margin-top:10px;font-family:${FONT_STACK};font-size:22px;font-weight:800;letter-spacing:1px;color:${BRAND.ink};">
                ELMADHI
              </div>
            </td>
          </tr>
          <!-- Headline -->
          <tr>
            <td style="padding:18px 32px 4px 32px;" align="center">
              <div style="font-family:${FONT_STACK};font-size:26px;line-height:1.5;font-weight:800;color:${BRAND.ink};">
                مبروك! 🎉
              </div>
              <div style="margin-top:6px;font-family:${FONT_STACK};font-size:19px;line-height:1.6;font-weight:700;color:${BRAND.accent};">
                إنت رسميًا من الأوائل في ELMADHI
              </div>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:18px 32px 8px 32px;" align="right">
              <p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.95;color:${BRAND.ink};">
                ${greeting}
              </p>
              <p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.95;color:${BRAND.muted};">
                حجزت بلاصتك في <strong style="color:${BRAND.ink};">ELMADHI</strong>، وإنت من أوّل الناس اللي باش يجرّبوا المنصة قبل الإطلاق الرسمي.
              </p>
              <p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.95;color:${BRAND.muted};">
                <strong style="color:${BRAND.ink};">ELMADHI ما تعطيكش مجرد برنامج تمشي عليه.</strong> تعطيك المعرفة اللي تخليك تفهم جسمك، تختار أكلك بذكاء، تتمرّن بالطريقة الصحيحة، ومع الوقت معادش تحتاج حد يقولك شتعمل.
              </p>
              <p style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:16px;line-height:1.95;color:${BRAND.muted};">
                وبما إنك من الأوائل، باش تكون من أوّل الناس اللي يكتشفوا كل المزايا الجديدة وقت الإطلاق.
              </p>
              <div style="background-color:${BRAND.bg};border:1px solid ${BRAND.hairline};border-radius:14px;padding:18px 20px;margin:8px 0 20px 0;">
                <p style="margin:0;font-family:${FONT_STACK};font-size:16px;line-height:1.95;color:${BRAND.ink};">
                  📩 <strong>أول ما تفتح المنصة، نبعثولك إيميل مباشرة، وتلقى نتيجة التقييم والخطة متاعك تستنّاك من أول دخول.</strong>
                </p>
              </div>
            </td>
          </tr>
          <!-- Sign-off -->
          <tr>
            <td style="padding:4px 32px 32px 32px;" align="right">
              <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.9;color:${BRAND.muted};">
                يعطيك الصحة على ثقتك ❤️<br/>
                <strong style="color:${BRAND.ink};">فريق ELMADHI</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td align="center" style="padding:20px 32px;border-top:1px solid ${BRAND.hairline};">
              <p style="margin:0;font-family:${FONT_STACK};font-size:12px;line-height:1.8;color:${BRAND.muted};">
                إفهم جسمك. إبني نظامك. وولّي الكوتش متاع روحك.<br/>
                © ELMADHI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildText(name?: string | null): string {
  const greeting = name && name.trim() ? `أهلا ${name.trim()} 👋` : "أهلا بيك 👋";
  return [
    "مبروك! 🎉 إنت رسميًا من الأوائل في ELMADHI",
    "",
    greeting,
    "",
    "حجزت بلاصتك في ELMADHI، وإنت من أوّل الناس اللي باش يجرّبوا المنصة قبل الإطلاق الرسمي.",
    "",
    "ELMADHI ما تعطيكش مجرد برنامج تمشي عليه. تعطيك المعرفة اللي تخليك تفهم جسمك، تختار أكلك بذكاء، تتمرّن بالطريقة الصحيحة، ومع الوقت معادش تحتاج حد يقولك شتعمل.",
    "",
    "وبما إنك من الأوائل، باش تكون من أوّل الناس اللي يكتشفوا كل المزايا الجديدة وقت الإطلاق.",
    "",
    "📩 أول ما تفتح المنصة، نبعثولك إيميل مباشرة، وتلقى نتيجة التقييم والخطة متاعك تستنّاك من أول دخول.",
    "",
    "يعطيك الصحة على ثقتك ❤️",
    "فريق ELMADHI",
  ].join("\n");
}

/**
 * Send the welcome email to a single recipient. Returns true on success.
 * Never throws — logs and returns false on any problem.
 */
export async function sendWelcomeEmail(
  to: string,
  name?: string | null
): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) {
    console.info("[email] (Gmail not configured) skip welcome to:", to);
    return false;
  }

  // Prefer an inline (cid) logo so it renders even before images are "shown".
  // Fall back to the hosted URL if the file can't be read (e.g. serverless).
  const logo = getLogoBuffer();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://elmadhi.com";
  const logoSrc = logo ? `cid:${LOGO_CID}` : `${siteUrl}/logo.png`;

  try {
    await transporter.sendMail({
      from: `ELMADHI team <${process.env.GMAIL_USER}>`,
      to,
      subject: SUBJECT,
      text: buildText(name),
      html: buildHtml(name, logoSrc),
      attachments: logo
        ? [{ filename: "logo.png", content: logo, cid: LOGO_CID }]
        : undefined,
    });
    return true;
  } catch (err) {
    console.error("[email] welcome send failed for", to, err);
    return false;
  }
}
