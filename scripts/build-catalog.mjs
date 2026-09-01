#!/usr/bin/env node
// Validates data/catalog sources and regenerates data/store-catalog.json.
import { readFile, rename, writeFile } from 'node:fs/promises';
import { buildCatalog, loadSources, outputPath } from './catalog-lib.mjs';

const sources = await loadSources();
let previous = null;
try { previous = JSON.parse(await readFile(outputPath, 'utf8')); } catch { /* first build */ }

try {
  const catalog = buildCatalog(sources, previous);
  const temporary = `${outputPath}.tmp`;
  await writeFile(temporary, `${JSON.stringify(catalog, null, 2)}\n`, 'utf8');
  await rename(temporary, outputPath);
  const byBrand = Object.values(catalog.brands).filter((b) => b.count).map((b) => `${b.name} ${b.count}`).join(', ');
  console.log(`✔ Catalogue généré : ${catalog.products.length} références (${byBrand})`);
} catch (error) {
  console.error(`✖ ${error.message}`);
  process.exit(1);
}
