/**
 * Product Detail Page
 * Phase 6b: Demonstrates mixed data fetching strategy
 * - Loader data: Product basic info (SSR, SEO-critical)
 * - Suspense data: Reviews (SERVER-SIDE streaming, async)
 */

import { Suspense } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import type { Product, Review } from '../../api/mockData';
import { ReviewSkeleton } from '../../components/Loading/Skeleton';
import { fetchProductReviews } from '../../api/productApi';

// Cache for review resources to prevent re-creating promises
const reviewsCache = new Map<string, any>();

// Simple resource wrapper for Suspense (Phase 6b approach)
// This works on BOTH server and client for streaming SSR
function createReviewsResource(productId: string) {
  // Check cache first
  if (reviewsCache.has(productId)) {
    return reviewsCache.get(productId);
  }

  let status = 'pending';
  let result: any;
  let error: any;

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
      if (status === 'pending') throw suspender;
      if (status === 'error') throw error;
      return result;
    },
  };

  // Cache the resource
  reviewsCache.set(productId, resource);

  return resource;
}

// Server-side async Reviews Component using Suspense
// This component will suspend on server and stream when ready
function ProductReviews({ productId }: { productId: string }) {
  const reviewsResource = createReviewsResource(productId);
  const reviews = reviewsResource.read(); // This throws promise, triggering Suspense

  return (
    <div style={{ marginTop: '32px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>用户评价</h2>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
        {reviews.map((review: Review) => (
          <div
            key={review.id}
            style={{
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <strong>{review.author}</strong>
              <span style={{ color: '#f59e0b' }}>{'⭐'.repeat(review.rating)}</span>
            </div>
            <p style={{ color: '#666', margin: '8px 0' }}>{review.comment}</p>
            <span style={{ fontSize: '12px', color: '#999' }}>{review.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProductPage() {
  // Phase 6b: Use loader data from Data Router
  const product = useLoaderData() as Product;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← 返回首页
        </Link>
      </nav>

      {/* Product Info (from loader - SSR rendered) */}
      <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Product Image */}
          <div>
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
              }}
            />
          </div>

          {/* Product Details */}
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#333' }}>
              {product.name}
            </h1>

            <div style={{ fontSize: '28px', color: '#e74c3c', fontWeight: 'bold', marginBottom: '16px' }}>
              ¥{product.price.toFixed(2)}
            </div>

            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '20px' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px' }}>
              <div>
                <span style={{ color: '#999' }}>分类：</span>
                <strong>{product.category}</strong>
              </div>
              <div>
                <span style={{ color: '#999' }}>库存：</span>
                <strong style={{ color: product.stock > 10 ? '#10b981' : '#ef4444' }}>
                  {product.stock} 件
                </strong>
              </div>
            </div>

            <button
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '12px 32px',
                fontSize: '16px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              加入购物车
            </button>
          </div>
        </div>
      </div>

      {/* Reviews (SERVER-SIDE Suspense streaming) */}
      <Suspense fallback={
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>用户评价</h2>
          <div>
            <ReviewSkeleton />
            <ReviewSkeleton />
          </div>
        </div>
      }>
        <ProductReviews productId={product.id} />
      </Suspense>

      {/* Phase 6b Demo Info */}
      <div style={{ marginTop: '40px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #3b82f6' }}>
        <h3 style={{ color: '#1d4ed8', marginBottom: '8px' }}>📊 Phase 6b: React 18 Streaming SSR</h3>
        <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#475569' }}>
          <li><strong>Loader Data (SSR):</strong> 产品信息通过 loader 在服务端预加载</li>
          <li><strong>Suspense Streaming (SSR):</strong> 用户评价在服务端异步加载并流式输出</li>
          <li><strong>Shell First:</strong> HTML 分两次发送 - 先发 shell（骨架屏），后发评价内容</li>
          <li><strong>SEO Friendly:</strong> 所有内容都在服务端渲染，搜索引擎可完整抓取</li>
        </ul>
      </div>
    </div>
  );
}
