"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GeneLogo } from "@/components/GeneLogo";
import { playKeyTick, playAccessGrantedBeep } from "@/lib/audio";

export default function OrganiserLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [shake, setShake] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setErrorText(null);
    setLoading(true);
    playKeyTick();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setShake(true);
        setTimeout(() => setShake(false), 600);
        setErrorText(data.error || "ACCESS DENIED: CIPHER REJECTED");
        return;
      }

      setAccessGranted(true);
      playAccessGrantedBeep();
      setTimeout(() => {
        router.push("/organiser");
      }, 600);
    } catch {
      setErrorText("COMMUNICATION BREACH: UNABLE TO CONTACT VAULT GATE.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bureau-base flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden select-none">
      {/* Background forensic lines */}
      <div className="absolute inset-0 forensic-grid opacity-30 pointer-events-none" />

      {/* Return Navigation Container */}
      <div className="w-full max-w-md mx-auto mb-4 z-20 flex items-center justify-between">
        <Link
          href="/"
          onClick={() => playKeyTick()}
          className="font-mono text-xs text-bureau-muted hover:text-bureau-teal flex items-center gap-2 transition-colors min-h-[44px]"
        >
          <span>←</span>
          <span>RETURN TO INCIDENT HUB</span>
        </Link>
        <span className="font-mono text-[10px] text-bureau-muted uppercase">
          SECURE ENCLAVE
        </span>
      </div>

      {/* Main Terminal Gate Card */}
      <div
        className={`relative z-10 max-w-md w-full border ${
          shake
            ? "border-bureau-red shadow-red-glow animate-glitch"
            : accessGranted
            ? "border-bureau-teal shadow-teal-glow"
            : "border-bureau-border"
        } bg-[#0b0f16]/95 p-6 sm:p-10 transition-all duration-300`}
      >
        {/* Brand Stamp */}
        <div className="flex flex-col items-center text-center mb-8">
          <GeneLogo size={44} showWordmark={false} />
          <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-bureau-red font-semibold">
            THE MENTALIST // GAME MASTER GATE
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold mt-1">
            Handler Verification
          </h1>
          <p className="font-sans text-xs text-bureau-muted mt-2 leading-relaxed">
            Authorized GENE and SAT coordinators must provide the designated cipher key to broadcast live clues and control incident telemetry.
          </p>
        </div>

        {/* Shake & Error Toast */}
        {errorText && (
          <div
            role="alert"
            className="mb-6 p-3 border border-bureau-red bg-bureau-red/10 text-bureau-red font-mono text-xs tracking-wider flex items-center gap-2 animate-pulse"
          >
            <span>[!]</span>
            <span>{errorText}</span>
          </div>
        )}

        {/* Access Granted Toast */}
        {accessGranted && (
          <div
            role="status"
            className="mb-6 p-3 border border-bureau-teal bg-bureau-teal/10 text-bureau-teal font-mono text-xs tracking-wider flex items-center gap-2"
          >
            <span>[✔]</span>
            <span>CLEARANCE VERIFIED. OPENING VAULT...</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="handler-password"
              className="block font-mono text-xs text-bureau-paper tracking-wider uppercase mb-2"
            >
              Master Access Cipher *
            </label>
            <div className="relative">
              <input
                id="handler-password"
                type={showPassword ? "text" : "password"}
                required
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  playKeyTick();
                }}
                placeholder="Enter Bureau cipher..."
                className="w-full bg-[#06080b] border border-bureau-border pl-4 pr-14 py-3 text-base sm:text-sm text-bureau-paper placeholder-bureau-muted/40 font-mono tracking-widest focus:outline-none focus:border-bureau-red transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 -translate-y-1/2 font-mono text-[10px] text-bureau-muted hover:text-bureau-paper uppercase tracking-wider px-3 min-h-[44px] flex items-center justify-center"
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-1 font-mono text-[10px] text-bureau-muted">
              <span>TIMING-SAFE BUFFER EQUALITY</span>
              <span>RATE-LIMITED (5 TRIES)</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || accessGranted}
            className="w-full font-mono text-xs uppercase tracking-[0.2em] font-bold bg-bureau-red text-white py-3.5 min-h-[48px] flex items-center justify-center hover:bg-red-700 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading
              ? "[ DECRYPTING KEY MATRIX... ]"
              : accessGranted
              ? "[ ACCESS AUTHORIZED ]"
              : "[ VERIFY HANDLER IDENTITY ]"}
          </button>
        </form>

        {/* Footer Warning */}
        <div className="mt-8 pt-4 border-t border-bureau-border/60 text-center font-mono text-[10px] text-bureau-muted leading-relaxed">
          UNAUTHORIZED ACCESS ATTEMPTS LOGGED BY FORENSIC IP TELEMETRY.
        </div>
      </div>
    </div>
  );
}
