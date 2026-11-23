import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getSortedAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
  togglePinAnnouncement,
  AnnouncementCategory,
} from "@/lib/store";
import { isAuthenticatedOrganiser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET: Public endpoint returning current intel dispatches.
 * Strictly no-store caching to ensure instantaneous dispatch updates.
 */
export async function GET() {
  try {
    const list = await getSortedAnnouncements();
    const response = NextResponse.json({
      success: true,
      data: list,
      timestamp: new Date().toISOString(),
    });

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    response.headers.set("Pragma", "no-cache");
    return response;
  } catch (err) {
    console.error("[Announcements GET] Error:", err);
    return NextResponse.json(
      { error: "TELEMETRY READ FAILURE: INTEL REPOSITORY UNREACHABLE" },
      { status: 500 }
    );
  }
}

/**
 * POST: Handler-only endpoint to broadcast a new intel dispatch.
 */
export async function POST(req: NextRequest) {
  const isAuth = await isAuthenticatedOrganiser();
  if (!isAuth) {
    return NextResponse.json(
      { error: "CLEARANCE VIOLATION: HANDLER AUTHENTICATION REQUIRED" },
      { status: 401 }
    );
  }

  try {
    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch (parseErr) {
      console.warn("[Announcements POST] Failed to parse JSON body:", parseErr);
      return NextResponse.json(
        { error: "INVALID PAYLOAD: EXPECTED JSON FORMAT" },
        { status: 400 }
      );
    }

    const { title, message, category, eventDate, pinned } = body;

    const result = await createAnnouncement({
      title: typeof title === "string" ? title : "",
      message: typeof message === "string" ? message : "",
      category: category as AnnouncementCategory,
      eventDate: typeof eventDate === "string" ? eventDate : undefined,
      pinned: Boolean(pinned),
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Force purge client route caches so participants see new dispatch immediately
    try {
      revalidatePath("/participant");
      revalidatePath("/api/announcements");
    } catch {
      // Non-critical in local runtimes
    }

    return NextResponse.json(
      {
        success: true,
        message: "INTEL DISPATCH BROADCAST ENCRYPTED AND LOGGED",
        data: result.data,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[Announcements POST] Error:", err);
    const detail = err instanceof Error ? err.message : "DISPATCH CORRUPTED";
    return NextResponse.json(
      { error: `TRANSMISSION ERROR: ${detail}` },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Handler-only endpoint to expunge a dispatch from the record.
 */
export async function DELETE(req: NextRequest) {
  const isAuth = await isAuthenticatedOrganiser();
  if (!isAuth) {
    return NextResponse.json(
      { error: "CLEARANCE VIOLATION: HANDLER AUTHENTICATION REQUIRED" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get("id");

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id;
      } catch {
        // Body was empty or not json
      }
    }

    if (!id) {
      return NextResponse.json(
        { error: "DOSSIER IDENTIFIER (ID) REQUIRED FOR EXPUNGEMENT" },
        { status: 400 }
      );
    }

    const removed = await deleteAnnouncement(id);
    if (!removed) {
      return NextResponse.json(
        { error: "SPECIFIED DISPATCH RECORD NOT FOUND OR ALREADY EXPUNGED" },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/participant");
      revalidatePath("/api/announcements");
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      message: "DISPATCH EXPUNGED FROM FORENSIC LOGS",
      id,
    });
  } catch (err) {
    console.error("[Announcements DELETE] Error:", err);
    return NextResponse.json(
      { error: "DESTRUCTION SEQUENCE ERROR" },
      { status: 500 }
    );
  }
}

/**
 * PATCH: Handler-only endpoint to toggle pinned status.
 */
export async function PATCH(req: NextRequest) {
  const isAuth = await isAuthenticatedOrganiser();
  if (!isAuth) {
    return NextResponse.json(
      { error: "CLEARANCE VIOLATION: HANDLER AUTHENTICATION REQUIRED" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "DISPATCH ID REQUIRED" }, { status: 400 });
    }

    const updated = await togglePinAnnouncement(id);
    if (!updated) {
      return NextResponse.json({ error: "DISPATCH RECORD NOT FOUND" }, { status: 404 });
    }

    try {
      revalidatePath("/participant");
      revalidatePath("/api/announcements");
    } catch {
      // Non-critical
    }

    return NextResponse.json({
      success: true,
      message: `DISPATCH PIN STATUS ALTERED: ${updated.pinned ? "PINNED TO HEADER" : "UNPINNED"}`,
      data: updated,
    });
  } catch (err) {
    console.error("[Announcements PATCH] Error:", err);
    return NextResponse.json(
      { error: "MODIFICATION SEQUENCE ERROR" },
      { status: 500 }
    );
  }
}
