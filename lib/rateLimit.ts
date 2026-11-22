interface RateLimitRecord {
  failedAttempts: number;
  firstAttemptAt: number;
  blockedUntil: number | null;
}

// In-memory rate limiting map keyed by client IP
const ipRecords = new Map<string, RateLimitRecord>();

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Clean up stale records periodically
 */
function cleanupExpiredRecords(now: number) {
  ipRecords.forEach((record, ip) => {
    if (record.blockedUntil && now > record.blockedUntil) {
      ipRecords.delete(ip);
    } else if (!record.blockedUntil && now - record.firstAttemptAt > WINDOW_MS) {
      ipRecords.delete(ip);
    }
  });
}

/**
 * Checks if an IP is currently blocked by the rate limiter.
 * Returns { allowed: boolean, retryAfterSeconds?: number }
 */
export function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  cleanupExpiredRecords(now);

  const record = ipRecords.get(ip);
  if (!record) {
    return { allowed: true };
  }

  if (record.blockedUntil) {
    if (now < record.blockedUntil) {
      const remainingMs = record.blockedUntil - now;
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(remainingMs / 1000),
      };
    } else {
      // Block expired
      ipRecords.delete(ip);
      return { allowed: true };
    }
  }

  return { allowed: true };
}

/**
 * Registers a failed authentication attempt.
 * If 5 failed attempts are reached within 10 minutes, locks the IP for 10 minutes.
 */
export function recordFailedAttempt(ip: string): { blocked: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  cleanupExpiredRecords(now);

  let record = ipRecords.get(ip);

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    record = {
      failedAttempts: 1,
      firstAttemptAt: now,
      blockedUntil: null,
    };
    ipRecords.set(ip, record);
    return { blocked: false };
  }

  record.failedAttempts += 1;

  if (record.failedAttempts >= MAX_FAILED_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_DURATION_MS;
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil(BLOCK_DURATION_MS / 1000),
    };
  }

  return { blocked: false };
}

/**
 * Clears failed attempts upon a successful login.
 */
export function clearRateLimit(ip: string): void {
  ipRecords.delete(ip);
}
