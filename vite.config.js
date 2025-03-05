import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build: {
    rollupOptions: {
      input: ["index.html", "generate_2d.html", "generate_3d.html", "src/index.ts"],
    }
  }
});
