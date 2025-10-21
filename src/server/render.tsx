/**
 * Server-Side Rendering Logic - Phase 3
 * Uses renderToString for traditional SSR
 */

import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/App';
import { generateHTML } from './template';

export function renderApp(): string {
  // Render React app to HTML string
  const html = renderToString(<App />);

  // Generate complete HTML document
  const fullHTML = generateHTML({
    html,
    scriptPath: '/static/bundle.js',
  });

  return fullHTML;
}
