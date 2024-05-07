/// <reference types="vite-plugin-svgr/client" />

declare module '*.css' {
  const exports: { [exportName: string]: string };
  export = exports;
}
