import {defineConfig} from 'vite';
import mc from '@motion-canvas/vite-plugin';
const motionCanvas = (mc as any).default ?? mc;

// Builds the in-page player: player/index.html bundles @motion-canvas/player and loads the
// project bundle (built by `vite build`) from ./project.js beside it.
export default defineConfig({
  root: 'player',
  base: './',
  build: {outDir: '../dist/player', emptyOutDir: true},
});
