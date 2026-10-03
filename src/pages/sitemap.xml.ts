import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { PILLAR_ORDER } from '../config/pillars';
import { getArticles, urlOf } from '../utils/articles';

/**
 * Auto-generated sitemap.xml — built from the content collection, so a new article
 * file appears here on the next build with nothing to edit. Sample/placeholder
 * articles are left out (they are also noindex).
 */
export const GET: APIRoute = async () => {
  const articles = (await getArticles()).filter((a) => !a.data.placeholder);

  const staticPages = [
    { path: '/', priority: '1.0' },
    ...PILLAR_ORDER.map((p) => ({ path: `/${p}/`, priority: '0.8' })),
    { path: '/about/', priority: '0.6' },
    { path: '/contact/', priority: '0.3' },
    { path: '/affiliate-disclosure/', priority: '0.2' },
    { path: '/privacy-policy/', priority: '0.2' },
  ];

  const urls = [
    ...staticPages.map((p) => `<url><loc>${SITE.url}${p.path}</loc><priority>${p.priority}</priority></url>`),
    ...articles.map((a) => {
      const lastmod = (a.data.updatedDate ?? a.data.pubDate).toISOString().slice(0, 10);
      return `<url><loc>${SITE.url}${urlOf(a)}</loc><lastmod>${lastmod}</lastmod><priority>0.7</priority></url>`;
    }),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
