"use client";

import React from "react";
import { INVESTIGATION_ROUNDS, SCORING_RUBRIC, EVENT_DETAILS } from "@/data/events";
import { playKeyTick } from "@/lib/audio";

export function EventRounds() {
  return (
    <section id="rounds" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-bureau-border bg-[#080b10] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mb-12 border-b border-bureau-border/70 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal mb-1">
              OPERATIONAL PROTOCOL // 5 ROUNDS
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-bureau-paper font-bold">
              The 5 Investigation Rounds
            </h2>
            <p className="font-sans text-xs sm:text-sm text-bureau-muted mt-2 max-w-2xl leading-relaxed">
              Official competition structure for Project Chimera. Teams progress sequentially across forensic network analysis, biochemical EXIF decryption, suspect cross-examination, black-box chronology, and the live tribunal defense.
            </p>
          </div>
          <div className="font-mono text-xs text-bureau-paper/80 flex flex-col sm:items-end gap-1">
            <div>
              TOTAL RUNTIME: <span className="text-bureau-teal font-bold">{EVENT_DETAILS.runtime}</span>
            </div>
            <div>
              TOTAL POINTS: <span className="text-[#e6af38] font-bold">{EVENT_DETAILS.totalScore}</span>
            </div>
          </div>
        </div>

        {/* 5 Rounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
          {INVESTIGATION_ROUNDS.map((round) => (
            <div
              key={round.roundNumber}
              className="border border-bureau-border bg-[#0d1219] p-5 flex flex-col justify-between hover:border-bureau-teal/60 transition-colors shadow-lg relative group"
            >
              <div>
                {/* Round Badge */}
                <div className="flex items-center justify-between font-mono text-[10px] text-bureau-muted mb-3 pb-2 border-b border-bureau-border/60">
                  <span className="text-bureau-teal font-bold">ROUND 0{round.roundNumber}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 border border-bureau-teal/40 bg-bureau-teal/10 text-bureau-teal font-semibold">
                      {round.points} PTS
                    </span>
                    <span className="px-1.5 py-0.5 border border-bureau-border bg-bureau-base text-bureau-paper">
                      {round.duration}
                    </span>
                  </div>
                </div>

                {/* Round Title */}
                <h3 className="font-serif text-lg sm:text-xl text-bureau-paper font-bold mb-2 group-hover:text-bureau-teal transition-colors">
                  {round.title}
                </h3>

                <div className="font-mono text-[10px] text-bureau-muted/80 uppercase tracking-wider mb-3">
                  {round.codeName}
                </div>

                {/* Objective */}
                <p className="font-sans text-xs text-bureau-paper-dark mb-4 leading-relaxed">
                  {round.objective}
                </p>

                {/* Bullet steps */}
                <div className="space-y-1.5 mb-6">
                  {round.taskDetails.map((task, idx) => (
                    <div key={idx} className="font-mono text-[10px] text-bureau-muted flex items-start gap-1.5 leading-tight">
                      <span className="text-bureau-teal mt-0.5 font-bold">›</span>
                      <span>{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverable Tag */}
              <div className="pt-3 border-t border-bureau-border/60 font-mono text-[10px]">
                <span className="text-bureau-muted block text-[9px] uppercase">DELIVERABLE:</span>
                <span className="text-bureau-paper font-semibold">{round.deliverable}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Judging Criteria & Rules Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-bureau-border bg-bureau-surface p-6 sm:p-8">
          {/* Scoring Rubric */}
          <div className="lg:col-span-7 space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-bureau-teal">
              [ JUDICIAL SCORING RUBRIC // 100 POINTS TOTAL ]
            </div>
            <h4 className="font-serif text-2xl text-bureau-paper font-bold">
              Official Points Allocation Matrix
            </h4>
            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {SCORING_RUBRIC.map((item, idx) => (
                <div key={idx} className="p-3 bg-black/40 border border-bureau-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="sm:max-w-md">
                    <span className="font-mono text-xs font-bold text-bureau-paper block">
                      {item.round}
                    </span>
                    <p className="font-sans text-[11px] text-bureau-muted leading-tight mt-0.5">
                      {item.breakdown}
                    </p>
                  </div>
                  <div className="font-mono text-xs font-bold text-bureau-teal border border-bureau-teal/40 bg-bureau-teal/10 px-2.5 py-1 whitespace-nowrap self-start sm:self-center">
                    {item.points} POINTS
                  </div>
                </div>
              ))}
            </div>
            <div className="font-mono text-[10px] text-bureau-muted/80 pt-1">
              * TIE-BREAKER PROTOCOL: Lowest hint tokens consumed + earliest submission timestamp + Tribunal confidence rating.
            </div>
          </div>

          {/* Rules & Portal Entry Action Box */}
          <div className="lg:col-span-5 flex flex-col justify-between p-6 border border-bureau-border bg-[#0b0f16]">
            <div>
              <div className="classified-stamp text-[10px] mb-3">
                INVESTIGATOR PROTOCOL
              </div>
              <h4 className="font-serif text-xl sm:text-2xl text-bureau-paper font-bold mb-3">
                Participant Team Guidelines
              </h4>
              <ul className="space-y-2.5 font-mono text-xs text-bureau-muted mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-bureau-teal mt-0.5">■</span>
                  <span>Teams of 3 to 5 student investigators.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bureau-teal mt-0.5">■</span>
                  <span>Cross-year and cross-branch teams permitted.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bureau-teal mt-0.5">■</span>
                  <span>Bring team laptop with terminal and Wi-Fi connectivity.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bureau-teal mt-0.5">■</span>
                  <span>Free Admission for confirmed participant teams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-bureau-teal mt-0.5">■</span>
                  <span>Venue: LP105, Asterion Bio-Computational Lab // TIET.</span>
                </li>
              </ul>
            </div>

            <a
              href="/participant"
              onClick={() => playKeyTick()}
              className="w-full text-center font-mono text-xs uppercase tracking-widest font-bold bg-bureau-teal text-bureau-base py-3.5 hover:bg-white transition-colors"
            >
              [ ENTER PARTICIPANT PORTAL → ]
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
export default EventRounds;
