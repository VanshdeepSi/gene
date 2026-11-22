"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Announcement } from "@/lib/store";
import { AnnouncementCard } from "@/components/AnnouncementCard";
import { INVESTIGATION_ROUNDS, EVENT_DETAILS, SCORING_RUBRIC } from "@/data/events";
import { playKeyTick } from "@/lib/audio";

export default function ParticipantPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("ALL");

  const fetchDispatches = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements", {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      });
      if (res.ok) {
        const json = await res.json();
        setAnnouncements(json.data || []);
        setLastUpdated(
          new Date().toLocaleTimeString("en-US", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDispatches();
    const interval = setInterval(() => {
      fetchDispatches();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchDispatches]);

  const filteredAnnouncements = announcements.filter((item) => {
    if (filterCategory === "ALL") return true;
    return item.category === filterCategory;
  });

  return (
    <div className="w-full min-h-screen bg-bureau-base pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Top Status & Telemetry Bar */}
      <div className="max-w-7xl mx-auto mb-8 border-b border-bureau-border/70 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            onClick={() => playKeyTick()}
            className="text-bureau-muted hover:text-bureau-teal transition-colors"
          >
            ← INCIDENT MAIN
          </Link>
          <span className="text-bureau-border">/</span>
          <span className="text-bureau-teal font-bold tracking-widest uppercase">
            PARTICIPANT COMMAND TERMINAL
          </span>
        </div>

        <div className="flex items-center gap-4 text-bureau-muted">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bureau-teal animate-pulse" />
            <span>ORGANISER BROADCAST: AUTO-SYNC (30S)</span>
          </div>
          {lastUpdated && <span>SYNCED: {lastUpdated} IST</span>}
        </div>
      </div>

      {/* Main Event Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="font-mono text-xs text-bureau-teal border border-bureau-teal/40 bg-bureau-teal/5 px-2.5 py-1 uppercase tracking-widest font-semibold">
            {EVENT_DETAILS.title}
          </span>
          <span className="font-mono text-xs text-[#e6af38] border border-[#e6af38]/40 bg-[#e6af38]/5 px-2.5 py-1 uppercase tracking-widest font-semibold">
            PARTICIPANT DISPATCHES // {EVENT_DETAILS.venue}
          </span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl text-bureau-paper font-bold tracking-tight mb-3">
          Live Clue & Incident Dispatches
        </h1>
        <p className="font-sans text-sm text-bureau-muted max-w-3xl leading-relaxed">
          Official telemetry broadcasts, clue releases, and round commencement alerts released live by the Game Masters and Organisers. Redaction bars can be clicked to declassify encrypted intelligence.
        </p>

        {/* Category Filter Pills (Mobile swipeable & Desktop flex-wrap) */}
        <div className="flex items-center gap-2 mt-6 font-mono text-xs overflow-x-auto no-scrollbar pb-1 sm:flex-wrap sm:pb-0">
          {["ALL", "Urgent", "Event", "Deadline", "General"].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                playKeyTick();
              }}
              className={`px-3 py-1.5 min-h-[38px] flex items-center justify-center whitespace-nowrap border transition-colors uppercase tracking-wider flex-shrink-0 ${
                filterCategory === cat
                  ? "border-bureau-teal bg-bureau-teal text-bureau-base font-bold"
                  : "border-bureau-border bg-bureau-surface text-bureau-muted hover:text-bureau-paper hover:border-bureau-muted"
              }`}
            >
              {cat === "ALL" ? "ALL TRANSMISSIONS" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Live Dispatches Feed from Organisers */}
      <section className="max-w-7xl mx-auto mb-16">
        {loading ? (
          <div className="p-12 border border-bureau-border text-center font-mono text-xs text-bureau-muted animate-pulse">
            INTERCEPTING ORGANISER CLUE FREQUENCY...
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="p-16 border-2 border-dashed border-bureau-border text-center bg-[#090d14]">
            <div className="classified-stamp mb-4 text-xs">STANDBY FOR CLUES</div>
            <h3 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold mb-2">
              NO ACTIVE CASES. THE CITY IS QUIET... FOR NOW.
            </h3>
            <p className="font-mono text-xs text-bureau-muted max-w-md mx-auto leading-relaxed">
              No unresolved telemetry dispatches match this security filter. Handlers are monitoring background cyber channels.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAnnouncements.map((dispatch) => (
              <AnnouncementCard
                key={dispatch.id}
                announcement={dispatch}
                isOrganiser={false}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Active Case Briefing Dossier */}
      <section className="max-w-7xl mx-auto mb-16 p-6 sm:p-8 border border-bureau-border bg-bureau-surface relative overflow-hidden">
        <div className="classified-stamp absolute top-4 right-4 text-[10px] hidden sm:block">
          TOP SECRET // FOR YOUR EYES ONLY
        </div>

        <div className="max-w-4xl">
          <div className="font-mono text-xs uppercase tracking-widest text-bureau-teal mb-2">
            [ CASE FILE // {EVENT_DETAILS.codeName} ]
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-bureau-paper font-bold mb-4">
            Incident Briefing: Asterion Lab Breach
          </h2>
          <p className="font-sans text-sm text-bureau-paper-dark leading-relaxed mb-6">
            {EVENT_DETAILS.incidentOverview}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs border border-bureau-border/80 bg-black/40 p-3.5 sm:p-4">
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">STOLEN ASSET</span>
              <span className="text-bureau-teal font-bold break-all">{EVENT_DETAILS.stolenAsset}</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">INCIDENT DATE</span>
              <span className="text-bureau-paper font-bold">{EVENT_DETAILS.date}</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">COMPETITION VENUE</span>
              <span className="text-bureau-paper font-bold">LP105 // TIET</span>
            </div>
            <div>
              <span className="text-bureau-muted block text-[10px] uppercase">PRIZE POOL</span>
              <span className="text-[#e6af38] font-bold">₹5,000 + MERIT CERTS</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 5 Rounds Investigation Roadmap */}
      <section className="max-w-7xl mx-auto mb-16 pt-8 border-t border-bureau-border">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-bureau-teal mb-1">
              COMPETITION STAGES // 5 ROUNDS
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-bureau-paper font-bold">
              Investigation Rounds Playbook
            </h2>
            <p className="font-sans text-xs sm:text-sm text-bureau-muted mt-1">
              Teams advance sequentially across 5 forensic, cryptographic, profiling, timeline, and tribunal stages.
            </p>
          </div>
          <div className="font-mono text-xs text-bureau-muted flex flex-col sm:items-end gap-0.5">
            <div>
              TOTAL RUNTIME: <span className="text-bureau-teal font-bold">{EVENT_DETAILS.runtime}</span>
            </div>
            <div>
              TOTAL SCORE: <span className="text-[#e6af38] font-bold">{EVENT_DETAILS.totalScore}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {INVESTIGATION_ROUNDS.map((r) => (
            <div key={r.roundNumber} className="p-5 border border-bureau-border bg-[#0d1117] flex flex-col justify-between hover:border-bureau-teal/50 transition-colors">
              <div>
                <div className="flex items-center justify-between font-mono text-[10px] text-bureau-muted mb-2 pb-1 border-b border-bureau-border/60">
                  <span className="text-bureau-teal font-bold">ROUND 0{r.roundNumber}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[#e6af38] font-semibold">{r.points}P</span>
                    <span>•</span>
                    <span className="text-bureau-paper">{r.duration}</span>
                  </div>
                </div>
                <h3 className="font-serif text-lg text-bureau-paper font-bold mb-2">
                  {r.title}
                </h3>
                <div className="font-mono text-[9px] text-bureau-muted uppercase mb-2">
                  {r.codeName}
                </div>
                <p className="font-sans text-xs text-bureau-paper-dark mb-4 leading-relaxed">
                  {r.objective}
                </p>
              </div>
              <div className="font-mono text-[10px] text-bureau-teal border-t border-bureau-border/60 pt-2">
                <span className="text-bureau-muted block text-[8px] uppercase">OUTPUT:</span>
                <span>{r.teamOutput}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Scoring Rubric Overview */}
      <section className="max-w-7xl mx-auto mb-16 pt-8 border-t border-bureau-border">
        <div className="mb-6">
          <div className="font-mono text-xs uppercase tracking-widest text-bureau-teal mb-1">
            EVALUATION CRITERIA
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold">
            Official Scoring Rubric
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SCORING_RUBRIC.map((item, idx) => (
            <div key={idx} className="p-4 border border-bureau-border bg-[#0a0e14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between font-mono text-xs mb-1">
                  <span className="font-bold text-bureau-paper">{item.round.split(":")[0]}</span>
                  <span className="text-bureau-teal font-bold">{item.points} PTS</span>
                </div>
                <p className="font-sans text-[11px] text-bureau-muted leading-tight mt-2">
                  {item.breakdown}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Contact & Field Desk Coordination */}
      <section className="max-w-7xl mx-auto pt-8 border-t border-bureau-border">
        <div className="p-6 sm:p-8 border border-bureau-border bg-bureau-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-bureau-paper font-bold mb-1">
              Field Team Coordination Desk
            </h3>
            <p className="font-sans text-xs text-bureau-muted leading-relaxed">
              For on-site dispute resolution, laptop power requisitions, or judge tribunal clarification, approach the Game Master desk at LP105 or transmit an inquiry to{" "}
              <a href="mailto:gene@thapar.edu" className="text-bureau-teal underline font-mono">
                gene@thapar.edu
              </a>.
            </p>
          </div>
          <Link
            href="/organiser/login"
            className="w-full sm:w-auto text-center font-mono text-xs uppercase tracking-wider text-bureau-paper hover:text-bureau-red border border-bureau-border hover:border-bureau-red/50 px-4 py-2.5 transition-colors whitespace-nowrap min-h-[44px] flex items-center justify-center flex-shrink-0"
          >
            [ HANDLER GATE ]
          </Link>
        </div>
      </section>
    </div>
  );
}
