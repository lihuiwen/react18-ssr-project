// Client-side entry point - Phase 2: Client-Side Rendering (CSR)
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Create root and render the app (CSR)
const root = createRoot(rootElement);
root.render(<App />);

console.log('✅ React 18 client-side rendering initialized');
