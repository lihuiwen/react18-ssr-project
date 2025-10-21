/**
 * Loading Skeleton Component
 * Displayed while Suspense boundaries are loading
 */

export function Skeleton() {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f0f0f0',
      borderRadius: '8px',
      animation: 'pulse 1.5s ease-in-out infinite',
    }}>
      <div style={{
        height: '24px',
        width: '60%',
        backgroundColor: '#d0d0d0',
        borderRadius: '4px',
        marginBottom: '12px',
      }} />
      <div style={{
        height: '16px',
        width: '80%',
        backgroundColor: '#d0d0d0',
        borderRadius: '4px',
        marginBottom: '8px',
      }} />
      <div style={{
        height: '16px',
        width: '70%',
        backgroundColor: '#d0d0d0',
        borderRadius: '4px',
      }} />
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default Skeleton;
