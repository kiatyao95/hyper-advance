import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Missing dist/index.html');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const scriptMatch = indexHtml.match(/src="(\/?assets\/[^"]+\.js)"/);
const styleMatch = indexHtml.match(/href="(\/?assets\/[^"]+\.css)"/);

const errors = [];

if (!fs.existsSync(path.join(distDir, 'web.config'))) {
  errors.push('Missing dist/web.config');
}

if (!fs.existsSync(path.join(distDir, 'data', 'catalog.json'))) {
  errors.push('Missing dist/data/catalog.json');
}

// Confirm per-route prerendering ran: a sample system page must exist and
// must carry its own canonical (not the homepage canonical).
const catalogFile = path.join(distDir, 'data', 'catalog.json');
if (fs.existsSync(catalogFile)) {
  const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf8'));
  const sampleId = catalog.systems?.[0]?.id;
  if (sampleId) {
    const samplePath = path.join(distDir, 'system', sampleId, 'index.html');
    if (!fs.existsSync(samplePath)) {
      errors.push(`Missing prerendered route: system/${sampleId}/index.html (run generate-prerender.mjs)`);
    } else {
      const sampleHtml = fs.readFileSync(samplePath, 'utf8');
      const expected = `href="https://www.hyper-advance.com/system/${sampleId}"`;
      if (!sampleHtml.includes(`<link rel="canonical" ${expected}/>`)) {
        errors.push(`Prerendered system/${sampleId} has wrong or missing canonical (expected ${expected})`);
      }
    }
  }
}

if (scriptMatch) {
  const scriptPath = scriptMatch[1].replace(/^\//, '');
  if (!fs.existsSync(path.join(distDir, scriptPath))) {
    errors.push(`Missing JS bundle: ${scriptMatch[1]}`);
  }
} else {
  errors.push('index.html has no script bundle reference');
}

if (styleMatch) {
  const stylePath = styleMatch[1].replace(/^\//, '');
  if (!fs.existsSync(path.join(distDir, stylePath))) {
    errors.push(`Missing CSS bundle: ${styleMatch[1]}`);
  }
}

if (errors.length) {
  console.error('IIS build verification failed:');
  errors.forEach((e) => console.error(`  - ${e}`));
  process.exit(1);
}

console.log('IIS build verification passed.');
console.log(`  JS:  ${scriptMatch[1]}`);
console.log(`  CSS: ${styleMatch[1]}`);
