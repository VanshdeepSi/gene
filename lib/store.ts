import fs from "fs/promises";
import path from "path";
import os from "os";
import crypto from "crypto";

export type AnnouncementCategory = "Event" | "Deadline" | "Urgent" | "General";

export interface Announcement {
  id: string;
  title: string;
  message: string;
  category: AnnouncementCategory;
  eventDate?: string;
  pinned: boolean;
  createdAt: string;
}

export const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "dispatch-mdd-01",
    title: "CRITICAL INCIDENT ALERT: PROJECT CHIMERA ASSET BREACH (LP105)",
    message:
      "At 01:48 AM on 23 November 2026, the Asterion Bio-Computational Lab server was breached. Stolen asset: PELAGOS_V4.weights (breakthrough synthetic enzyme model). No external brute force was detected; internal credentials were used. Student investigative teams must assemble at LP105 immediately. Live clue packets will be released sequentially across 5 rounds.",
    category: "Urgent",
    eventDate: "2026-11-23",
    pinned: true,
    createdAt: "2026-11-23T01:55:00.000Z",
  },
  {
    id: "dispatch-mdd-02",
    title: "ROUND 1 COMMENCEMENT: THE DIGITAL TRAIL (20 MIN // 15 PTS)",
    message:
      "Round 1 telemetry data has been released. Teams must cross-reference authentication logs, RFID gate records (#BIO-409), and campus DHCP logs to identify the transfer host workstation (B204-PC03) and the source device IP (172.16.44.89). Remember: physical card access alone does not prove execution guilt.",
    category: "Event",
    eventDate: "2026-11-23",
    pinned: true,
    createdAt: "2026-11-23T02:00:00.000Z",
  },
  {
    id: "dispatch-mdd-03",
    title: "PRIZE POOL & FINAL EVALUATION SCHEDULE (₹5,000 + MERIT CERTS)",
    message:
      "Official Announcement: Top unmasking teams will be awarded from the ₹5,000 cash prize pool alongside official Saturnalia'51 merit accreditations. Round 5 live defense will take place before the judging tribunal at LP105. Admission is completely free for all confirmed participant teams.",
    category: "General",
    eventDate: "2026-11-23",
    pinned: false,
    createdAt: "2026-11-22T14:00:00.000Z",
  },
  {
    id: "dispatch-mdd-04",
    title: "EXHIBIT NOTICE: GEL PREVIEW & EXIF CODON SEQUENCE UNLOCKED",
    message:
      "The Game Master bureau has released Exhibit 2A (gel_preview.png EXIF comment). Teams entering Round 2 are instructed to translate the mRNA sequence starting at AUG through the codon immediately before UAA. Decode the passphrase to authenticate the external escrow receipt.",
    category: "General",
    eventDate: "2026-11-23",
    pinned: false,
    createdAt: "2026-11-22T10:15:00.000Z",
  },
];

// Global in-memory cache to guarantee persistence on Vercel / serverless and Node.js
declare global {
  // eslint-disable-next-line no-var
  var __GENE_ANNOUNCEMENTS__: Announcement[] | undefined;
}

const PRIMARY_DATA_DIR = path.join(process.cwd(), "data");
const PRIMARY_DATA_FILE = path.join(PRIMARY_DATA_DIR, "announcements.json");
const TMP_DATA_FILE = path.join(os.tmpdir(), "gene-announcements.json");

/**
 * Escapes common HTML special characters to prevent stored XSS attacks.
 */
export function sanitizeText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Reads all announcements safely.
 * Checks in-memory cache -> primary file -> tmp file -> default seeds.
 */
export async function readAnnouncements(): Promise<Announcement[]> {
  // 1. If in-memory cache is already loaded, return a copy
  if (globalThis.__GENE_ANNOUNCEMENTS__ && Array.isArray(globalThis.__GENE_ANNOUNCEMENTS__)) {
    return [...globalThis.__GENE_ANNOUNCEMENTS__];
  }

  // 2. Try reading from primary data file (local dev or traditional server)
  try {
    const raw = await fs.readFile(PRIMARY_DATA_FILE, "utf-8");
    if (raw && raw.trim()) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__GENE_ANNOUNCEMENTS__ = parsed;
        return [...parsed];
      }
    }
  } catch {
    // Primary file read failed or doesn't exist
  }

  // 3. Try reading from serverless /tmp file
  try {
    const raw = await fs.readFile(TMP_DATA_FILE, "utf-8");
    if (raw && raw.trim()) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__GENE_ANNOUNCEMENTS__ = parsed;
        return [...parsed];
      }
    }
  } catch {
    // Tmp file read failed or doesn't exist
  }

  // 4. Fallback to default official announcements
  const fallback = [...DEFAULT_ANNOUNCEMENTS];
  globalThis.__GENE_ANNOUNCEMENTS__ = fallback;

  // Best-effort attempt to persist seeds
  await writeAnnouncements(fallback).catch(() => {});

  return [...fallback];
}

/**
 * Writes the announcements array safely.
 * Updates in-memory store immediately, then attempts primary file write,
 * falling back gracefully to /tmp (for Vercel read-only filesystems).
 * NEVER throws an exception.
 */
async function writeAnnouncements(announcements: Announcement[]): Promise<void> {
  // 1. Update in-memory runtime cache
  globalThis.__GENE_ANNOUNCEMENTS__ = [...announcements];

  const serialized = JSON.stringify(announcements, null, 2);

  // 2. Attempt writing to primary data directory
  let primarySuccess = false;
  try {
    await fs.mkdir(PRIMARY_DATA_DIR, { recursive: true });
    await fs.writeFile(PRIMARY_DATA_FILE, serialized, "utf-8");
    primarySuccess = true;
  } catch (err) {
    // Expected on read-only environments like Vercel (EROFS)
    console.warn("[Store] Primary file write not permitted, switching to serverless /tmp storage:", (err as Error)?.message);
  }

  // 3. Always mirror to /tmp (writable in all serverless environments like AWS Lambda / Vercel)
  try {
    await fs.writeFile(TMP_DATA_FILE, serialized, "utf-8");
  } catch (tmpErr) {
    if (!primarySuccess) {
      console.warn("[Store] Tmp write also bypassed, retaining in runtime memory:", (tmpErr as Error)?.message);
    }
  }
}

/**
 * Retrieves announcements sorted with pinned items first, then newest first.
 */
export async function getSortedAnnouncements(): Promise<Announcement[]> {
  const list = await readAnnouncements();
  return list.sort((a, b) => {
    // Pinned always on top
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    // Then newest first
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    return timeB - timeA;
  });
}

export interface CreateAnnouncementInput {
  title: string;
  message: string;
  category: AnnouncementCategory;
  eventDate?: string;
  pinned?: boolean;
}

/**
 * Validates and saves a new dispatch.
 */
export async function createAnnouncement(
  input: CreateAnnouncementInput
): Promise<{ success: boolean; data?: Announcement; error?: string }> {
  try {
    const trimmedTitle = input.title?.trim() || "";
    const trimmedMessage = input.message?.trim() || "";
    const validCategories: AnnouncementCategory[] = ["Event", "Deadline", "Urgent", "General"];

    if (!trimmedTitle || trimmedTitle.length > 100) {
      return { success: false, error: "Title is required and must be 100 characters or fewer." };
    }

    if (!trimmedMessage || trimmedMessage.length > 1000) {
      return { success: false, error: "Message is required and must be 1000 characters or fewer." };
    }

    if (!validCategories.includes(input.category)) {
      return { success: false, error: "Invalid dispatch category specified." };
    }

    const safeTitle = sanitizeText(trimmedTitle);
    const safeMessage = sanitizeText(trimmedMessage);
    const safeDate = input.eventDate ? sanitizeText(input.eventDate) : undefined;

    const newRecord: Announcement = {
      id: `dispatch-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`,
      title: safeTitle,
      message: safeMessage,
      category: input.category,
      eventDate: safeDate,
      pinned: Boolean(input.pinned),
      createdAt: new Date().toISOString(),
    };

    const current = await readAnnouncements();
    current.push(newRecord);
    await writeAnnouncements(current);

    return { success: true, data: newRecord };
  } catch (err) {
    console.error("[Store] createAnnouncement error:", err);
    return {
      success: false,
      error: `Storage error: ${(err as Error)?.message || "Failed to persist dispatch"}`,
    };
  }
}

/**
 * Deletes an announcement by ID.
 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (!id) return false;
  try {
    const current = await readAnnouncements();
    const filtered = current.filter((item) => item.id !== id);
    if (filtered.length === current.length) {
      return false; // Not found
    }
    await writeAnnouncements(filtered);
    return true;
  } catch (err) {
    console.error("[Store] deleteAnnouncement error:", err);
    return false;
  }
}

/**
 * Toggles or updates the pinned status of an announcement.
 */
export async function togglePinAnnouncement(id: string): Promise<Announcement | null> {
  if (!id) return null;
  try {
    const current = await readAnnouncements();
    const target = current.find((item) => item.id === id);
    if (!target) return null;
    target.pinned = !target.pinned;
    await writeAnnouncements(current);
    return target;
  } catch (err) {
    console.error("[Store] togglePinAnnouncement error:", err);
    return null;
  }
}
