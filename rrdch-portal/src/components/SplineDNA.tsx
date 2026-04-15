import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineDNA() {
  return (
    <div style={{
      width: '100%',
      height: '420px',
      borderRadius: '24px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Suspense fallback={
        <div style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.4)',
          fontSize: '14px'
        }}>
          Loading 3D model...
        </div>
      }>
        <Spline
          scene="https://prod.spline.design/lttPCd2miU4Keh-F/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </Suspense>

      {/* Gradient overlay at bottom to blend with hero */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(to top, rgba(26,82,118,0.6), transparent)',
        pointerEvents: 'none',
        borderRadius: '0 0 24px 24px'
      }} />
    </div>
  );
}
