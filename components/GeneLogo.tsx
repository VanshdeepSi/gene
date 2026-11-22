"use client";

import React, { useState } from "react";
import Image from "next/image";

interface GeneLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
}

export function GeneLogo({
  className = "",
  size = 38,
  showWordmark = true,
}: GeneLogoProps) {
  const [satFailed, setSatFailed] = useState(false);
  const [geneFailed, setGeneFailed] = useState(false);

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-3 select-none ${className}`}>
      {/* Logos Container: Official GENE Society + SATURNALIA 51 Logos */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Real GENE Logo */}
        <div
          className="relative flex items-center justify-center rounded border border-bureau-teal/50 bg-[#0d141e]/90 p-0.5 shadow-[0_0_10px_rgba(25,227,208,0.2)]"
          style={{ width: size, height: size }}
          title="GENE (Genesis & Engineering of Neo Environment)"
        >
          {!geneFailed ? (
            <Image
              src="/assets/gene-logo.png"
              alt="GENE Society Logo"
              width={size}
              height={size}
              className="object-contain"
              onError={() => setGeneFailed(true)}
              priority
            />
          ) : (
            <svg
              width={size}
              height={size}
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-bureau-teal"
            >
              <path
                d="M38 16C35.2 10.5 29.8 7 23.5 7C14.4 7 7 14.4 7 23.5C7 32.6 14.4 40 23.5 40C31.5 40 38.2 34.3 39.7 26.8H23.5"
                stroke="#19e3d0"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="23.5" cy="23.5" r="3" fill="#b3202a" />
            </svg>
          )}
        </div>

        {/* Small "×" bridge */}
        <span className="font-mono text-xs text-bureau-muted font-bold">×</span>

        {/* Real Saturnalia 51 (2026) Official Logo */}
        <div
          className="relative flex items-center justify-center rounded border border-[#e6af38]/40 bg-[#0d141e]/90 p-0.5 shadow-[0_0_10px_rgba(230,175,56,0.2)]"
          style={{ width: size * 1.25, height: size }}
          title="Saturnalia 51 (2026) - The Ascension of Legacy"
        >
          {!satFailed ? (
            <Image
              src="/assets/saturnalia51-logo.png"
              alt="Saturnalia 51 (2026) Official Logo"
              width={size * 1.25}
              height={size}
              className="object-contain"
              onError={() => setSatFailed(true)}
              priority
            />
          ) : (
            <div className="font-mono text-[9px] font-bold text-[#e6af38] uppercase">
              SAT&apos;51
            </div>
          )}
        </div>
      </div>

      {showWordmark && (
        <div className="flex flex-col tracking-tight">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-serif text-base sm:text-lg tracking-wider text-bureau-paper font-bold leading-tight">
              THE MENTALIST
            </span>
            <span className="hidden xs:inline-block text-[8px] sm:text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-bureau-red/40 bg-bureau-red/10 text-bureau-red font-semibold leading-none">
              DIGITAL DECEPTION
            </span>
          </div>
          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-wider sm:tracking-widest text-bureau-muted leading-tight">
            GENE × SATURNALIA 51 // TIET
          </span>
        </div>
      )}
    </div>
  );
}

export default GeneLogo;
