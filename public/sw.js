import { clientsClaim, skipWaiting } from 'workbox-core';
import { createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

skipWaiting();
clientsClaim();

registerRoute(
  new RegExp(/\.(?:png|gif|jpg|svg|ico|webp)$/),
  new CacheFirst({
    cacheName: 'image-cache',
  }),
  'GET'
);

// The precache routes for workbox-webpack-plugin
precacheAndRoute(self.__WB_MANIFEST);
const handler = createHandlerBoundToURL('/index.html');
const navigationRoute = new NavigationRoute(handler);
registerRoute(navigationRoute);
