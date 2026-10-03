import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkDirective from 'remark-directive';
import { remarkPotDirectives } from './src/plugins/remark-directives.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://potandbalcony.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [remarkDirective, remarkPotDirectives],
    smartypants: true,
  },
});
