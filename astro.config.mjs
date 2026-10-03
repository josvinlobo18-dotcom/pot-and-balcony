import { defineConfig } from 'astro/config';
import remarkDirective from 'remark-directive';
import { remarkPotDirectives } from './src/plugins/remark-directives.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://potandbalcony.com',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    // remark-directive must come first; remarkPotDirectives turns
    // ::figure / ::product / :::field-notes into HTML at build time.
    remarkPlugins: [remarkDirective, remarkPotDirectives],
    smartypants: true,
  },
});
