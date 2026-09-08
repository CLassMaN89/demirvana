import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Geliştirme sunucusunda /api isteklerini PHP sunucusuna geçirerek tarayıcı CORS ayarına ihtiyaç bırakmaz.
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8080',
      '/dokumanlar': 'http://127.0.0.1:8080',
      // Sertifika PDF'leri de geliştirmede güvenli PHP dosya sunucusundan gelir.
      '/sertifika-dosyalari': 'http://127.0.0.1:8080',
      '/robots.txt': 'http://127.0.0.1:8080',
      '/sitemap.xml': 'http://127.0.0.1:8080'
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/kurulum.js',
    css: true
  }
});
