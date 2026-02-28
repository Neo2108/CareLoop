/**
 * Rate limiting for API routes. Uses Upstash Redis when configured.
 * When UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set,
 * rate limiting is skipped (all requests allowed).
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

let ratelimit: Ratelimit | null = null;

export function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ip = forwarded?.split(",")[0]?.trim() || realIp || "anonymous";
  return ip;
}

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  const redis = new Redis({ url, token });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"),
    analytics: true,
  });
  return ratelimit;
}

export type RateLimitResult =
  | { success: true }
  | { success: false; limit: number; remaining: number; reset: number };

/**
 * Check rate limit for an identifier (e.g. IP or user ID).
 * Returns { success: true } if allowed, or { success: false, ... } if rate limited.
 * When Upstash is not configured, always returns { success: true }.
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const rl = getRatelimit();
  if (!rl) return { success: true };
  const result = await rl.limit(identifier);
  if (result.success) return { success: true };
  return {
    success: false,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}
