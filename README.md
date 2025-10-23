# React 18 SSR Project

<div align="center">

**A modern React 18 Server-Side Rendering project with dual-server architecture, HMR, and React Router**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5.102-8dd6f9?logo=webpack)](https://webpack.js.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Architecture](#architecture)

**Languages**: [English](./README.md) | [简体中文](./README.zh-CN.md)

</div>

---

## Overview

This is a production-ready **React 18 Server-Side Rendering (SSR)** project featuring:

- 🚀 **Streaming SSR** with React 18's `renderToPipeableStream`
- 🔥 **Hot Module Replacement (HMR)** with stable dual-server architecture
- 🛣️ **React Router v7** with Data Router and SSR support
- 📦 **Route Loaders** for server-side data prefetching
- ⚡ **Zero duplicate requests** via intelligent hydration
- 🎯 **TypeScript** throughout the entire stack
- 🏗️ **Webpack 5** with optimized production builds

**Current Version**: v1.2.0 - Phase 6b Complete ✅

---

## Features

### 🎨 Modern React 18

- **Streaming SSR**: Send HTML skeleton immediately for better TTFB
- **Suspense Boundaries**: Progressive content loading
- **Selective Hydration**: Prioritize interactive elements
- **Concurrent Rendering**: Non-blocking UI updates

### 🔧 Developer Experience

- **Dual-Server Architecture**: Independent HMR and SSR servers
- **Fast Refresh**: Modify components without page reload
- **Auto-Restart**: Server code changes trigger graceful restarts
- **CORS-Enabled**: Stable cross-server HMR communication

### 🛤️ Data Router

- **SSR Loaders**: Prefetch data on the server
- **Hydration Optimization**: Reuse server data on client
- **Dynamic Routing**: Type-safe route parameters
- **SEO-Friendly**: Fully rendered HTML with metadata

### 🏛️ Dual-Server Architecture

```
┌─────────────────────────────┐     ┌──────────────────────────┐
│   HMR Server (Port 3001)    │     │   SSR Server (Port 3000) │
├─────────────────────────────┤     ├──────────────────────────┤
│ • Express.js                │     │ • Koa.js                 │
│ • Webpack Dev Middleware    │     │ • renderToPipeableStream │
│ • Webpack Hot Middleware    │     │ • Route Loader Execution │
│ • Server-Sent Events        │     │ • Static File Serving    │
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

## Quick Start

### Prerequisites

- **Node.js**: v18+ recommended
- **Package Manager**: pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd react18-ssr-project

# Install dependencies
pnpm install
```

### Development

```bash
# Start dual-server development environment
pnpm run dev

# Servers will start:
# - HMR Server: http://localhost:3001 (internal)
# - SSR Server: http://localhost:3000 (access here)
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Build optimized bundles
pnpm run build

# Start production server
pnpm start
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm install` | Install all dependencies |
| `pnpm run dev` | Start development with dual-server |
| `pnpm run build` | Build client and server bundles |
| `pnpm run build:client` | Build client bundle only |
| `pnpm run build:server` | Build server bundle only |
| `pnpm start` | Start production server |
| `pnpm run clean` | Remove dist folder |

---

## Project Structure

```
react18-ssr-project/
├── docs/                              # 📚 Documentation
│   ├── PHASES.md                      # Implementation roadmap
│   ├── ARCHITECTURE.md                # Design decisions
│   ├── DEVELOPMENT.md                 # Development workflows
│   ├── CHANGELOG.md                   # Version history
│   ├── HMR.md                         # HMR architecture deep dive
│   └── STREAMING_SSR.md               # SSR streaming patterns
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
│   │   └── types/                     # TypeScript types
│   │
│   └── config/                        # Webpack configs
│       ├── webpack.common.ts
│       ├── webpack.client.ts
│       └── webpack.server.ts
│
├── dist/                              # Build output (gitignored)
│   ├── client/                        # Client bundle
│   └── server/                        # Server bundle
│
├── CLAUDE.md                          # Project overview
├── package.json
├── tsconfig.json
└── tsconfig.server.json
```

---

## Architecture

### Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | React 19.2 | UI rendering with SSR |
| **Language** | TypeScript 5.9 | Type safety |
| **Build Tool** | Webpack 5 | Module bundling |
| **HMR Server** | Express 5.1 | Hot module replacement |
| **SSR Server** | Koa 3.0 | Server-side rendering |
| **Routing** | React Router v7 | Data Router with loaders |

### Isomorphic Code Structure

- **`/client`**: Browser-only code (window, document APIs)
- **`/server`**: Node.js-only code (SSR, file system, secrets)
- **`/shared`**: Runs on both sides (components, routes, types)

### Data Flow

```
1. User Request → SSR Server (Koa)
2. Match Route → Execute Loader (server-side)
3. renderToPipeableStream → Send HTML skeleton
4. Inject hydration data → window.__staticRouterHydrationData
5. Client hydration → Reuse server data (no duplicate requests)
6. Interactive UI → React takes over
```

---

## Documentation

### 📘 Core Documentation

| Document | Description |
|----------|-------------|
| **[CLAUDE.md](./CLAUDE.md)** | Project overview and quick reference |
| **[PHASES.md](./docs/PHASES.md)** | Complete 9-phase implementation roadmap |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | Design decisions, patterns & performance |
| **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** | Development workflows & debugging |
| **[CHANGELOG.md](./docs/CHANGELOG.md)** | Version history & migration guides |

### 🔍 Deep Dives

| Document | Description |
|----------|-------------|
| **[HMR.md](./docs/HMR.md)** | HMR architecture & troubleshooting |
| **[STREAMING_SSR.md](./docs/STREAMING_SSR.md)** | SSR streaming patterns & best practices |

### Getting Started Guide

**New to the project?** Follow this reading order:

1. **README.md** (this file) - Quick start
2. **[CLAUDE.md](./CLAUDE.md)** - Project overview
3. **[PHASES.md](./docs/PHASES.md)** - Implementation roadmap
4. **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - Daily workflows

---

## Implementation Progress

### ✅ Completed (v1.2.0)

- [x] **Phase 1**: Basic Config & Webpack Setup
- [x] **Phase 2**: Client-Side Rendering (CSR)
- [x] **Phase 3**: Basic SSR Implementation
- [x] **Phase 4**: React 18 Streaming SSR
- [x] **Phase 5**: HMR Dual-Server Architecture
- [x] **Phase 6a**: React Router Integration
- [x] **Phase 6b**: Data Router + Data Fetching

### ⏳ Upcoming

- [ ] **Phase 7**: Tailwind CSS + Styling System
- [ ] **Phase 8a**: State Management (Zustand)
- [ ] **Phase 8b**: SEO Optimization (react-helmet-async)
- [ ] **Phase 8c**: API Proxy + Integration
- [ ] **Phase 9**: React Query (Optional Advanced)

See [PHASES.md](./docs/PHASES.md) for detailed roadmap.

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

## Development Workflow

### Hot Module Replacement (HMR)

1. Modify `.tsx` file in `src/shared/pages/` or `src/client/`
2. Save file
3. Browser auto-updates (1-2s) ✅
4. Check console: `🔥 Hot Module Replacement triggered`

**HMR not working?** See [HMR.md](./docs/HMR.md) for troubleshooting.

### Server Code Changes

1. Edit `.ts` file in `src/server/`
2. Save file
3. Server auto-restarts (nodemon)
4. Manually refresh browser

### Adding New Routes

```typescript
// src/shared/routes/index.tsx
export const routes: RouteObject[] = [
  {
    path: '/new-page',
    element: <NewPage />,
    loader: async ({ params }) => {
      // Optional: prefetch data on server
      return await fetchData(params.id);
    }
  }
];
```

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed workflows.

---

## Deployment

### Docker

```bash
# Build image
docker build -t react18-ssr .

# Run container
docker run -p 3000:3000 react18-ssr
```

### PM2

```bash
# Start with PM2
pm2 start dist/server/index.js --name react18-ssr

# Monitor
pm2 monit

# Auto-restart on reboot
pm2 startup
pm2 save
```

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for deployment guides.

---

## Troubleshooting

### Common Issues

**HMR not updating?**
- Check Network tab for `__webpack_hmr` connection
- Verify HMR server running on `:3001`
- See [HMR.md](./docs/HMR.md)

**Hydration mismatch errors?**
- Server and client must render identical HTML
- Use `useEffect` for browser-only code
- See [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

**SSR errors?**
- Check server terminal for stack traces
- Add logging in `src/server/render.tsx`
- See [STREAMING_SSR.md](./docs/STREAMING_SSR.md)

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for coding standards.

---

## License

This project is licensed under the ISC License.

---

## Acknowledgments

Built with:

- [React 18](https://react.dev/) - UI framework
- [React Router v7](https://reactrouter.com/) - Routing with Data Router
- [Webpack 5](https://webpack.js.org/) - Module bundler
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Koa](https://koajs.com/) - SSR server framework
- [Express](https://expressjs.com/) - HMR server framework

---

## Questions?

- **Project Overview**: See [CLAUDE.md](./CLAUDE.md)
- **Implementation Guide**: See [PHASES.md](./docs/PHASES.md)
- **Development Help**: See [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- **HMR Issues**: See [HMR.md](./docs/HMR.md)

---

<div align="center">

**Made with ❤️ using React 18 SSR**

[⬆ Back to Top](#react-18-ssr-project)

</div>
