import { getCollection, type CollectionEntry } from 'astro:content';
import { isPillar, PILLAR_ORDER, type PillarSlug } from '../config/pillars';

export type Article = CollectionEntry<'articles'>;

/** Pillar = the folder the markdown file lives in. */
export const pillarOf = (a: Article): PillarSlug => a.id.split('/')[0] as PillarSlug;
/** Slug = the file name without .md. */
export const slugOf = (a: Article): string => a.id.split('/')[1];
export const urlOf = (a: Article): string => `/${pillarOf(a)}/${slugOf(a)}/`;

/** All publishable articles, newest first. Drafts are hidden in production builds. */
export async function getArticles(): Promise<Article[]> {
  const all = await getCollection('articles', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
  for (const a of all) {
    if (!isPillar(pillarOf(a))) {
      throw new Error(
        `[pot-and-balcony] "${a.id}" is in an unknown folder. Articles must live in one of: ${PILLAR_ORDER.join(', ')}`,
      );
    }
  }
  return all.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getArticlesByPillar(pillar: PillarSlug): Promise<Article[]> {
  return (await getArticles()).filter((a) => pillarOf(a) === pillar);
}

/** Hand-picked `related:` first, then same pillar / shared tags, then newest. */
export async function getRelated(article: Article, limit = 3): Promise<Article[]> {
  const all = (await getArticles()).filter((a) => a.id !== article.id);
  const picked = article.data.related
    .map((id) => all.find((a) => a.id === id))
    .filter((a): a is Article => Boolean(a));

  const score = (a: Article) => {
    const sharedTags = a.data.tags.filter((t) => article.data.tags.includes(t)).length;
    return (pillarOf(a) === pillarOf(article) ? 2 : 0) + sharedTags * 3;
  };
  const rest = all
    .filter((a) => !picked.includes(a))
    .sort((a, b) => score(b) - score(a) || b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return [...picked, ...rest].slice(0, limit);
}

export function readingTime(body = ''): number {
  const words = body.replace(/^:{2,3}.*$/gm, '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(date);
}
