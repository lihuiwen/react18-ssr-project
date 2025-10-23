/**
 * Simple in-memory cache for client-side data fetching
 * Phase 6b: Basic caching without React Query
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class DataCache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 5 * 60 * 1000; // 5 minutes

  /**
   * Get data from cache
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now - entry.timestamp > this.defaultTTL) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, data: T): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear specific key or all cache
   */
  clear(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }
}

// Singleton instance
export const dataCache = new DataCache();

/**
 * Fetch with cache
 * Checks cache first, then fetches if not available
 */
export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> {
  // Check cache first
  const cached = dataCache.get<T>(key);
  if (cached !== null) {
    console.log(`📦 Cache hit: ${key}`);
    return cached;
  }

  // Fetch and cache
  console.log(`🌐 Fetching: ${key}`);
  const data = await fetcher();
  dataCache.set(key, data);

  return data;
}
