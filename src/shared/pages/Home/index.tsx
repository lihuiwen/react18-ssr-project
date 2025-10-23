import React from 'react';
import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏠 Home Page</h1>
      <p>Welcome to React 18 SSR with Streaming!</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Features Implemented:</h2>
        <ul>
          <li>✅ Phase 1: Basic Config & Webpack Setup</li>
          <li>✅ Phase 2: Client-Side Rendering (CSR)</li>
          <li>✅ Phase 3: Basic SSR Implementation</li>
          <li>✅ Phase 4: React 18 Streaming SSR</li>
          <li>✅ Phase 5: HMR Dual-Server Architecture</li>
          <li>✅ Phase 6a: React Router Integration</li>
          <li>🚀 Phase 6b: Data Fetching with Loaders (Current)</li>
        </ul>
      </div>

      <nav style={{ marginTop: '30px' }}>
        <h3>Navigation:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
              🏠 Home
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/about" style={{ color: '#007bff', textDecoration: 'none' }}>
              ℹ️ About
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/product/1" style={{ color: '#007bff', textDecoration: 'none' }}>
              📦 Product: React 18 完全指南
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/product/123" style={{ color: '#007bff', textDecoration: 'none' }}>
              📚 Product: SSR 服务端渲染实战
            </Link>
          </li>
          <li style={{ marginBottom: '10px' }}>
            <Link to="/nonexistent" style={{ color: '#007bff', textDecoration: 'none' }}>
              ❌ 404 Page (Test)
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
