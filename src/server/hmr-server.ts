/**
 * HMR Server - Phase 5
 * Express server that handles Webpack compilation and Hot Module Replacement
 * Runs on port 3001
 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import path from 'path';

// Import client webpack config
const clientConfig = require('../config/webpack.client.js');

const app = express();
const PORT = process.env.HMR_PORT || 3001;

// Enable CORS for HMR assets (needed for dual-server architecture)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Configure webpack for development mode
clientConfig.mode = 'development';

// Create webpack compiler
const compiler = webpack(clientConfig);

if (!compiler) {
  throw new Error('Failed to create webpack compiler');
}

// Add webpack-dev-middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: clientConfig.output.publicPath || '/static/',
    writeToDisk: true, // Write to disk so SSR server can read the files
    stats: {
      colors: true,
      modules: false,
      children: false,
      chunks: false,
    },
  })
);

// Add webpack-hot-middleware for HMR
app.use(
  webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    heartbeat: 2000,
    log: console.log,
  })
);

// Start HMR server
app.listen(PORT, () => {
  console.log(`🔥 HMR server running on http://localhost:${PORT}`);
  console.log(`📦 Webpack watching for changes...`);
});

export default app;
