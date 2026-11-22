"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { EVENT_DETAILS } from "@/data/events";
import { playKeyTick } from "@/lib/audio";

export function Footer() {
  return (
    <footer className="w-full border-t border-bureau-border bg-[#05070a] text-bureau-muted py-14 px-4 sm:px-6 lg:px-8 font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-8 pb-10 border-b border-bureau-border/60">
        <div className="space-y-4 max-w-xl">
          {/* Dual Real Logos Header */}
          <div className="flex items-center gap-4">
            {/* Real Saturnalia 51 (2026) Emblem */}
            <div className="p-1 rounded border border-[#e6af38]/40 bg-bureau-base">
              <Image
                src="/assets/saturnalia51-logo.png"
                alt="Saturnalia 51 (2026)"
                width={50}
                height={40}
                className="object-contain"
              />
            </div>
            <span className="font-mono text-sm text-bureau-muted font-bold">×</span>
            {/* Real GENE Logo */}
            <div className="p-1 rounded border border-bureau-teal/50 bg-[#0d141e]/90">
              <Image
                src="/assets/gene-logo.png"
                alt="GENE Society"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <span className="font-mono text-sm text-bureau-muted font-bold">×</span>
            {/* TI Logo */}
            <div className="p-1 rounded border border-bureau-border bg-bureau-base">
              <Image
                src="/assets/thapar-logo.png"
                alt="Thapar Institute"
                width={30}
                height={30}
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-2xl text-bureau-paper font-bold">
              The Mentalist: Digital Deception
            </h4>
            <p className="font-sans text-xs text-bureau-muted leading-relaxed mt-1">
              A story-driven cyber investigation challenge hosted by <strong>GENE</strong> (Genesis and Engineering of Neo Environment) in official collaboration with <strong>SAT</strong> for <strong>Saturnalia &apos;51 (2026)</strong> at Thapar Institute of Engineering and Technology, Patiala.
            </p>
          </div>

          <div className="text-[11px] text-bureau-paper/70 tracking-wider">
            OFFICIAL EVENT CORRESPONDENCE:{" "}
            <a
              href="mailto:gene@thapar.edu"
              className="text-bureau-teal hover:underline"
            >
              gene@thapar.edu
            </a>
          </div>
        </div>

        {/* Case Stamp and Archival Tag */}
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="classified-stamp text-xs tracking-widest">
            INCIDENT ARCHIVE #TIET-SAT51-MDD-2026
          </div>
          <div className="text-[10px] text-bureau-muted/70 tracking-widest uppercase">
            VENUE: LP105 // ASTERION LAB // 23 NOV 2026
          </div>
          <Link
            href="/participant"
            onClick={() => playKeyTick()}
            className="text-bureau-teal hover:underline text-xs flex items-center gap-1 mt-1 font-bold"
          >
            <span>PARTICIPANT INVESTIGATION DOSSIER</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between text-[10px] text-bureau-muted/60 tracking-wider gap-4">
        <div>
          © 2026 THE MENTALIST // GENE × SATURNALIA 51 // THAPAR INSTITUTE
        </div>
        <div className="flex items-center gap-6">
          <Link href="/participant" className="hover:text-bureau-teal transition-colors">
            INVESTIGATOR PORTAL
          </Link>
          <Link href="/organiser/login" className="hover:text-bureau-red transition-colors">
            HANDLER GATE
          </Link>
          <a href="#top" className="hover:text-bureau-paper transition-colors">
            ▲ TOP
          </a>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
