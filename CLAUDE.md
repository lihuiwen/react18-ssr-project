# React 18 SSR Project - Documentation

**Project Status**: v1.2.0 - Phase 6b Complete (Data Router Integration + Data Fetching)
**Created**: 2025-10-21
**Last Updated**: 2025-10-24
**Framework**: React 18 with TypeScript and Webpack 5

---

## 📖 Quick Navigation

| Document | Description |
|----------|-------------|
| **[PHASES.md](./docs/PHASES.md)** | Complete 9-phase implementation roadmap |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Design decisions, patterns & performance |
| **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** | Development workflows & debugging |
| **[CHANGELOG.md](./docs/CHANGELOG.md)** | Version history & migration guides |
| **[HMR.md](./HMR.md)** | HMR architecture deep dive |
| **[STREAMING_SSR.md](./STREAMING_SSR.md)** | SSR streaming patterns |

---

## Project Overview

This is a **React 18 Server-Side Rendering (SSR) project** with a modern dual-server architecture, featuring:

- ✅ **Streaming SSR** with React 18 `renderToPipeableStream`
- ✅ **Hot Module Replacement** (HMR) with stable dual-server architecture
- ✅ **React Router v7** with Data Router and SSR support
- ✅ **Route Loaders** for server-side data prefetching
- ✅ **Zero duplicate requests** via intelligent hydration
- ✅ **TypeScript** throughout the stack

**Current Progress**: Phase 1-6b Complete ✅

---

## High-Level Architecture

### Dual-Server Architecture

```
┌─────────────────────────────┐     ┌──────────────────────────┐
│   HMR Server (Port 3001)    │     │   SSR Server (Port 3000) │
├─────────────────────────────┤     ├──────────────────────────┤
│ • Express.js                │     │ • Koa.js                 │
│ • Webpack Compiler          │     │ • renderToPipeableStream │
│ • webpack-dev-middleware    │     │ • Static file serving    │
│ • webpack-hot-middleware    │     │ • Route loader execution │
│ • Server-Sent Events (SSE)  │     │ • Graceful shutdown      │
└─────────────────────────────┘     └──────────────────────────┘
         │                                    │
         │  HMR Updates (SSE)                 │  HTML + Data
         └──────────────┬──────────────────┘
                        │
                   ┌────▼─────┐
                   │  Browser  │
                   │ :3000     │
                   └───────────┘
```

**Why Dual-Server?**
1. **Independent Lifecycle**: Client changes don't restart SSR server
2. **Stable HMR**: SSE connection persists during SSR restarts
3. **Clear Separation**: Frontend tooling separate from backend rendering
4. **Optimal Tech Stack**: Express for HMR, Koa for SSR

---

## Technology Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Build Tool** | Webpack 5 | Mature, rich ecosystem, strong SSR |
| **Client** | React 18 | Streaming SSR, Suspense, Selective Hydration |
| **HMR Server** | Express.js | Native webpack middleware support |
| **SSR Server** | Koa.js | Modern, clean API, great for SSR |
| **Language** | TypeScript | Type safety, better DX |
| **Routing** | React Router v7 | Data Router, SSR loaders |
| **Styling** | Tailwind CSS (Phase 7) | Utility-first, fast development |
| **State** | Zustand (Phase 8a) | Lightweight, SSR-friendly |
| **SEO** | react-helmet-async (Phase 8b) | SSR-compatible meta tags |
| **Advanced Data** | React Query (Phase 9) | Optional: caching, polling, optimistic updates |

---

## Project Structure

```
react18-ssr-project/
├── docs/                              # 📚 Documentation
│   ├── PHASES.md                      # Implementation roadmap
│   ├── ARCHITECTURE.md                # Design decisions
│   ├── DEVELOPMENT.md                 # Dev workflows
│   └── CHANGELOG.md                   # Version history
│
├── src/
│   ├── client/                        # Browser-side code
│   │   └── index.tsx                  # Hydration entry (HMR)
│   │
│   ├── server/                        # Node.js-side code
│   │   ├── index.ts                   # Production entry
│   │   ├── dev-server.ts              # Dev SSR server (Koa)
│   │   ├── hmr-server.ts              # HMR server (Express)
│   │   └── render.tsx                 # SSR streaming logic
│   │
│   ├── shared/                        # Isomorphic code
│   │   ├── routes/                    # Route configuration
│   │   ├── pages/                     # Page components
│   │   ├── components/                # Shared components
│   │   ├── api/                       # Data layer
│   │   ├── store/                     # State management
│   │   └── types/                     # TypeScript types
│   │
│   └── config/                        # Webpack configs
│       ├── webpack.common.ts
│       ├── webpack.client.ts
│       └── webpack.server.ts
│
├── dist/                              # Build output
│   ├── client/                        # Client bundle
│   └── server/                        # Server bundle
│
├── HMR.md                             # HMR architecture
├── STREAMING_SSR.md                   # SSR streaming guide
├── package.json
├── tsconfig.json
└── tsconfig.server.json
```

---

## Quick Start

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start dual-server development
pnpm run dev

# Servers:
# - HMR Server: http://localhost:3001 (internal)
# - SSR Server: http://localhost:3000 (access here)
```

### Production Build

```bash
# Build client + server
pnpm run build

# Start production server
pnpm start
```

### Available Commands

```bash
pnpm install           # Install dependencies
pnpm run dev           # Start development (dual-server)
pnpm run build         # Build production bundles
pnpm run build:client  # Build client only
pnpm run build:server  # Build server only
pnpm start             # Start production server
pnpm run clean         # Clean dist folder
```

---

## Implementation Progress

### ✅ Completed Phases (v1.2.0)

```
✅ Phase 1: Basic Config & Webpack Setup
✅ Phase 2: Client-Side Rendering (CSR)
✅ Phase 3: Basic SSR Implementation
✅ Phase 4: React 18 Streaming SSR
✅ Phase 5: HMR Dual-Server Architecture
✅ Phase 6a: React Router Integration
✅ Phase 6b: Data Router + Data Fetching
```

**Current Capabilities:**
- Streaming SSR with `renderToPipeableStream`
- Hot Module Replacement (HMR) with stable dual-server
- React Router v7 with Data Router
- Route Loaders for SSR data prefetching
- SSR hydration data reuse (no duplicate requests)
- Mock API data layer
- 404 error handling
- CORS-enabled cross-server HMR

### ⏳ Upcoming Phases

```
⏳ Phase 7: Tailwind CSS + Styling System
⏳ Phase 8a: State Management (Zustand)
⏳ Phase 8b: SEO Optimization (react-helmet-async)
⏳ Phase 8c: API Proxy + Integration
⏳ Phase 9: React Query (Optional Advanced)
```

**See [PHASES.md](./docs/PHASES.md) for detailed roadmap.**

---

## Key Features

### 1. React 18 Streaming SSR

**Benefits:**
- Send HTML skeleton immediately (low TTFB)
- Stream content as data arrives
- Better perceived performance

**Flow:**
```
User Request → Route Loader → renderToPipeableStream
  ↓
onShellReady (immediate HTML skeleton)
  ↓
Suspense boundaries resolve (progressive content)
  ↓
Client hydration (interactive)
```

### 2. Data Router with SSR Hydration

**Server-side:**
- Execute route loaders before rendering
- Pass data via `window.__staticRouterHydrationData`
- Render fully populated HTML (SEO ✅)

**Client-side:**
- Hydrate with server data
- Zero duplicate requests
- Instant interactive

**Example:**
```typescript
{
  path: '/product/:id',
  element: <ProductPage />,
  loader: async ({ params }) => {
    return await fetchProduct(params.id); // Server preloads
  }
}
```

### 3. Hot Module Replacement (HMR)

**Features:**
- Modify React components without page refresh
- Server code changes auto-restart SSR server
- Stable HMR connection via absolute URLs
- CORS-enabled cross-server communication

**See [HMR.md](./HMR.md) for architecture details.**

---

## Performance Targets

### Web Vitals Goals

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.5s
- **TTFB** (Time to First Byte): < 600ms

### SSR Metrics

- **Shell render**: < 100ms
- **Full page**: < 1s (with Suspense)
- **Hydration**: < 500ms

---

## Code Organization

### Isomorphic Structure

- **`/client`**: Browser-only (window, document APIs)
- **`/server`**: Node.js-only (SSR, file system, secrets)
- **`/shared`**: Runs on both sides (components, routes, types)

### Route Configuration

```typescript
// src/shared/routes/index.tsx
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/product/:id',
    element: <ProductPage />,
    loader: async ({ params }) => {
      return await fetchProduct(params.id);
    }
  }
];
```

### Suspense Boundaries

```typescript
function ProductPage() {
  return (
    <div>
      {/* Critical: from loader (SSR) */}
      <ProductInfo />

      {/* Secondary: lazy load (Suspense) */}
      <Suspense fallback={<Skeleton />}>
        <ProductReviews />
      </Suspense>
    </div>
  );
}
```

---

## Development Workflow

### Modifying Client Code

1. Edit `.tsx` file in `src/shared/pages/` or `src/client/`
2. Save file
3. Browser auto-updates (1-2s) ✅
4. Check console: `🔥 Hot Module Replacement triggered`

### Modifying Server Code

1. Edit `.ts` file in `src/server/`
2. Save file
3. Server auto-restarts (nodemon)
4. Manually refresh browser

### Debugging

**HMR Issues:**
- Check Network tab for `__webpack_hmr` connection
- Verify HMR server running on `:3001`
- See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for troubleshooting

**SSR Errors:**
- Check server terminal for stack traces
- Add logging in `src/server/render.tsx`
- Ensure no browser APIs in shared code

**Hydration Mismatches:**
- Server and client must render identical HTML
- Use `useEffect` for browser-only code
- See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for patterns

---

## Deployment

### Production Build

```bash
# Build optimized bundles
pnpm run build

# Start production server (single server, no HMR)
pnpm start
```

### Docker

```bash
docker build -t react18-ssr .
docker run -p 3000:3000 react18-ssr
```

### PM2

```bash
pm2 start dist/server/index.js --name react18-ssr
pm2 monit
```

**See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for deployment guides.**

---

## Documentation Map

### For New Developers

1. **Start here**: `CLAUDE.md` (this file) - Project overview
2. **Implementation**: [PHASES.md](./docs/PHASES.md) - Step-by-step phases
3. **Architecture**: [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Design decisions
4. **Development**: [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - Daily workflows
5. **Deep Dives**:
   - [HMR.md](./HMR.md) - HMR architecture & troubleshooting
   - [STREAMING_SSR.md](./STREAMING_SSR.md) - SSR streaming patterns

### For Contributors

- [CHANGELOG.md](./docs/CHANGELOG.md) - Version history & migration guides
- [PHASES.md](./docs/PHASES.md) - Upcoming features roadmap

---

## Recent Updates

### v1.2.0 (2025-10-24) - Phase 6b Complete

**Added:**
- Data Router architecture (createBrowserRouter/createStaticRouter)
- Route loaders for SSR data prefetching
- SSR hydration data reuse
- Product page with dynamic routing
- Mock API layer (10 realistic products)

**Performance:**
- Zero duplicate requests after hydration
- SEO-optimized with product info in HTML
- TTFB improvement via server-side loaders

**See [CHANGELOG.md](./docs/CHANGELOG.md) for full history.**

---

## Next Steps

**Recommended Next Phase**: Phase 7 - Tailwind CSS + Styling System

```bash
# Preview Phase 7 objectives
cat docs/PHASES.md | grep -A 20 "Phase 7"
```

**Questions?**
- See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for troubleshooting
- Check [HMR.md](./HMR.md) for HMR issues
- Review [PHASES.md](./docs/PHASES.md) for implementation details

---

## Summary

This React 18 SSR project uses a **sophisticated dual-server architecture** to maximize developer experience and performance:

- **HMR Server (3001)**: Frontend builds & hot updates
- **SSR Server (3000)**: Server-side rendering & content delivery
- **React 18 Streaming**: Progressive rendering with Suspense
- **Data Router**: SSR loaders + intelligent hydration
- **TypeScript**: Full type safety across stack
- **Modern Stack**: Webpack 5, Koa, React Router v7, Tailwind (Phase 7)

**Status**: Phase 1-6b complete, production-ready foundation. Ready for Phase 7 (Styling System).

---

*For detailed information, please refer to the documentation files in the `docs/` directory.*
