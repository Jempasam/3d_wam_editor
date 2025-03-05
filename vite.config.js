import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  esbuild: {
    supported: {
      'top-level-await': false
    },
  }
});
