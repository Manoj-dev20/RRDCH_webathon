import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

export default function SplineDNA() {
  return (
    <div style={{
      width: '100%',
      height: '500px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Suspense fallback={
        <div style={{
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
    </div>
  );
}
