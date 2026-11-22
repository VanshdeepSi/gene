import React from "react";
import { Hero } from "@/components/Hero";
import { ElectrophoresisDivider } from "@/components/ElectrophoresisDivider";
import { EventRounds } from "@/components/EventRounds";
import { MentalistMindReader } from "@/components/MentalistMindReader";

export default function HomePage() {
  return (
    <div className="w-full flex flex-col bg-bureau-base">
      {/* 1. Spacious, Uncluttered Hero with Real Logos & Access Chamber */}
      <Hero />

      {/* 2. Cyber-Forensic Divider */}
      <ElectrophoresisDivider label="INCIDENT TELEMETRY STREAM // PACKET INJECTION TRACE #SAT51" />

      {/* 3. The 4 Investigation Rounds & Scoring Breakdown */}
      <EventRounds />

      {/* 4. Mentalist Interaction: Ocular Perception Experiment */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-bureau-border bg-bureau-base">
        <div className="max-w-4xl mx-auto">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal mb-2">
            PSYCHO-DEDUCTION TRIAL // THE MENTALIST CHALLENGE
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-bureau-paper font-bold mb-4">
            Can You Outthink The Mentalist?
          </h2>
          <p className="font-sans text-xs sm:text-sm text-bureau-muted mb-6 max-w-xl">
            Test your deductive focus before entering the crime scene. The Mastermind measures your ocular micro-saccades and typing cadence.
          </p>
          <MentalistMindReader />
        </div>
      </section>
    </div>
  );
}
