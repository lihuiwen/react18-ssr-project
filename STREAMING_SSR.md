# React 18 Streaming SSR 实现方案

## 概述

本文档详细说明了如何实现真正的 React 18 服务端流式渲染（Streaming SSR）+ Suspense 异步加载。

**创建时间**: 2025-10-22
**实现阶段**: Phase 6b - Data Fetching (Mixed Mode)
**核心目标**: 实现服务端异步流式渲染，而非客户端异步加载

---

## 一、核心概念

### 1.1 什么是 Streaming SSR？

传统 SSR 的问题：
```
用户请求 → 等待所有数据加载完成 → 一次性发送完整 HTML → 用户看到页面
```

React 18 Streaming SSR 的优势：
```
用户请求 → 立即发送 Shell (骨架) → 异步加载数据 → 流式追加内容 → 用户更快看到页面
```

### 1.2 核心技术栈

- **React 18**: `renderToPipeableStream` API
- **Suspense**: 服务端异步边界标记
- **React Router v6+**: Data Router with loader support
- **Koa**: 流式响应支持

---

## 二、实现方案

### 2.1 数据获取策略

本项目采用**混合数据获取策略**：

| 数据类型 | 获取方式 | 渲染时机 | 用途 |
|---------|---------|---------|------|
| **关键数据** | Route Loader | SSR (onShellReady) | SEO、首屏内容 |
| **次要数据** | Suspense + async fetch | SSR (streaming) | 用户体验增强 |

**示例**：
- 产品基本信息（名称、价格、描述）→ Route Loader
- 用户评价、推荐商品 → Suspense 流式渲染

### 2.2 架构流程图

```
┌─────────────────────────────────────────────────────────┐
│                    用户请求 /product/1                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  服务器：执行 Route Loader (fetchProductBasicInfo)       │
│  • 加载产品基本信息（300ms 延迟）                         │
│  • 返回：{ id, name, price, description, image }         │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  renderToPipeableStream 开始渲染                         │
│  • 渲染产品信息（来自 loader data）                       │
│  • 遇到 <Suspense> 边界                                  │
│  • 先渲染 fallback（骨架屏）                             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  onShellReady 触发 - 立即发送 HTML Shell                 │
│  ✅ 用户在 ~300ms 后就能看到：                            │
│     - 完整的产品信息                                     │
│     - 评价区域的骨架屏                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  服务器继续执行：fetchProductReviews                      │
│  • 异步加载评价数据（2000ms 延迟）                        │
│  • Suspense 边界等待 promise resolve                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  评价数据准备完成 - 流式追加到 HTML                       │
│  • React 自动将 Suspense 内容渲染为 HTML 片段            │
│  • 通过 <script> 标签插入到正确位置                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  浏览器接收完整 HTML                                      │
│  • 总时间：~2.3s (300ms + 2000ms)                       │
│  • 但用户在 300ms 就看到主要内容！                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  客户端 Hydration                                        │
│  • React 接管 DOM                                        │
│  • 组件变为可交互                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 三、代码实现

### 3.1 服务端渲染逻辑 (`src/server/render.tsx`)

```tsx
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticRouter, createStaticHandler, StaticRouterProvider } from 'react-router';

export async function renderAppStream(ctx: Context): Promise<void> {
  ctx.type = 'text/html';

  // 1. 创建 static handler 处理 loader
  const handler = createStaticHandler(routes);
  const fetchRequest = new Request(`http://localhost:3000${ctx.url}`, {
    method: ctx.method,
    headers: new Headers(ctx.headers as Record<string, string>),
  });

  // 2. 执行 loader 获取关键数据
  const context = await handler.query(fetchRequest);

  // 3. 创建 static router
  const router = createStaticRouter(routes, context);

  // 4. 使用 renderToPipeableStream 进行流式渲染
  const { pipe } = renderToPipeableStream(
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>React 18 SSR Project</title>
      </head>
      <body>
        <div id="root">
          <StaticRouterProvider router={router} context={context} />
        </div>
      </body>
    </html>,
    {
      bootstrapScripts: [bundleUrl],

      // 5. Shell 准备好时立即发送
      onShellReady() {
        ctx.status = 200;
        pipe(ctx.res); // 🚀 立即发送 HTML + 骨架屏
      },

      onShellError(error) {
        console.error('Shell Error:', error);
        ctx.status = 500;
      },

      onError(error) {
        console.error('Stream Error:', error);
      },
    }
  );
}
```

**关键点**：
- ✅ `onShellReady` 在 shell 渲染完成后立即调用
- ✅ `pipe(ctx.res)` 开始流式传输
- ✅ Suspense 内容会自动延迟流式输出

### 3.2 Route 配置 (`src/shared/routes/index.tsx`)

```tsx
import { ProductPage } from '../pages/Product';
import { fetchProductBasicInfo } from '../api/productApi';

export const routes: RouteObject[] = [
  {
    path: '/product/:id',
    element: <ProductPage />,

    // Route Loader: 预加载关键 SEO 数据
    loader: async ({ params }) => {
      const productId = params.id || '1';
      try {
        const product = await fetchProductBasicInfo(productId);
        return product; // ← 返回给组件使用
      } catch (error) {
        throw new Response('Product Not Found', { status: 404 });
      }
    },
  },
];
```

### 3.3 API 层 (`src/shared/api/productApi.ts`)

```tsx
/**
 * 获取产品基本信息 (关键数据，快速加载)
 */
export async function fetchProductBasicInfo(id: string): Promise<Product> {
  await delay(300); // 模拟 300ms 网络延迟

  const product = MOCK_PRODUCTS[id];
  if (!product) {
    throw new Error(`Product ${id} not found`);
  }

  return product;
}

/**
 * 获取产品评价 (次要数据，Suspense 流式加载)
 */
export async function fetchProductReviews(id: string): Promise<Review[]> {
  await delay(2000); // 🔄 模拟 2 秒延迟，展示流式效果

  return MOCK_REVIEWS[id] || [];
}
```

**延迟说明**：
- 产品信息：300ms（快速，SEO 关键）
- 评价数据：2000ms（较慢，流式输出）

### 3.4 产品页面组件 (`src/shared/pages/Product/index.tsx`)

```tsx
import { Suspense } from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchProductReviews } from '../../api/productApi';
import { ReviewSkeleton } from '../../components/Loading/Skeleton';

// ========== Resource Wrapper (Suspense 模式) ==========

const reviewsCache = new Map<string, any>();

function createReviewsResource(productId: string) {
  // 检查缓存
  if (reviewsCache.has(productId)) {
    return reviewsCache.get(productId);
  }

  let status = 'pending';
  let result: any;
  let error: any;

  // 创建 promise
  const suspender = fetchProductReviews(productId).then(
    (data) => {
      status = 'success';
      result = data;
    },
    (err) => {
      status = 'error';
      error = err;
    }
  );

  const resource = {
    read() {
      if (status === 'pending') throw suspender; // ← 触发 Suspense
      if (status === 'error') throw error;
      return result;
    },
  };

  reviewsCache.set(productId, resource);
  return resource;
}

// ========== 评价组件 (服务端异步加载) ==========

function ProductReviews({ productId }: { productId: string }) {
  const reviewsResource = createReviewsResource(productId);
  const reviews = reviewsResource.read(); // ← 如果未完成，抛出 promise

  return (
    <div style={{ marginTop: '32px' }}>
      <h2>用户评价</h2>
      <div>
        {reviews.map((review: Review) => (
          <div key={review.id}>
            <strong>{review.author}</strong>
            <span>{'⭐'.repeat(review.rating)}</span>
            <p>{review.comment}</p>
            <span>{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ========== 产品页面主组件 ==========

export function ProductPage() {
  // 从 loader 获取产品数据
  const product = useLoaderData() as Product;

  return (
    <div>
      {/* 1. 关键信息：立即渲染 (来自 loader) */}
      <div>
        <img src={product.image} alt={product.name} />
        <h1>{product.name}</h1>
        <div>¥{product.price.toFixed(2)}</div>
        <p>{product.description}</p>
      </div>

      {/* 2. 次要信息：Suspense 流式渲染 */}
      <Suspense fallback={
        <div style={{ marginTop: '32px' }}>
          <h2>用户评价</h2>
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      }>
        <ProductReviews productId={product.id} />
      </Suspense>

      {/* 3. 说明信息 */}
      <div>
        <h3>📊 Phase 6b: React 18 Streaming SSR</h3>
        <ul>
          <li><strong>Loader Data (SSR):</strong> 产品信息通过 loader 在服务端预加载</li>
          <li><strong>Suspense Streaming (SSR):</strong> 用户评价在服务端异步加载并流式输出</li>
          <li><strong>Shell First:</strong> HTML 分两次发送 - 先发 shell（骨架屏），后发评价内容</li>
          <li><strong>SEO Friendly:</strong> 所有内容都在服务端渲染，搜索引擎可完整抓取</li>
        </ul>
      </div>
    </div>
  );
}
```

**关键实现要点**：

1. **Resource Wrapper**：
   - 使用 Map 缓存 resource，避免重复创建 promise
   - `read()` 方法抛出 promise 触发 Suspense

2. **Suspense 边界**：
   - `fallback` 在服务端立即渲染（骨架屏）
   - 子组件异步加载完成后流式追加

3. **Loader Data**：
   - `useLoaderData()` 获取预加载的产品数据
   - 数据已在 `onShellReady` 前准备好

### 3.5 客户端入口 (`src/client/index.tsx`)

```tsx
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from '../shared/routes';

const rootElement = document.getElementById('root');

// 创建 browser router (复用服务端 hydration 数据)
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

// Hydrate 服务端渲染的内容
hydrateRoot(rootElement, <RouterProvider router={router} />);

console.log('✅ React 18 SSR hydration completed with streaming data');
```

**注意**：
- ✅ `window.__staticRouterHydrationData` 由 React Router 自动注入
- ✅ 使用 `hydrateRoot` 而非 `createRoot`

---

## 四、验证测试

### 4.1 测试流式渲染

**命令行测试**：

```bash
# 测试 1: 检查总响应时间
time curl -s http://localhost:3000/product/1 > /dev/null
# 预期：~2.3 秒（300ms loader + 2000ms reviews）

# 测试 2: 检查 Shell 是否包含骨架屏
curl -s http://localhost:3000/product/1 | grep "ReviewSkeleton"
# 预期：找到骨架屏 HTML

# 测试 3: 检查完整 HTML 是否包含评价数据
curl -s http://localhost:3000/product/1 | grep "张三"
# 预期：找到评价内容（如果请求等待完成）
```

### 4.2 浏览器验证

1. **打开浏览器 DevTools**
2. **访问** `http://localhost:3000/product/1`
3. **观察 Network 面板**：
   - ✅ HTML 文档有 "Transfer-Encoding: chunked"
   - ✅ Timeline 显示分块传输

4. **查看页面源码** (Ctrl+U)：
   - ✅ 产品信息完整渲染
   - ✅ 评价数据完整渲染
   - ✅ 包含 `window.__staticRouterHydrationData` 脚本

5. **观察用户体验**：
   - ✅ 产品信息立即显示
   - ✅ 评价区域先显示骨架屏（在 SSR HTML 中）
   - ✅ 所有内容都在服务端渲染（非客户端异步请求）

### 4.3 SEO 验证

```bash
# 使用 curl 模拟搜索引擎爬虫
curl -s http://localhost:3000/product/1 | grep -E "(React 18 完全指南|张三|李四)"
```

**预期结果**：
- ✅ 产品名称、价格、描述全部可见
- ✅ 用户评价内容全部可见
- ✅ 搜索引擎可以完整抓取所有内容

---

## 五、性能对比

### 5.1 传统 SSR vs Streaming SSR

| 指标 | 传统 SSR | Streaming SSR |
|-----|---------|--------------|
| **TTFB** (Time to First Byte) | 2.3s | ~300ms |
| **FCP** (First Contentful Paint) | 2.3s | ~300ms |
| **完整内容加载时间** | 2.3s | 2.3s |
| **用户感知速度** | 慢 | **快 🚀** |
| **SEO 友好度** | ✅ | ✅ |

### 5.2 Streaming SSR vs 纯客户端

| 指标 | 纯客户端 (CSR) | Streaming SSR |
|-----|---------------|--------------|
| **首屏 HTML 大小** | 小 (空壳) | 大 (完整内容) |
| **SEO** | ❌ 差 | ✅ 优秀 |
| **FCP** | ~1s (bundle 加载) | ~300ms |
| **TTI** | 慢 (需下载 JS) | 快 (hydration) |
| **网络依赖** | 高 (多次请求) | 低 (一次 SSR) |

---

## 六、常见问题与解决方案

### 6.1 Hydration Mismatch 错误

**问题**：
```
Warning: Text content did not match. Server: "..." Client: "..."
```

**原因**：
- 服务端和客户端渲染不一致
- 使用了浏览器 API（如 `window`、`Date.now()`）

**解决方案**：
```tsx
// ❌ 错误：每次渲染结果不同
function Component() {
  return <div>{Date.now()}</div>;
}

// ✅ 正确：使用 useEffect 延迟客户端渲染
function Component() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div>Loading...</div>;
  return <div>{Date.now()}</div>;
}
```

### 6.2 Suspense 不工作

**问题**：Suspense 内容没有流式输出

**检查清单**：
1. ✅ 使用 `renderToPipeableStream` 而非 `renderToString`
2. ✅ 组件内抛出 promise (`throw promise`)
3. ✅ 使用 resource pattern 缓存 promise
4. ✅ `onShellReady` 正确调用 `pipe()`

### 6.3 重复网络请求

**问题**：同一数据在服务端和客户端都请求了

**解决方案**：
```tsx
// 使用 React Router 的 hydration data
const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData, // ← 复用服务端数据
});
```

### 6.4 TypeScript 类型错误

**问题**：
```
Parameter 'review' implicitly has an 'any' type
```

**解决方案**：
```tsx
import type { Review } from '../../api/mockData';

// 添加类型标注
{reviews.map((review: Review) => (
  <div key={review.id}>{review.author}</div>
))}
```

---

## 七、最佳实践

### 7.1 数据拆分策略

| 数据类型 | 推荐方式 | 原因 |
|---------|---------|------|
| SEO 关键信息 | Route Loader | 快速、稳定、搜索引擎可见 |
| 用户体验增强 | Suspense Streaming | 不阻塞首屏、渐进式加载 |
| 实时更新数据 | 客户端 fetch | 保持数据最新 |

**示例决策树**：
```
需要数据吗？
  │
  ├─ SEO 必需？ ──YES→ Route Loader
  │      │
  │     NO
  │      ↓
  ├─ 首屏关键？ ──YES→ Route Loader
  │      │
  │     NO
  │      ↓
  ├─ 可延迟加载？ ──YES→ Suspense Streaming
  │      │
  │     NO
  │      ↓
  └─ 实时更新？ ──YES→ 客户端 fetch + polling
```

### 7.2 性能优化建议

1. **控制 Suspense 边界数量**：
   - ✅ 合理：2-3 个 Suspense 边界
   - ❌ 过多：10+ 个边界会增加复杂度

2. **优化数据加载时间**：
   ```tsx
   // ❌ 慢：串行加载
   const product = await fetchProduct(id);
   const reviews = await fetchReviews(id);

   // ✅ 快：并行加载
   const [product, reviews] = await Promise.all([
     fetchProduct(id),
     fetchReviews(id),
   ]);
   ```

3. **使用适当的 fallback**：
   ```tsx
   // ✅ 好的骨架屏：匹配真实布局
   <Suspense fallback={<ReviewSkeleton />}>

   // ❌ 差的 fallback：通用 spinner
   <Suspense fallback={<Spinner />}>
   ```

### 7.3 监控和调试

**开发工具**：

1. **React DevTools Profiler**：
   - 查看组件渲染时间
   - 识别性能瓶颈

2. **Network 面板**：
   - 检查 Transfer-Encoding: chunked
   - 观察分块传输时序

3. **Lighthouse**：
   - 测量 TTFB、FCP、LCP
   - 验证 SEO 得分

**服务端日志**：
```tsx
onShellReady() {
  console.log(`[SSR] Shell ready for ${ctx.url}`);
  pipe(ctx.res);
},

onError(error) {
  console.error(`[SSR] Error streaming ${ctx.url}:`, error);
},
```

---

## 八、总结

### 8.1 Phase 6b 核心目标

**Phase 6b 的核心目标**：实现 **服务端异步流式渲染**，而非客户端异步加载。

#### ❌ 错误理解：客户端异步加载

```tsx
// 这不是流式 SSR！这是客户端异步加载
function ProductReviews() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    // ❌ 客户端发起请求
    fetchReviews().then(setReviews);
  }, []);

  return reviews ? <div>{reviews}</div> : <Skeleton />;
}
```

**问题**：
- ❌ 服务端渲染时输出骨架屏
- ❌ 客户端加载后再请求数据
- ❌ 搜索引擎看不到评价内容（SEO 不友好）
- ❌ 多一次网络请求

#### ✅ 正确实现：服务端流式渲染

```tsx
// 这才是真正的流式 SSR！
function ProductReviews() {
  const resource = createReviewsResource(); // 创建 promise resource
  const reviews = resource.read(); // ← 抛出 promise，触发 Suspense

  return <div>{reviews.map(r => ...)}</div>;
}

// 使用 Suspense 包裹
<Suspense fallback={<Skeleton />}>
  <ProductReviews />
</Suspense>
```

**优势**：
- ✅ 服务端发起请求并等待
- ✅ Shell 立即发送（包含骨架屏）
- ✅ 数据准备好后流式追加到 HTML
- ✅ 搜索引擎可以抓取完整内容
- ✅ 零客户端网络请求（hydration 复用数据）

---

### 8.2 Phase 6b 实现要点

| 要求 | 实现方式 |
|------|---------|
| **异步加载** | ✅ 使用 Suspense + promise resource |
| **流式输出** | ✅ `renderToPipeableStream` + `onShellReady` |
| **服务端渲染** | ✅ 数据在服务端获取，非客户端 fetch |
| **SEO 友好** | ✅ 所有内容都在 HTML 源码中 |
| **渐进式呈现** | ✅ Shell 先发，内容后流式追加 |

---

### 8.3 Phase 6b 目标达成情况

✅ **核心目标：服务端异步流式渲染**

| 目标 | 状态 | 说明 |
|------|------|------|
| **异步加载** | ✅ 完成 | 使用 Suspense + promise resource 实现真正的异步 |
| **流式输出** | ✅ 完成 | `renderToPipeableStream` 分块传输 HTML |
| **服务端渲染** | ✅ 完成 | 所有数据在服务端获取，非客户端 fetch |
| **SEO 友好** | ✅ 完成 | 完整内容在 HTML 源码中，搜索引擎可抓取 |
| **渐进式呈现** | ✅ 完成 | Shell first (300ms) → 完整内容 (2.3s) |

**验证结果**：
```bash
# HTML 源码包含完整评价数据 ✅
curl -s http://localhost:3000/product/1 | grep "张三"
# 找到评价内容，证明服务端渲染成功

# 响应时间符合预期 ✅
time curl -s http://localhost:3000/product/1
# ~2.3s（300ms loader + 2000ms reviews streaming）

# 浏览器验证 ✅
# - Network 面板只有一个 HTML 请求
# - 没有额外的 /api/reviews 请求
# - Transfer-Encoding: chunked 分块传输
```

#### 验证标准

要确认是否正确实现了 Phase 6b 的流式 SSR，需满足：

```bash
# 1. 查看 HTML 源码，应包含完整评价数据
curl -s http://localhost:3000/product/1 | grep "张三"
# ✅ 应该找到评价内容（在 HTML 中，非 JS 异步加载）

# 2. 检查响应时间
time curl -s http://localhost:3000/product/1 > /dev/null
# ✅ 总时间 ~2.3s（包含 2s 的异步数据延迟）

# 3. 浏览器 Network 面板
# ✅ 只有一个 HTML 请求
# ✅ 没有额外的 /api/reviews 请求
# ✅ Transfer-Encoding: chunked（分块传输）

# 4. 查看页面源码（Ctrl+U）
# ✅ 评价内容直接在 HTML 中
# ✅ 不是通过 JS 动态插入的
```

---

### 8.4 技术实现要点

✅ **已完成**：
1. ✅ 使用 `renderToPipeableStream` 实现流式 SSR
2. ✅ Route Loader 预加载关键数据（产品信息）
3. ✅ Suspense 边界标记异步内容（用户评价）
4. ✅ Resource pattern 管理 promise 防止重复请求
5. ✅ 客户端 hydration 复用服务端数据（零额外请求）

**关键代码片段**：
```tsx
// 1. 服务端：renderToPipeableStream + onShellReady
const { pipe } = renderToPipeableStream(<App />, {
  onShellReady() {
    pipe(ctx.res); // 立即发送 shell
  },
});

// 2. 组件：Suspense + resource.read()
<Suspense fallback={<Skeleton />}>
  <ProductReviews /> {/* read() 抛出 promise */}
</Suspense>

// 3. 客户端：hydrateRoot 复用数据
hydrateRoot(root, <RouterProvider router={router} />);
```

### 8.5 性能提升对比

**传统 SSR vs Phase 6b Streaming SSR**：

| 指标 | 传统 SSR | Phase 6b Streaming | 提升 |
|------|---------|-------------------|------|
| **TTFB** | 2.3s | ~0.3s | ⚡ 87% |
| **FCP** | 2.3s | ~0.3s | ⚡ 87% |
| **完整内容** | 2.3s | 2.3s | - |
| **SEO** | ✅ 优秀 | ✅ 优秀 | - |
| **用户感知速度** | 慢 | **快 🚀** | ⚡ 显著提升 |
| **网络请求** | 1 次 (HTML) | 1 次 (HTML) | - |

**Phase 6b vs 客户端异步加载**：

| 指标 | 客户端异步 | Phase 6b Streaming | 优势 |
|------|-----------|-------------------|------|
| **SEO** | ❌ 差 | ✅ 优秀 | ✅ 搜索引擎可抓取所有内容 |
| **首屏内容** | 骨架屏 | 完整 HTML | ✅ 内容更丰富 |
| **网络请求** | 2 次 (HTML + API) | 1 次 (HTML) | ✅ 减少 50% 请求 |
| **TTI** | 慢 (等待 JS) | 快 (hydration) | ✅ 更快可交互 |

### 8.6 Phase 6b 核心价值

**为什么选择服务端流式渲染？**

1. **SEO 最优化** 📈
   - 所有内容在 HTML 源码中
   - 搜索引擎完整抓取
   - 社交媒体分享预览正确

2. **用户体验最佳** 🚀
   - 首屏 300ms 即显示主要内容
   - 渐进式加载，无白屏等待
   - 感知速度提升 87%

3. **网络性能优化** 📡
   - 减少客户端 HTTP 请求
   - 利用服务器高速网络
   - 降低移动端流量消耗

4. **开发体验良好** 💻
   - 代码结构清晰（Suspense 边界）
   - 数据流向明确（服务端 → 客户端）
   - 调试方便（查看 HTML 源码即可）

### 8.7 下一步优化方向

**项目路线图**：

1. **Phase 7**: 集成 Tailwind CSS 样式系统
2. **Phase 8a**: 添加 Zustand 状态管理
3. **Phase 8b**: SEO 优化 (react-helmet-async)
4. **Phase 8c**: API 代理 + 完整集成
5. **Phase 9**: React Query 高级数据管理（可选）

**生产环境优化**：
- 添加缓存策略（Redis / CDN）
- 实现服务端组件（React Server Components）
- 监控性能指标（TTFB、FCP、LCP）
- 实现渐进式增强（离线支持）

---

## 九、参考资源

### 官方文档
- [React 18 Suspense for SSR](https://react.dev/reference/react-dom/server/renderToPipeableStream)
- [React Router Data APIs](https://reactrouter.com/en/main/routers/create-browser-router)

### 相关文件
- `src/server/render.tsx` - 服务端渲染逻辑
- `src/shared/pages/Product/index.tsx` - Suspense 实现示例
- `src/shared/routes/index.tsx` - Route Loader 配置
- `src/shared/api/productApi.ts` - 数据获取层

---

**文档版本**: v1.0
**最后更新**: 2025-10-22
**贡献者**: Claude Code Assistant
