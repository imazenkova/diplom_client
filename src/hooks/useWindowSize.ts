// useWindowSize.ts
import { useState, useEffect } from 'react';

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    widthWin: window.innerWidth,
    heightWin: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        widthWin: window.innerWidth,
        heightWin: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
