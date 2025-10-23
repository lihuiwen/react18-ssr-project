/**
 * Product API Functions
 * Phase 6b: Data fetching with simulated network delays
 */

import { MOCK_PRODUCTS, MOCK_REVIEWS, MOCK_RECOMMENDATIONS } from './mockData';
import type { Product, Review, Recommendation } from './mockData';
import { fetchWithCache } from './cache';

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Fetch product basic info (critical data for SEO)
 * Used in route loader for server-side rendering
 */
export async function fetchProductBasicInfo(id: string): Promise<Product> {
  // Simulate network delay
  await delay(300);

  const product = MOCK_PRODUCTS[id];

  if (!product) {
    throw new Error(`Product ${id} not found`);
  }

  return product;
}

/**
 * Fetch product reviews (secondary data, lazy loaded)
 * Used in Suspense boundary for SERVER-SIDE streaming SSR
 */
export async function fetchProductReviews(id: string): Promise<Review[]> {
  // Simulate longer network delay to demonstrate streaming SSR
  // This makes shell render first, then reviews stream after 2 seconds
  await delay(2000);

  return MOCK_REVIEWS[id] || [];
}

/**
 * Fetch product recommendations (secondary data, lazy loaded)
 * Used in Suspense boundary for client-side loading
 */
export async function fetchProductRecommendations(
  id: string
): Promise<Recommendation[]> {
  // Simulate network delay
  await delay(1200);

  return MOCK_RECOMMENDATIONS[id] || [];
}

/**
 * Fetch product reviews with cache (client-side only)
 */
export async function fetchProductReviewsCached(
  id: string
): Promise<Review[]> {
  return fetchWithCache(`reviews-${id}`, () => fetchProductReviews(id));
}

/**
 * Fetch product recommendations with cache (client-side only)
 */
export async function fetchProductRecommendationsCached(
  id: string
): Promise<Recommendation[]> {
  return fetchWithCache(`recommendations-${id}`, () =>
    fetchProductRecommendations(id)
  );
}

/**
 * Fetch all products (for product list page - future use)
 */
export async function fetchAllProducts(): Promise<Product[]> {
  await delay(500);
  return Object.values(MOCK_PRODUCTS);
}
