import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  metadataBase: new URL("https://aoc.intrface.eu"),
  title: {
    default: "AOC",
    template: "%s | AOC",
  },
  description:
    "AOC is the terminal-first AI workspace by Intrface for structured, local-first agentic coding.",
  openGraph: {
    title: "AOC",
    description:
      "AOC is the terminal-first AI workspace by Intrface for structured, local-first agentic coding.",
    url: "https://aoc.intrface.eu",
    siteName: "AOC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AOC",
    description:
      "AOC is the terminal-first AI workspace by Intrface for structured, local-first agentic coding.",
  },
  icons: {
    icon: [
      { url: "/brand/intrface-icon.svg", media: "(prefers-color-scheme: light)" },
      { url: "/brand/intrface-icon-dark.svg", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/brand/intrface-icon.svg",
    apple: "/brand/intrface-icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
