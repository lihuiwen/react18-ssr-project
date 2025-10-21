/**
 * Development SSR Server - Phase 5
 * Koa server for SSR during development
 * Runs on port 3000, reads compiled files from HMR server
 */

import Koa from 'koa';
import serve from 'koa-static';
import path from 'path';
import { renderAppStream } from './render';

const app = new Koa();
const PORT = process.env.PORT || 3000;

// Serve static files from dist/client at /static path
// Files are written by HMR server's webpack-dev-middleware
app.use(async (ctx, next) => {
  if (ctx.path.startsWith('/static/')) {
    // Remove /static prefix and serve from dist/client
    const filePath = ctx.path.replace('/static', '');
    const staticPath = path.resolve(process.cwd(), 'dist/client');

    // Create a new context with modified path
    const staticMiddleware = serve(staticPath);
    const originalPath = ctx.path;
    ctx.path = filePath;

    await staticMiddleware(ctx, async () => {
      ctx.path = originalPath;
      await next();
    });
  } else {
    await next();
  }
});

// SSR route - streaming render React app
app.use(async (ctx) => {
  try {
    // In development, just use the imported renderAppStream
    // Nodemon will restart the server when files change
    renderAppStream(ctx);
  } catch (error) {
    console.error('SSR Error:', error);
    ctx.status = 500;
    ctx.body = 'Internal Server Error';
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Dev SSR server running on http://localhost:${PORT}`);
  console.log(`📦 Serving static files from /static`);
  console.log(`🔄 Hot reload enabled`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received, closing dev server...');
  server.close(() => {
    console.log('✅ Dev server closed');
    process.exit(0);
  });
});
