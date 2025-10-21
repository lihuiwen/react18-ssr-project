/**
 * Client-side entry point
 * Phase 2: Client-Side Rendering (CSR) with createRoot
 * Phase 3: Hydration with hydrateRoot
 * Phase 5: Hot Module Replacement (HMR) support
 */

import { hydrateRoot } from 'react-dom/client';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Check if there's server-rendered content
const hasServerRenderedContent = rootElement.hasChildNodes();

if (hasServerRenderedContent) {
  // Phase 3: Hydrate server-rendered content
  hydrateRoot(rootElement, <App />);
  console.log('✅ React 18 SSR hydration completed');
} else {
  // Phase 2: Fallback to CSR if no server content
  // This code path is used by webpack-dev-server
  const { createRoot } = require('react-dom/client');
  const root = createRoot(rootElement);
  root.render(<App />);
  console.log('✅ React 18 client-side rendering initialized');
}

// Phase 5: Enable Hot Module Replacement
if (module.hot) {
  module.hot.accept('./App', () => {
    console.log('🔥 Hot Module Replacement triggered');
    // Re-render on hot update
    const NextApp = require('./App').default;

    if (hasServerRenderedContent) {
      hydrateRoot(rootElement, <NextApp />);
    } else {
      const { createRoot } = require('react-dom/client');
      const root = createRoot(rootElement);
      root.render(<NextApp />);
    }
  });
}
