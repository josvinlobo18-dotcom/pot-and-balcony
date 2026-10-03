import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Article frontmatter schema. The build FAILS if a file doesn't match — that is
 * deliberate, so a malformed n8n commit can never publish a broken page.
 * Full field reference: docs/N8N-PUBLISHING.md
 */
const articles = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/articles' }),
  schema: z
    .object({
      title: z.string().min(10).max(70),
      /** Optional shorter <title> if `title` is too long for search results (<= 60 chars). */
      seoTitle: z.string().max(60).optional(),
      description: z.string().min(70).max(165),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      /** Path under /public, e.g. /images/articles/my-slug/hero.jpg */
      heroImage: z.string().startsWith('/').optional(),
      heroAlt: z.string().min(5).optional(),
      heroCaption: z.string().optional(),
      tags: z.array(z.string()).default([]),
      /** Optional hand-picked related articles, as "pillar/slug" (file path without .md). */
      related: z.array(z.string()).default([]),
      author: z.string().default('Josh'),
      /** Force the table of contents on/off. Default: shown when there are 3+ H2/H3 headings. */
      toc: z.boolean().optional(),
      draft: z.boolean().default(false),
      /** Marks sample content: shows a banner and sets noindex. */
      placeholder: z.boolean().default(false),
    })
    .refine((d) => !d.heroImage || !!d.heroAlt, {
      message: 'heroAlt is required when heroImage is set',
      path: ['heroAlt'],
    }),
});

export const collections = { articles };
