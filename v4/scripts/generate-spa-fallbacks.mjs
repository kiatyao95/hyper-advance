import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const catalogPath = path.join(distDir, 'data/catalog.json');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Missing dist/index.html — run vite build first.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const routes = new Set([
  'projects',
  'systems',
  'distributors',
]);

for (const d of catalog.distributors || []) routes.add(`distributor/${d.id}`);
for (const s of catalog.systems || []) routes.add(`system/${s.id}`);
for (const p of catalog.projects || []) {
  if (p.slug) routes.add(`project/${p.slug}`);
}

for (const route of routes) {
  const dir = path.join(distDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
}

console.log(`Generated ${routes.size} SPA fallback routes in ${distDir}`);
