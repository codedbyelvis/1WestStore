// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  site: "https://elvis-astro-tut.netlify.app/",
  
  // 1. Enable Server-Side Rendering (SSR) for API routes & backend file writing
  output: 'server',
  
  // 2. Configure the Node adapter so Astro knows how to build for a Node server environment
  adapter: node({
    mode: 'standalone',
  }),

  // 3. Your existing project integrations
  integrations: [react(), markdoc(), keystatic()],
  vite: {
    optimizeDeps: {
      include: ['lodash.debounce', 'lodash'],
    },
  },
});