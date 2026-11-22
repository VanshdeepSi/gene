import React from "react";
import Link from "next/link";
import { GeneLogo } from "@/components/GeneLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bureau-base flex flex-col justify-center items-center px-4 py-16 text-center select-none relative overflow-hidden">
      {/* Background forensic grid */}
      <div className="absolute inset-0 forensic-grid opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full border border-bureau-border bg-[#0b0f16] p-8 sm:p-12 shadow-2xl">
        <div className="mb-6 flex justify-center">
          <GeneLogo size={44} showWordmark={false} />
        </div>

        <div className="classified-stamp text-xs mb-4">
          ERROR 404 // CLASSIFIED VOID
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl text-bureau-paper font-bold mb-3">
          Case File Not Found
        </h1>

        <div className="h-[1px] w-20 bg-bureau-red mx-auto mb-4" />

        <p className="font-mono text-xs text-bureau-muted uppercase tracking-wider mb-8 leading-relaxed">
          The requested coordinate or case dossier does not exist in the Bureau central repository.
          It may have been expunged, redacted, or never transcribed.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest font-bold bg-bureau-teal text-bureau-base px-6 py-3 hover:bg-white transition-colors"
          >
            [ RETURN TO BUREAU ]
          </Link>
          <Link
            href="/participant"
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest text-bureau-paper border border-bureau-border px-6 py-3 hover:border-bureau-teal hover:text-bureau-teal transition-colors"
          >
            [ AGENT DISPATCHES ]
          </Link>
        </div>

        <div className="mt-8 pt-4 border-t border-bureau-border/60 font-mono text-[10px] text-bureau-muted/70">
          LOGGED UNDER SECURITY ANOMALY #ERR-404-NULL
        </div>
      </div>
    </div>
  );
}
