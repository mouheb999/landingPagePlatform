import type { ReactNode } from "react";
import "./globals.css";

// Root layout is intentionally minimal — the real <html>/<body> shell lives in
// the [locale] layout so it can set lang/dir per request.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
