"use client";

import React, { useState } from "react";
import { Announcement } from "@/lib/store";
import { playKeyTick } from "@/lib/audio";

interface AnnouncementCardProps {
  announcement: Announcement;
  isOrganiser?: boolean;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

function getRelativeTime(isoString: string): string {
  try {
    const now = Date.now();
    const past = new Date(isoString).getTime();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return "just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHour = Math.floor(diffMin / 60);
    if (diffHour < 24) return `${diffHour}h ago`;
    const diffDays = Math.floor(diffHour / 24);
    if (diffDays < 30) return `${diffDays}d ago`;
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "recent";
  }
}

export function AnnouncementCard({
  announcement,
  isOrganiser = false,
  onDelete,
  onTogglePin,
}: AnnouncementCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [declassified, setDeclassified] = useState(false);

  const isUrgent = announcement.category === "Urgent";
  const isEvent = announcement.category === "Event";
  const isDeadline = announcement.category === "Deadline";

  const categoryColor = isUrgent
    ? "border-bureau-red/70 bg-bureau-red/10 text-bureau-red"
    : isDeadline
    ? "border-amber-500/60 bg-amber-500/10 text-amber-400"
    : isEvent
    ? "border-bureau-teal/60 bg-bureau-teal/10 text-bureau-teal"
    : "border-bureau-border bg-bureau-surface text-bureau-muted";

  return (
    <article
      className={`relative p-6 border transition-all duration-300 ${
        announcement.pinned
          ? "border-bureau-teal/70 bg-[#0f1520] shadow-[0_0_15px_rgba(25,227,208,0.1)]"
          : isUrgent
          ? "border-bureau-red/50 bg-[#140b0e]"
          : "border-bureau-border bg-[#0d1117] hover:border-bureau-border/90"
      }`}
    >
      {/* Pinned Ribbon Tag */}
      {announcement.pinned && (
        <div className="absolute -top-3 right-6 bg-bureau-teal text-bureau-base font-mono text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 shadow">
          PINNED DOSSIER // TOP PRIORITY
        </div>
      )}

      {/* Top Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-bureau-border/60 pb-3 mb-4 font-mono text-[10px]">
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 border font-semibold uppercase tracking-wider ${categoryColor}`}>
            {announcement.category}
          </span>
          {announcement.eventDate && (
            <span className="text-bureau-paper/80 border border-bureau-border px-2 py-0.5">
              TARGET DATE: {announcement.eventDate}
            </span>
          )}
        </div>

        <div className="text-bureau-muted">
          DISPATCHED: {getRelativeTime(announcement.createdAt)}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-serif text-xl sm:text-2xl text-bureau-paper font-bold tracking-wide mb-3">
        {announcement.title}
      </h3>

      {/* Declassified Redaction Bar Animation Reveal */}
      <div className="relative font-sans text-xs sm:text-sm text-bureau-paper-dark leading-relaxed mb-6 overflow-hidden">
        {/* Redaction slider bar for visual noir effect */}
        {!declassified && (
          <div
            className="absolute inset-0 bg-[#07090c] border-y border-bureau-teal/30 z-10 flex items-center px-3 sm:px-4 cursor-pointer group min-h-[44px]"
            onClick={() => {
              setDeclassified(true);
              playKeyTick();
            }}
          >
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-bureau-teal tracking-wider sm:tracking-widest uppercase">
              <span className="animate-pulse flex-shrink-0">▶</span>
              <span className="group-hover:underline">CLICK TO DECLASSIFY DISPATCH TELEMETRY</span>
            </div>
          </div>
        )}
        <p className="whitespace-pre-line">{announcement.message}</p>
      </div>

      {/* Card Footer: Metadata and Organiser Controls */}
      <div className="border-t border-bureau-border/60 pt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] text-bureau-muted">
        <div>ID: {announcement.id}</div>

        {/* Organiser Action Buttons */}
        {isOrganiser && (
          <div className="flex items-center gap-3">
            {/* Toggle Pin */}
            {onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(announcement.id)}
                className="hover:text-bureau-teal uppercase tracking-wider transition-colors px-2 py-0.5 border border-bureau-border"
              >
                {announcement.pinned ? "[ UNPIN ]" : "[ PIN TO TOP ]"}
              </button>
            )}

            {/* Delete with confirmation dialog */}
            {onDelete && !showConfirmDelete && (
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="hover:text-bureau-red uppercase tracking-wider text-bureau-red/80 transition-colors px-2 py-0.5 border border-bureau-border"
              >
                [ EXPUNGE ]
              </button>
            )}

            {showConfirmDelete && (
              <div className="flex items-center gap-2 bg-bureau-red-dark/30 border border-bureau-red p-1">
                <span className="text-bureau-red font-bold">CONFIRM DESTRUCTION?</span>
                <button
                  type="button"
                  onClick={() => {
                    if (onDelete) {
                      onDelete(announcement.id);
                    }
                    setShowConfirmDelete(false);
                  }}
                  className="bg-bureau-red text-white px-2 py-0.5 font-bold uppercase hover:bg-red-700"
                >
                  YES, EXPUNGE
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="text-bureau-paper px-2 py-0.5 uppercase hover:underline"
                >
                  CANCEL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
export default AnnouncementCard;
