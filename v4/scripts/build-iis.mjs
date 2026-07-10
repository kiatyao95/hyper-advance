import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

delete process.env.GITHUB_PAGES;
if (!process.env.BASE_PATH) process.env.BASE_PATH = '/';

const env = { ...process.env };

function run(label, command, args = []) {
  console.log(`\n> ${label}`);
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: 'inherit',
    env,
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run('generate sitemap', 'node', ['scripts/generate-sitemap.mjs']);
run('vite build', 'npx', ['vite', 'build']);
run('prerender routes', 'node', ['scripts/generate-prerender.mjs']);
run('generate web.config', 'node', ['scripts/generate-web-config.mjs']);
run('verify IIS build', 'node', ['scripts/verify-iis-build.mjs']);

console.log('\nIIS build complete: v4/dist/');
