import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/': {
        target: 'http://localhost:4200',
        changeOrigin: true,
        secure: false
      }
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 4200,
    origin: 'http://localhost:4200',
    hmr: {
      clientPort: 4200
    }
  },
  optimizeDeps: {
  },
  cacheDir: null,
  build: {
    cache: false
  }
}); 