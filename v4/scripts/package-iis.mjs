import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const releaseDir = path.join(root, 'release', 'iis');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Missing dist/index.html — run npm run build:iis first.');
  process.exit(1);
}

if (!fs.existsSync(path.join(distDir, 'web.config'))) {
  console.error('Missing dist/web.config — run npm run build:iis first.');
  process.exit(1);
}

fs.rmSync(releaseDir, { recursive: true, force: true });
fs.mkdirSync(releaseDir, { recursive: true });
fs.cpSync(distDir, releaseDir, { recursive: true });

const stamp = new Date().toISOString();
const notes = [
  'Hyper Advance v4 — IIS deployment package',
  `Generated: ${stamp}`,
  `Base path: ${process.env.BASE_PATH || '/'}`,
  '',
  'IMPORTANT — copy the ENTIRE folder contents to IIS.',
  'A blank page usually means the JS bundle was not deployed.',
  '',
  'Required files (verify these exist on the server):',
  '  /index.html',
  '  /web.config',
  '  /assets/index-*.js',
  '  /assets/index-*.css',
  '  /data/catalog.json',
  '',
  'If replacing an old site, delete the old site files first or deploy',
  'to a clean folder. Do not copy only index.html.',
  '',
  'Requires IIS URL Rewrite: https://www.iis.net/downloads/microsoft/url-rewrite',
  '',
  'Verify in browser DevTools → Network:',
  '  index-*.js should return 200 (not 404, not HTML)',
  '  catalog.json should return 200',
].join('\n');

fs.writeFileSync(path.join(releaseDir, 'DEPLOY.txt'), notes);
console.log(`IIS package ready: ${releaseDir}`);
