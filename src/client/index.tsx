/**
 * Client-side entry point
 * Phase 2: Client-Side Rendering (CSR) with createRoot
 * Phase 3: Hydration with hydrateRoot
 * Phase 5: Hot Module Replacement (HMR) support
 * Phase 6a: React Router integration with BrowserRouter
 */

import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { routes } from '../shared/routes';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create the router component
function AppWithRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

// Check if there's server-rendered content
const hasServerRenderedContent = rootElement.hasChildNodes();

if (hasServerRenderedContent) {
  // Phase 3: Hydrate server-rendered content
  hydrateRoot(rootElement, <AppWithRouter />);
  console.log('✅ React 18 SSR hydration completed with routing');
} else {
  // Phase 2: Fallback to CSR if no server content
  // This code path is used by webpack-dev-server
  const { createRoot } = require('react-dom/client');
  const root = createRoot(rootElement);
  root.render(<AppWithRouter />);
  console.log('✅ React 18 client-side rendering initialized with routing');
}

// Phase 5: Enable Hot Module Replacement
if (module.hot) {
  module.hot.accept(['./App', '../shared/routes'], () => {
    console.log('🔥 Hot Module Replacement triggered');

    if (hasServerRenderedContent) {
      hydrateRoot(rootElement, <AppWithRouter />);
    } else {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(rootElement);
      root.render(<AppWithRouter />);
    }
  });
}
