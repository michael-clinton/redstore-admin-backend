import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path'; // Ensure the 'path' module is imported

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = '/admin-ui/'; // Set base URL for deployment

  return {
    base: API_URL, // Base path for all assets
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
        pages: path.resolve(__dirname, 'src/pages'), // Alias for pages directory
      },
    },
    build: {
      outDir: 'dist', // Ensure output goes to dist folder
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
    plugins: [react(), jsconfigPaths()], // React plugin and JS config paths
  };
}