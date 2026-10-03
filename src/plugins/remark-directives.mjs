import { visit } from 'unist-util-visit';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Remark plugin: turns three directive types written in plain markdown into HTML.
 *
 *   ::figure{src="/images/articles/x/a.jpg" alt="Describe it" caption="Optional caption"}
 *
 *   ::product{id="product-id-from-products.json"}
 *
 *   :::field-notes{photo="/images/articles/x/b.jpg" alt="Describe it" caption="Optional"}
 *   Two or three sentences from Josh.
 *   :::
 *
 * Product boxes are built from src/data/products.json, so affiliate URLs never
 * appear in article files. An unknown product ID FAILS THE BUILD on purpose.
 */

const esc = (value = '') =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function loadProducts() {
  // Read fresh each time so edits to products.json show up in dev without a restart.
  const raw = readFileSync(join(process.cwd(), 'src', 'data', 'products.json'), 'utf8');
  return JSON.parse(raw);
}

function fail(file, message) {
  const where = file?.path ? ` (in ${file.path})` : '';
  throw new Error(`[pot-and-balcony] ${message}${where}`);
}

function figureHtml(attrs, file) {
  const { src, alt, caption, width, height } = attrs;
  if (!src) fail(file, '::figure needs a src="..." attribute');
  if (!alt) fail(file, `::figure for "${src}" needs an alt="..." attribute (accessibility + SEO)`);
  const size = width && height ? ` width="${esc(width)}" height="${esc(height)}"` : '';
  return (
    `<figure class="article-figure">` +
    `<img src="${esc(src)}" alt="${esc(alt)}"${size} loading="lazy" decoding="async">` +
    (caption ? `<figcaption>${esc(caption)}</figcaption>` : '') +
    `</figure>`
  );
}

function productHtml(id, file) {
  if (!id) fail(file, '::product needs an id="..." attribute');
  const products = loadProducts();
  const p = products[id];
  if (!p || id.startsWith('_')) {
    const known = Object.keys(products).filter((k) => !k.startsWith('_')).join(', ');
    fail(file, `Unknown product id "${id}". Add it to src/data/products.json. Known ids: ${known}`);
  }
  const retailer = p.retailer || 'retailer';
  const points = Array.isArray(p.points) && p.points.length
    ? `<ul class="product-box__points">${p.points.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`
    : '';
  const price = p.price
    ? `<span class="product-box__price">${esc(p.price)}${p.priceChecked ? ` <small>price checked ${esc(p.priceChecked)}</small>` : ''}</span>`
    : `<span class="product-box__price"><small>Check current price</small></span>`;

  return (
    `<aside class="product-box" data-product-id="${esc(id)}" aria-label="Product: ${esc(p.name)}">` +
    (p.placeholder ? `<p class="product-box__placeholder">Sample product — replace in products.json</p>` : '') +
    `<div class="product-box__media"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="400" height="400" loading="lazy" decoding="async"></div>` +
    `<div class="product-box__body">` +
    (p.badge ? `<p class="product-box__badge">${esc(p.badge)}</p>` : '') +
    (p.brand ? `<p class="product-box__brand">${esc(p.brand)}</p>` : '') +
    `<p class="product-box__name">${esc(p.name)}</p>` +
    (p.blurb ? `<p class="product-box__blurb">${esc(p.blurb)}</p>` : '') +
    points +
    `<div class="product-box__cta">` +
    `<a class="btn" href="${esc(p.url)}" target="_blank" rel="sponsored nofollow noopener">View on ${esc(retailer)}</a>` +
    price +
    `</div>` +
    `<p class="product-box__note">Affiliate link — I may earn a commission at no extra cost to you. <a href="/affiliate-disclosure/">How this works</a></p>` +
    `</div></aside>`
  );
}

function toHtmlNode(node, html) {
  node.type = 'html';
  node.value = html;
  delete node.children;
  delete node.attributes;
  delete node.name;
  delete node.data;
}

export function remarkPotDirectives() {
  return (tree, file) => {
    visit(tree, (node) => {
      const isDirective =
        node.type === 'containerDirective' || node.type === 'leafDirective' || node.type === 'textDirective';
      if (!isDirective) return;

      const attrs = node.attributes || {};

      if (node.type === 'leafDirective' && node.name === 'figure') {
        return toHtmlNode(node, figureHtml(attrs, file));
      }

      if (node.type === 'leafDirective' && node.name === 'product') {
        return toHtmlNode(node, productHtml(attrs.id, file));
      }

      if (node.type === 'containerDirective' && node.name === 'field-notes') {
        const children = (node.children || []).filter((c) => !c.data?.directiveLabel);
        const photo = attrs.photo
          ? `<figure class="field-notes__photo"><img src="${esc(attrs.photo)}" alt="${esc(attrs.alt || '')}" loading="lazy" decoding="async">` +
            (attrs.caption ? `<figcaption>${esc(attrs.caption)}</figcaption>` : '') +
            `</figure>`
          : '';
        node.data = { hName: 'aside', hProperties: { className: ['field-notes'], 'aria-label': 'Field notes from Josh' } };
        node.children = [
          { type: 'html', value: `<p class="field-notes__label">Field Notes <span>from Josh&rsquo;s balcony</span></p>` },
          ...(photo ? [{ type: 'html', value: photo }] : []),
          {
            type: 'fieldNotesBody',
            data: { hName: 'div', hProperties: { className: ['field-notes__body'] } },
            children,
          },
        ];
        return;
      }

      // Inline "directives" are usually just stray colons in prose (e.g. "Tip:water early").
      // Put the text back exactly as it was written.
      if (node.type === 'textDirective') {
        const label = (node.children || []).map((c) => c.value || '').join('');
        node.type = 'text';
        node.value = `:${node.name}${label ? `[${label}]` : ''}`;
        delete node.children;
        delete node.attributes;
        delete node.name;
        return;
      }

      fail(
        file,
        `Unknown directive "${node.name}". Supported: ::figure{...}, ::product{id="..."}, :::field-notes{...}`,
      );
    });
  };
}
