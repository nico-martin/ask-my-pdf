import { defineConfig } from '@vite-pwa/assets-generator/config';

import app from './app.json';

export default defineConfig({
  preset: {
    transparent: {
      sizes: app.iconSizes,
      favicons: [[64, 'favicon.ico']],
    },
    maskable: { sizes: app.iconSizes },
    apple: { sizes: [180] },
  },
  images: app.iconImages,
});
