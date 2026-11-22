import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { CommandPalette } from "@/components/CommandPalette";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sourcelab.github.io"),
  title: {
    default: "SourceLab — Privacy-First Browser Tools Suite",
    template: "%s | SourceLab",
  },
  description:
    "Free, no-signup, privacy-first suite of browser tools. Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati.",
  openGraph: {
    title: "SourceLab — Privacy-First Browser Tools Suite",
    description:
      "Free, no-signup, privacy-first suite of browser tools. Tumhari file tumhare browser me hi process hoti hai — server pe kabhi nahi jaati.",
    url: "https://sourcelab.github.io",
    siteName: "SourceLab",
    images: [
      {
        url: "/media/og-home.png",
        width: 1200,
        height: 630,
        alt: "SourceLab — Privacy-First Browser Tools Suite",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SourceLab — Privacy-First Browser Tools Suite",
    description:
      "Free, no-signup, privacy-first suite of browser tools. Tumhari file tumhare browser me hi process hoti hai.",
    images: ["/media/og-home.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-[var(--sl-bg)] text-[var(--sl-text)] font-sans antialiased flex flex-col pb-16 md:pb-0">
        <TooltipProvider>
          <Header />
          <div className="flex-1 w-full">{children}</div>
          <Footer />
          <BottomNav />
          <CommandPalette />
        </TooltipProvider>
      </body>
    </html>
  );
}
