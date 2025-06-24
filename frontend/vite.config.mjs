import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = '/'; // ✅ Set base URL to root

  return {
    base: API_URL,
    server: {
      open: true,
      port: 3000,
      host: true,
    },
    preview: {
      open: true,
      host: true,
    },
    resolve: {
      alias: {
        pages: path.resolve(__dirname, 'src/pages'),
      },
    },
    build: {
      outDir: 'dist',
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    plugins: [react(), jsconfigPaths()],
  };
});
