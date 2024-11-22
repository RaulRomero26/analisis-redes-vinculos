import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({
  base: './',
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Verificar que assetInfo.name no sea undefined
          if (assetInfo.name && /\.(gif|jpe?g|png|svg)$/.test(assetInfo.name)) {
            return 'assets/[name][extname]';
          }
          // Para otros tipos de archivos, puedes usar la configuración predeterminada
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
});