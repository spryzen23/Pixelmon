import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/screens/__tests__/setup.js'],
    include: [
      'src/screens/__tests__/**/*.{test,spec}.{js,jsx}',
      'src/game/**/*.{test,spec}.{js,jsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [
        'src/v2/**/*',
        'src/**/*.test.{js,jsx}',
        'src/screens/__tests__/**/*',
        'src/types/**/*',
        'src/server/**/*'
      ],
    },
  },
});
