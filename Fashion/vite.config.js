import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:8080', // Spring Boot 서버
        changeOrigin: true,
        secure: false,
      },
    },
  },
});