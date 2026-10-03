# Placeholder checklist

Everything below is sample or placeholder content. Tick each off before launch.
Tip: search the project for `PLACEHOLDER` to find them all.

## Config values
- [ ] `src/config/site.ts` → `email` (currently `hello@potandbalcony.com`)
- [ ] `src/config/site.ts` → `formspreeEndpoint` (replace `PLACEHOLDER_FORM_ID` after creating the form at formspree.io)
- [ ] `src/config/site.ts` → `gscVerification` (paste the Google Search Console `content` value)
- [ ] `src/config/site.ts` → `author.avatar`, `author.bio` (real photo + bio)
- [ ] `public/og-default.jpg` (default social share image, 1200×630)

## Images (all in `public/images/placeholder/`)
- [ ] `photo-landscape.svg` — used on the homepage hero and in sample articles → real balcony photo
- [ ] `josh-avatar.svg` — homepage, About page, bylines → real photo of Josh
- [ ] `product.svg` — sample product image → real product images

## Pages
- [ ] Homepage — intro copy is a draft in Josh's voice (`src/pages/index.astro`)
- [ ] About — bracketed `[Josh: ...]` prompts need his real story (`src/pages/about.astro`)
- [ ] Affiliate disclosure — final Amazon Associates wording (`src/pages/affiliate-disclosure.astro`)
- [ ] Privacy policy — legal review; add a cookie-consent banner for UK/EU (`src/pages/privacy-policy.astro`)
- [ ] Footer Amazon line (`src/components/Footer.astro`)
- [ ] Remove the `PlaceholderBanner` from each page once it's final

## Sample content to delete
- [ ] `src/content/articles/balcony-growing/placeholder-no-drill-balcony-setup.md`
- [ ] `src/content/articles/gear-guides/placeholder-self-watering-planter-review.md`
- [ ] The four `sample-*` entries in `src/data/products.json` (or replace their URLs, names, images, prices and remove `"placeholder": true`)

Sample articles are marked `placeholder: true`, which adds a banner, sets `noindex` and keeps them out of `sitemap.xml`.
