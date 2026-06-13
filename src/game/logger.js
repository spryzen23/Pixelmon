const isDev = process.env.NODE_ENV !== 'production';

export function logDebug(...args) {
  if (isDev) {
     
    console.debug('[pixelmon]', ...args);
  }
}

export function logWarn(...args) {
   
  console.warn('[pixelmon]', ...args);
}

export function logError(...args) {
   
  console.error('[pixelmon]', ...args);
}
