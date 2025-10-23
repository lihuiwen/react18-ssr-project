# Changelog

All notable changes to the React 18 SSR Project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [v1.2.0] - 2025-10-24

### ✅ Phase 6b: Data Router Integration + Data Fetching

**Added:**
- React Router Data Router architecture (createBrowserRouter/createStaticRouter)
- Route loader implementation for SSR data prefetching
- SSR hydration data transfer via `window.__staticRouterHydrationData`
- Product page with dynamic routing (`/product/:id`)
- Mock API data layer (`src/shared/api/`)
  - `productApi.ts` - Product data API
  - `mockData.ts` - 10 realistic product mocks
  - `cache.ts` - Simple caching utility
- `STREAMING_SSR.md` - SSR streaming architecture documentation

**Changed:**
- Migrated from BrowserRouter/StaticRouter to Data Router
- Updated `src/client/index.tsx` - Hydration data reuse
- Updated `src/server/render.tsx` - createStaticHandler integration
- Updated `src/server/dev-server.ts` - Async render support
- Enhanced loading skeleton components

**Fixed:**
- HMR stability - No duplicate root creation on hot reload
- Zero duplicate data requests after hydration
- 404 error handling via loader Response throws

**Performance:**
- TTFB improvement through server-side data prefetching
- Eliminated waterfall requests (client reuses server data)
- SEO optimized with product info in initial HTML

**Stats:**
- 13 files changed (+1602 lines)
- 5 new files created
- Architecture upgrade: Data Router

---

## [v1.1.0] - 2025-10-22

### ✅ Phase 6a: React Router Integration

**Added:**
- React Router v7 integration with SSR support
- Isomorphic route configuration (`src/shared/routes/index.tsx`)
- Example pages:
  - `Home` page with navigation
  - `About` page with architecture info
  - `NotFound` 404 page
- Client-side navigation (BrowserRouter)
- Server-side routing (StaticRouter)
- 404 status code handling

**Changed:**
- Updated `src/server/render.tsx` - Route matching and 404 handling
- Updated `src/client/index.tsx` - BrowserRouter integration

**Stats:**
- 6 files changed (~200 lines)
- 4 new files created

### 🔧 Critical Bug Fix: HMR Stability Issue

**Problem:**
- HMR update files requested from wrong server
- `ERR_CONNECTION_REFUSED` errors on hot updates
- Webpack `publicPath` using relative paths

**Solution:**
- Changed Webpack `publicPath` to absolute URL in development:
  ```typescript
  publicPath: isDevelopment
    ? 'http://localhost:3001/static/'  // Absolute for HMR
    : '/static/'                        // Relative for production
  ```
- Added CORS support to HMR server
- Updated SSR render to use absolute bundle URL in development

**Impact:**
- ✅ HMR now stable - No connection errors
- ✅ Multiple saves work correctly
- ✅ All assets load from correct server
- ✅ Production builds unaffected

---

## [v1.0.0] - 2025-10-21

### ✅ Phase 1-5: Foundation Complete

**Phase 1: Basic Config & Webpack Setup**
- TypeScript configuration (client + server)
- Webpack configuration (common, client, server)
- Base directory structure
- Dependencies setup

**Phase 2: Client-Side Rendering (CSR)**
- Pure client-side React rendering
- Webpack build pipeline verification
- Simple Hello World page

**Phase 3: Basic SSR Implementation**
- Koa server setup
- Traditional SSR with `renderToString`
- Client-side hydration with `hydrateRoot`

**Phase 4: React 18 Streaming SSR + Suspense**
- Migrated to `renderToPipeableStream`
- Suspense boundary implementation
- Progressive streaming HTML
- Loading skeleton components

**Phase 5: HMR Dual-Server Architecture**
- HMR server (Express, port 3001)
- SSR dev server (Koa, port 3000)
- Webpack HMR configuration
- Server-Sent Events (SSE) for hot updates
- Graceful server shutdown handling
- Development orchestration script

**Technology Stack:**
- React 18
- TypeScript
- Webpack 5
- Koa.js (SSR server)
- Express.js (HMR server)
- pnpm (package manager)

---

## Version Summary

| Version | Date | Phase | Key Features |
|---------|------|-------|--------------|
| v1.2.0 | 2025-10-24 | 6b | Data Router, Route Loaders, SSR Hydration |
| v1.1.0 | 2025-10-22 | 6a | React Router, Routing, HMR Fix |
| v1.0.0 | 2025-10-21 | 1-5 | SSR Foundation, Streaming, HMR |

---

## Upcoming Releases

### [v1.3.0] - Planned

**Phase 7: Tailwind CSS + Styling System**
- Tailwind CSS configuration
- PostCSS setup
- SSR style extraction
- Styled example components
- HMR support for CSS changes

### [v1.4.0] - Planned

**Phase 8a: State Management (Zustand)**
- Zustand integration
- SSR state serialization
- Client-side state hydration
- Example stores (cart, user, theme)

**Phase 8b: SEO Optimization**
- react-helmet-async integration
- Dynamic meta tags per route
- Reusable SEO component
- Social media preview support

**Phase 8c: API Proxy + Integration**
- API proxy middleware
- Complete example application
- Integration testing
- Full feature demonstration

### [v2.0.0] - Future (Optional)

**Phase 9: React Query Integration**
- @tanstack/react-query setup
- SSR data prefetching and hydration
- Advanced data patterns:
  - Infinite scroll
  - Optimistic updates
  - Polling
- React Query DevTools

---

## Migration Guides

### Migrating from v1.1.0 to v1.2.0

**Breaking Changes:**
- Removed `BrowserRouter` and `StaticRouter` imports
- Changed to `createBrowserRouter` and `createStaticRouter`

**Steps:**
1. Update route configuration:
```typescript
// Old (v1.1.0)
<BrowserRouter>
  <Routes>{/* ... */}</Routes>
</BrowserRouter>

// New (v1.2.0)
const router = createBrowserRouter(routes);
<RouterProvider router={router} />
```

2. Add loader functions to routes:
```typescript
{
  path: '/product/:id',
  element: <ProductPage />,
  loader: async ({ params }) => {
    return await fetchProduct(params.id);
  }
}
```

3. No action needed for hydration - handled automatically!

---

## Deprecated Features

None yet - all features are actively maintained.

---

## Security Updates

### v1.1.0
- Added CORS security headers to HMR server
- Restricted CORS origin to localhost in development

### v1.0.0
- Initial security configuration
- Environment variable separation
- No secrets in client bundles
