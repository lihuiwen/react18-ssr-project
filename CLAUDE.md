# React 18 SSR Project - Claude Code Documentation

## Project Overview

This is a **React 18 Server-Side Rendering (SSR) project** with a modern dual-server architecture. Currently at Phase 6a with **Phase 1-6a completed**.

**Project Status**: v1.1.0 - Phase 6a Complete (React Router Integration + HMR Fix)
**Created**: 2025-10-21
**Last Updated**: 2025-10-22
**Framework**: React 18 with TypeScript and Webpack 5

---

## High-Level Architecture

### Dual-Server Architecture

The project uses a **separation of concerns** with two independent servers working together:

```
┌─────────────────────────────┐     ┌──────────────────────────┐
│   HMR Server (Port 3001)    │     │   SSR Server (Port 3000) │
├─────────────────────────────┤     ├──────────────────────────┤
│ • Express.js                │     │ • Koa.js                 │
│ • Webpack Compiler          │     │ • renderToPipeableStream │
│ • webpack-dev-middleware    │     │ • Static file serving    │
│ • webpack-hot-middleware    │     │ • Require cache clearing │
│ • Server-Sent Events (SSE)  │     │ • Graceful shutdown      │
└─────────────────────────────┘     └──────────────────────────┘
         │                                    │
         │  HMR Updates (SSE)                 │  HTML + Static
         └──────────────┬──────────────────┘
                        │
                   ┌────▼─────┐
                   │  Browser  │
                   │ :3000     │
                   └───────────┘
```

### Why Dual-Server?

1. **Independent Lifecycle**: Modifying client code doesn't restart the SSR server
2. **Stable HMR Connection**: SSE connection persists even when SSR server restarts
3. **Clear Separation**: Frontend tooling (Webpack) separate from backend rendering (Koa)
4. **Optimized Technology Stack**: Express for HMR (native webpack integration), Koa for SSR (modern & simple)

### React 18 Streaming Render Flow

```
User Request
    ↓
Koa Route Matching
    ↓
Execute Route Loader (critical data preload)
    ↓
renderToPipeableStream
    ↓
onShellReady (send HTML skeleton immediately)
├─ <html><head>...</head>
├─ <body><div id="root">
└─ Navigation, Layout (skeleton)
    ↓
Suspense Boundaries (parallel loading)
├─ Suspense 1: Product List Data
├─ Suspense 2: User Comments
└─ Suspense 3: Recommendations
    ↓
Streaming Complete Content
    ↓
Client Hydration (hydrateRoot)
    ↓
Selective Hydration (interactive parts prioritized)
```

### HMR Workflow for Development

**When modifying client code (React components)**:
1. Save .tsx file
2. HMR Server (3001) detects change
3. Webpack recompiles client code
4. Generates hot-update.js
5. Pushes update via SSE to browser
6. `module.hot.accept()` triggered
7. Component hot replaces (no refresh needed) ✅
8. SSR server unaffected ✅

**When modifying server code**:
1. Save src/server/*.ts
2. nodemon detects change
3. Sends SIGTERM signal
4. SSR server gracefully closes (releases port)
5. Waits 1 second (nodemon delay)
6. Starts new SSR server (3000)
7. HMR server continues running ✅

---

## Technology Stack

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Build Tool** | Webpack 5 | Mature, rich plugin ecosystem, strong SSR support |
| **Client Rendering** | React 18 | Latest with streaming SSR support |
| **Server (HMR)** | Express.js | Native webpack middleware support |
| **Server (SSR)** | Koa.js | Modern, clean API, excellent SSR patterns |
| **Language** | TypeScript | Type safety, refactoring-friendly |
| **Styling** | Tailwind CSS | Utility-first, fast development, PostCSS integration |
| **Routing** | React Router v6 | Official router, loader API for SSR |
| **State Management** | Zustand | Lightweight, SSR-friendly, simple API |
| **Data Fetching (Basic)** | React 18 Suspense + Loaders | Native patterns for SSR data |
| **Data Fetching (Advanced)** | React Query (TanStack) | Optional: caching, polling, optimistic updates (Phase 9) |
| **SEO** | react-helmet-async | Meta tag management, SSR compatible |
| **CSS Extraction** | PostCSS | Critical CSS extraction for SSR |

---

## Project Structure

```
react18-ssr-project/
├── src/
│   ├── client/                        # Client-side code (CSR)
│   │   ├── index.tsx                  # Client hydration entry (HMR support)
│   │   └── App.tsx                    # Client root component
│   │
│   ├── server/                        # Server-side code (SSR)
│   │   ├── index.ts                   # Production SSR entry
│   │   ├── dev-server.ts              # Development SSR (Koa, :3000)
│   │   ├── hmr-server.ts              # HMR server (Express, :3001)
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts        # Error handling middleware
│   │   │   ├── logger.ts              # Logging middleware
│   │   │   └── apiProxy.ts            # API proxy middleware
│   │   ├── render.tsx                 # SSR streaming render logic
│   │   └── template.ts                # HTML template generation
│   │
│   ├── shared/                        # Isomorphic code (both sides)
│   │   ├── routes/
│   │   │   ├── index.tsx              # Route configuration (with loaders)
│   │   │   └── routeConfig.ts         # Route type definitions
│   │   ├── components/
│   │   │   ├── ErrorBoundary/         # Error boundary wrapper
│   │   │   ├── SEO/                   # SEO metadata component
│   │   │   └── Loading/               # Loading skeleton screens
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Product/
│   │   │   └── NotFound/
│   │   ├── api/                       # API layer (Phase 9)
│   │   │   ├── queryClient.ts         # React Query client config
│   │   │   ├── queries/               # Query definitions
│   │   │   └── mutations/             # Mutation definitions
│   │   ├── store/                     # Zustand store definitions
│   │   ├── hooks/                     # Custom React hooks
│   │   ├── utils/                     # Utility functions
│   │   └── types/                     # TypeScript type definitions
│   │
│   └── config/                        # Webpack configurations
│       ├── webpack.common.ts          # Shared configuration
│       ├── webpack.client.ts          # Client build (includes HMR)
│       └── webpack.server.ts          # Server build
│
├── scripts/
│   └── dev.ts                         # Development orchestration script
│
├── public/                            # Static assets
│   └── favicon.ico
│
├── dist/                              # Build output
│   ├── client/                        # Client bundle
│   │   ├── bundle.js
│   │   └── bundle.js.map
│   └── server/                        # Server bundle
│       └── index.js
│
├── tailwind.config.js                 # Tailwind configuration
├── postcss.config.js                  # PostCSS configuration
├── tsconfig.json                      # TypeScript config (client)
├── tsconfig.server.json               # TypeScript config (server)
├── webpack.config.js                  # Webpack entry
├── package.json                       # Dependencies & scripts
├── .gitignore                         # Git ignore rules
├── HMR.md                             # Detailed HMR architecture
└── CLAUDE.md                          # This file (includes all 9 phases)
```

---

## Code Organization Patterns

### 1. Isomorphic Code Structure

Code is organized into three categories:

- **`/client`**: Browser-only code (React hooks for browser APIs, browser-specific imports)
- **`/server`**: Node.js-only code (SSR rendering, database queries, API secrets)
- **`/shared`**: Code that runs on both client and server (components, routes, types)

**Example**:
```typescript
// shared/components/Button/Button.tsx - Runs on both sides
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

// client/hooks/useWindowSize.ts - Client only
export function useWindowSize() {
  const [size, setSize] = useState(window.innerWidth);
  // browser-specific code
}

// server/render.tsx - Server only
export async function renderApp() {
  const { shell } = renderToPipeableStream(<App />, {
    onShellReady() { /* ... */ }
  });
}
```

### 2. Route Configuration with Loaders

Routes include SSR loaders for critical data:

```typescript
// shared/routes/index.tsx
const routes = [
  {
    path: '/product/:id',
    element: <ProductPage />,
    loader: async ({ params }) => {
      // Preload on server-side, available during render
      return fetchProduct(params.id);
    }
  }
];
```

### 3. Suspense Boundaries for Progressive Rendering

Split content into immediate (critical) and deferred (secondary):

```typescript
function ProductPage() {
  return (
    <div>
      {/* Renders immediately from loader data */}
      <ProductInfo />
      
      {/* Loads after shell, shown when ready */}
      <Suspense fallback={<Skeleton />}>
        <ProductReviews />
      </Suspense>
    </div>
  );
}
```

### 4. State Management with Zustand

SSR-friendly state store:

```typescript
// shared/store/userStore.ts
export const useUserStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

// On server: hydrate with user data
// On client: reuse state from SSR
```

### 5. TypeScript Configuration

- **`tsconfig.json`**: Client-side config (DOM types, ES modules)
- **`tsconfig.server.json`**: Server-side config (Node.js types, CommonJS)

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

### Proposed npm Scripts (from PROJECT_PLAN.md)

```json
{
  "scripts": {
    "dev": "node scripts/dev.js",
    "build": "npm run build:client && npm run build:server",
    "build:client": "webpack --config src/config/webpack.client.ts",
    "build:server": "webpack --config src/config/webpack.server.ts",
    "start": "node dist/server/index.js",
    "clean": "rm -rf dist"
  }
}
```

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

## Existing Documentation

### 1. PROJECT_PLAN.md

Comprehensive 8-phase implementation roadmap:

#### Phase 1: Basic Config & Webpack Setup ✅
**Objectives**:
- Install all dependencies
- Configure TypeScript (client + server)
- Configure Webpack (client + server + common)
- Create base directory structure

**Deliverables**:
- `package.json` with all dependencies
- `tsconfig.json`, `tsconfig.server.json`
- `webpack.common.ts`, `webpack.client.ts`, `webpack.server.ts`
- Base directory structure

**Verification**:
```bash
pnpm install          # Dependencies installed
pnpm run build:client # Webpack client compiles
pnpm run build:server # Webpack server compiles
```

---

#### Phase 2: Client-Side Rendering (CSR) ✅
**Objectives**:
- Implement pure client-side React rendering
- Verify Webpack build pipeline
- Create simple Hello World page
- Add HtmlWebpackPlugin for automatic HTML generation

**Deliverables**:
- `src/client/index.tsx` (client entry)
- `src/client/App.tsx` (root component)
- Update Webpack client config with `html-webpack-plugin`
- Or manually create `public/index.html` template

**Verification**:
```bash
# Option A: Using HtmlWebpackPlugin (Recommended)
pnpm run build:client
# Open dist/client/index.html in browser
# Browser shows "Hello World"

# Option B: Using webpack-dev-server
npx webpack serve --config src/config/webpack.client.ts
# Visit http://localhost:8080
# Browser shows "Hello World"
```

**Note**: This phase focuses on client-only rendering without SSR. The HTML is either auto-generated by Webpack or served from a static template.

---

#### Phase 3: Basic SSR Implementation ✅
**Objectives**:
- Implement Koa server
- Use `renderToString` (traditional SSR)
- Client-side hydration
- Verify SSR → Hydration flow

**Deliverables**:
- `src/server/index.ts` (Koa server)
- `src/server/render.tsx` (SSR render logic)
- `src/server/template.ts` (HTML template generation)

**Verification**:
```bash
pnpm run build
pnpm start
curl http://localhost:3000
# View source: HTML contains rendered content
# Browser: interactions work (hydration successful)
```

---

#### Phase 4: React 18 Streaming SSR + Suspense ✅
**Objectives**:
- Replace with `renderToPipeableStream`
- Implement Suspense boundaries
- Verify streaming (shell sent first)

**Deliverables**:
- Update `src/server/render.tsx` (streaming)
- Create Suspense example components
- Create Loading skeleton components

**Verification**:
```bash
pnpm start
# Open browser Network tab
# View HTML response: streaming (Transfer-Encoding: chunked)
# See skeleton first, then actual content
```

---

#### Phase 5: HMR Dual-Server Architecture ✅
**Objectives**:
- Implement HMR server (Express, 3001)
- Implement dev SSR server (Koa, 3000)
- Configure Webpack HMR
- Implement orchestration script

**Deliverables**:
- `src/server/hmr-server.ts`
- `src/server/dev-server.ts`
- `scripts/dev.ts`
- Update Webpack client config (HMR entry)
- Update client entry (module.hot.accept)

**Verification**:
```bash
pnpm run dev
# Visit http://localhost:3000
# Modify React component
# Browser auto-updates without refresh ✅
# Console: 🔥 Hot Module Replacement triggered
# Network: __webpack_hmr connected to 3001
```

---

#### Phase 6a: React Router Integration ⏳
**Objectives**:
- Integrate React Router v6 basics
- Create route configuration
- Implement client-side navigation
- Verify SSR + client-side routing work together

**Deliverables**:
- `src/shared/routes/index.tsx` (basic route config)
- Example pages: `Home`, `About`, `NotFound`
- Update server render logic to handle routes
- Update client entry to use BrowserRouter

**Verification**:
```bash
pnpm run dev
# Visit http://localhost:3000/
# Visit http://localhost:3000/about
# View page source: HTML contains route-specific content (SSR working)
# Click navigation links: no page refresh (client routing working)
# Browser back/forward buttons work correctly
```

**Note**: This phase establishes routing foundation without data fetching complexity.

---

#### Phase 6b: Data Fetching (Mixed Mode) ⏳
**Objectives**:
- Implement route-level loaders (server-side data preload)
- Implement component-level Suspense (client-side lazy load)
- Use React 18 native `use()` Hook with simple caching
- Create mock API endpoints

**Deliverables**:
- Add `Product/:id` page with loader
- Route loader implementation (server-side)
- Simple cache utility for client-side data
- Suspense components for secondary data
- Mock API data functions (`src/shared/api/`)

**Verification**:
```bash
pnpm run dev
# Visit /product/123
# View page source: product data rendered (from loader, SEO-friendly)
# Browser console: reviews/recommendations lazy-loaded (from Suspense)
# Network tab: see separate requests for secondary data
# Verify loading states (skeleton screens appear first)
```

**Note**: This phase demonstrates the mixed data fetching strategy:
- Critical SEO data: Route loaders (server-side)
- Secondary UX data: Suspense + native React patterns (client-side)
- React Query will be introduced later in Phase 9 for advanced scenarios

---

#### Phase 7: Tailwind CSS + Styling System ⏳
**Objectives**:
- Configure Tailwind CSS
- Configure PostCSS
- Support SSR style extraction
- Create styled example components

**Deliverables**:
- `tailwind.config.js`
- `postcss.config.js`
- Update Webpack config (CSS loaders)
- Example pages with Tailwind styles

**Verification**:
```bash
pnpm run dev
# Browser: Tailwind styles applied
# View source: <head> has inline CSS (critical styles)
# Modify Tailwind classes: HMR auto-updates
```

---

#### Phase 8a: State Management (Zustand) ⏳
**Objectives**:
- Integrate Zustand for global state management
- Handle SSR state serialization
- Verify client-side hydration with state
- Create example stores (cart, user, theme)

**Deliverables**:
- `src/shared/store/cartStore.ts` (example store)
- `src/shared/store/userStore.ts` (example store)
- SSR state serialization logic
- Client-side state hydration
- Store usage examples in components

**Verification**:
```bash
pnpm run dev
# Test adding items to cart (state updates)
# Refresh page: cart state persists (SSR serialization working)
# View page source: __INITIAL_STATE__ contains serialized store data
# Browser console: verify state hydration on client
# Test state sharing across components
```

**Note**: Key challenges:
- Serializing Zustand state on server
- Passing state to client via `window.__INITIAL_STATE__`
- Hydrating store on client without causing mismatches

---

#### Phase 8b: SEO Optimization ⏳
**Objectives**:
- Integrate react-helmet-async for meta tag management
- Configure SSR support for helmet
- Create reusable SEO component
- Implement dynamic meta tags per route

**Deliverables**:
- `src/shared/components/SEO/SEO.tsx` (reusable component)
- Configure HelmetProvider on server and client
- Update server render to extract helmet data
- Add SEO to example pages (Home, Product)

**Verification**:
```bash
pnpm run dev
# Visit /
# View source: <title> and <meta> tags correctly rendered
# Visit /product/123
# View source: product-specific meta tags (title, description, og:image)
# Use SEO checker tool: verify structured data
# Test social media preview (Twitter, Facebook cards)
```

**Note**: react-helmet-async is async-safe for SSR, unlike original react-helmet.

---

#### Phase 8c: API Proxy + Complete Integration ⏳
**Objectives**:
- Implement API proxy middleware
- Unify API requests through proxy
- Create complete example application
- Final integration testing

**Deliverables**:
- `src/server/middleware/apiProxy.ts`
- Configure proxy routes (`/api/*`)
- Complete product listing + detail pages
- Shopping cart functionality example
- Integration tests workflow

**Verification**:
```bash
pnpm run dev
# Test API proxy: fetch('/api/products') → proxied to backend
# Verify CORS handling (no CORS errors)
# Test complete user flow:
  # 1. Browse product list (/)
  # 2. Click product (routing works)
  # 3. View product details (loader data + Suspense)
  # 4. Add to cart (Zustand state)
  # 5. Check SEO (meta tags)
  # 6. Verify styles (Tailwind)
  # 7. Test HMR (modify code, auto-update)
# All features work together seamlessly ✅
```

**Note**: This final phase brings together all previous work into a cohesive application.

---

#### Phase 9: React Query Integration (Optional Advanced) 🚀

**Objectives**:
- Introduce @tanstack/react-query for advanced client-side data scenarios
- Implement SSR data prefetching and hydration
- Enable complex data patterns (polling, optimistic updates, infinite scroll)
- Maintain compatibility with existing Route Loader pattern

**Why React Query?**
Phase 6b established basic data fetching with Route Loaders and native Suspense. Phase 9 adds:
- ✅ Smart caching with automatic deduplication
- ✅ Real-time data sync (polling, WebSocket integration)
- ✅ Optimistic updates (shopping cart, likes)
- ✅ Pagination/infinite scroll
- ✅ Powerful DevTools

**When to implement Phase 9:**
- You need real-time data updates
- You need optimistic UI updates
- You need complex pagination/infinite scroll
- Team wants standardized data fetching patterns

**Deliverables**:
- `src/shared/api/queryClient.ts` - QueryClient configuration
- `src/shared/api/queries/` - Query definitions (products, cart, user)
- `src/shared/api/mutations/` - Mutation definitions (cart operations)
- Update `src/server/render.tsx` - Add query prefetching
- Update `src/client/index.tsx` - Add query hydration
- React Query DevTools integration
- Example pages using advanced patterns (infinite scroll, polling, optimistic updates)

**Dual Data Strategy:**
```typescript
// Route config with both strategies
{
  path: '/product/:id',

  // Phase 6b: Critical SEO data (Route Loader)
  loader: async ({ params }) => {
    return { product: await fetchProductBasicInfo(params.id) };
  },

  // Phase 9: Enhanced client data (React Query Prefetch)
  queryPrefetch: async (queryClient, params) => {
    await queryClient.prefetchQuery(productDetailOptions(params.id));
    await queryClient.prefetchQuery(productReviewsOptions(params.id));
  }
}
```

**Core Implementation:**

1. **QueryClient Setup** (`src/shared/api/queryClient.ts`):
```typescript
import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,       // 1 min cache
        gcTime: 5 * 60 * 1000,       // 5 min garbage collection
        refetchOnMount: false,       // Avoid refetch after SSR
      },
    },
  });
}
```

2. **Server-Side Prefetching** (`src/server/render.tsx`):
```typescript
import { dehydrate, QueryClientProvider } from '@tanstack/react-query';

const queryClient = getQueryClient();

// Prefetch queries before rendering
await route.queryPrefetch?.(queryClient, params);

const dehydratedState = dehydrate(queryClient);

renderToPipeableStream(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
  {
    onShellReady() {
      res.write(`
        <script>
          window.__REACT_QUERY_STATE__ = ${JSON.stringify(dehydratedState)};
        </script>
      `);
    }
  }
);
```

3. **Client-Side Hydration** (`src/client/index.tsx`):
```typescript
import { hydrate, QueryClientProvider } from '@tanstack/react-query';

const queryClient = getQueryClient();

// Hydrate server-prefetched data
if (window.__REACT_QUERY_STATE__) {
  hydrate(queryClient, window.__REACT_QUERY_STATE__);
}

hydrateRoot(
  root,
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);
```

4. **Advanced Patterns:**

**Infinite Scroll:**
```typescript
function ProductList() {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
}
```

**Optimistic Updates:**
```typescript
function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCartAPI,
    onMutate: async (item) => {
      // Cancel ongoing queries
      await queryClient.cancelQueries(['cart']);

      // Snapshot current state
      const previous = queryClient.getQueryData(['cart']);

      // Optimistically update
      queryClient.setQueryData(['cart'], (old) => [...old, item]);

      return { previous };
    },
    onError: (err, item, context) => {
      // Rollback on error
      queryClient.setQueryData(['cart'], context.previous);
    },
  });
}
```

**Polling:**
```typescript
function ProductReviews({ productId }) {
  const { data } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => fetchReviews(productId),
    refetchInterval: 30 * 1000, // Poll every 30s
  });
}
```

**Verification**:
```bash
pnpm install @tanstack/react-query @tanstack/react-query-devtools
pnpm run dev

# Visit /product/123
# View source: window.__REACT_QUERY_STATE__ contains prefetched data ✅
# Browser: No extra requests after hydration ✅
# DevTools: React Query panel shows cache state ✅

# Test optimistic update:
# Click "Add to Cart"
# Cart updates immediately (no loading state) ✅
# Network confirms request succeeded ✅

# Test infinite scroll:
# Visit /products
# Scroll to bottom
# Next page loads automatically ✅

# Test polling:
# Open /product/123
# Network shows periodic requests every 30s ✅
```

**Architecture Decision:**
```
┌─────────────────────────────────────────┐
│       Data Fetching Strategy            │
├─────────────────────────────────────────┤
│                                         │
│  Route Loader (Phase 6b)                │
│  └─ SEO-critical data                   │
│     (product name, price, description)  │
│                                         │
│  React Query (Phase 9)                  │
│  ├─ Enhanced data (specs, stock)        │
│  ├─ Real-time data (reviews, comments)  │
│  ├─ Interactive data (cart, likes)      │
│  └─ Complex patterns (pagination)       │
│                                         │
└─────────────────────────────────────────┘
```

**Decision Flow:**
```
Need data?
    │
    ├─ SEO critical? ──YES→ Route Loader
    │       │
    │      NO
    │       ↓
    ├─ Real-time updates? ──YES→ React Query (polling)
    │       │
    │      NO
    │       ↓
    ├─ Optimistic updates? ──YES→ React Query (mutations)
    │       │
    │      NO
    │       ↓
    ├─ Pagination/Infinite? ──YES→ React Query (infinite)
    │       │
    │      NO
    │       ↓
    └─ Simple lazy load ────────→ Native Suspense
```

**Dependencies:**
```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.59.0"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.59.0"
  }
}
```

**Note**: This is an **optional advanced phase**. If your app doesn't need real-time updates, optimistic UI, or complex data patterns, Phase 6b's native approach is sufficient. Only implement Phase 9 when these advanced features become necessary.

---

### 2. HMR.md

In-depth HMR architecture documentation:

- **Architecture Overview**: Dual-server topology and data flow
- **Core Files**: Detailed explanation of each server file
- **Workflow Diagrams**: Visual process flows
- **Advantages**: Why this architecture is optimal
- **Troubleshooting**: Common issues and solutions (5 detailed scenarios)
- **Technical Deep-Dives**: 
  - Cross-port HMR connections
  - Server-Sent Events (SSE)
  - Require cache management
  - module.hot.accept() patterns
  - hydrate vs render decisions

**See**: `/Users/lihuiwen/Desktop/ssr-project/react18-ssr-project/HMR.md`

### 3. package.json

Current minimal setup (awaiting implementation):

```json
{
  "name": "react18-ssr-project",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

---

## Key Features & Design Decisions

### 1. React 18 Streaming SSR

**Why**: Traditional SSR requires waiting for all data before sending HTML.

**Solution**: Use `renderToPipeableStream` to:
- Send HTML skeleton immediately (onShellReady)
- Stream data chunks as Suspense boundaries resolve
- Client sees content progressively

**Benefits**:
- Reduced Time to First Byte (TTFB)
- Faster First Contentful Paint (FCP)
- Better perceived performance

### 2. Selective Hydration

React 18 automatically:
- Prioritizes hydrating interactive components first
- Defers non-critical component hydration
- Improves Time to Interactive (TTI)

### 3. Mixed Data Fetching Strategy

**Phase 6b - Basic Strategy:**
- **Route Loaders**: Preload critical SEO data server-side
- **Component Suspense**: Lazy-load secondary data client-side with native patterns
- **Benefit**: SEO-friendly + smooth UX

**Phase 9 - Advanced Strategy (Optional):**
- **React Query**: Add intelligent caching, polling, optimistic updates
- **When to use**: Real-time features, complex interactions, pagination
- **Benefit**: Production-grade data management with minimal code

### 4. Graceful Server Shutdown

```typescript
// server/dev-server.ts
process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0); // Clean exit, release port
  });
});
```

Ensures:
- Port doesn't remain locked after restart
- Open connections properly closed
- Next server process can bind successfully

### 5. Webpack writeToDisk

HMR Server writes bundle to disk:
- SSR server can read latest compiled code
- Both servers always in sync
- No cross-server communication needed

---

## Performance Targets

### Web Vitals Goals

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **TTI** (Time to Interactive): < 3.5s
- **TTFB** (Time to First Byte): < 600ms

### SSR Performance

- **Shell render time**: < 100ms (skeleton HTML)
- **Full page render**: < 1s (including Suspense)
- **Hydration time**: < 500ms (client activation)

---

## Implementation Best Practices

### 1. Webpack Configuration

**Client Build**:
```typescript
// webpack.client.ts (Development)
entry: [
  'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr&reload=true',
  './src/client/index.tsx'
],
output: {
  path: path.resolve(__dirname, '../../dist/client'),
  filename: 'bundle.js',
  publicPath: '/static/'
}
```

**Server Build**:
```typescript
// webpack.server.ts
target: 'node',
externals: [nodeExternals()], // Don't bundle node_modules
output: {
  libraryTarget: 'commonjs2'
}
```

### 2. TypeScript Configuration

**Client Config** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["DOM", "ES2020"],
    "jsx": "react-jsx",
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

**Server Config** (`tsconfig.server.json`):
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "lib": ["ES2020"],
    "types": ["node"]
  },
  "include": ["src/server/**/*", "src/shared/**/*"]
}
```

### 3. Data Fetching Patterns

**Route Loader (Server-side)**:
```typescript
// Runs on server during SSR
export const productLoader = async ({ params }) => {
  const product = await fetchProduct(params.id);
  return { product };
};
```

**Component Suspense (Client-side)**:
```typescript
// Lazy loads on client after hydration
function Reviews() {
  const { data } = useQuery('reviews', fetchReviews);
  return <ReviewList reviews={data} />;
}
```

### 4. Error Handling

**Server-side Error Boundary**:
```typescript
// server/render.tsx
renderToPipeableStream(<App />, {
  onError(error) {
    console.error('SSR Error:', error);
    // Log to monitoring service
  }
});
```

**Client-side Error Boundary**:
```tsx
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

---

## Important Notes

### Current Status

**Phase 1-6a have been successfully implemented and tested!**

**✅ Completed Phases:**
- Phase 1: Basic Config & Webpack Setup
- Phase 2: Client-Side Rendering (CSR)
- Phase 3: Basic SSR Implementation (renderToString)
- Phase 4: React 18 Streaming SSR (renderToPipeableStream)
- Phase 5: HMR Dual-Server Architecture (Express + Koa)
- **Phase 6a: React Router Integration** ⭐ NEW

**Current Capabilities:**
- ✅ Streaming SSR with React 18
- ✅ Hot Module Replacement (HMR) working (stable with absolute URL fix)
- ✅ Dual-server architecture (HMR:3001, SSR:3000)
- ✅ Client-side hydration
- ✅ Interactive features (state, events)
- ✅ Development workflow optimized
- ✅ **React Router v7 with SSR support** ⭐ NEW
- ✅ **Client-side and server-side routing** ⭐ NEW
- ✅ **404 status code handling** ⭐ NEW
- ✅ **CORS-enabled dual-server HMR** ⭐ NEW

**Next Phase:** Phase 6b - Data Fetching (Mixed Mode)

### Implementation Phases

The project includes a comprehensive 9-phase rollout plan. Each phase is designed to:
- Build incrementally
- Validate progress before advancing
- Provide clear success criteria

Phases 1-8c cover core SSR functionality, while Phase 9 (React Query) is an optional advanced enhancement for complex data scenarios.

### HMR Architecture

The dual-server design is critical to the project's success. Understand the HMR.md document thoroughly before implementation:
- How Express and Koa work together
- Why SSE connections must stay stable
- How to properly handle graceful restarts

### Testing & Validation

Each phase includes verification steps. Key validations:
- Browser DevTools Network tab for SSE connection
- Console for "Hot Module Replacement triggered" messages
- Page source code to verify server-side rendering
- Performance metrics using Lighthouse

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

---

## Quick Reference

**When to check HMR.md**:
- HMR not updating changes
- ERR_INCOMPLETE_CHUNKED_ENCODING errors
- Port occupation issues during server restarts
- Understanding the technical deep-dives

**File Reading Order** (for new developers):
1. This CLAUDE.md (high-level overview with all 9 phases)
2. HMR.md (detailed HMR patterns)
3. Source code as you implement each phase

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

## Summary

This React 18 SSR project uses a **sophisticated dual-server architecture** to maximize developer experience and performance:

- **HMR Server (3001)**: Frontend builds & hot updates
- **SSR Server (3000)**: Server-side rendering & content delivery
- **React 18 Streaming**: Progressive rendering with Suspense
- **Mixed Data Fetching**:
  - Phase 6b: Route Loaders + native Suspense (core functionality)
  - Phase 9: Optional React Query integration (advanced scenarios)
- **TypeScript Throughout**: Full type safety across stack
- **Modern Stack**: Webpack 5, Koa, React Router v6, Zustand, Tailwind

The project includes a **9-phase implementation plan**:
- **Phases 1-8c**: Core SSR functionality (required)
- **Phase 9**: React Query integration (optional, for advanced data patterns)

All phases are well-documented with clear objectives, deliverables, and verification steps ready for development.

---

## 📝 Phase 6a Completion Report (2025-10-22)

### ✅ Phase 6a: React Router Integration - COMPLETED

#### Implementation Summary

Successfully integrated React Router v7 with full SSR support, enabling seamless client-side and server-side routing.

#### Key Deliverables

1. **Dependencies Installed:**
   - `react-router-dom@7.9.4`
   - `@types/react-router-dom@5.3.3`

2. **Route Configuration Created:**
   - `src/shared/routes/index.tsx` - Isomorphic route config
   - Supports both StaticRouter (server) and BrowserRouter (client)

3. **Example Pages Implemented:**
   - `src/shared/pages/Home/index.tsx` - Home page with navigation
   - `src/shared/pages/About/index.tsx` - About page with architecture info
   - `src/shared/pages/NotFound/index.tsx` - 404 error page

4. **Server-Side Rendering Updated:**
   - `src/server/render.tsx` - Added StaticRouter and Routes
   - Proper 404 status code handling
   - Route matching logic for SSR

5. **Client-Side Routing Updated:**
   - `src/client/index.tsx` - Added BrowserRouter and Routes
   - HMR compatibility maintained
   - Hydration works with routing

#### Verification Results

| Test Item | Status | Details |
|-----------|--------|---------|
| Home Route (`/`) | ✅ | Renders correctly with all content |
| About Route (`/about`) | ✅ | Displays architecture information |
| 404 Route (`/nonexistent`) | ✅ | Shows 404 page with correct content |
| 404 Status Code | ✅ | Returns proper `404 Not Found` status |
| SSR Content | ✅ | HTML source contains fully rendered content (SEO-friendly) |
| Client-Side Navigation | ✅ | Link clicks work without page refresh |
| HMR Compatibility | ✅ | Hot reloading works with routing changes |

---

## 🔧 Critical Bug Fix: HMR Stability Issue (2025-10-22)

### Problem Identified

During Phase 6a testing, discovered a **critical HMR stability issue** in the dual-server architecture:

**Symptom:**
```
http://localhost:3000/static/main.xxx.hot-update.json
net::ERR_CONNECTION_REFUSED
```

**Root Cause:**
- Webpack `publicPath` was using relative path `/static/`
- Browser resolved it as `localhost:3000/static/` instead of `localhost:3001/static/`
- HMR update files (`*.hot-update.json`) were requested from wrong server
- SSR server (`:3000`) doesn't serve HMR files, causing connection refused

### Solution Implemented

#### 1. Webpack Client Config (`src/config/webpack.client.js`)

**Changed:**
```javascript
output: {
  publicPath: isDevelopment
    ? 'http://localhost:3001/static/'  // ✅ Absolute URL for HMR server
    : '/static/',                       // Production uses relative path
}
```

#### 2. HMR Server CORS Support (`src/server/hmr-server.ts`)

**Added:**
```typescript
// Enable CORS for cross-origin resource loading
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Credentials', 'true');
  // ... preflight handling
});
```

#### 3. SSR Render Script Path (`src/server/render.tsx`)

**Changed:**
```typescript
const isDevelopment = process.env.NODE_ENV !== 'production';
const bundleUrl = isDevelopment
  ? 'http://localhost:3001/static/bundle.js'  // ✅ Points to HMR server
  : '/static/bundle.js';                       // Production relative path

bootstrapScripts: [bundleUrl],
```

### Impact

- ✅ **HMR now stable** - No more connection refused errors
- ✅ **Multiple saves work** - Can save files repeatedly without issues
- ✅ **Proper resource loading** - All assets load from correct server
- ✅ **Production unaffected** - Relative paths still work in production

### Architecture Diagram (After Fix)

```
Browser (localhost:3000)
    ↓
HTML: <script src="http://localhost:3001/static/bundle.js">
    ↓
Loads bundle from HMR Server (:3001) ✅
    ↓
HMR Update Triggered
    ↓
Webpack Client requests: http://localhost:3001/static/main.xxx.hot-update.json
    ↓
HMR Server responds with update ✅
    ↓
Hot update applied successfully!
```

---

## 🎯 Current Progress Summary

```
✅ Phase 1: Basic Config & Webpack Setup
✅ Phase 2: Client-Side Rendering (CSR)
✅ Phase 3: Basic SSR Implementation
✅ Phase 4: React 18 Streaming SSR
✅ Phase 5: HMR Dual-Server Architecture
✅ Phase 6a: React Router Integration + HMR Stability Fix
⏳ Phase 6b: Data Fetching (Next)
⏳ Phase 7-9: Remaining phases
```

**Lines of Code Changed:** ~200 lines (across 6 files)
**New Files Created:** 4 (routes config + 3 pages)
**Bugs Fixed:** 1 critical (HMR stability)
**Production Ready:** Phase 1-6a features are production-ready

