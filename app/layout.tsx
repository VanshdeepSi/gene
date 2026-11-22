import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { MagnifierCursor } from "@/components/MagnifierCursor";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  weight: ["400", "600", "700"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Mentalist: Digital Deception | GENE with SAT",
  description:
    "The Mentalist: Digital Deception — A story-driven cyber investigation event by GENE with SAT (Saturnalia'51, 2026) at Thapar Institute of Engineering and Technology, Patiala. Teams crack a simulated cyber incident using suspect profiles, digital logs and encoded clues to unmask the mastermind.",
  keywords: [
    "The Mentalist Digital Deception",
    "GENE Society",
    "Saturnalia 51",
    "Saturnalia 2026",
    "Thapar Institute",
    "TIET Patiala",
    "Cyber Investigation",
    "Forensic Mystery",
  ],
  authors: [{ name: "GENE with SAT", url: "mailto:gene@thapar.edu" }],
  openGraph: {
    title: "The Mentalist: Digital Deception | GENE with SAT",
    description:
      "A story-driven investigation event by GENE with SAT at Saturnalia'51 (2026). Crack the simulated cyber incident, analyze suspect profiles, and unmask the mastermind.",
    siteName: "The Mentalist: Digital Deception",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Mentalist: Digital Deception | GENE with SAT",
    description:
      "A story-driven investigation event by GENE with SAT at Saturnalia'51 (2026). Think like a detective. Investigate like a hacker. Solve like a Mentalist.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jetbrains.variable} ${inter.variable}`}
    >
      <body className="bg-bureau-base text-bureau-paper antialiased min-h-screen flex flex-col selection:bg-bureau-teal selection:text-bureau-base">
        {/* SVG Filter for Hand-made Stamp Irregularities (feTurbulence) */}
        <svg
          aria-hidden="true"
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        >
          <filter id="filter-stamp">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>

        {/* Global Forensic Magnifying Glass Cursor for desktop */}
        <MagnifierCursor />

        {/* Intro Session Loader */}
        <Loader />

        {/* Bureau Global Navbar */}
        <Navbar />

        {/* Main Routed Content */}
        <main className="flex-grow flex flex-col">{children}</main>

        {/* Bureau Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
