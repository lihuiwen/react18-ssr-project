# React 18 SSR 项目

<div align="center">

**基于双服务器架构的现代化 React 18 服务端渲染项目，支持 HMR 和 React Router**

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Webpack](https://img.shields.io/badge/Webpack-5.102-8dd6f9?logo=webpack)](https://webpack.js.org/)
[![License](https://img.shields.io/badge/License-ISC-green.svg)](LICENSE)

[功能特性](#功能特性) • [快速开始](#快速开始) • [文档](#文档) • [架构设计](#架构设计)

</div>

---

## 项目概览

这是一个生产级的 **React 18 服务端渲染 (SSR)** 项目，具备以下特性：

- 🚀 **流式 SSR** - 使用 React 18 的 `renderToPipeableStream` API
- 🔥 **热模块替换 (HMR)** - 稳定的双服务器架构
- 🛣️ **React Router v7** - 支持 Data Router 和 SSR
- 📦 **路由加载器** - 服务端数据预取
- ⚡ **零重复请求** - 智能水合优化
- 🎯 **TypeScript** - 全栈类型安全
- 🏗️ **Webpack 5** - 优化的生产构建

**当前版本**: v1.2.0 - Phase 6b 已完成 ✅

---

## 功能特性

### 🎨 现代化 React 18

- **流式 SSR**: 立即发送 HTML 骨架，提升 TTFB
- **Suspense 边界**: 渐进式内容加载
- **选择性水合**: 优先处理交互元素
- **并发渲染**: 非阻塞 UI 更新

### 🔧 开发者体验

- **双服务器架构**: HMR 和 SSR 服务器相互独立
- **快速刷新**: 修改组件无需刷新页面
- **自动重启**: 服务端代码变更触发优雅重启
- **CORS 支持**: 稳定的跨服务器 HMR 通信

### 🛤️ Data Router

- **SSR 加载器**: 在服务端预取数据
- **水合优化**: 客户端复用服务端数据
- **动态路由**: 类型安全的路由参数
- **SEO 友好**: 完整渲染的 HTML 和元数据

### 🏛️ 双服务器架构

```
┌─────────────────────────────┐     ┌──────────────────────────┐
│   HMR 服务器 (端口 3001)     │     │   SSR 服务器 (端口 3000)  │
├─────────────────────────────┤     ├──────────────────────────┤
│ • Express.js                │     │ • Koa.js                 │
│ • Webpack Dev Middleware    │     │ • renderToPipeableStream │
│ • Webpack Hot Middleware    │     │ • 路由加载器执行          │
│ • Server-Sent Events        │     │ • 静态文件服务            │
└─────────────────────────────┘     └──────────────────────────┘
         │                                    │
         │  HMR 更新 (SSE)                    │  HTML + 数据
         └──────────────┬──────────────────┘
                        │
                   ┌────▼─────┐
                   │  浏览器   │
                   │ :3000    │
                   └───────────┘
```

**为什么选择双服务器？**

1. **独立生命周期**: 客户端代码变更不会重启 SSR 服务器
2. **稳定的 HMR**: SSE 连接在 SSR 重启期间保持活跃
3. **清晰分离**: 前端工具与后端渲染逻辑分离
4. **最优技术栈**: Express 用于 HMR，Koa 用于 SSR

---

## 快速开始

### 环境要求

- **Node.js**: 推荐 v18+
- **包管理器**: pnpm（或 npm/yarn）

### 安装

```bash
# 克隆仓库
git clone <your-repo-url>
cd react18-ssr-project

# 安装依赖
pnpm install
```

### 开发环境

```bash
# 启动双服务器开发环境
pnpm run dev

# 服务器将启动：
# - HMR 服务器: http://localhost:3001 (内部使用)
# - SSR 服务器: http://localhost:3000 (访问地址)
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)。

### 生产构建

```bash
# 构建优化后的打包文件
pnpm run build

# 启动生产服务器
pnpm start
```

---

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm install` | 安装所有依赖 |
| `pnpm run dev` | 启动双服务器开发环境 |
| `pnpm run build` | 构建客户端和服务端打包文件 |
| `pnpm run build:client` | 仅构建客户端打包文件 |
| `pnpm run build:server` | 仅构建服务端打包文件 |
| `pnpm start` | 启动生产服务器 |
| `pnpm run clean` | 删除 dist 文件夹 |

---

## 项目结构

```
react18-ssr-project/
├── docs/                              # 📚 文档
│   ├── PHASES.md                      # 实现路线图
│   ├── ARCHITECTURE.md                # 架构设计决策
│   ├── DEVELOPMENT.md                 # 开发工作流
│   ├── CHANGELOG.md                   # 版本历史
│   ├── HMR.md                         # HMR 架构深度解析
│   └── STREAMING_SSR.md               # SSR 流式渲染模式
│
├── src/
│   ├── client/                        # 浏览器端代码
│   │   └── index.tsx                  # 水合入口 (HMR)
│   │
│   ├── server/                        # Node.js 端代码
│   │   ├── index.ts                   # 生产环境入口
│   │   ├── dev-server.ts              # 开发 SSR 服务器 (Koa)
│   │   ├── hmr-server.ts              # HMR 服务器 (Express)
│   │   └── render.tsx                 # SSR 流式渲染逻辑
│   │
│   ├── shared/                        # 同构代码
│   │   ├── routes/                    # 路由配置
│   │   ├── pages/                     # 页面组件
│   │   ├── components/                # 共享组件
│   │   ├── api/                       # 数据层
│   │   └── types/                     # TypeScript 类型
│   │
│   └── config/                        # Webpack 配置
│       ├── webpack.common.ts
│       ├── webpack.client.ts
│       └── webpack.server.ts
│
├── dist/                              # 构建输出 (gitignored)
│   ├── client/                        # 客户端打包文件
│   └── server/                        # 服务端打包文件
│
├── CLAUDE.md                          # 项目总览
├── README.md                          # 英文说明文档
├── README.zh-CN.md                    # 中文说明文档（本文件）
├── package.json
├── tsconfig.json
└── tsconfig.server.json
```

---

## 架构设计

### 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| **框架** | React 19.2 | UI 渲染与 SSR |
| **语言** | TypeScript 5.9 | 类型安全 |
| **构建工具** | Webpack 5 | 模块打包 |
| **HMR 服务器** | Express 5.1 | 热模块替换 |
| **SSR 服务器** | Koa 3.0 | 服务端渲染 |
| **路由** | React Router v7 | Data Router 与加载器 |

### 同构代码结构

- **`/client`**: 仅浏览器代码 (window、document API)
- **`/server`**: 仅 Node.js 代码 (SSR、文件系统、密钥)
- **`/shared`**: 双端运行代码 (组件、路由、类型)

### 数据流

```
1. 用户请求 → SSR 服务器 (Koa)
2. 匹配路由 → 执行加载器 (服务端)
3. renderToPipeableStream → 发送 HTML 骨架
4. 注入水合数据 → window.__staticRouterHydrationData
5. 客户端水合 → 复用服务端数据 (无重复请求)
6. 交互式 UI → React 接管
```

---

## 文档

### 📘 核心文档

| 文档 | 说明 |
|------|------|
| **[CLAUDE.md](./CLAUDE.md)** | 项目总览和快速参考 |
| **[PHASES.md](./docs/PHASES.md)** | 完整的 9 阶段实现路线图 |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | 设计决策、模式和性能 |
| **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** | 开发工作流和调试 |
| **[CHANGELOG.md](./docs/CHANGELOG.md)** | 版本历史和迁移指南 |

### 🔍 深度解析

| 文档 | 说明 |
|------|------|
| **[HMR.md](./docs/HMR.md)** | HMR 架构与故障排查 |
| **[STREAMING_SSR.md](./docs/STREAMING_SSR.md)** | SSR 流式渲染模式与最佳实践 |

### 入门指南

**初次接触项目？** 按以下顺序阅读：

1. **README.zh-CN.md** (本文件) - 快速开始
2. **[CLAUDE.md](./CLAUDE.md)** - 项目总览
3. **[PHASES.md](./docs/PHASES.md)** - 实现路线图
4. **[DEVELOPMENT.md](./docs/DEVELOPMENT.md)** - 日常工作流

---

## 实现进度

### ✅ 已完成 (v1.2.0)

- [x] **Phase 1**: 基础配置与 Webpack 设置
- [x] **Phase 2**: 客户端渲染 (CSR)
- [x] **Phase 3**: 基础 SSR 实现
- [x] **Phase 4**: React 18 流式 SSR
- [x] **Phase 5**: HMR 双服务器架构
- [x] **Phase 6a**: React Router 集成
- [x] **Phase 6b**: Data Router + 数据获取

### ⏳ 即将实现

- [ ] **Phase 7**: Tailwind CSS + 样式系统
- [ ] **Phase 8a**: 状态管理 (Zustand)
- [ ] **Phase 8b**: SEO 优化 (react-helmet-async)
- [ ] **Phase 8c**: API 代理 + 集成
- [ ] **Phase 9**: React Query (可选高级功能)

查看 [PHASES.md](./docs/PHASES.md) 了解详细路线图。

---

## 性能目标

### Web Vitals 指标

- **FCP** (首次内容绘制): < 1.5s
- **LCP** (最大内容绘制): < 2.5s
- **TTI** (可交互时间): < 3.5s
- **TTFB** (首字节时间): < 600ms

### SSR 指标

- **骨架渲染**: < 100ms
- **完整页面**: < 1s (使用 Suspense)
- **水合时间**: < 500ms

---

## 开发工作流

### 热模块替换 (HMR)

1. 修改 `src/shared/pages/` 或 `src/client/` 中的 `.tsx` 文件
2. 保存文件
3. 浏览器自动更新 (1-2s) ✅
4. 检查控制台: `🔥 Hot Module Replacement triggered`

**HMR 不工作？** 查看 [HMR.md](./docs/HMR.md) 进行故障排查。

### 服务端代码修改

1. 编辑 `src/server/` 中的 `.ts` 文件
2. 保存文件
3. 服务器自动重启 (nodemon)
4. 手动刷新浏览器

### 添加新路由

```typescript
// src/shared/routes/index.tsx
export const routes: RouteObject[] = [
  {
    path: '/new-page',
    element: <NewPage />,
    loader: async ({ params }) => {
      // 可选：在服务端预取数据
      return await fetchData(params.id);
    }
  }
];
```

查看 [DEVELOPMENT.md](./docs/DEVELOPMENT.md) 了解详细工作流。

---

## 部署

### Docker

```bash
# 构建镜像
docker build -t react18-ssr .

# 运行容器
docker run -p 3000:3000 react18-ssr
```

### PM2

```bash
# 使用 PM2 启动
pm2 start dist/server/index.js --name react18-ssr

# 监控
pm2 monit

# 开机自启
pm2 startup
pm2 save
```

查看 [DEVELOPMENT.md](./docs/DEVELOPMENT.md) 了解部署指南。

---

## 故障排查

### 常见问题

**HMR 不更新？**
- 检查 Network 标签中的 `__webpack_hmr` 连接
- 验证 HMR 服务器运行在 `:3001` 端口
- 参考 [HMR.md](./docs/HMR.md)

**水合不匹配错误？**
- 服务端和客户端必须渲染相同的 HTML
- 使用 `useEffect` 处理仅浏览器代码
- 参考 [ARCHITECTURE.md](./docs/ARCHITECTURE.md)

**SSR 错误？**
- 检查服务器终端的堆栈跟踪
- 在 `src/server/render.tsx` 中添加日志
- 参考 [STREAMING_SSR.md](./docs/STREAMING_SSR.md)

---

## 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

查看 [DEVELOPMENT.md](./docs/DEVELOPMENT.md) 了解编码规范。

---

## 许可证

本项目采用 ISC 许可证。

---

## 致谢

使用以下技术构建：

- [React 18](https://react.dev/) - UI 框架
- [React Router v7](https://reactrouter.com/) - 路由与 Data Router
- [Webpack 5](https://webpack.js.org/) - 模块打包器
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Koa](https://koajs.com/) - SSR 服务器框架
- [Express](https://expressjs.com/) - HMR 服务器框架

---

## 疑问？

- **项目总览**: 查看 [CLAUDE.md](./CLAUDE.md)
- **实现指南**: 查看 [PHASES.md](./docs/PHASES.md)
- **开发帮助**: 查看 [DEVELOPMENT.md](./docs/DEVELOPMENT.md)
- **HMR 问题**: 查看 [HMR.md](./docs/HMR.md)

---

<div align="center">

**使用 React 18 SSR 用心打造**

[⬆ 回到顶部](#react-18-ssr-项目)

</div>
