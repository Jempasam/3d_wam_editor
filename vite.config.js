import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  base: './',
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build: {
    outDir: 'app',
    rollupOptions: {
      input: ["index.html", "generate_2d.html", "generate_3d.html", "src/index.ts"],
    }
  }
});
