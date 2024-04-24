import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import fs from 'fs';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

dotenv.config();

export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssNesting,
        autoprefixer,
        postcssPresetEnv,
      ],
    },
  },
  server: {
    https: {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
    },
    port: 3000,
  },
  plugins: [
    react(),
    tsconfigPaths(),
    svgr(),
  ],
});
