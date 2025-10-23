/**
 * Client-side entry point
 * Phase 2: Client-Side Rendering (CSR) with createRoot
 * Phase 3: Hydration with hydrateRoot
 * Phase 5: Hot Module Replacement (HMR) support
 * Phase 6a: React Router integration with BrowserRouter
 * Phase 6b: Data Router with createBrowserRouter for loader support
 */

import { hydrateRoot, createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../shared/routes';

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __staticRouterHydrationData?: any;
  }
}

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Phase 6b: Create browser router with loader support
// If server provided hydration data, use it to avoid re-fetching
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

// Check if there's server-rendered content
const hasServerRenderedContent = rootElement.hasChildNodes();

// Create root instance (reused for HMR)
let root: ReturnType<typeof createRoot> | ReturnType<typeof hydrateRoot>;

if (hasServerRenderedContent) {
  // Phase 3: Hydrate server-rendered content
  root = hydrateRoot(rootElement, <RouterProvider router={router} />);
  console.log('✅ React 18 SSR hydration completed with data router');
} else {
  // Phase 2: Fallback to CSR if no server content
  root = createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
  console.log('✅ React 18 client-side rendering initialized with data router');
}

// Phase 5: Enable Hot Module Replacement
// IMPORTANT: Don't create new roots on HMR, just re-render
if (module.hot) {
  module.hot.accept('../shared/routes', () => {
    console.log('🔥 Hot Module Replacement triggered - re-rendering');
    // Recreate router with updated routes (no hydration data on HMR)
    const newRouter = createBrowserRouter(routes);
    // Just re-render with the existing root
    root.render(<RouterProvider router={newRouter} />);
  });
}
