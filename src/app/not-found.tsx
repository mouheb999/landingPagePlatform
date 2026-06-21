import "./globals.css";

// Catches unmatched non-localized paths. Renders its own shell because the root
// layout intentionally omits <html>/<body>.
export default function GlobalNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-bg text-ink antialiased">
        <main className="grid min-h-screen place-items-center px-6 text-center">
          <div>
            <p className="text-6xl font-extrabold text-accent">404</p>
            <a
              href="/"
              className="mt-8 inline-flex h-14 items-center rounded-full bg-accent px-7 font-bold text-bg"
            >
              ELMADHI
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
