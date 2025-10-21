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
  // Set response headers before streaming
  ctx.status = 200;
  ctx.type = 'text/html';

  // Write HTML head immediately
  ctx.res.write('<!DOCTYPE html>');
  ctx.res.write('<html lang="en">');
  ctx.res.write('<head>');
  ctx.res.write('<meta charset="UTF-8">');
  ctx.res.write('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  ctx.res.write('<meta name="description" content="React 18 SSR Project - Streaming SSR">');
  ctx.res.write('<title>React 18 SSR Project - Streaming</title>');
  ctx.res.write('</head>');
  ctx.res.write('<body>');
  ctx.res.write('<div id="root">');

  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/static/bundle.js'],

    // Called when the shell (navigation/layout) is ready
    onShellReady() {
      // Pipe React content (will stream progressively)
      pipe(ctx.res);
    },

    // Called when shell rendering encounters an error
    onShellError(error) {
      console.error('Shell Error:', error);
      ctx.status = 500;
      ctx.res.write('<h1>Server Error</h1>');
      ctx.res.end();
    },

    // Called if there's an error during streaming
    onError(error) {
      console.error('Stream Error:', error);
    },
  });
}
