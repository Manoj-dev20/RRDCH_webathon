declare module '@splinetool/react-spline' {
  import { FC } from 'react';
  
  interface SplineProps {
    scene: string;
    style?: React.CSSProperties;
    className?: string;
    onLoad?: () => void;
    onError?: (error: Error) => void;
  }
  
  const Spline: FC<SplineProps>;
  export default Spline;
}
