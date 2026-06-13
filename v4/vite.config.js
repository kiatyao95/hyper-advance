import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function shouldFallback(url = '') {
  const path = url.split('?')[0];
  if (path === '/' || path === '/index.html') return true;
  if (path.startsWith('/assets') || path.startsWith('/data') || path.endsWith('.html')) return false;
  if (path.includes('.')) return false;
  return ['/projects', '/systems', '/distributors'].includes(path) || path.startsWith('/system/') || path.startsWith('/distributor/');
}

const base = process.env.GITHUB_PAGES === 'true' ? '/hyper-advance/' : '/';

export default defineConfig({
  base,
  root: '.',
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (shouldFallback(req.url)) req.url = '/index.html';
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (shouldFallback(req.url)) req.url = '/index.html';
          next();
        });
      },
    },
  ],
  publicDir: 'public',
  build: {
    rollupOptions: {
      input: 'index.html',
    },
  },
  preview: {
    open: '/index.html',
  },
  server: {
    open: '/index.html',
  },
});
