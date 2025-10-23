# Development Guide

Complete guide for developing, debugging, and deploying the React 18 SSR project.

---

## Development Workflow

### 1. Starting Development

```bash
pnpm install
pnpm run dev

# Expected output:
# ✅ Webpack server build complete
# 🔥 HMR server running on http://localhost:3001
# 🚀 SSR server running on http://localhost:3000
```

### 2. Modifying Client Code

```bash
# Edit src/shared/pages/Home/index.tsx or src/client/index.tsx
# Save the file
# Browser automatically updates within 1-2 seconds ✅

# Check browser console for: 🔥 Hot Module Replacement triggered
# Check Network tab for: __webpack_hmr connected to :3001
```

### 3. Modifying Server Code

```bash
# Edit src/server/dev-server.ts or src/server/middleware/*.ts
# Save the file
# Server restarts automatically (nodemon monitoring)
# HMR connection remains stable ✅
# Manually refresh browser to see changes
```

### 4. Building for Production

```bash
pnpm run build
# Generates:
# - dist/client/bundle.js (with CSS)
# - dist/server/index.js (server bundle)

pnpm start
# Runs production server on :3000
```

---

## Common Commands

### Development

```bash
# Install dependencies
pnpm install

# Start development servers (dual-server architecture)
pnpm run dev
# Starts:
# - HMR Server on :3001 (Webpack compiler)
# - SSR Server on :3000 (Koa renderer)
# Access: http://localhost:3000

# Clean previous builds
pnpm run clean
```

### Building

```bash
# Build both client and server
pnpm run build

# Build only client bundle
pnpm run build:client

# Build only server bundle
pnpm run build:server
```

### Production

```bash
# Run production server (single server, no HMR)
pnpm start
# Runs dist/server/index.js on port 3000
```

---

## Debugging Guide

### HMR Not Working

**Symptoms**: Changes don't reflect in browser

**Checks**:
1. Verify HMR server is running on port 3001
2. Check browser Network tab for `__webpack_hmr` connection
3. Look for HMR errors in browser console
4. Ensure `module.hot.accept()` is properly configured

**Solution**:
```bash
# Restart development servers
pnpm run dev

# Check logs for compilation errors
# Verify terminal shows: ✅ webpack built xxx in XXms
```

### Port Already in Use

**Symptoms**: `EADDRINUSE: address already in use :::3000`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use nodemon with proper SIGTERM handling (already configured)
```

### SSR Hydration Mismatch

**Symptoms**: Warning in console: "Hydration failed"

**Causes**:
- Server and client render different content
- Using browser-only APIs during SSR
- Date/random values not synchronized

**Solution**:
```typescript
// Use conditional rendering
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return <Skeleton />;
return <BrowserSpecificComponent />;
```

### Webpack Build Errors

**Common Issues**:
1. **Module not found**: Check import paths
2. **TypeScript errors**: Run `tsc --noEmit` to see all errors
3. **CSS errors**: Verify PostCSS and Tailwind config

**Debugging Steps**:
```bash
# Check TypeScript errors
npx tsc --noEmit

# Check webpack config syntax
node -c src/config/webpack.client.ts

# Verbose build output
pnpm run build:client --verbose
```

### SSR Errors

**Check Server Logs**:
```bash
# Development mode already shows detailed errors
# Look for stack traces in terminal

# Common SSR errors:
# - Using window/document in shared code
# - Missing data in loaders
# - Async operations not awaited
```

**Debug SSR Rendering**:
```typescript
// Add logging in server/render.tsx
console.log('Rendering route:', ctx.url);
console.log('Route matches:', matches);
console.log('Loader context:', context);
```

### HMR Connection Issues

**Symptoms**: `ERR_INCOMPLETE_CHUNKED_ENCODING` or connection refused

**Root Cause**: Webpack publicPath misconfiguration

**Solution** (Already fixed in Phase 6a):
```typescript
// webpack.client.ts
output: {
  publicPath: isDevelopment
    ? 'http://localhost:3001/static/'  // ✅ Absolute URL
    : '/static/',                       // Production
}
```

### Data Loader Errors

**Symptoms**: 404 or data not loading

**Debug**:
```typescript
// Add try-catch in loader
loader: async ({ params }) => {
  try {
    console.log('Loading product:', params.id);
    const product = await fetchProduct(params.id);
    console.log('Product loaded:', product);
    return product;
  } catch (error) {
    console.error('Loader error:', error);
    throw new Response('Not Found', { status: 404 });
  }
}
```

---

## Deployment Guide

### Development Deployment

```bash
# Start dual-server development
pnpm run dev

# Servers running:
# - HMR Server: http://localhost:3001 (internal)
# - SSR Server: http://localhost:3000 (user-facing)
```

### Production Deployment

```bash
# Build production bundles
pnpm run build

# Start production server (single server, no HMR)
pnpm start

# Or with PM2
pm2 start dist/server/index.js --name react18-ssr

# Or with Docker
docker build -t react18-ssr .
docker run -p 3000:3000 react18-ssr
```

### Environment Variables

```bash
# .env.development
NODE_ENV=development
PORT=3000
HMR_PORT=3001

# .env.production
NODE_ENV=production
PORT=3000
```

### Docker Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Expose port
EXPOSE 3000

# Start production server
CMD ["pnpm", "start"]
```

**Build and run**:
```bash
docker build -t react18-ssr .
docker run -p 3000:3000 -e NODE_ENV=production react18-ssr
```

### PM2 Deployment

**ecosystem.config.js**:
```javascript
module.exports = {
  apps: [{
    name: 'react18-ssr',
    script: './dist/server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

**Deploy**:
```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor
pm2 monit

# Logs
pm2 logs react18-ssr

# Restart
pm2 restart react18-ssr
```

### Nginx Configuration

```nginx
upstream react18_ssr {
    server localhost:3000;
    server localhost:3001;  # For multiple instances
    keepalive 64;
}

server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://react18_ssr;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Cache static assets
    location /static/ {
        proxy_pass http://react18_ssr;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## Testing Workflows

### Manual Testing Checklist

**SSR Verification**:
- [ ] View page source contains rendered HTML
- [ ] No "Loading..." text in initial HTML
- [ ] Meta tags rendered correctly
- [ ] Images and assets load

**Hydration Verification**:
- [ ] No hydration warnings in console
- [ ] Interactive elements work after page load
- [ ] State persists from server to client
- [ ] No flash of unstyled content

**Routing Verification**:
- [ ] Direct URL navigation works
- [ ] Client-side navigation works
- [ ] Back/forward buttons work
- [ ] 404 pages show correctly

**Data Loading Verification**:
- [ ] Loader data renders on server
- [ ] No duplicate requests on client
- [ ] Loading states work correctly
- [ ] Error states handled gracefully

**HMR Verification**:
- [ ] Component changes hot reload
- [ ] State preserved during HMR
- [ ] No page refresh needed
- [ ] Console shows HMR messages

### Performance Testing

```bash
# Lighthouse audit
npx lighthouse http://localhost:3000 --view

# Bundle analysis
npx webpack-bundle-analyzer dist/client/stats.json

# Load testing
npx autocannon http://localhost:3000 -c 100 -d 30
```

---

## Quick Reference

**When to check HMR.md**:
- HMR not updating changes
- ERR_INCOMPLETE_CHUNKED_ENCODING errors
- Port occupation issues during server restarts
- Understanding the technical deep-dives

**File Reading Order** (for new developers):
1. CLAUDE.md (high-level overview)
2. PHASES.md (implementation roadmap)
3. ARCHITECTURE.md (design decisions)
4. HMR.md (detailed HMR patterns)
5. This file (DEVELOPMENT.md)

**Common Commands Quick Reference**:
```bash
pnpm install           # Install dependencies
pnpm run dev           # Start development (dual-server)
pnpm run build         # Build production bundles
pnpm start             # Start production server
pnpm run clean         # Clean dist folder
pnpm run build:client  # Build client only
pnpm run build:server  # Build server only
```

---

## Troubleshooting Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Port in use | `lsof -i :3000` then `kill -9 <PID>` |
| HMR not working | Restart `pnpm run dev` |
| Hydration mismatch | Check for browser-only code in shared components |
| Build errors | Run `npx tsc --noEmit` to see TypeScript errors |
| Slow builds | Clear `dist/` and `node_modules/.cache` |
| Module not found | Check import paths and file extensions |

---

## Related Documentation

- **[CLAUDE.md](../CLAUDE.md)**: Project overview
- **[PHASES.md](./PHASES.md)**: Implementation phases
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Architecture details
- **[HMR.md](./HMR.md)**: HMR deep dive
- **[STREAMING_SSR.md](./STREAMING_SSR.md)**: SSR streaming patterns
- **[CHANGELOG.md](./CHANGELOG.md)**: Version history
