"use client";

import React, { useEffect, useState } from "react";
import { GeneLogo } from "./GeneLogo";
import { playKeyTick } from "@/lib/audio";

export function Loader() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    "INITIALISING BUREAU TERMINAL...",
    "DECRYPTING GENOMIC CASE TELEMETRY...",
    "WELCOME, AGENT.",
  ];

  useEffect(() => {
    // Only show once per session
    const hasSeen = sessionStorage.getItem("gene_intro_shown");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasSeen === "1" || reducedMotion) {
      return;
    }

    setVisible(true);

    const step1Timer = setTimeout(() => {
      setStepIndex(1);
      playKeyTick();
    }, 600);

    const step2Timer = setTimeout(() => {
      setStepIndex(2);
      playKeyTick();
    }, 1300);

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1900);

    const endTimer = setTimeout(() => {
      sessionStorage.setItem("gene_intro_shown", "1");
      setVisible(false);
    }, 2200);

    return () => {
      clearTimeout(step1Timer);
      clearTimeout(step2Timer);
      clearTimeout(fadeTimer);
      clearTimeout(endTimer);
    };
  }, []);

  const handleSkip = () => {
    sessionStorage.setItem("gene_intro_shown", "1");
    setFading(true);
    setTimeout(() => {
      setVisible(false);
    }, 150);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Bureau initialization loading screen"
      className={`fixed inset-0 z-[10000] bg-bureau-base flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background forensic lines */}
      <div className="absolute inset-0 forensic-grid pointer-events-none opacity-40" />

      {/* Main Terminal Window */}
      <div className="relative z-10 flex flex-col items-center max-w-md w-full border border-bureau-border bg-bureau-surface/90 p-8 text-center shadow-2xl">
        <div className="mb-6">
          <GeneLogo size={48} showWordmark={false} />
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-bureau-border h-1 mb-6 overflow-hidden">
          <div
            className="h-full bg-bureau-teal transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>

        <p className="font-mono text-sm tracking-widest text-bureau-paper mb-2 uppercase min-h-[24px]">
          {steps[stepIndex]}
        </p>

        <p className="font-mono text-[10px] text-bureau-muted tracking-widest uppercase">
          SECURITY LEVEL: RESTRICTED // CLEARANCE REQUIRED
        </p>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-8 font-mono text-[11px] text-bureau-muted hover:text-bureau-teal tracking-widest uppercase border border-bureau-border px-3 py-1 hover:border-bureau-teal/50 transition-colors"
        >
          [ ESC / SKIP INITIALISATION ]
        </button>
      </div>
    </div>
  );
}
export default Loader;
