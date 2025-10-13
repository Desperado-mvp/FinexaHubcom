import type { NextRequest } from "next/server"

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export function rateLimit(request: NextRequest, limit = 10, windowMs = 60000): { success: boolean; remaining: number } {
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"
  const now = Date.now()

  if (!store[ip] || now > store[ip].resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    }
    return { success: true, remaining: limit - 1 }
  }

  if (store[ip].count >= limit) {
    return { success: false, remaining: 0 }
  }

  store[ip].count++
  return { success: true, remaining: limit - store[ip].count }
}
