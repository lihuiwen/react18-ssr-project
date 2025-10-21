/**
 * SSR Server Entry Point - Phase 3
 * Basic Koa server with renderToString SSR
 */

import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import { renderApp } from './render';

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

// SSR route - render React app
app.use(async (ctx) => {
  try {
    const html = renderApp();
    ctx.type = 'text/html';
    ctx.body = html;
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
