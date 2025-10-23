/**
 * Loading Skeleton Components
 * Phase 6b: Displayed while Suspense boundaries are loading
 */

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  marginBottom?: string;
}

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  marginBottom = '0',
}: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        marginBottom,
        backgroundColor: '#e0e0e0',
        backgroundImage: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    >
      <style>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}

/**
 * Product Info Skeleton
 */
export function ProductSkeleton() {
  return (
    <div style={{ padding: '20px' }}>
      {/* Image skeleton */}
      <Skeleton width="100%" height="300px" marginBottom="20px" borderRadius="8px" />

      {/* Title skeleton */}
      <Skeleton width="60%" height="32px" marginBottom="16px" />

      {/* Price skeleton */}
      <Skeleton width="30%" height="28px" marginBottom="16px" />

      {/* Description skeleton */}
      <Skeleton width="100%" height="16px" marginBottom="8px" />
      <Skeleton width="100%" height="16px" marginBottom="8px" />
      <Skeleton width="80%" height="16px" marginBottom="16px" />

      {/* Meta info skeleton */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <Skeleton width="100px" height="20px" />
        <Skeleton width="100px" height="20px" />
      </div>
    </div>
  );
}

/**
 * Review Skeleton
 */
export function ReviewSkeleton() {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <Skeleton width="100px" height="20px" marginBottom="0" />
        <div style={{ marginLeft: '12px' }}>
          <Skeleton width="80px" height="16px" />
        </div>
      </div>
      <Skeleton width="100%" height="16px" marginBottom="8px" />
      <Skeleton width="100%" height="16px" marginBottom="8px" />
      <Skeleton width="60%" height="16px" />
    </div>
  );
}

/**
 * Recommendation Skeleton
 */
export function RecommendationSkeleton() {
  return (
    <div style={{ padding: '12px', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <Skeleton width="100%" height="150px" marginBottom="12px" borderRadius="4px" />
      <Skeleton width="80%" height="18px" marginBottom="8px" />
      <Skeleton width="40%" height="16px" />
    </div>
  );
}

export default Skeleton;
