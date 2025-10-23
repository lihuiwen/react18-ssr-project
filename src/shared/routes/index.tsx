import React from 'react';
import { RouteObject } from 'react-router-dom';
import { HomePage } from '../pages/Home';
import { AboutPage } from '../pages/About';
import { NotFoundPage } from '../pages/NotFound';
import { ProductPage } from '../pages/Product';
import { fetchProductBasicInfo } from '../api/productApi';

/**
 * Route configuration for both client and server
 * Phase 6b: Added Product route with loader for SSR data fetching
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/product/:id',
    element: <ProductPage />,
    // Route loader: Preloads product data on server-side (SEO-critical)
    loader: async ({ params }) => {
      const productId = params.id || '1';
      try {
        const product = await fetchProductBasicInfo(productId);
        return product;
      } catch (error) {
        console.error('Failed to load product:', error);
        throw new Response('Product Not Found', { status: 404 });
      }
    },
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
