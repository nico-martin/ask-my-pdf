import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import dotenv from 'dotenv';
import fs from 'fs';
import postcssNesting from 'postcss-nesting';
import postcssPresetEnv from 'postcss-preset-env';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';
import app from './app.json';
import htmlPlugin from 'vite-plugin-html-config';

dotenv.config();

const icons = [
  ...app.iconSizes.map((size) => ({
    src: `fav/icon/pwa-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any',
  })),
  ...app.iconSizes.map((size) => ({
    src: `fav/icon/maskable-icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'maskable',
  })),
  {
    src: 'fav/icon/icon.svg',
    type: 'image/svg+xml',
    sizes: '512x512',
  },
  {
    src: 'fav/icon/favicon.ico',
    sizes: '72x72 96x96 128x128 256x256',
  },
];

export default defineConfig({
  build: {
    target: 'es2022',
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
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
  plugins: [
    react(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      workbox: {
        cleanupOutdatedCaches: false,
      },
      manifest: {
        name: '',
        short_name: app.short,
        description: app.description,
        theme_color: app.color,
        background_color: app.colorbkg,
        start_url: '/',
        scope: '/',
        id: '/',
        icons,
      },
    }),
    svgr(),
    htmlPlugin({
      title: app.title,
      metas: [
        {
          name: 'description',
          content: app.description,
        },
        {
          name: 'og:image',
          content: '/facebook.jpg',
        },
        {
          name: 'og:title',
          content: app.title,
        },
        {
          name: 'og:description',
          content: app.description,
        },
        {
          name: 'og:locale',
          content: 'en_US',
        },
        {
          name: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:creator',
          content: '@nic_o_martin',
        },
        {
          name: 'twitter:title',
          content: app.title,
        },
        {
          name: 'twitter:description',
          content: app.description,
        },
        {
          name: 'twitter:image',
          content: '/twitter.jpg',
        },
      ],
    }),
  ],
});
