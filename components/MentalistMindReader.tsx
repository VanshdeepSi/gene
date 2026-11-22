"use client";

import React, { useState } from "react";
import { playKeyTick, playAccessGrantedBeep } from "@/lib/audio";

const SYMBOLS = [
  { id: "A", name: "ADENINE-α", symbol: "Ψ", meaning: "Initiator sequence", freq: "432 Hz" },
  { id: "C", name: "CYTOSINE-β", symbol: "Ω", meaning: "Epigenetic methylator", freq: "528 Hz" },
  { id: "G", name: "GUANINE-γ", symbol: "Δ", meaning: "Quadruplex knot", freq: "639 Hz" },
  { id: "T", name: "THYMINE-δ", symbol: "Σ", meaning: "UV photoreactive base", freq: "741 Hz" },
  { id: "U", name: "URACIL-ε", symbol: "Φ", meaning: "Ribosomal messenger", freq: "852 Hz" },
];

export function MentalistMindReader() {
  const [stage, setStage] = useState<"SELECT" | "ANALYZING" | "REVEALED">("SELECT");
  const [selectedSymbol, setSelectedSymbol] = useState<typeof SYMBOLS[0] | null>(null);
  const [analyzingText, setAnalyzingText] = useState("CAPTURING MICRO-SACCADES...");

  const handleStartAnalysis = (sym: typeof SYMBOLS[0]) => {
    setSelectedSymbol(sym);
    setStage("ANALYZING");
    playKeyTick();

    setTimeout(() => {
      setAnalyzingText("SYNTHESIZING COGNITIVE TELEMETRY...");
      playKeyTick();
    }, 700);

    setTimeout(() => {
      setAnalyzingText("INTERCEPTING SYNAPTIC WAVEFORM...");
      playKeyTick();
    }, 1400);

    setTimeout(() => {
      setStage("REVEALED");
      playAccessGrantedBeep();
    }, 2100);
  };

  const handleReset = () => {
    setStage("SELECT");
    setSelectedSymbol(null);
    playKeyTick();
  };

  return (
    <div className="relative border border-bureau-border bg-bureau-card/90 p-6 sm:p-8 backdrop-blur-md overflow-hidden">
      {/* Background Reticle */}
      <div className="absolute top-2 right-3 font-mono text-[10px] text-bureau-muted tracking-widest uppercase">
        PSYCHO-FORENSIC PROTOCOL #M-88
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 bg-bureau-teal rounded-full animate-ping" />
        <h3 className="font-serif text-xl sm:text-2xl text-bureau-paper font-semibold">
          Perception Matrix: Codon Resonance
        </h3>
      </div>

      <p className="font-sans text-xs sm:text-sm text-bureau-muted mb-6 max-w-xl">
        The Bureau measures micro-hesitation, cursor friction, and ocular focal patterns.
        Focus your intent on one nucleotide cipher below. Allow the bureau scanner to predict your internal choice.
      </p>

      {stage === "SELECT" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 [&>*:last-child]:col-span-2 sm:[&>*:last-child]:col-span-1">
            {SYMBOLS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStartAnalysis(s)}
                className="group relative flex flex-col items-center justify-center p-3 sm:p-4 min-h-[90px] border border-bureau-border bg-bureau-base/60 hover:border-bureau-teal hover:bg-bureau-teal/5 active:scale-[0.98] transition-all text-center focus:outline-none focus:ring-1 focus:ring-bureau-teal"
              >
                <span className="font-serif text-3xl text-bureau-paper group-hover:text-bureau-teal transition-colors mb-1.5">
                  {s.symbol}
                </span>
                <span className="font-mono text-[11px] font-bold text-bureau-paper tracking-wider">
                  {s.name}
                </span>
                <span className="font-mono text-[9px] text-bureau-muted leading-tight mt-0.5">
                  {s.meaning}
                </span>
              </button>
            ))}
          </div>
          <div className="text-center font-mono text-[11px] text-bureau-muted/70 pt-2">
            SELECT A SEQUENCE TO TRANSMIT NEURAL FREQUENCY
          </div>
        </div>
      )}

      {stage === "ANALYZING" && (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="relative w-16 h-16 mb-4 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-bureau-teal/20 border-t-bureau-teal animate-spin" />
            <span className="font-mono text-xs text-bureau-teal animate-pulse">REC</span>
          </div>
          <p className="font-mono text-sm tracking-widest text-bureau-teal mb-1">
            {analyzingText}
          </p>
          <p className="font-mono text-[10px] text-bureau-muted">
            CALIBRATING FORENSIC NEURO-TELEMETRY
          </p>
        </div>
      )}

      {stage === "REVEALED" && selectedSymbol && (
        <div className="py-4 border-t border-bureau-border/70 animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border border-bureau-teal/30 bg-bureau-teal/5">
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center border border-bureau-teal bg-bureau-base text-bureau-teal text-5xl font-serif">
              {selectedSymbol.symbol}
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-mono text-[10px] text-bureau-teal tracking-widest uppercase">
                [ NEURAL PATTERN CONFIRMED // TARGET ACQUIRED ]
              </div>
              <h4 className="font-serif text-2xl text-bureau-paper font-bold">
                You focused on {selectedSymbol.name}.
              </h4>
              <p className="font-sans text-xs text-bureau-muted max-w-md">
                Biometric velocity and cursor linger matched the resonant waveform of the {selectedSymbol.meaning} at {selectedSymbol.freq}. The Bureau anticipated your neural state.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] text-bureau-muted">
              CONFIDENCE INTERVAL: 99.8% // CODON ACCREDITED
            </span>
            <button
              onClick={handleReset}
              className="font-mono text-[11px] uppercase tracking-wider text-bureau-paper hover:text-bureau-teal border border-bureau-border px-3 py-1 transition-colors"
            >
              [ RUN ANOTHER TRIAL ]
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default MentalistMindReader;
