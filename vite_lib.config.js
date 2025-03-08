import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import dts from 'vite-plugin-dts'

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': true
    },
  },
  build: {
    lib:{
      entry: "src/index.ts",
      name: "wam3dgenerator",
      formats: ["es"],
      fileName: "index"
    },
    rollupOptions: {
      external: ['@babylonjs/core','@webaudiomodules/api']
    },
  },
  plugins: [ dts()]
});
