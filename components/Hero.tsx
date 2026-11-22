"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HelixCanvas } from "./HelixCanvas";
import { Door } from "./Door";
import { playKeyTick } from "@/lib/audio";
import { EVENT_DETAILS } from "@/data/events";

export function Hero() {
  const terminalHeadline = "THINK LIKE A DETECTIVE. INVESTIGATE LIKE A HACKER. SOLVE LIKE A MENTALIST.";
  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setTypedLength(index);
      playKeyTick();
      if (index >= terminalHeadline.length) {
        clearInterval(interval);
      }
    }, 38);

    return () => clearInterval(interval);
  }, [terminalHeadline]);

  return (
    <section className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-24 sm:pt-36 sm:pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-bureau-base">
      {/* 1. Forensic Canvas (Double Helix & Cyber Dust) */}
      <HelixCanvas />

      {/* 2. Cyber-forensic Scanning Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-bureau-teal/40 to-transparent animate-scan-line pointer-events-none z-10" />

      {/* 3. Film Grain & Vignette */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,9,12,0.85)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-10 film-grain opacity-60" />

      {/* 4. Mentalist Lens Hidden Clues (revealed under magnifying lens) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-20 select-none overflow-hidden"
        style={{
          clipPath: "circle(100px at var(--cursor-x, -500px) var(--cursor-y, -500px))",
        }}
      >
        <div className="w-full h-full relative">
          <div className="absolute top-[24%] left-[6%] font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal bg-bureau-base/90 px-3 py-1.5 border border-bureau-teal/50 shadow-lg">
            [ CLASSIFIED CLUE: THE MASTERMIND IS NOT WHO YOU THINK ]
          </div>
          <div className="absolute top-[38%] right-[10%] font-mono text-xs uppercase tracking-[0.25em] text-bureau-red bg-bureau-base/90 px-3 py-1.5 border border-bureau-red/50 shadow-lg">
            [ CIPHER LEAK: CHECK THE 02:14:08 AM AUTH LOG PRIVILEGE ESCALATION ]
          </div>
          <div className="absolute bottom-[28%] left-[18%] font-mono text-[11px] uppercase tracking-[0.2em] text-bureau-paper bg-bureau-base/90 px-3 py-1 border border-bureau-paper/30 shadow-lg">
            [ PACKET TELEMETRY: 10.99.14.22 WIREGUARD BEACON ACTIVE ]
          </div>
        </div>
      </div>

      {/* 5. Main Hero Screen */}
      <div className="relative z-30 max-w-7xl mx-auto w-full">
        {/* Real Logos Partner Badge */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-6">
          {/* Official Saturnalia 51 (2026) Emblem */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded border border-[#e6af38]/40 bg-[#0d141e]/90 shadow-md">
            <Image
              src="/assets/saturnalia51-logo.png"
              alt="Saturnalia 51 (2026) - The Ascension of Legacy"
              width={48}
              height={38}
              className="object-contain"
              priority
            />
            <div className="font-mono text-[9px] sm:text-[10px] text-[#e6af38] leading-tight pr-1.5 sm:pr-2">
              <span className="font-bold block tracking-wider">SATURNALIA &apos;51</span>
              <span className="text-[8px] sm:text-[9px] text-bureau-muted">51ST EDITION // 2026</span>
            </div>
          </div>

          <span className="font-mono text-[10px] sm:text-xs text-bureau-muted uppercase">PRESENTS WITH</span>

          {/* Official GENE Society Emblem */}
          <div className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 rounded border border-bureau-teal/50 bg-[#0d141e]/90 shadow-md">
            <Image
              src="/assets/gene-logo.png"
              alt="GENE Society Logo"
              width={38}
              height={38}
              className="object-contain"
              priority
            />
            <div className="font-mono text-[9px] sm:text-[10px] text-bureau-teal leading-tight pr-1.5 sm:pr-2">
              <span className="font-bold block tracking-wider">GENE SOCIETY</span>
              <span className="text-[8px] sm:text-[9px] text-bureau-muted">BIOTECHNOLOGY & FORENSICS</span>
            </div>
          </div>

          <span className="hidden sm:inline font-mono text-xs text-bureau-border">|</span>

          {/* Thapar Red TI Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded border border-bureau-border bg-bureau-surface/80">
            <Image
              src="/assets/thapar-logo.png"
              alt="Thapar Institute of Engineering and Technology"
              width={26}
              height={26}
              className="object-contain"
            />
            <span className="font-mono text-[9px] sm:text-[10px] text-bureau-muted">
              TIET PATIALA
            </span>
          </div>
        </div>

        {/* Monospace Typing Tagline */}
        <div className="min-h-8 mb-3 flex items-center">
          <h2 className="font-mono text-[11px] sm:text-sm md:text-base text-bureau-teal tracking-wider sm:tracking-widest uppercase leading-snug">
            {terminalHeadline.slice(0, typedLength)}
            {typedLength < terminalHeadline.length && (
              <span className="inline-block w-2 h-4 bg-bureau-teal ml-1 animate-pulse" />
            )}
          </h2>
        </div>

        {/* Grand Editorial Title */}
        <div className="mb-6">
          <h1 className="font-serif text-5xl sm:text-8xl md:text-9xl font-bold tracking-tight text-bureau-paper ink-bleed select-none leading-none break-words">
            THE MENTALIST
          </h1>
          <div className="font-mono text-lg sm:text-2xl md:text-3xl text-bureau-red font-bold tracking-[0.15em] sm:tracking-[0.25em] uppercase mt-2.5 sm:mt-3 flex flex-wrap items-center gap-2 sm:gap-4">
            <span>DIGITAL DECEPTION</span>
            <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 border border-bureau-red/60 bg-bureau-red/10 text-bureau-red font-semibold whitespace-nowrap">
              INCIDENT #2026-SAT51
            </span>
          </div>
        </div>

        {/* Story Briefing with Generous Negative Space */}
        <div className="max-w-3xl mb-8">
          <p className="font-sans text-sm sm:text-base text-bureau-paper-dark leading-relaxed mb-6">
            A story-driven cyber investigation challenge at Saturnalia &apos;51. At 01:48 AM, the Asterion Bio-Computational Lab server was breached and the synthetic enzyme weights model was stolen. Teams of student investigators must crack simulated cyber incident logs, analyze conflicting suspect statements, and decrypt encoded cryptographic ciphers to unmask the mastermind.
          </p>

          {/* Clean Event Status Ticker */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs border border-bureau-border bg-bureau-surface/75 p-4">
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">EVENT DATE</span>
              <span className="text-bureau-paper font-bold">{EVENT_DETAILS.date}</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">TEAM MATRIX</span>
              <span className="text-bureau-teal font-bold">{EVENT_DETAILS.teamSize}</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">STATUS</span>
              <span className="text-bureau-paper font-bold">CONFIRMED TEAMS // FREE ADMISSION</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">PRIZE POOL</span>
              <span className="text-[#e6af38] font-bold">₹5,000 + MERIT CERTS</span>
            </div>
          </div>
        </div>

        {/* 6. Investigation Access Chamber (Positioned comfortably down with generous spacing) */}
        <div className="mt-32 sm:mt-44 pt-12 border-t border-bureau-border/60">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono text-xs uppercase text-bureau-teal tracking-widest font-semibold block mb-1">
                [ ACCESS CHAMBER // SELECT IDENTITY ]
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold">
                Enter Investigation Portal
              </h3>
            </div>
            <span className="font-mono text-xs text-bureau-muted">
              AUTHENTICATED PARTICIPANT & HANDLER GATES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl">
            <Door
              role="AGENT"
              title="ENTER AS PARTICIPANT"
              subtitle="Student Investigators & Field Teams"
              destination="/participant"
              description="Direct access for student participants. Review active incident briefs, decoded clues, and live incident broadcasts published by the organizers."
              clearanceLevel="PARTICIPANT CLEARANCE"
              accent="teal"
              caseNumber="PORTAL-01 // PARTICIPANT"
            />

            <Door
              role="HANDLER"
              title="ENTER AS HANDLER"
              subtitle="Organisers & Game Masters"
              destination="/organiser/login"
              description="Restricted command vault for GENE and SAT event coordinators. Release round clues, broadcast emergency dispatches, and manage the live investigation feed."
              clearanceLevel="LEVEL-5 GAME MASTER"
              accent="red"
              caseNumber="PORTAL-02 // HANDLER"
            />
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Ticker */}
      <div className="relative z-30 max-w-7xl mx-auto w-full pt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between font-mono text-[10px] text-bureau-muted tracking-widest gap-2">
        <div className="flex items-center gap-4">
          <span>HOSTED BY GENE × SATURNALIA 51</span>
          <span className="hidden sm:inline">|</span>
          <span>TIET PATIALA // PUNJAB</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-bureau-teal animate-pulse">● INCIDENT NETWORK ONLINE</span>
          <span>VENUE: LP105 // ASTERION LAB</span>
        </div>
      </div>
    </section>
  );
}
export default Hero;
