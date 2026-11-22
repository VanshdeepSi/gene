"use client";

import React, { useState } from "react";
import { AnnouncementCategory } from "@/lib/store";
import { playKeyTick, playAccessGrantedBeep } from "@/lib/audio";

interface AnnouncementFormProps {
  onSuccess?: () => void;
}

export function AnnouncementForm({ onSuccess }: AnnouncementFormProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory>("Event");
  const [eventDate, setEventDate] = useState("");
  const [pinned, setPinned] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage(null);

    const trimmedTitle = title.trim();
    const trimmedMessage = message.trim();

    if (!trimmedTitle) {
      setToastMessage({ type: "error", text: "DISPATCH REJECTED: TITLE CANNOT BE BLANK." });
      return;
    }
    if (trimmedTitle.length > 100) {
      setToastMessage({ type: "error", text: "TITLE EXCEEDS MAXIMUM 100 CHARACTER SPECIFICATION." });
      return;
    }
    if (!trimmedMessage) {
      setToastMessage({ type: "error", text: "DISPATCH REJECTED: MESSAGE BODY REQUIRED." });
      return;
    }
    if (trimmedMessage.length > 1000) {
      setToastMessage({ type: "error", text: "MESSAGE EXCEEDS MAXIMUM 1000 CHARACTER SPECIFICATION." });
      return;
    }

    setLoading(true);
    playKeyTick();

    try {
      const res = await fetch("/api/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: trimmedTitle,
          message: trimmedMessage,
          category,
          eventDate: eventDate || undefined,
          pinned,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToastMessage({
          type: "error",
          text: data.error || "TRANSMISSION REJECTED BY BUREAU REPOSITORY.",
        });
        return;
      }

      playAccessGrantedBeep();
      setToastMessage({
        type: "success",
        text: "DISPATCH LOGGED & BROADCAST TO FIELD AGENTS.",
      });

      // Clear form
      setTitle("");
      setMessage("");
      setCategory("Event");
      setEventDate("");
      setPinned(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch {
      setToastMessage({
        type: "error",
        text: "TELEMETRY COMM LINK FAILURE. PLEASE RETRY.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-bureau-border bg-[#0b0f16] p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-bureau-border/70 pb-4 mb-6">
        <div>
          <span className="font-mono text-xs uppercase text-bureau-red tracking-widest">
            HANDLER AUTHORIZED ENTRY
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl text-bureau-paper font-bold">
            Post New Intel Dispatch
          </h2>
        </div>
        <div className="font-mono text-[10px] text-bureau-muted tracking-widest uppercase">
          SEC-FORM // DISPATCH-V2
        </div>
      </div>

      {/* Typewriter-Style Toast Alert */}
      {toastMessage && (
        <div
          role="alert"
          className={`mb-6 p-4 border font-mono text-xs tracking-wider flex items-center justify-between animate-fadeIn ${
            toastMessage.type === "success"
              ? "border-bureau-teal/70 bg-bureau-teal/10 text-bureau-teal"
              : "border-bureau-red/70 bg-bureau-red/10 text-bureau-red"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="animate-pulse">■</span>
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-bureau-paper hover:underline uppercase text-[10px]"
          >
            [ DISMISS ]
          </button>
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5 font-mono text-xs text-bureau-paper">
            <label htmlFor="dispatch-title" className="tracking-wider uppercase">
              Dispatch Title *
            </label>
            <span
              className={`text-[10px] ${
                title.length > 90 ? "text-bureau-red" : "text-bureau-muted"
              }`}
            >
              {title.length} / 100
            </span>
          </div>
          <input
            id="dispatch-title"
            type="text"
            required
            maxLength={100}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              playKeyTick();
            }}
            placeholder="e.g. CRITICAL PROTOCOL REVISION: LABORATORY DECONTAMINATION"
            className="w-full bg-[#07090c] border border-bureau-border px-4 py-2.5 min-h-[44px] text-base sm:text-sm text-bureau-paper placeholder-bureau-muted/40 font-sans focus:outline-none focus:border-bureau-teal transition-colors"
          />
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label
              htmlFor="dispatch-category"
              className="block font-mono text-xs text-bureau-paper tracking-wider uppercase mb-1.5"
            >
              Category Classification *
            </label>
            <select
              id="dispatch-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as AnnouncementCategory);
                playKeyTick();
              }}
              className="w-full bg-[#07090c] border border-bureau-border px-4 py-2.5 min-h-[44px] text-base sm:text-sm text-bureau-paper font-mono focus:outline-none focus:border-bureau-teal transition-colors"
            >
              <option value="Event">Event (Symposia & Workshops)</option>
              <option value="Deadline">Deadline (Abstracts & Submissions)</option>
              <option value="Urgent">Urgent (Immediate Protocol Alert)</option>
              <option value="General">General (General Briefing)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="dispatch-date"
              className="block font-mono text-xs text-bureau-paper tracking-wider uppercase mb-1.5"
            >
              Target Event Date (Optional)
            </label>
            <input
              id="dispatch-date"
              type="date"
              value={eventDate}
              onChange={(e) => {
                setEventDate(e.target.value);
                playKeyTick();
              }}
              className="w-full bg-[#07090c] border border-bureau-border px-4 py-2.5 min-h-[44px] text-base sm:text-sm text-bureau-paper font-mono focus:outline-none focus:border-bureau-teal transition-colors"
            />
          </div>
        </div>

        {/* Message Body Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5 font-mono text-xs text-bureau-paper">
            <label htmlFor="dispatch-message" className="tracking-wider uppercase">
              Intel Message Body *
            </label>
            <span
              className={`text-[10px] ${
                message.length > 900 ? "text-bureau-red" : "text-bureau-muted"
              }`}
            >
              {message.length} / 1000
            </span>
          </div>
          <textarea
            id="dispatch-message"
            required
            rows={5}
            maxLength={1000}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              playKeyTick();
            }}
            placeholder="Provide comprehensive briefing details, location parameters, and operative directives..."
            className="w-full bg-[#07090c] border border-bureau-border p-4 text-base sm:text-sm text-bureau-paper placeholder-bureau-muted/40 font-sans focus:outline-none focus:border-bureau-teal transition-colors resize-y"
          />
        </div>

        {/* Pinned Checkbox */}
        <div className="flex items-center gap-3">
          <input
            id="dispatch-pinned"
            type="checkbox"
            checked={pinned}
            onChange={(e) => {
              setPinned(e.target.checked);
              playKeyTick();
            }}
            className="w-4 h-4 rounded border-bureau-border bg-[#07090c] text-bureau-teal focus:ring-bureau-teal"
          />
          <label
            htmlFor="dispatch-pinned"
            className="font-mono text-xs text-bureau-paper select-none cursor-pointer tracking-wider"
          >
            PIN DISPATCH TO TOP OF BUREAU FEED (PRIORITY FLAG)
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto font-mono text-xs uppercase tracking-[0.2em] font-bold bg-bureau-teal text-bureau-base px-8 py-3.5 hover:bg-white transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "[ ENCRYPTING & BROADCASTING... ]" : "[ TRANSMIT INTEL DISPATCH ]"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AnnouncementForm;
