/**
 * Async Content Component
 * Simulates async data fetching to demonstrate client-side async rendering
 *
 * Note: For Phase 5, we're using client-side data fetching with useEffect
 * True SSR streaming with Suspense will be implemented in later phases
 */

import { useState, useEffect } from 'react';

interface AsyncContentProps {
  id: string;
  delay?: number;
  title: string;
}

export function AsyncContent({ id, delay = 2000, title }: AsyncContentProps) {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`🔄 Loading ${id}...`);
    setLoading(true);

    const timer = setTimeout(() => {
      setData(`Data for ${id} (loaded after ${delay}ms)`);
      setLoading(false);
      console.log(`✅ ${id} loaded!`);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay]);

  // Show loading state during client-side fetch
  if (loading) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px',
        marginTop: '16px',
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#856404' }}>{title}</h3>
        <p style={{ margin: 0, color: '#856404' }}>⏳ Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e8f5e9',
      borderRadius: '8px',
      marginTop: '16px',
    }}>
      <h3 style={{ margin: '0 0 12px 0', color: '#2e7d32' }}>{title}</h3>
      <p style={{ margin: 0, color: '#555' }}>{data}</p>
      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#888' }}>
        ✅ Streamed from server
      </p>
    </div>
  );
}

export default AsyncContent;
