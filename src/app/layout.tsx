import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Poppins, JetBrains_Mono, Noto_Sans_Khmer } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-noto-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TECHSTORE — Precision Gadgets",
    template: "%s | TECHSTORE",
  },
  description:
    "Engineered gadgets, chosen for how they're built, not just what they do.",
};

// NOTE: intentionally NOT setting maximumScale or userScalable: false.
// Doing so blocks pinch-zoom entirely, which fails WCAG 1.4.4 (Resize Text)
// and is worse for mobile users than the accidental-zoom bugs it "fixes".
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${poppins.variable} ${jetbrainsMono.variable} ${notoSansKhmer.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
