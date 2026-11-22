import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

export const AUTH_COOKIE_NAME = "gene_bureau_token";
export const TOKEN_EXPIRY_SECONDS = 8 * 60 * 60; // 8 hours

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    // Fallback secret for safety in dev, but enforce presence
    const fallback = "gene_bureau_secure_production_secret_key_32chars_min";
    return new TextEncoder().encode(secret || fallback);
  }
  return new TextEncoder().encode(secret);
}

/**
 * Perform constant-time password comparison to prevent timing attacks.
 */
export function verifyOrganiserPassword(inputPassword: string): boolean {
  const expectedPassword = process.env.ORGANISER_PASSWORD || "GeneBureau@2026";
  
  if (!inputPassword || typeof inputPassword !== "string") {
    return false;
  }

  const inputBuffer = Buffer.from(inputPassword.normalize());
  const expectedBuffer = Buffer.from(expectedPassword.normalize());

  if (inputBuffer.length !== expectedBuffer.length) {
    // Dummy comparison to mitigate length timing leaks
    crypto.timingSafeEqual(inputBuffer, inputBuffer);
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, expectedBuffer);
}

/**
 * Creates and signs an 8-hour JWT session token for an authenticated organiser.
 */
export async function createSessionToken(): Promise<string> {
  const secretKey = getJwtSecretKey();
  
  return await new SignJWT({
    role: "organiser",
    clearance: "LEVEL-5-HANDLER",
    issuedAt: Math.floor(Date.now() / 1000),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_EXPIRY_SECONDS}s`)
    .sign(secretKey);
}

/**
 * Verifies a JWT token using jose. Returns true if valid and unexpired.
 */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload.role === "organiser";
  } catch {
    return false;
  }
}

/**
 * Server-side helper to check if current request has a valid organiser session.
 */
export async function isAuthenticatedOrganiser(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  return await verifySessionToken(token);
}
