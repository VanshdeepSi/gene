import { NextRequest, NextResponse } from "next/server";
import {
  verifyOrganiserPassword,
  createSessionToken,
  AUTH_COOKIE_NAME,
  TOKEN_EXPIRY_SECONDS,
} from "@/lib/auth";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/rateLimit";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Check rate limit
  const limitStatus = checkRateLimit(ip);
  if (!limitStatus.allowed) {
    return NextResponse.json(
      {
        error: `TERMINAL LOCKED. MAXIMUM FAILED ATTEMPTS EXCEEDED. RETRY IN ${limitStatus.retryAfterSeconds || 600} SECONDS.`,
        locked: true,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;

    if (!password || typeof password !== "string") {
      recordFailedAttempt(ip);
      return NextResponse.json(
        { error: "ACCESS DENIED: PASSWORD PROTOCOL UNFULFILLED" },
        { status: 400 }
      );
    }

    // 2. Validate password with constant-time equality
    const isValid = verifyOrganiserPassword(password);

    if (!isValid) {
      const failStatus = recordFailedAttempt(ip);
      if (failStatus.blocked) {
        return NextResponse.json(
          {
            error: "SECURITY BREACH DETECTED. TERMINAL ENCRYPTION LOCKED FOR 10 MINUTES.",
            locked: true,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: "ACCESS DENIED: INVALID HANDLER KEY" },
        { status: 401 }
      );
    }

    // 3. Clear rate limit on successful authentication
    clearRateLimit(ip);

    // 4. Generate signed JWT token
    const token = await createSessionToken();

    // 5. Build response and set httpOnly, sameSite=strict cookie
    const response = NextResponse.json({
      success: true,
      message: "HANDLER VERIFIED. CLEARANCE LEVEL 5 GRANTED.",
      redirect: "/organiser",
    });

    const isProduction = process.env.NODE_ENV === "production";

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/",
      maxAge: TOKEN_EXPIRY_SECONDS,
    });

    return response;
  } catch (err) {
    console.error("[Login API] Execution error:", err);
    return NextResponse.json(
      { error: "SYSTEM ANOMALY DURING AUTHENTICATION SEQUENCE" },
      { status: 500 }
    );
  }
}
