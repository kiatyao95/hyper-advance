import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/**
 * Static per-route prerender for the Hyper Advance v4 SPA.
 *
 * For every indexable route this writes a dedicated index.html with:
 *   - the correct <title>, description, keywords and canonical baked in
 *   - Open Graph / Twitter tags and hreflang alternates
 *   - route-specific JSON-LD (Organization, Service, Breadcrumb, ...)
 *   - a <noscript> block of crawlable, keyword-rich copy + internal links
 *
 * Meta tags, canonical and JSON-LD use the exact same ids/selectors that the
 * runtime `usePageSeo` hook manages, so React seamlessly takes them over on
 * hydration instead of duplicating them.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.resolve(root, 'dist');
const indexPath = path.join(distDir, 'index.html');
const catalogPath = path.join(distDir, 'data/catalog.json');

if (!fs.existsSync(indexPath)) {
  console.error('Missing dist/index.html — run vite build first.');
  process.exit(1);
}

const seo = await import(pathToFileURL(path.join(root, 'src/seo/seoConfig.js')).href);
const {
  SITE,
  PAGE_SEO,
  SYSTEM_SEO,
  DISTRIBUTOR_SEO,
  SOLUTION_GROUPS,
  organizationJsonLd,
  websiteJsonLd,
  serviceJsonLd,
  breadcrumbJsonLd,
  systemJsonLd,
  distributorJsonLd,
} = seo;

const template = fs.readFileSync(indexPath, 'utf8');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const escapeAttr = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const escapeHtml = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const absUrl = (p = '') => `${SITE.url}${p}`;
const resolveImage = (img) =>
  !img ? `${SITE.url}/assets/brand/hyper-advance-logo.png` : img.startsWith('http') ? img : `${SITE.url}${img}`;

function replaceOrAppend(head, regex, replacement, extras) {
  if (regex.test(head)) return head.replace(regex, replacement);
  extras.push(replacement);
  return head;
}

function renderDocument(routeSeo) {
  const url = absUrl(routeSeo.path || '/');
  const image = resolveImage(routeSeo.image);
  const keywords = (routeSeo.keywords || []).join(', ');
  const robots = routeSeo.noindex ? 'noindex,nofollow' : 'index,follow';
  const description = routeSeo.description || PAGE_SEO.home.description;

  let head = template.slice(0, template.indexOf('</head>'));
  const rest = template.slice(template.indexOf('</head>'));
  const extras = [];

  head = head.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(routeSeo.title)}</title>`);
  head = replaceOrAppend(head, /<meta name="description" content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeAttr(description)}"/>`, extras);
  head = replaceOrAppend(head, /<meta name="keywords" content="[\s\S]*?"\s*\/?>/,
    `<meta name="keywords" content="${escapeAttr(keywords)}"/>`, extras);
  head = replaceOrAppend(head, /<meta name="robots" content="[\s\S]*?"\s*\/?>/,
    `<meta name="robots" content="${robots}"/>`, extras);
  head = replaceOrAppend(head, /<link rel="canonical"[^>]*\/?>/,
    `<link rel="canonical" href="${url}"/>`, extras);
  head = replaceOrAppend(head, /<meta property="og:title" content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:title" content="${escapeAttr(routeSeo.title)}"/>`, extras);
  head = replaceOrAppend(head, /<meta property="og:description" content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${escapeAttr(description)}"/>`, extras);
  head = replaceOrAppend(head, /<meta property="og:url" content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:url" content="${url}"/>`, extras);

  extras.push(
    `<meta property="og:image" content="${image}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${escapeAttr(routeSeo.title)}"/>`,
    `<meta name="twitter:description" content="${escapeAttr(description)}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
    `<link rel="alternate" hreflang="en-my" href="${url}"/>`,
    `<link rel="alternate" hreflang="x-default" href="${url}"/>`,
  );

  // Remove any twitter:card already present in the template to avoid duplicates.
  head = head.replace(/\s*<meta name="twitter:card"[^>]*\/?>/, '');

  const ld = Array.isArray(routeSeo.jsonLd) ? routeSeo.jsonLd : routeSeo.jsonLd ? [routeSeo.jsonLd] : [];
  ld.forEach((data, i) => {
    const json = JSON.stringify(data).replace(/</g, '\\u003c');
    extras.push(`<script type="application/ld+json" id="seo-jsonld-${i}">${json}</script>`);
  });

  head += `  ${extras.join('\n  ')}\n`;

  let html = head + rest;
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root"></div>\n  <noscript>\n${routeSeo.noscript || ''}\n  </noscript>`,
  );
  return html;
}

const navLinks = `      <nav aria-label="Site">
        <a href="${absUrl('/')}">Home</a>
        <a href="${absUrl('/systems')}">ELV Systems</a>
        <a href="${absUrl('/distributors')}">Authorised Distributors</a>
        <a href="${absUrl('/projects')}">Project References</a>
      </nav>`;

const napBlock = `      <address>
        ${escapeHtml(SITE.name)} — ELV Contractor Malaysia.
        ${escapeHtml(SITE.address.street)}, ${escapeHtml(SITE.address.postalCode)} ${escapeHtml(SITE.address.city)}, ${escapeHtml(SITE.address.state)}, Malaysia.
        Tel: ${SITE.phones.join(' / ')}. Email: ${SITE.email}.
      </address>`;

const fallback = (inner) => `    <div class="seo-fallback">
${inner}
${navLinks}
${napBlock}
    </div>`;

/* ---------------------------------------------------------------- routes */

const routes = [];

// Home
routes.push({
  path: '/',
  file: 'index.html',
  ...PAGE_SEO.home,
  keywords: PAGE_SEO.home.keywords,
  jsonLd: [organizationJsonLd(), websiteJsonLd(), serviceJsonLd()],
  noscript: fallback(`      <h1>Malaysia's Leading ELV Contractor &amp; Authorised Distributor</h1>
      <p>${escapeHtml(PAGE_SEO.home.description)}</p>
      <h2>Extra Low Voltage Systems We Supply, Install &amp; Maintain</h2>
      <ul>
${SOLUTION_GROUPS.map((g) => `        <li><strong>${escapeHtml(g.title)}:</strong> ${escapeHtml(g.keywords.join(', '))} — ${escapeHtml(g.brands)}</li>`).join('\n')}
      </ul>`),
});

// Static list pages
routes.push({
  path: '/systems',
  file: 'systems/index.html',
  ...PAGE_SEO.systems,
  jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Systems', path: '/systems' }])],
  noscript: fallback(`      <h1>ELV Systems in Malaysia</h1>
      <p>${escapeHtml(PAGE_SEO.systems.description)}</p>
      <ul>
${(catalog.systems || []).map((s) => `        <li><a href="${absUrl(`/system/${s.id}`)}">${escapeHtml(s.name)}</a> — ${escapeHtml((s.brands || []).join(', '))}</li>`).join('\n')}
      </ul>`),
});

routes.push({
  path: '/distributors',
  file: 'distributors/index.html',
  ...PAGE_SEO.distributors,
  jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Distributors', path: '/distributors' }])],
  noscript: fallback(`      <h1>Authorised ELV Brand Distributors in Malaysia</h1>
      <p>${escapeHtml(PAGE_SEO.distributors.description)}</p>
      <ul>
${(catalog.distributors || []).map((d) => `        <li><a href="${absUrl(`/distributor/${d.id}`)}">${escapeHtml(d.fullName || d.name)}</a></li>`).join('\n')}
      </ul>`),
});

routes.push({
  path: '/projects',
  file: 'projects/index.html',
  ...PAGE_SEO.projects,
  jsonLd: [breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Projects', path: '/projects' }])],
  noscript: fallback(`      <h1>ELV Project References in Malaysia</h1>
      <p>${escapeHtml(PAGE_SEO.projects.description)}</p>`),
});

// System detail pages
for (const sys of catalog.systems || []) {
  const dist = (catalog.distributors || []).find((d) => d.id === sys.distributorId) || null;
  const override = SYSTEM_SEO[sys.id];
  const keywords = override?.keywords || [sys.shortName, 'ELV Malaysia', ...(sys.brands || [])];
  const routePath = `/system/${sys.id}`;
  routes.push({
    path: routePath,
    file: `system/${sys.id}/index.html`,
    title: override?.title || `${sys.name} Malaysia | Hyper Advance`,
    description: override?.description || sys.description,
    keywords,
    jsonLd: [
      systemJsonLd(sys, dist, routePath, keywords),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Systems', path: '/systems' },
        { name: sys.name, path: routePath },
      ]),
    ],
    noscript: fallback(`      <h1>${escapeHtml(sys.name)} Malaysia</h1>
      <p>${escapeHtml(override?.description || sys.description)}</p>
      <p><strong>Brands:</strong> ${escapeHtml((sys.brands || []).join(', '))}</p>
${sys.models?.length ? `      <p><strong>Models:</strong> ${escapeHtml(sys.models.join(', '))}</p>` : ''}
${dist ? `      <p><a href="${absUrl(`/distributor/${dist.id}`)}">Authorised distributor: ${escapeHtml(dist.fullName || dist.name)}</a></p>` : ''}`),
  });
}

// Distributor detail pages
for (const dist of catalog.distributors || []) {
  const override = DISTRIBUTOR_SEO[dist.id];
  const keywords = override?.keywords || [dist.name, 'authorised distributor', 'ELV Malaysia'];
  const routePath = `/distributor/${dist.id}`;
  routes.push({
    path: routePath,
    file: `distributor/${dist.id}/index.html`,
    title: override?.title || `${dist.fullName} Authorised Distributor Malaysia`,
    description: override?.description || dist.description,
    keywords,
    image: dist.logo,
    jsonLd: [
      distributorJsonLd(dist, routePath, keywords),
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Distributors', path: '/distributors' },
        { name: dist.fullName || dist.name, path: routePath },
      ]),
    ],
    noscript: fallback(`      <h1>${escapeHtml(dist.fullName || dist.name)} — Authorised Distributor Malaysia</h1>
      <p>${escapeHtml(override?.description || dist.description || '')}</p>
${dist.products?.length ? `      <ul>
${dist.products.map((pr) => `        <li><strong>${escapeHtml(pr.name)}</strong> (${escapeHtml(pr.type)}): ${escapeHtml(pr.description)}</li>`).join('\n')}
      </ul>` : ''}`),
  });
}

// Project detail pages (mirrors sitemap dedupe rules)
const seenSlugs = new Set();
for (const p of catalog.projects || []) {
  if (!p.slug || p.source === 'xlsx-secondary') continue;
  if (seenSlugs.has(p.slug)) continue;
  seenSlugs.add(p.slug);

  const systems = (p.systemsCovered || []).join(', ') || p.tag || '';
  const routePath = `/project/${p.slug}`;
  const title = `${p.name} ELV Project | ${systems} — Hyper Advance`;
  const description = `${p.name} — ${systems} installation in Malaysia by Hyper Advance. ${p.sector || ''} ELV project reference${p.completionDate ? ` completed ${p.completionDate}` : ''}.`;
  routes.push({
    path: routePath,
    file: `project/${p.slug}/index.html`,
    title,
    description,
    keywords: [p.name, systems, 'ELV contractor Malaysia', p.sector].filter(Boolean),
    image: p.image,
    jsonLd: [
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: p.name, path: routePath },
      ]),
    ],
    noscript: fallback(`      <h1>${escapeHtml(p.name)} — ELV Project Reference</h1>
      <p>${escapeHtml(description)}</p>
${systems ? `      <p><strong>Systems covered:</strong> ${escapeHtml(systems)}</p>` : ''}`),
  });
}

/* ----------------------------------------------------------------- write */

for (const routeSeo of routes) {
  const html = renderDocument(routeSeo);
  const outPath = path.join(distDir, routeSeo.file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
}

// 404 falls back to the home shell so client routing can recover.
fs.writeFileSync(path.join(distDir, '404.html'), renderDocument(routes[0]));

console.log(`Prerendered ${routes.length} routes (+404.html) into ${distDir}`);
