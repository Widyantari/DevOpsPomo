// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './setupTests.js', // tambahkan baris ini
    globals: true, // <-- TAMBAHKAN BARIS INI!
  },
})
