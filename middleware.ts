import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "gene_bureau_token";

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET || "gene_bureau_secure_production_secret_key_32chars_min";
  return new TextEncoder().encode(secret);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // 1. Protect Organiser Dashboard route
  if (pathname === "/organiser" || pathname.startsWith("/organiser/")) {
    // Exception: /organiser/login is public
    if (pathname === "/organiser/login") {
      // If already logged in, redirect straight to /organiser
      if (token) {
        try {
          const { payload } = await jwtVerify(token, getSecretKey());
          if (payload.role === "organiser") {
            return NextResponse.redirect(new URL("/organiser", request.url));
          }
        } catch {
          // Token invalid, proceed to login page
        }
      }
      return NextResponse.next();
    }

    // Protect all other /organiser paths
    if (!token) {
      const loginUrl = new URL("/organiser/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const { payload } = await jwtVerify(token, getSecretKey());
      if (payload.role !== "organiser") {
        return NextResponse.redirect(new URL("/organiser/login", request.url));
      }
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/organiser/login", request.url));
    }
  }

  // 2. Protect mutation APIs on /api/announcements
  if (pathname.startsWith("/api/announcements")) {
    const method = request.method.toUpperCase();
    if (["POST", "DELETE", "PATCH", "PUT"].includes(method)) {
      if (!token) {
        return NextResponse.json(
          { error: "UNAUTHORIZED: HANDLER CLEARANCE REQUIRED" },
          { status: 401 }
        );
      }

      try {
        const { payload } = await jwtVerify(token, getSecretKey());
        if (payload.role !== "organiser") {
          return NextResponse.json(
            { error: "FORBIDDEN: INSUFFICIENT SECURITY LEVEL" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "INVALID OR EXPIRED CLEARANCE TOKEN" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/organiser/:path*", "/api/announcements/:path*"],
};
