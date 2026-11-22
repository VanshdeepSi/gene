"use client";

import React from "react";

interface ElectrophoresisDividerProps {
  label?: string;
  className?: string;
}

export function ElectrophoresisDivider({
  label = "AGAROSE GEL ELECTROPHORESIS // RUN: ETHIDIUM BROMIDE CASSETTE #441",
  className = "",
}: ElectrophoresisDividerProps) {
  // Lanes representation with molecular base-pair bands
  const lanes = [
    { name: "LADDER (BP)", bands: [95, 80, 65, 50, 35, 20] },
    { name: "SMPL-OPERON", bands: [80, 50, 20] },
    { name: "SMPL-POL1.0", bands: [65, 35] },
    { name: "SMPL-PRIBNW", bands: [95, 65, 35] },
    { name: "SMPL-TISSUE", bands: [50, 20] },
    { name: "CTRL-BLANK", bands: [] },
  ];

  return (
    <div className={`w-full py-8 overflow-hidden select-none ${className}`}>
      {/* Top Telemetry Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3 flex items-center justify-between font-mono text-[10px] text-bureau-muted tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-bureau-teal animate-pulse" />
          <span>{label}</span>
        </div>
        <div className="hidden sm:block text-bureau-paper/40">
          CATHODE [-] ─────────────── ANODE [+] // 120V CONSTANT
        </div>
      </div>

      {/* Gel Electrophoresis Cassette Tray */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative border border-bureau-border/80 bg-[#060a0f] p-4 rounded-none shadow-inner overflow-hidden">
          {/* Subtle gel fluid reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-bureau-teal/5 via-transparent to-bureau-teal/5 pointer-events-none" />

          {/* Cassette Wells and Lanes */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 relative z-10">
            {lanes.map((lane, idx) => (
              <div key={idx} className="flex flex-col items-center">
                {/* Gel Well Opening */}
                <div className="w-8 sm:w-16 h-2 rounded-sm bg-bureau-border/70 border border-bureau-muted/20 mb-3" />
                <span className="font-mono text-[9px] text-bureau-muted/70 tracking-tight text-center mb-2 truncate max-w-full">
                  {lane.name}
                </span>

                {/* Gel Migration Column */}
                <div className="relative w-full h-16 sm:h-20 bg-black/40 border-x border-bureau-border/30 overflow-hidden">
                  {lane.bands.map((bandPos, bIdx) => (
                    <div
                      key={bIdx}
                      className="absolute inset-x-1 sm:inset-x-2 h-[3px] sm:h-[4px] rounded-xs bg-bureau-teal/80 shadow-[0_0_8px_#19e3d0] transition-opacity hover:opacity-100 opacity-80"
                      style={{ top: `${bandPos}%` }}
                    />
                  ))}
                  {/* Faint migratory band shimmer */}
                  <div className="absolute inset-x-0 h-[1px] bg-bureau-teal/20 animate-scan-line pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Technical Legend */}
          <div className="mt-3 pt-2 border-t border-bureau-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 font-mono text-[8px] sm:text-[9px] text-bureau-muted/60">
            <span className="truncate max-w-full">RUN DURATION: 45 MIN // 1.2% AGAROSE // UV TRANSILLUMINATION</span>
            <span>BAND PURITY: 98.7%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ElectrophoresisDivider;
