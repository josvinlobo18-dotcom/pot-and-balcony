import { SITE } from '../config/site';
import { PILLARS } from '../config/pillars';
import { pillarOf, urlOf, slugOf, type Article } from './articles';

export const abs = (path: string): string => new URL(path, SITE.url).toString();

export const organizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: abs('/favicon.svg'),
  email: SITE.email,
});

export const websiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: 'en-GB',
  publisher: { '@id': `${SITE.url}/#organization` },
});

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
});

export const articleSchema = (article: Article) => {
  const d = article.data;
  const url = abs(urlOf(article));
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: d.title,
    description: d.description,
    image: [abs(d.heroImage ?? SITE.defaultOgImage)],
    datePublished: d.pubDate.toISOString(),
    dateModified: (d.updatedDate ?? d.pubDate).toISOString(),
    inLanguage: 'en-GB',
    articleSection: PILLARS[pillarOf(article)].title,
    keywords: d.tags.join(', ') || undefined,
    author: { '@type': 'Person', name: d.author, url: abs('/about/') },
    publisher: { '@id': `${SITE.url}/#organization` },
    url,
    identifier: slugOf(article),
  };
};
