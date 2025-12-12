import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "HyperBeats | Real-time Activity Monitoring",
  description: "Real-time activity monitoring and visualization for blockchain ecosystems",
  keywords: ["analytics", "blockchain", "metrics", "visualization", "charts"],
  authors: [{ name: "Hyperkit Labs" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "HyperBeats",
    description: "Real-time activity monitoring for blockchain ecosystems",
    url: "https://beats.hyperionkit.xyz",
    siteName: "HyperBeats",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
