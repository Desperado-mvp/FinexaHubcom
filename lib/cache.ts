// Simple cache utility for server-side data
// In production, consider using Redis or Vercel KV

interface CacheEntry<T> {
  data: T
  timestamp: number
}

class Cache {
  private store: Map<string, CacheEntry<any>>
  private defaultTTL: number

  constructor(defaultTTL = 300000) {
    // 5 minutes default
    this.store = new Map()
    this.defaultTTL = defaultTTL
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.store.set(key, {
      data,
      timestamp: Date.now() + (ttl || this.defaultTTL),
    })
  }

  get<T>(key: string): T | null {
    const entry = this.store.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.timestamp) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  delete(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.timestamp) {
        this.store.delete(key)
      }
    }
  }
}

export const cache = new Cache()

// Cleanup every 10 minutes
if (typeof window === "undefined") {
  setInterval(() => cache.cleanup(), 600000)
}
