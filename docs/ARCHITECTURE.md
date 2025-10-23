# Architecture & Design Decisions

Deep dive into the architectural decisions, design patterns, and performance optimizations of the React 18 SSR project.

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
  publicPath: isDevelopment
    ? 'http://localhost:3001/static/'  // Absolute URL for HMR
    : '/static/'                        // Relative for production
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

---

## Dual-Server Architecture Deep Dive

### Architecture Diagram

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

## Technology Stack Rationale

| Category | Technology | Rationale |
|----------|-----------|-----------|
| **Build Tool** | Webpack 5 | Mature, rich plugin ecosystem, strong SSR support |
| **Client Rendering** | React 18 | Latest with streaming SSR support |
| **Server (HMR)** | Express.js | Native webpack middleware support |
| **Server (SSR)** | Koa.js | Modern, clean API, excellent SSR patterns |
| **Language** | TypeScript | Type safety, refactoring-friendly |
| **Styling** | Tailwind CSS | Utility-first, fast development, PostCSS integration |
| **Routing** | React Router v7 | Official router, loader API for SSR |
| **State Management** | Zustand | Lightweight, SSR-friendly, simple API |
| **Data Fetching (Basic)** | React 18 Suspense + Loaders | Native patterns for SSR data |
| **Data Fetching (Advanced)** | React Query (TanStack) | Optional: caching, polling, optimistic updates (Phase 9) |
| **SEO** | react-helmet-async | Meta tag management, SSR compatible |
| **CSS Extraction** | PostCSS | Critical CSS extraction for SSR |

---

## Security Considerations

### 1. XSS Prevention

- Sanitize all user inputs
- Use React's built-in escaping
- Validate data on server before rendering

### 2. Environment Variables

- Never expose API keys in client code
- Use `.env` files with proper gitignore
- Separate dev/staging/production configs

### 3. CORS Configuration

```typescript
// HMR Server CORS for cross-origin resource loading
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

---

## Scalability Patterns

### 1. Code Splitting

```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./HeavyChart'));

<Suspense fallback={<Spinner />}>
  <HeavyChart />
</Suspense>
```

### 2. Caching Strategy

- Route loader data: Cache on server (Redis)
- Static assets: CDN with long TTL
- API responses: SWR pattern with React Query

### 3. Load Balancing

- Multiple SSR server instances behind load balancer
- Session affinity for stateful operations
- Health checks for auto-scaling

---

## Related Documentation

- **[HMR.md](./HMR.md)**: Detailed HMR architecture and troubleshooting
- **[PHASES.md](./PHASES.md)**: Complete implementation phases
- **[DEVELOPMENT.md](./DEVELOPMENT.md)**: Development workflows and debugging
- **[STREAMING_SSR.md](./STREAMING_SSR.md)**: SSR streaming patterns
