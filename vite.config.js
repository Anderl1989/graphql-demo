import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import graphqlLoader from 'vite-plugin-graphql-loader';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), graphqlLoader()],
  root: './frontend', // frontend is in a 'frontend' subfolder, so this is required for vite to find the frontend files
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
