# Publishing articles from n8n

This is everything the n8n pipeline needs to publish a new article **without anyone touching the site**.

## How it works

```
n8n  ──(GitHub API: create file commit on `main`)──►  GitHub repo
                                                          │  push event
                                                          ▼
                                              Cloudflare Pages (auto build)
                                                          │  npm run build
                                                          ▼
                                              Live on potandbalcony.com (≈1–2 min)
```

1. n8n commits **one markdown file** (plus optional images) to the `main` branch via the GitHub API.
2. Cloudflare Pages is connected to the repo and rebuilds on **every push to `main`**.
3. The build regenerates the article page, the pillar hub list, related-article links, the homepage "latest" list and `sitemap.xml`. Nothing else needs editing.
4. If the build fails (bad frontmatter, unknown product ID) Cloudflare **keeps the previous deployment live** and shows the error in the build log. A broken commit can never take the site down.

## Where to commit

| What | Path | Notes |
|---|---|---|
| Article | `src/content/articles/<pillar>/<slug>.md` | `<pillar>` must be exactly one of the three folders below |
| Images | `public/images/articles/<slug>/<file>.jpg` | Referenced in markdown as `/images/articles/<slug>/<file>.jpg` |

**Pillar folders** (this decides the URL and which hub page lists the article):

| Folder | URL |
|---|---|
| `balcony-growing` | `/balcony-growing/<slug>/` |
| `indoor-growing` | `/indoor-growing/<slug>/` |
| `gear-guides` | `/gear-guides/<slug>/` |

**Slug rules:** the filename (without `.md`) *is* the URL slug. Use lowercase letters, numbers and hyphens only, e.g. `best-self-watering-planters-for-balconies.md`. Do not put files in sub-folders or in any other folder; they will not be picked up (or the build will fail with a clear error for an unknown pillar folder).

Commit the image(s) **in the same commit or before** the markdown file. Use web-sized images (about 1600 px wide max, JPG/WebP); they are served as-is.

## Frontmatter fields

```yaml
---
title: "Exact headline of the article"           # REQUIRED, 10–70 chars
description: "One or two sentences for search results and social cards."  # REQUIRED, 70–165 chars
pubDate: 2026-10-15                              # REQUIRED, YYYY-MM-DD
updatedDate: 2026-11-02                          # optional, YYYY-MM-DD
heroImage: /images/articles/my-slug/hero.jpg     # optional, must start with /
heroAlt: "Describe the hero photo"               # REQUIRED if heroImage is set (min 5 chars)
heroCaption: "Optional caption under the hero"   # optional
tags: [no-drill, containers, wind]               # optional, drives related-article matching
related: [gear-guides/another-slug]              # optional, hand-picked "pillar/slug" ids
author: Josh                                     # optional, default "Josh"
seoTitle: "Shorter title for Google"             # optional, max 60 chars
toc: true                                        # optional; default = auto (3+ H2/H3 headings)
draft: false                                     # optional; true = hidden in production
placeholder: false                               # optional; never set true for real content
---
```

Rules the build enforces (a failure stops that deploy only):

- `title`, `description`, `pubDate` are required and length-checked.
- If `heroImage` is set, `heroAlt` is required.
- `pubDate` in the future still publishes — it is not scheduled. Use `draft: true` to hold an article back.

**Everything else is automatic:** meta title, meta description, canonical URL, Open Graph + Twitter tags, `Article` + `BreadcrumbList` JSON-LD, reading time, table of contents, byline, related articles, sitemap entry.

## Writing the body

Plain markdown: `##` / `###` headings (don't use `#`, the title is the H1), lists, tables, links, bold, blockquotes. The intro is the first paragraph(s) — the `description` is also shown as the standfirst under the headline.

Three special blocks are available. They use a simple directive syntax so n8n never has to write HTML or components.

### Inline photo with caption

```md
::figure{src="/images/articles/my-slug/balcony-wind.jpg" alt="Tomato plants staked against the balcony wall" caption="The wall side takes the worst of the wind."}
```

`src` and `alt` are required. `caption` is optional. Put it on its own line with blank lines around it.

### Field Notes (Josh's personal block)

```md
:::field-notes{photo="/images/articles/my-slug/josh-planter.jpg" alt="Josh's planter after a hot week" caption="day 9, still alive"}
Two or three sentences in Josh's voice about what actually happened.
:::
```

`photo`, `alt` and `caption` are optional (without `photo` it renders as a text-only note). Always keep the closing `:::` on its own line.

### Affiliate product box

```md
::product{id="sample-led-grow-light"}
```

**Only the product ID.** Never put an affiliate URL in an article. The ID must exist as a key in `src/data/products.json`, otherwise the **build fails** with a message listing the valid IDs. Articles with a product box automatically get an affiliate notice at the top.

## Adding or fixing a product (the affiliate config)

`src/data/products.json` maps product ID → name, URL, image, price, etc. To change a dead link, edit that product's `url` — every article using the ID updates on the next build.

```json
"my-product-id": {
  "name": "Product name",
  "brand": "Brand",
  "retailer": "Amazon",
  "url": "https://www.amazon.co.uk/dp/ASIN?tag=yourtag-21",
  "image": "/images/products/my-product.jpg",
  "price": "£34.99",
  "priceChecked": "October 2026",
  "badge": "Our pick",
  "blurb": "One sentence.",
  "points": ["Pro one", "Pro two"]
}
```

`price`, `priceChecked`, `badge`, `brand`, `blurb`, `points` are optional. Remove `price` if you can't keep it current (Amazon restricts showing stale prices); the box then says "Check current price". Add the product entry **before or in the same commit** as any article that uses it.

## Minimal n8n recipe

Use the GitHub node (or HTTP Request) with a fine-grained personal access token limited to this one repo with **Contents: Read & write**.

- **Create a file:** `PUT /repos/{owner}/pot-and-balcony/contents/src/content/articles/{pillar}/{slug}.md`
- Body: `{ "message": "Publish: {title}", "content": "<base64 of the markdown file>", "branch": "main" }`
- For images, the same endpoint with the path `public/images/articles/{slug}/{file}.jpg` (base64 content). Commit images first.
- To **update** an existing article, include the file's current `sha` in the request.
- To **unpublish**, update the file with `draft: true` (or delete it).

Each commit triggers its own Cloudflare build; commit the markdown **last** so it never builds without its images. Check status in Cloudflare Pages → Deployments.

## Quick pre-flight checklist for the pipeline

- [ ] Folder is one of `balcony-growing`, `indoor-growing`, `gear-guides`
- [ ] Filename is `lowercase-with-hyphens.md`
- [ ] `title`, `description`, `pubDate` present; `description` is 70–165 chars
- [ ] `heroAlt` present if `heroImage` is set; image file exists at that path
- [ ] Every `::product{id=...}` ID exists in `products.json`
- [ ] Every `::figure` has `alt`
- [ ] No affiliate URLs in the article body
