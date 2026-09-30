import type { Metadata } from "next";
import { sitePath } from "@/lib/site-path";
import "./globals.css";

export const metadata: Metadata = {
  title: "emfau — Web, Games & Labs",
  description:
    "emfau verbindet Websites, Spiele und technische Werkzeuge unter einem Dach.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: sitePath("/favicon.svg"),
    shortcut: sitePath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
