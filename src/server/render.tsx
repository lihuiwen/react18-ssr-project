/**
 * Server-Side Rendering Logic
 * Phase 3: renderToString for traditional SSR
 * Phase 4: renderToPipeableStream for streaming SSR
 */

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import type { Context } from 'koa';
import App from '../client/App';

/**
 * Phase 4: Streaming SSR with renderToPipeableStream
 * Returns a pipeable stream that progressively sends HTML
 */
export function renderAppStream(ctx: Context): void {
  ctx.type = 'text/html';
  let didError = false;

  const { pipe } = renderToPipeableStream(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="React 18 SSR Project - Streaming SSR" />
        <title>React 18 SSR Project - Streaming</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
      </body>
    </html>,
    {
      bootstrapScripts: ['/static/bundle.js'],
      onShellReady() {
        ctx.status = didError ? 500 : 200;
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
