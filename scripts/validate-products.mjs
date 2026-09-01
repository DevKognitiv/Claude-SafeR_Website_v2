#!/usr/bin/env node
// Validates one or more product source files without requiring the whole catalogue: node scripts/validate-products.mjs data/catalog/products/reolink.json
import path from 'node:path';
import { applyTuyaRule, catalogDir, readJson, validateProduct } from './catalog-lib.mjs';

const files = process.argv.slice(2);
if (!files.length) { console.error('usage: validate-products.mjs <file.json> [...]'); process.exit(2); }
const taxonomy = await readJson(path.join(catalogDir, 'taxonomy.json'));
let failed = false;
for (const file of files) {
  const list = await readJson(file);
  const seen = { ids: new Set(), skus: new Set() };
  const errors = [];
  if (!Array.isArray(list)) errors.push(`${file}: expected an array`);
  else for (const product of list) errors.push(...validateProduct(applyTuyaRule({ ...product, _file: path.basename(file) }), taxonomy, seen));
  if (errors.length) { failed = true; console.error(`✖ ${file}\n - ${errors.join('\n - ')}`); }
  else console.log(`✔ ${file}: ${list.length} produits valides`);
}
process.exit(failed ? 1 : 0);
