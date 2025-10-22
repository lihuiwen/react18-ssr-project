/**
 * Server-Side Rendering Logic
 * Phase 3: renderToString for traditional SSR
 * Phase 4: renderToPipeableStream for streaming SSR
 * Phase 6a: Added React Router support (StaticRouter)
 */

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter, createRoutesFromElements, matchRoutes, Route, Routes } from 'react-router-dom';
import type { Context } from 'koa';
import { routes } from '../shared/routes';

/**
 * Phase 6a: Streaming SSR with React Router
 * StaticRouter is used for server-side routing
 * Returns a pipeable stream that progressively sends HTML
 */
export function renderAppStream(ctx: Context): void {
  ctx.type = 'text/html';
  let didError = false;

  // Get the current URL from the request
  const url = ctx.url;

  // Check if route exists (for 404 handling)
  const routeElements = createRoutesFromElements(
    routes.map((route, index) => (
      <Route key={index} path={route.path} element={route.element} />
    ))
  );
  const matches = matchRoutes(routeElements, url);
  const is404 = !matches || matches.length === 0 || matches[0].route.path === '*';

  // Use absolute URL for development HMR, relative for production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const bundleUrl = isDevelopment
    ? 'http://localhost:3001/static/bundle.js'
    : '/static/bundle.js';

  const { pipe } = renderToPipeableStream(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="React 18 SSR Project - Streaming SSR with Routing" />
        <title>React 18 SSR Project</title>
      </head>
      <body>
        <div id="root">
          <StaticRouter location={url}>
            <Routes>
              {routes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </StaticRouter>
        </div>
      </body>
    </html>,
    {
      bootstrapScripts: [bundleUrl],
      onShellReady() {
        // Set 404 status if no route matches
        ctx.status = didError ? 500 : (is404 ? 404 : 200);
        pipe(ctx.res);
      },
      onShellError(error) {
        console.error('Shell Error:', error);
        ctx.status = 500;
        ctx.body = '<!DOCTYPE html><html><body><h1>Server Error</h1></body></html>';
      },
      onError(error) {
        didError = true;
        // Filter out "destination stream closed early" errors (expected when browser closes connection)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (!errorMessage.includes('destination stream closed early')) {
          console.error('Stream Error:', error);
        }
      },
    }
  );
}
