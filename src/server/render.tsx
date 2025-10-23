/**
 * Server-Side Rendering Logic
 * Phase 3: renderToString for traditional SSR
 * Phase 4: renderToPipeableStream for streaming SSR
 * Phase 6a: Added React Router support (StaticRouter)
 * Phase 6b: Data Router with createStaticRouter for loader support
 */

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticRouter, createStaticHandler, StaticRouterProvider } from 'react-router';
import { matchRoutes } from 'react-router-dom';
import type { Context } from 'koa';
import { routes } from '../shared/routes';

/**
 * Phase 6b: Streaming SSR with Data Router
 * createStaticRouter is used for server-side routing with loader support
 * Returns a pipeable stream that progressively sends HTML
 */
export async function renderAppStream(ctx: Context): Promise<void> {
  ctx.type = 'text/html';
  let didError = false;

  // Get the current URL from the request
  const url = ctx.url;

  // Check if route exists (for 404 handling)
  const matches = matchRoutes(routes, url);
  const is404 = !matches || matches.length === 0 || matches[0].route.path === '*';

  // Use absolute URL for development HMR, relative for production
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const bundleUrl = isDevelopment
    ? 'http://localhost:3001/static/bundle.js'
    : '/static/bundle.js';

  // Phase 6b: Create static handler for data loading
  const handler = createStaticHandler(routes);

  // Create a web Request from Koa context
  const fetchRequest = new Request(`http://localhost:3000${ctx.url}`, {
    method: ctx.method,
    headers: new Headers(ctx.headers as Record<string, string>),
  });

  // Query the handler to get loader data
  const context = await handler.query(fetchRequest);

  // Handle redirects and errors
  if (context instanceof Response) {
    if (context.status === 301 || context.status === 302) {
      ctx.redirect(context.headers.get('Location') || '/');
      return;
    }
    // Handle other Response cases
    ctx.status = context.status;
    ctx.body = await context.text();
    return;
  }

  // Create static router with context
  const router = createStaticRouter(routes, context);

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
          <StaticRouterProvider router={router} context={context} />
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
