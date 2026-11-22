"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { GeneLogo } from "./GeneLogo";
import { initAudioPreference, isAudioEnabled, setAudioEnabled, playKeyTick } from "@/lib/audio";

export function Navbar() {
  const [audioOn, setAudioOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const initial = initAudioPreference();
    setAudioOn(initial);

    const handleToggle = () => {
      setAudioOn(isAudioEnabled());
    };

    window.addEventListener("gene_audio_toggle", handleToggle);
    return () => window.removeEventListener("gene_audio_toggle", handleToggle);
  }, []);

  const toggleSound = () => {
    const nextState = !audioOn;
    setAudioEnabled(nextState);
    setAudioOn(nextState);
    if (nextState) {
      playKeyTick();
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-bureau-base/95 backdrop-blur-md border-b border-bureau-border/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Event Brand Mark */}
        <Link
          href="/"
          className="focus:outline-none focus:ring-1 focus:ring-bureau-teal flex-shrink-0"
          onClick={() => playKeyTick()}
        >
          <GeneLogo size={32} />
        </Link>

        {/* Clean, spacious desktop nav */}
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest text-bureau-muted uppercase">
          <Link
            href="/"
            onClick={() => playKeyTick()}
            className="hover:text-bureau-teal transition-colors"
          >
            {"//"} INCIDENT
          </Link>
          <Link
            href="/#rounds"
            onClick={() => playKeyTick()}
            className="hover:text-bureau-teal transition-colors"
          >
            {"//"} 5 ROUNDS
          </Link>
          <Link
            href="/participant"
            onClick={() => playKeyTick()}
            className="text-bureau-teal font-semibold hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1 border border-bureau-teal/40 bg-bureau-teal/5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-bureau-teal animate-pulse" />
            <span>PARTICIPANT PORTAL</span>
          </Link>
        </nav>

        {/* Controls: Audio Toggle & Handler Gate */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={toggleSound}
            aria-label={`Toggle typing audio ticks (currently ${audioOn ? "active" : "muted"})`}
            title={`Audio Clicks: ${audioOn ? "ON" : "OFF"}`}
            className={`font-mono text-[10px] tracking-wider uppercase px-2.5 py-1.5 min-h-[38px] border transition-all flex items-center gap-1.5 focus:outline-none focus:ring-1 focus:ring-bureau-teal ${
              audioOn
                ? "border-bureau-teal text-bureau-teal bg-bureau-teal/10"
                : "border-bureau-border text-bureau-muted hover:border-bureau-muted"
            }`}
          >
            <span>{audioOn ? "SFX: ON" : "SFX: MUTED"}</span>
          </button>

          <Link
            href="/organiser/login"
            onClick={() => playKeyTick()}
            className="hidden sm:inline-flex font-mono text-[11px] tracking-wider uppercase text-bureau-paper hover:text-bureau-red border border-bureau-border hover:border-bureau-red/50 px-3 py-1.5 transition-all"
          >
            [ HANDLER GATE ]
          </Link>

          {/* Mobile Menu Hamburger (with 44x44px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden font-mono text-sm text-bureau-paper w-11 h-11 flex items-center justify-center border border-bureau-border active:bg-bureau-surface"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-bureau-border bg-[#0a0e14]/98 backdrop-blur-xl p-4 sm:p-5 space-y-2 font-mono text-xs tracking-wider uppercase animate-fadeIn">
          <Link
            href="/"
            onClick={() => {
              setMobileMenuOpen(false);
              playKeyTick();
            }}
            className="block text-bureau-paper hover:text-bureau-teal py-3 px-3 rounded border-b border-bureau-border/40 min-h-[44px] flex items-center"
          >
            {"//"} INCIDENT OVERVIEW
          </Link>
          <Link
            href="/#rounds"
            onClick={() => {
              setMobileMenuOpen(false);
              playKeyTick();
            }}
            className="block text-bureau-paper hover:text-bureau-teal py-3 px-3 rounded border-b border-bureau-border/40 min-h-[44px] flex items-center"
          >
            {"//"} 5 INVESTIGATION ROUNDS
          </Link>
          <Link
            href="/participant"
            onClick={() => {
              setMobileMenuOpen(false);
              playKeyTick();
            }}
            className="block text-bureau-teal font-semibold py-3 px-3 rounded bg-bureau-teal/10 border border-bureau-teal/40 min-h-[44px] flex items-center justify-between"
          >
            <span>{"//"} PARTICIPANT PORTAL</span>
            <span>→</span>
          </Link>
          <Link
            href="/organiser/login"
            onClick={() => {
              setMobileMenuOpen(false);
              playKeyTick();
            }}
            className="block text-bureau-red font-semibold py-3 px-3 rounded border border-bureau-red/40 bg-bureau-red/5 min-h-[44px] flex items-center justify-between mt-2"
          >
            <span>[ HANDLER COMMAND GATE ]</span>
            <span>🔒</span>
          </Link>
        </div>
      )}
    </header>
  );
}
export default Navbar;
