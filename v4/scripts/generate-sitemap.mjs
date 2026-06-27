import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalogPath = path.join(root, 'public/data/catalog.json');
const outPath = path.join(root, 'public/sitemap.xml');

const SITE = 'https://www.hyper-advance.com';
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const urls = new Set([
  '/',
  '/projects',
  '/systems',
  '/distributors',
]);

for (const s of catalog.systems || []) urls.add(`/system/${s.id}`);
for (const d of catalog.distributors || []) urls.add(`/distributor/${d.id}`);

const seenSlugs = new Set();
for (const p of catalog.projects || []) {
  if (!p.slug || p.source === 'xlsx-secondary') continue;
  if (seenSlugs.has(p.slug)) continue;
  seenSlugs.add(p.slug);
  urls.add(`/project/${p.slug}`);
}

const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls].sort().map((loc) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${loc === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${loc === '/' ? '1.0' : loc.startsWith('/project/') ? '0.7' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(outPath, xml);
console.log(`Wrote ${urls.size} URLs to ${outPath}`);
