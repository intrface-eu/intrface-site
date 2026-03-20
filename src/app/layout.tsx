import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Intrface",
  description: "Intrface builds AI-native platforms, products, and systems.",
  icons: {
    icon: [
      { url: "/brand/intrface-icon-dark.svg", media: "(prefers-color-scheme: light)" },
      { url: "/brand/intrface-icon.svg", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: "/brand/intrface-icon-dark.svg",
    apple: "/brand/intrface-icon-dark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
