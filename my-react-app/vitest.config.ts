import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // gør describe/it/expect globale
    environment: 'jsdom', // simulerer browser
    setupFiles: './src/setupTests.ts', // optional, til global opsætning
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
  },
})
