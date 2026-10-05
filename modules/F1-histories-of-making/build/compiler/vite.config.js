import { defineConfig } from 'vite';
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0, modulePreload: false, chunkSizeWarningLimit: 900 },
});
