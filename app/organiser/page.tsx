"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Announcement } from "@/lib/store";
import { AnnouncementForm } from "@/components/AnnouncementForm";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { playKeyTick, playAccessGrantedBeep } from "@/lib/audio";

export default function OrganiserDashboardPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fetchDispatches = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch dispatches:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispatches();
  }, [fetchDispatches]);

  const handleLogout = async () => {
    playKeyTick();
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
    } catch {
      router.push("/");
    }
  };

  const handleDelete = async (id: string) => {
    playKeyTick();
    try {
      const res = await fetch(`/api/announcements?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedbackToast({
          type: "error",
          text: data.error || "EXPUNGEMENT PROTOCOL FAILED.",
        });
        return;
      }

      playAccessGrantedBeep();
      setFeedbackToast({
        type: "success",
        text: `DISPATCH ${id} EXPUNGED FROM OFFICIAL BUREAU LOGS.`,
      });
      fetchDispatches();
    } catch {
      setFeedbackToast({
        type: "error",
        text: "TELEMETRY FAILURE DURING DELETION SEQUENCE.",
      });
    }
  };

  const handleTogglePin = async (id: string) => {
    playKeyTick();
    try {
      const res = await fetch("/api/announcements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFeedbackToast({
          type: "error",
          text: data.error || "PIN PROTOCOL FAILED.",
        });
        return;
      }

      playAccessGrantedBeep();
      setFeedbackToast({
        type: "success",
        text: data.message || "DISPATCH PIN STATE MODIFIED.",
      });
      fetchDispatches();
    } catch {
      setFeedbackToast({
        type: "error",
        text: "TELEMETRY FAILURE DURING PIN UPDATE.",
      });
    }
  };

  return (
    <div className="w-full min-h-screen bg-bureau-base pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Header & Clearances */}
      <div className="max-w-7xl mx-auto mb-10 border-b border-bureau-border/70 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => playKeyTick()}
            className="text-bureau-muted hover:text-bureau-teal transition-colors min-h-[44px] flex items-center"
          >
            ← INCIDENT HUB
          </Link>
          <span className="text-bureau-border">/</span>
          <span className="text-bureau-red font-bold tracking-widest uppercase">
            HANDLER COMMAND TERMINAL
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-4">
          <span className="text-bureau-muted text-[11px]">
            CLEARANCE: <span className="text-bureau-teal font-semibold">LEVEL-5-HANDLER</span>
          </span>
          <button
            onClick={handleLogout}
            className="font-mono text-xs text-bureau-paper hover:text-bureau-red border border-bureau-border px-3.5 py-1.5 min-h-[40px] flex items-center justify-center uppercase tracking-wider hover:border-bureau-red/50 transition-colors"
          >
            [ SECURE LOGOUT ]
          </button>
        </div>
      </div>

      {/* Main Handler Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="classified-stamp mb-3 text-xs">
              THE MENTALIST // GAME MASTER COMMAND
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-bureau-paper font-bold tracking-tight">
              Incident Dispatch Control
            </h1>
            <p className="font-sans text-sm text-bureau-muted mt-2 max-w-2xl leading-relaxed">
              Broadcast live clue drops, emergency directives, round transitions, and tie-breaker alerts to field investigator squads. Transmissions propagate immediately to all active participant terminals.
            </p>
          </div>
          <div>
            <Link
              href="/participant"
              target="_blank"
              onClick={() => playKeyTick()}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase text-bureau-teal hover:underline"
            >
              <span>PREVIEW INVESTIGATOR FEED (NEW TAB)</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Toast */}
      {feedbackToast && (
        <div className="max-w-7xl mx-auto mb-8">
          <div
            role="alert"
            className={`p-4 border font-mono text-xs tracking-wider flex items-center justify-between animate-fadeIn ${
              feedbackToast.type === "success"
                ? "border-bureau-teal bg-bureau-teal/10 text-bureau-teal"
                : "border-bureau-red bg-bureau-red/10 text-bureau-red"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="animate-pulse">■</span>
              <span>{feedbackToast.text}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-bureau-paper hover:underline uppercase text-[10px]"
            >
              [ DISMISS ]
            </button>
          </div>
        </div>
      )}

      {/* Section 1: Post New Intel Dispatch */}
      <div className="max-w-7xl mx-auto mb-16">
        <AnnouncementForm onSuccess={fetchDispatches} />
      </div>

      {/* Section 2: Active Dispatches Management */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between border-b border-bureau-border/70 pb-4 mb-6">
          <div>
            <span className="font-mono text-xs uppercase text-bureau-teal tracking-widest">
              MANAGEMENT ARCHIVE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold">
              Active Dispatches ({announcements.length})
            </h2>
          </div>
          <button
            onClick={() => {
              playKeyTick();
              fetchDispatches();
            }}
            className="font-mono text-xs text-bureau-muted hover:text-bureau-paper border border-bureau-border px-3 py-1 uppercase"
          >
            [ REFRESH FEED ]
          </button>
        </div>

        {loading ? (
          <div className="p-12 border border-bureau-border text-center font-mono text-xs text-bureau-muted animate-pulse">
            RETRIEVING DOSSIER INVENTORY...
          </div>
        ) : announcements.length === 0 ? (
          <div className="p-12 border border-bureau-border text-center font-mono text-xs text-bureau-muted">
            NO DISPATCH RECORDS FOUND IN /data/announcements.json
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {announcements.map((dispatch) => (
              <AnnouncementCard
                key={dispatch.id}
                announcement={dispatch}
                isOrganiser={true}
                onDelete={handleDelete}
                onTogglePin={handleTogglePin}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
