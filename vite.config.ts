import react from "@vitejs/plugin-react";
import autoprefixer from "autoprefixer";
import dotenv from "dotenv";
import fs from "fs";
import postcssNesting from "postcss-nesting";
import postcssPresetEnv from "postcss-preset-env";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

dotenv.config();

export default defineConfig({
  build: {
    target: "es2022",
  },
  esbuild: {
    target: "es2022",
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2022",
    },
  },
  css: {
    postcss: {
      plugins: [postcssNesting, autoprefixer, postcssPresetEnv],
    },
  },
  server: {
    https: {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
    },
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  },
  plugins: [react(), tsconfigPaths(), svgr()],
});
