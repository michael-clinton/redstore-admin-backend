import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import jsconfigPaths from 'vite-jsconfig-paths';
import path from 'path'; // Ensure the 'path' module is imported

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const API_URL = env.VITE_APP_BASE_NAME || '/'; // Fallback to root if VITE_APP_BASE_NAME is undefined
  const PORT = 3000;

  return {
    server: {
      open: true, // Automatically opens the browser
      port: PORT, // Sets the default port
      host: true, // Allows access from the network
    },
    preview: {
      open: true,
      host: true,
    },
    define: {
      global: 'window', // Adds global variable compatibility
    },
    resolve: {
      alias: {
        pages: path.resolve(__dirname, 'src/pages'), // Alias for pages directory
      },
    },
    base: API_URL, // Base URL for the project
    plugins: [react(), jsconfigPaths()], // React plugin and JS config paths
  };
});
