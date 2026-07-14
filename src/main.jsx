import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { installHtmlInCanvasPolyfill } from 'three-html-render/polyfill';
import App from './App';
import './index.css';

installHtmlInCanvasPolyfill();


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
