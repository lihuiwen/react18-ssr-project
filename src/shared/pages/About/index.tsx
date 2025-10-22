import React from 'react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>ℹ️ About Page</h1>
      <p>This is a React 18 Server-Side Rendering (SSR) project with modern architecture.</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Architecture Highlights:</h2>
        <ul>
          <li><strong>Dual-Server Architecture:</strong> HMR Server (3001) + SSR Server (3000)</li>
          <li><strong>Streaming SSR:</strong> Progressive rendering with React 18</li>
          <li><strong>Hot Module Replacement:</strong> Fast development workflow</li>
          <li><strong>React Router v6:</strong> Client and server-side routing</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Technology Stack:</h3>
        <ul>
          <li>React 18 with TypeScript</li>
          <li>Webpack 5</li>
          <li>Koa.js (SSR Server)</li>
          <li>Express.js (HMR Server)</li>
          <li>React Router v6</li>
        </ul>
      </div>

      <nav style={{ marginTop: '30px' }}>
        <Link to="/" style={{ color: '#007bff', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </nav>
    </div>
  );
}
