/**
 * Vite Configuration
 * Production-ready build configuration with code splitting
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
    ],
    
    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    // Development server
    server: {
      host: '0.0.0.0',
      port: parseInt(env.VITE_PORT || '3000'),
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    
    // Production build
    build: {
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          // Manual chunking for optimal caching
          manualChunks: {
            // Core vendor chunks
            'vendor': ['react', 'react-dom'],
            'router': ['react-router-dom'],
            
            // UI libraries
            'ui': [
              '@radix-ui/react-dialog',
              '@radix-ui/react-dropdown-menu',
              '@radix-ui/react-select',
              '@radix-ui/react-tabs',
              '@radix-ui/react-toast',
            ],
            
            // Form handling
            'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
            
            // Editor (heavy, lazy-loaded)
            'editor': ['@monaco-editor/react'],
            
            // Utilities
            'utils': ['axios', 'date-fns', 'lucide-react'],
            
            // Charts (if using recharts)
            'charts': ['recharts'],
          },
          // Ensure chunk files have content hash for caching
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
      // Increase chunk size warning limit (for Monaco editor)
      chunkSizeWarningLimit: 1000,
    },
    
    // CSS configuration
    css: {
      devSourcemap: true,
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@monaco-editor/react',
        'axios',
        'date-fns',
        'lucide-react',
        'zustand',
        'immer',
      ],
    },
    
    // Preview server (for production build testing)
    preview: {
      port: 3000,
      host: true,
    },
  };
});
