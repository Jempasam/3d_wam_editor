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
      name: "index",
      formats: ["es"],
    }
  },
  plugins: [ dts()]
});
