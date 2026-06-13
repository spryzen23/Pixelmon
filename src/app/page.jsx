'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// We dynamically import the main App with SSR disabled to prevent Three.js and window errors
const App = dynamic(() => import('../App'), { ssr: false });

export default function GamePage() {
  useEffect(() => {
    // Dynamically import the polyfill only client-side to prevent Element is not defined on server
    import('three-html-render/polyfill').then(({ installHtmlInCanvasPolyfill }) => {
      installHtmlInCanvasPolyfill();
    });
  }, []);

  return <App />;
}
