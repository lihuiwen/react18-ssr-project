/**
 * SSR Server Entry Point
 * Phase 3: Basic Koa server with renderToString SSR
 * Phase 4: Streaming SSR with renderToPipeableStream
 */

import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import { renderAppStream } from './render';

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Serve static files from dist/client at /static path
// This matches the publicPath in webpack.client.js production config
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/static/')) {
    // Remove /static prefix and serve from dist/client
    ctx.path = ctx.path.replace('/static', '');
    await serve(path.resolve(__dirname, '../client'))(ctx, next);
  } else {
    await next();
  }
});

// SSR route - streaming render React app
app.use(async (ctx) => {
  try {
    // Phase 4: Use streaming SSR
    renderAppStream(ctx);
  } catch (error) {
    console.error('SSR Error:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SSR server running on http://localhost:${PORT}`);
  console.log(`📦 Serving static files from /static`);
});

export default app;
