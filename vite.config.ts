import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Crucial for Capacitor: allows assets to be loaded from relative paths (file://)
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  // Polyfill process.env to prevent "process is not defined" crashes in the browser/webview
  define: {
    'process.env': {
      API_KEY: process.env.API_KEY || '' 
    }
  },
  build: {
    outDir: 'dist',
  }
});