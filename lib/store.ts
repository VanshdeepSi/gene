import fs from "fs/promises";
import path from "path";
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

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "announcements.json");

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
 * Ensures data directory and announcements file exist.
 */
async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, "[]", "utf-8");
    }
  } catch (err) {
    console.error("[Store] Failed to ensure announcements data file:", err);
  }
}

/**
 * Reads all announcements safely from the JSON file.
 * Returns empty array if file is missing or invalid.
 */
export async function readAnnouncements(): Promise<Announcement[]> {
  await ensureDataFile();
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    if (!raw.trim()) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as Announcement[];
  } catch (error) {
    console.error("[Store] Error reading announcements.json:", error);
    return [];
  }
}

/**
 * Writes the announcements array to disk safely.
 */
async function writeAnnouncements(announcements: Announcement[]): Promise<void> {
  await ensureDataFile();
  const serialized = JSON.stringify(announcements, null, 2);
  await fs.writeFile(DATA_FILE, serialized, "utf-8");
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
}

/**
 * Deletes an announcement by ID.
 */
export async function deleteAnnouncement(id: string): Promise<boolean> {
  if (!id) return false;
  const current = await readAnnouncements();
  const filtered = current.filter((item) => item.id !== id);
  if (filtered.length === current.length) {
    return false; // Not found
  }
  await writeAnnouncements(filtered);
  return true;
}

/**
 * Toggles or updates the pinned status of an announcement.
 */
export async function togglePinAnnouncement(id: string): Promise<Announcement | null> {
  if (!id) return null;
  const current = await readAnnouncements();
  const target = current.find((item) => item.id === id);
  if (!target) return null;
  target.pinned = !target.pinned;
  await writeAnnouncements(current);
  return target;
}
