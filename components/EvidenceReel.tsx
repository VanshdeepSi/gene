"use client";

import React, { useRef } from "react";
import { DIGITAL_EVIDENCE_FILES } from "@/data/events";
import { playKeyTick } from "@/lib/audio";

export function EvidenceReel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  return (
    <section id="evidence" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-bureau-border bg-bureau-surface overflow-hidden">
      {/* Header and Scroll Controllers */}
      <div className="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal mb-1">
            FORENSIC LOGS // PACKET CAPTURES & CIPHERS
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-bureau-paper font-bold">
            Digital Evidence Reel
          </h2>
          <p className="font-sans text-xs sm:text-sm text-bureau-muted mt-2 max-w-xl">
            Simulated raw server logs, network packet captures, and cryptographic artifacts recovered during the 02:14 AM breach.
          </p>
        </div>

        {/* Scroll Nav Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              scrollLeft();
              playKeyTick();
            }}
            aria-label="Scroll left in evidence reel"
            className="w-10 h-10 border border-bureau-border hover:border-bureau-teal text-bureau-paper hover:text-bureau-teal flex items-center justify-center font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-bureau-teal"
          >
            ←
          </button>
          <button
            onClick={() => {
              scrollRight();
              playKeyTick();
            }}
            aria-label="Scroll right in evidence reel"
            className="w-10 h-10 border border-bureau-border hover:border-bureau-teal text-bureau-paper hover:text-bureau-teal flex items-center justify-center font-mono text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-bureau-teal"
          >
            →
          </button>
        </div>
      </div>

      {/* Horizontal Scroll Track */}
      <div className="max-w-7xl mx-auto">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {DIGITAL_EVIDENCE_FILES.map((ev) => (
            <div
              key={ev.id}
              className="flex-shrink-0 w-[320px] sm:w-[400px] snap-start relative group"
            >
              {/* Folder Tab Shape */}
              <div className="flex items-center">
                <div className="bg-[#18212e] border-t border-l border-r border-bureau-border px-4 py-1.5 font-mono text-[10px] text-bureau-teal uppercase tracking-widest font-semibold">
                  EVIDENCE FILE // {ev.fileType}
                </div>
                <div className="h-[1px] flex-grow bg-bureau-border" />
              </div>

              {/* Main Evidence Dossier Folder Body */}
              <div className="bg-[#101620] border border-bureau-border p-6 shadow-paper-elevation group-hover:border-bureau-teal/70 transition-all duration-300">
                {/* Folder Top Metadata */}
                <div className="flex items-center justify-between border-b border-bureau-border/60 pb-3 mb-4">
                  <span className="font-mono text-[10px] text-bureau-muted">
                    ID: {ev.id.toUpperCase()}
                  </span>
                  <span className="classified-stamp text-[10px] py-0.5 px-2">
                    {ev.classification}
                  </span>
                </div>

                {/* File Name */}
                <h3 className="font-mono text-base sm:text-lg text-bureau-paper font-bold mb-2 group-hover:text-bureau-teal transition-colors truncate">
                  {ev.fileName}
                </h3>

                {/* Summary */}
                <p className="font-sans text-xs sm:text-sm text-bureau-paper-dark leading-relaxed mb-4">
                  {ev.summary}
                </p>

                {/* Raw Terminal Code Snippet */}
                <div className="bg-black/70 border border-bureau-border/80 p-3 rounded mb-4 font-mono text-[10px] text-bureau-teal overflow-x-auto whitespace-pre-wrap leading-tight">
                  {ev.rawSnippet}
                </div>

                {/* Evidence Reveal */}
                <div className="border-t border-bureau-border/60 pt-3 font-mono text-[10px]">
                  <span className="text-bureau-red font-semibold block mb-0.5">
                    [+] INVESTIGATOR DEDUCTION:
                  </span>
                  <p className="text-bureau-muted leading-tight">
                    {ev.reveals}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default EvidenceReel;
