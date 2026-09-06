import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Geliştirme sunucusunda /api isteklerini PHP sunucusuna geçirerek tarayıcı CORS ayarına ihtiyaç bırakmaz.
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8080'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/kurulum.js',
    css: true
  }
});
