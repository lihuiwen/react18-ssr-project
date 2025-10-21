/**
 * Async Content Component
 * Simulates async data fetching to demonstrate Suspense streaming
 *
 * Note: This uses useState/useEffect pattern for client-side loading
 * Server renders with fallback, client hydrates and loads data
 */

import { useState, useEffect } from 'react';

interface AsyncContentProps {
  id: string;
  delay?: number;
  title: string;
}

export function AsyncContent({ id, delay = 2000, title }: AsyncContentProps) {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate async data fetching (only runs on client)
    const timer = setTimeout(() => {
      setData(`Data for ${id} (loaded after ${delay}ms on client)`);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [id, delay]);

  if (isLoading || !data) {
    // This will be rendered during SSR and initial client render
    return null; // Suspense fallback will show instead
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
        ✅ Loaded on client after hydration
      </p>
    </div>
  );
}

export default AsyncContent;
