import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://soham.eu.cc',
  integrations: [react(), sitemap()],
  devToolbar: {
    enabled: false
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      target: 'esnext'
    }
  }
});
