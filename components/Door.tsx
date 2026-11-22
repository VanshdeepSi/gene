"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { playAccessGrantedBeep, playKeyTick } from "@/lib/audio";

interface DoorProps {
  role: "AGENT" | "HANDLER";
  title: string;
  subtitle: string;
  destination: string;
  description: string;
  clearanceLevel: string;
  accent: "teal" | "red";
  caseNumber: string;
}

export function Door({
  role,
  title,
  subtitle,
  destination,
  description,
  clearanceLevel,
  accent,
  caseNumber,
}: DoorProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [granted, setGranted] = useState(false);

  const isTeal = accent === "teal";
  const accentBorder = isTeal ? "border-bureau-teal/40" : "border-bureau-red/40";
  const accentGlow = isTeal ? "hover:shadow-teal-glow" : "hover:shadow-red-glow";
  const accentText = isTeal ? "text-bureau-teal" : "text-bureau-red";
  const accentBg = isTeal ? "bg-bureau-teal/10" : "bg-bureau-red/10";

  const handleActivate = () => {
    if (isScanning || granted) return;
    setIsScanning(true);
    playKeyTick();

    setTimeout(() => {
      setGranted(true);
      playAccessGrantedBeep();
      setTimeout(() => {
        router.push(destination);
      }, 550);
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleActivate();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${title} (${subtitle}) - Proceed to ${destination}`}
      onClick={handleActivate}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => {
        setIsHovered(true);
        playKeyTick();
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group w-full text-left p-6 sm:p-8 rounded-none border border-bureau-border bg-bureau-surface/75 backdrop-blur-md transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 ${
        isTeal ? "focus:ring-bureau-teal" : "focus:ring-bureau-red"
      } ${accentGlow} overflow-hidden`}
    >
      {/* Top Technical Metadata Bar */}
      <div className="flex items-center justify-between border-b border-bureau-border/70 pb-3 mb-6 font-mono text-[11px] text-bureau-muted tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-bureau-border group-hover:bg-bureau-teal transition-colors" />
          <span>{caseNumber}</span>
        </div>
        <div className={`px-2 py-0.5 border ${accentBorder} ${accentBg} ${accentText} font-semibold uppercase`}>
          {clearanceLevel}
        </div>
      </div>

      {/* Main Door Titles */}
      <div className="mb-4">
        <p className="font-mono text-xs text-bureau-paper/60 uppercase tracking-widest mb-1">
          {subtitle}
        </p>
        <h3 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold tracking-wide group-hover:text-white transition-colors flex items-center justify-between">
          <span>{title}</span>
          <span className={`font-mono text-lg transition-transform duration-300 ${isHovered ? "translate-x-1" : ""} ${accentText}`}>
            →
          </span>
        </h3>
      </div>

      <p className="font-sans text-xs sm:text-sm text-bureau-muted leading-relaxed mb-6">
        {description}
      </p>

      {/* Biometric Fingerprint Scanner Area */}
      <div className="pt-4 border-t border-bureau-border/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Fingerprint SVG Graphic with Animated Ridges */}
          <div className="relative w-12 h-12 flex items-center justify-center rounded border border-bureau-border/80 bg-bureau-base/80 overflow-hidden">
            <svg
              width="28"
              height="36"
              viewBox="0 0 28 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-colors duration-300 ${
                granted
                  ? isTeal
                    ? "text-bureau-teal"
                    : "text-bureau-red"
                  : isHovered
                  ? "text-bureau-paper"
                  : "text-bureau-muted/60"
              }`}
            >
              {/* Outer Ridge */}
              <path
                d="M14 3C7.5 3 3 7.8 3 14V22C3 27 6 31 10 33"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                className={`transition-all duration-500 ${
                  isHovered ? "stroke-dashoffset-0" : ""
                }`}
                style={{
                  strokeDasharray: 45,
                  strokeDashoffset: isHovered ? 0 : 35,
                }}
              />
              {/* Core Loops */}
              <path
                d="M14 8C9.5 8 7 11.5 7 16V22C7 26 9.5 29 13 30"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 38,
                  strokeDashoffset: isHovered ? 0 : 25,
                }}
              />
              <path
                d="M14 13C12 13 11 14.8 11 17V22C11 24.5 12.5 26.5 15 27"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                style={{
                  strokeDasharray: 25,
                  strokeDashoffset: isHovered ? 0 : 18,
                }}
              />
              {/* Central Nucleus */}
              <path
                d="M14 18V21"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              {/* Right Arcs */}
              <path
                d="M25 15C25 8 20.5 3 14 3"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M21 17C21 12 18 8 14 8"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M18 24V17C18 14.5 16.5 13 14 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
              <path
                d="M23 21C23 25.5 20.5 29 17 31"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>

            {/* Scanning line sweep on hover */}
            {isHovered && !granted && (
              <div
                className={`absolute inset-x-0 h-[2px] ${
                  isTeal ? "bg-bureau-teal shadow-[0_0_8px_#19e3d0]" : "bg-bureau-red shadow-[0_0_8px_#b3202a]"
                } animate-scan-line pointer-events-none`}
              />
            )}
          </div>

          <div className="font-mono text-[11px] leading-tight">
            {granted ? (
              <span className={`font-bold tracking-wider ${accentText}`}>
                [ ACCESS GRANTED // DISPATCHING ]
              </span>
            ) : isScanning ? (
              <span className="text-bureau-paper animate-pulse">
                [ VERIFYING BIOMETRICS... ]
              </span>
            ) : isHovered ? (
              <span className="text-bureau-paper">
                [ SCANNER READY // CLICK TO ENGAGE ]
              </span>
            ) : (
              <span className="text-bureau-muted">
                STANDBY FOR IDENTIFICATION
              </span>
            )}
            <div className="text-[10px] text-bureau-muted/80">
              {role === "AGENT" ? "UNRESTRICTED AGENT PORTAL" : "LEVEL-5 CIPHER REQUIRED"}
            </div>
          </div>
        </div>

        {/* Status Indicator Pip */}
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${
              granted
                ? isTeal
                  ? "bg-bureau-teal shadow-[0_0_8px_#19e3d0]"
                  : "bg-bureau-red shadow-[0_0_8px_#b3202a]"
                : isHovered
                ? "bg-bureau-paper animate-ping"
                : "bg-bureau-muted/40"
            }`}
          />
        </div>
      </div>

      {/* Screen flash on grant */}
      {granted && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
            isTeal ? "bg-bureau-teal/15" : "bg-bureau-red/15"
          }`}
        />
      )}
    </div>
  );
}
export default Door;
