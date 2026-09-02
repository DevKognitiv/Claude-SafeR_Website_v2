#!/usr/bin/env node
/**
 * Scans public/media/pages/ and writes data/page-images.json.
 *
 * Each page of the site declares an "image slot" (see lib/images.ts). Dropping a
 * file named <slot>.jpg (or .webp / .png / .avif) into public/media/pages/ makes
 * the site use it automatically — no code change required. Slots without a local
 * file fall back to the curated stock image declared in lib/images.ts.
 *
 * Run automatically before `npm run build` (prebuild) and on demand with
 * `npm run images:manifest`.
 */
import { readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, extname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'public', 'media', 'pages');
const out = join(root, 'data', 'page-images.json');
const priority = ['.avif', '.webp', '.jpg', '.jpeg', '.png'];

const manifest = {};
if (existsSync(dir)) {
  for (const file of readdirSync(dir).sort()) {
    const ext = extname(file).toLowerCase();
    if (!priority.includes(ext)) continue;
    const slot = basename(file, ext);
    const current = manifest[slot];
    if (!current || priority.indexOf(ext) < priority.indexOf(extname(current).toLowerCase())) {
      manifest[slot] = `/media/pages/${file}`;
    }
  }
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(manifest, null, 2)}\n`);
const count = Object.keys(manifest).length;
console.log(`page-images.json: ${count} local image${count === 1 ? '' : 's'} registered${count ? ` (${Object.keys(manifest).join(', ')})` : ''}.`);
