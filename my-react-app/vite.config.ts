import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/// <reference types="vitest" />

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // så vi kan bruge describe/it uden import
    environment: 'jsdom',    // simulerer browser-miljø
    setupFiles: './src/setupTests.ts', // opsætning (jest-dom mm.)
  },
});
