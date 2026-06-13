import { useEffect, useState } from 'react';

const COMPACT_HEIGHT = 800;
const COMPACT_WIDTH = 1100;

export function useViewportLayout() {
  const [layout, setLayout] = useState(() => getLayout());

  useEffect(() => {
    const onResize = () => setLayout(getLayout());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return layout;
}

function getLayout() {
  if (typeof window === 'undefined') {
    return { mode: 'standard', isCompact: false, height: 1080, width: 1920 };
  }
  const height = window.innerHeight;
  const width = window.innerWidth;
  const isCompact = height <= COMPACT_HEIGHT || width <= COMPACT_WIDTH;
  return {
    mode: isCompact ? 'compact' : 'standard',
    isCompact,
    height,
    width,
  };
}
