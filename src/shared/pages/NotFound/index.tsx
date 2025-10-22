import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      marginTop: '50px'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0' }}>404</h1>
      <h2>Page Not Found</h2>
      <p style={{ color: '#666', marginTop: '20px' }}>
        The page you're looking for doesn't exist.
      </p>

      <div style={{ marginTop: '30px' }}>
        <Link
          to="/"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            padding: '10px 20px',
            border: '2px solid #007bff',
            borderRadius: '5px',
            display: 'inline-block'
          }}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
