"use client";

import React, { useEffect, useRef, useState } from "react";
import { SUSPECT_PROFILES, SuspectDossier } from "@/data/events";
import { playKeyTick } from "@/lib/audio";

export function CaseBoard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSuspect, setActiveSuspect] = useState<SuspectDossier | null>(null);
  const [stringsDrawn, setStringsDrawn] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStringsDrawn(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      id="suspects"
      className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-bureau-border bg-bureau-base overflow-hidden"
    >
      {/* Section Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-bureau-border/70 pb-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal mb-1">
              INVESTIGATION FILE // SUSPECT DOSSIERS
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-bureau-paper font-bold">
              The Suspect Board
            </h2>
            <p className="font-sans text-xs sm:text-sm text-bureau-muted mt-2 max-w-2xl">
              Cross-examine the statements, physical access swipes, and intercepted contradictions of the primary suspects in the Saturnalia&apos;51 cyber intrusion.
            </p>
          </div>
          <div className="font-mono text-[11px] text-bureau-muted text-right tracking-widest uppercase">
            <span className="text-bureau-red font-semibold">4 SUSPECTS + 1 MASTERMIND</span>
            <div>RED STRING LINK MATRIX: ACTIVE</div>
          </div>
        </div>
      </div>

      {/* Main Corkboard Area */}
      <div className="max-w-7xl mx-auto relative corkboard-grid p-6 sm:p-10 border border-bureau-border/90 shadow-2xl rounded-none">
        {/* SVG Red Strings Overlay Connecting Suspects */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: "visible" }}
        >
          {/* String 1: Evelyn -> Vikram */}
          <line
            x1="20%"
            y1="25%"
            x2="50%"
            y2="30%"
            stroke="#b3202a"
            strokeWidth="1.8"
            strokeDasharray="400"
            strokeDashoffset={stringsDrawn ? "0" : "400"}
            style={{ transition: "stroke-dashoffset 1.4s ease-out 0.2s" }}
            strokeLinecap="round"
          />
          {/* String 2: Vikram -> Rohan */}
          <line
            x1="50%"
            y1="30%"
            x2="80%"
            y2="35%"
            stroke="#b3202a"
            strokeWidth="1.8"
            strokeDasharray="400"
            strokeDashoffset={stringsDrawn ? "0" : "400"}
            style={{ transition: "stroke-dashoffset 1.4s ease-out 0.5s" }}
            strokeLinecap="round"
          />
          {/* String 3: Vikram -> Ananya */}
          <line
            x1="50%"
            y1="30%"
            x2="30%"
            y2="75%"
            stroke="#b3202a"
            strokeWidth="1.8"
            strokeDasharray="500"
            strokeDashoffset={stringsDrawn ? "0" : "500"}
            style={{ transition: "stroke-dashoffset 1.6s ease-out 0.7s" }}
            strokeLinecap="round"
          />
          {/* String 4: Ananya -> The Mastermind */}
          <line
            x1="30%"
            y1="75%"
            x2="75%"
            y2="80%"
            stroke="#b3202a"
            strokeWidth="1.8"
            strokeDasharray="500"
            strokeDashoffset={stringsDrawn ? "0" : "500"}
            style={{ transition: "stroke-dashoffset 1.6s ease-out 0.9s" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Suspect Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-20">
          {SUSPECT_PROFILES.map((suspect) => (
            <div
              key={suspect.id}
              onClick={() => {
                setActiveSuspect(suspect);
                playKeyTick();
              }}
              style={{
                transform: `rotate(${suspect.rotationDeg}deg)`,
              }}
              className="group relative bg-[#131922] border border-[#263140] p-6 shadow-paper-elevation transition-all duration-300 hover:scale-[1.02] hover:z-30 hover:border-bureau-teal cursor-pointer"
            >
              {/* Pushpin at top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-bureau-red border-2 border-bureau-base shadow-md z-30" />

              {/* Top Case Tag */}
              <div className="flex items-center justify-between border-b border-bureau-border/80 pb-2 mb-3 font-mono text-[10px]">
                <span className="font-bold text-bureau-paper">{suspect.caseNumber}</span>
                <span
                  className={`px-1.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
                    suspect.threatLevel === "CRITICAL"
                      ? "border-bureau-red text-bureau-red bg-bureau-red/10"
                      : suspect.threatLevel === "HIGH"
                      ? "border-amber-500/70 text-amber-400 bg-amber-500/10"
                      : "border-bureau-teal text-bureau-teal bg-bureau-teal/10"
                  }`}
                >
                  {suspect.threatLevel}
                </span>
              </div>

              {/* Name & Alias */}
              <div className="mb-2">
                <span className="font-mono text-[10px] text-bureau-muted block">
                  CLEARANCE: {suspect.clearanceLevel}
                </span>
                <h3 className="font-serif text-2xl text-bureau-paper font-bold group-hover:text-bureau-teal transition-colors">
                  {suspect.name}
                </h3>
                <span className="font-mono text-xs text-bureau-teal">
                  ALIAS: &quot;{suspect.alias}&quot;
                </span>
              </div>

              {/* Role */}
              <div className="font-mono text-[10px] text-bureau-paper/80 mb-3 uppercase">
                {suspect.role}
              </div>

              {/* Alibi Statement Preview */}
              <div className="p-3 bg-black/40 border border-bureau-border/60 mb-4 font-sans text-xs text-bureau-paper-dark italic line-clamp-3">
                &ldquo;{suspect.statement}&rdquo;
              </div>

              {/* Direct Contradiction Indicator */}
              <div className="border-t border-bureau-border/60 pt-3">
                <div className="font-mono text-[10px] text-bureau-red font-semibold mb-1 flex items-center gap-1.5">
                  <span>[!] CONTRADICTION DETECTED:</span>
                </div>
                <p className="font-mono text-[10px] text-bureau-muted leading-tight line-clamp-2">
                  {suspect.contradiction}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-bureau-border/40 flex items-center justify-between font-mono text-[9px] text-bureau-muted">
                <span>EVIDENCE: {suspect.evidenceRef}</span>
                <span className="text-bureau-teal group-hover:translate-x-1 transition-transform">
                  OPEN FILE →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suspect Dossier Modal */}
      {activeSuspect && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveSuspect(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-[#0d1219] border-2 border-bureau-teal p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-bureau-border pb-4 mb-6 font-mono text-xs text-bureau-muted">
              <div>SUSPECT DOSSIER: {activeSuspect.caseNumber}</div>
              <button
                onClick={() => setActiveSuspect(null)}
                className="text-bureau-paper hover:text-bureau-teal px-2 py-1 font-mono uppercase text-xs border border-bureau-border"
              >
                [ CLOSE FILE ]
              </button>
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="classified-stamp">{activeSuspect.threatLevel} THREAT</span>
              <span className="font-mono text-xs text-bureau-teal">CLEARANCE: {activeSuspect.clearanceLevel}</span>
            </div>

            <h3 className="font-serif text-3xl sm:text-4xl text-bureau-paper font-bold mb-1">
              {activeSuspect.name}
            </h3>
            <div className="font-mono text-sm text-bureau-teal tracking-wider uppercase mb-6">
              ALIAS: &quot;{activeSuspect.alias}&quot; // {activeSuspect.role}
            </div>

            <div className="space-y-5 mb-6 text-sm text-bureau-paper-dark leading-relaxed">
              <div>
                <h4 className="font-mono text-xs text-bureau-paper uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-bureau-teal rounded-full" />
                  <span>OFFICIAL INTERROGATION STATEMENT</span>
                </h4>
                <div className="p-4 bg-black/50 border border-bureau-border text-xs sm:text-sm font-sans italic text-bureau-paper leading-relaxed">
                  &ldquo;{activeSuspect.statement}&rdquo;
                </div>
              </div>

              <div>
                <h4 className="font-mono text-xs text-bureau-red uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-bureau-red rounded-full" />
                  <span>IDENTIFIED CONTRADICTION & PHYSICAL TELEMETRY</span>
                </h4>
                <div className="p-4 bg-bureau-red/10 border border-bureau-red/40 text-xs sm:text-sm font-sans text-bureau-paper leading-relaxed">
                  {activeSuspect.contradiction}
                </div>
              </div>

              <div className="border-t border-bureau-border/60 pt-4">
                <h4 className="font-mono text-xs text-bureau-paper uppercase tracking-widest mb-1">
                  CORRELATED FORENSIC ARTIFACT
                </h4>
                <div className="font-mono text-xs text-bureau-teal bg-bureau-base p-2.5 border border-bureau-border">
                  LINKED EVIDENCE: {activeSuspect.evidenceRef}
                </div>
              </div>
            </div>

            <div className="border-t border-bureau-border pt-4 flex items-center justify-between font-mono text-[10px] text-bureau-muted">
              <span>SATURNALIA &apos;51 CYBER FORENSIC ARCHIVE</span>
              <span>GENE INVESTIGATIVE UNIT</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
export default CaseBoard;
