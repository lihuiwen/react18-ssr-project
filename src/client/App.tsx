import { Suspense } from 'react';
import Skeleton from '../shared/components/Loading/Skeleton';
import AsyncContent from '../shared/components/AsyncContent/AsyncContent';

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '800px' }}>
      {/* Shell content - sent immediately */}
      <h1>React 18 Streaming SSR Demo 🚀</h1>
      <p style={{ color: '#666' }}>
        This page demonstrates React 18's streaming SSR with Suspense boundaries.
      </p>
      <p style={{ color: '#666' }}>
        The shell (navigation/layout) is sent immediately, while deferred content streams in progressively.
      </p>

      <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1976d2' }}>✅ Shell Content</h2>
        <p style={{ margin: 0, color: '#555' }}>
          This content is sent immediately when the shell is ready (onShellReady).
        </p>
      </div>

      {/* Suspense boundary 1 - fast loading (1 second) */}
      <Suspense fallback={<Skeleton />}>
        <AsyncContent
          id="fast-content"
          delay={1000}
          title="⚡ Fast Loading Content (1s)"
        />
      </Suspense>

      {/* Suspense boundary 2 - slow loading (3 seconds) */}
      <Suspense fallback={<Skeleton />}>
        <AsyncContent
          id="slow-content"
          delay={3000}
          title="🐌 Slow Loading Content (3s)"
        />
      </Suspense>

      {/* Footer - part of shell */}
      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #ddd' }}>
        <p style={{ margin: 0, color: '#999', fontSize: '14px' }}>
          Phase 4: Streaming SSR with Suspense ✓
        </p>
      </div>
    </div>
  );
}

export default App;
