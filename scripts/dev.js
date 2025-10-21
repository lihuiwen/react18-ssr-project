#!/usr/bin/env node

/**
 * Development Orchestration Script - Phase 5
 * Starts both HMR server (3001) and Dev SSR server (3000)
 */

const { spawn } = require('child_process');
const path = require('path');

// Set development environment
process.env.NODE_ENV = 'development';

console.log('🚀 Starting development servers...\n');

// Start HMR server (port 3001)
const hmrServer = spawn(
  'ts-node',
  ['--project', 'tsconfig.server.json', path.resolve(__dirname, '../src/server/hmr-server.ts')],
  {
    stdio: 'inherit',
    env: { ...process.env, HMR_PORT: '3001' },
  }
);

// Wait a bit for HMR server to start, then start SSR server
setTimeout(() => {
  // Start Dev SSR server (port 3000) with nodemon for server-side hot reload
  const devServer = spawn(
    'nodemon',
    [
      '--watch', 'src/server',
      '--watch', 'src/shared',
      '--ext', 'ts,tsx',
      '--exec', 'ts-node --project tsconfig.server.json',
      path.resolve(__dirname, '../src/server/dev-server.ts'),
    ],
    {
      stdio: 'inherit',
      env: { ...process.env, PORT: '3000' },
    }
  );

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down development servers...');
    hmrServer.kill('SIGTERM');
    devServer.kill('SIGTERM');
    process.exit(0);
  });

  devServer.on('exit', (code) => {
    console.log(`Dev SSR server exited with code ${code}`);
    hmrServer.kill('SIGTERM');
    process.exit(code);
  });

  hmrServer.on('exit', (code) => {
    console.log(`HMR server exited with code ${code}`);
    devServer.kill('SIGTERM');
    process.exit(code);
  });
}, 2000);
