# Pot and Balcony

Source for [potandbalcony.com](https://potandbalcony.com): an author-led resource for urban renters growing food on balconies, windowsills and indoors.

**Stack:** Astro 5 (static) · Markdown content collections · vanilla CSS · Cloudflare Pages

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to ./dist
npm run preview
```

Requires Node 20+.

## Project map

| Path | Purpose |
|---|---|
| `src/content/articles/<pillar>/*.md` | Articles (one folder per content pillar) |
| `src/content.config.ts` | Frontmatter schema; bad frontmatter fails the build |
| `src/data/products.json` | **Central affiliate config** — product ID → URL, name, price, image |
| `src/config/site.ts` | Site name, GA4 ID, Search Console tag, Formspree endpoint, author |
| `src/config/pillars.ts` | The three pillars (hub page copy) |
| `src/plugins/remark-directives.mjs` | `::figure`, `::product`, `:::field-notes` markdown blocks |
| `src/layouts`, `src/components` | Templates and UI |
| `src/styles` | Design tokens, global, article/prose styles |
| `public/_headers` | Cloudflare caching + security headers |
| `docs/N8N-PUBLISHING.md` | **How the n8n pipeline publishes articles** |
| `docs/PLACEHOLDERS.md` | Everything to replace before launch |

## Design

- Display: **Anton** · Body: **Inter** · Field Notes accent: **Caveat** (self-hosted via Fontsource)
- Palette: Forest `#01472e`, Sage `#ccd5ae`, Olive `#e9edc9`, Cream `#fefae0`, Moss `#a3b18a`. Dark text is always Forest.

## Deploy (Cloudflare Pages)

Connect the GitHub repo in Cloudflare Pages with:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Production branch | `main` |
| Environment variable | `NODE_VERSION` = `20` |

Every push to `main` builds and deploys automatically; other branches and PRs get preview URLs.
Add the custom domain `potandbalcony.com` under Pages → Custom domains.

## SEO

Per page/article, generated automatically: title, meta description, canonical, Open Graph + Twitter tags, `Article` / `BreadcrumbList` / `Organization` JSON-LD. `sitemap.xml` and `robots.txt` are generated at build time.
