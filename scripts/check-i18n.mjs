#!/usr/bin/env node
// 1) Every locale dictionary must have exactly the FR key structure (no missing / orphan keys, no empty strings).
// 2) No hard-coded French copy in JSX (text nodes must come from the dictionaries).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['fr', 'en', 'es', 'ar', 'zh'];
let failed = false;

// --- dictionaries (compiled on the fly with tsx-free approach: we import the built TS via a tiny transpile using TypeScript's compiler API)
import ts from 'typescript';
async function loadDictionary(locale) {
  const dir = path.join(root, 'lib/i18n/dictionaries', locale);
  const files = readdirSync(dir).filter((f) => f.endsWith('.ts'));
  const modules = {};
  const cacheDir = path.join(root, '.i18n-cache', locale);
  const { mkdirSync, writeFileSync } = await import('node:fs');
  mkdirSync(cacheDir, { recursive: true });
  for (const file of files) {
    const source = readFileSync(path.join(dir, file), 'utf8');
    const out = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
      .replace(/from '\.\/(\w+)';/g, "from './$1.mjs';")
      .replace(/from '\.\.\/fr';/g, "from '../fr/index.mjs';");
    writeFileSync(path.join(cacheDir, file.replace(/\.ts$/, '.mjs')), out);
    modules[file] = true;
  }
  const mod = await import(pathToFileURL(path.join(cacheDir, 'index.mjs')).href + `?t=${Date.now()}`);
  return mod[locale];
}

function flatten(value, prefix = '', out = {}) {
  if (Array.isArray(value)) { value.forEach((v, i) => flatten(v, `${prefix}[${i}]`, out)); return out; }
  if (value && typeof value === 'object') { for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out); return out; }
  out[prefix] = value;
  return out;
}

const fr = flatten(await loadDictionary('fr'));
const frKeys = Object.keys(fr);
console.log(`FR dictionary: ${frKeys.length} strings`);
for (const locale of locales.slice(1)) {
  const dict = flatten(await loadDictionary(locale));
  const keys = Object.keys(dict);
  const missing = frKeys.filter((k) => !(k in dict));
  const orphan = keys.filter((k) => !(k in fr));
  const empty = keys.filter((k) => typeof dict[k] === 'string' && !dict[k].trim());
  const untranslated = frKeys.filter((k) => typeof fr[k] === 'string' && fr[k].length > 12 && /[a-zàâçéèêëîïôûùüÿœ]/i.test(fr[k]) && dict[k] === fr[k] && !/^(SafeR|RADIANT|https?:|tel:|\+225|contact@|\d)/.test(fr[k]) && !k.startsWith('common.phone') && !k.includes('Href') && !k.includes('href') && !k.includes('.icon') && !k.includes('solution') );
  const identical = untranslated.filter((k) => !/\.(n|price|value|short)$/.test(k));
  const status = missing.length || orphan.length || empty.length ? '✖' : '✔';
  if (status === '✖') failed = true;
  console.log(`${status} ${locale}: ${keys.length} strings · missing ${missing.length} · orphan ${orphan.length} · empty ${empty.length} · identical-to-FR ${identical.length}`);
  for (const k of missing.slice(0, 15)) console.log(`   missing  ${k}`);
  for (const k of orphan.slice(0, 15)) console.log(`   orphan   ${k}`);
  for (const k of empty.slice(0, 15)) console.log(`   empty    ${k}`);
  if (process.argv.includes('--verbose')) for (const k of identical.slice(0, 40)) console.log(`   same     ${k} = ${String(fr[k]).slice(0, 60)}`);
}

// --- hard-coded copy scan
const skipDirs = new Set(['node_modules', '.next', 'dist', '.vinext', '.wrangler', '.git', 'lib/i18n', 'data', 'crawler', '.i18n-cache']);
function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const rel = path.relative(root, full);
    if (skipDirs.has(rel) || skipDirs.has(entry)) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(entry)) out.push(full);
  }
  return out;
}
const frenchWord = /\b(le|la|les|des|une|votre|vos|pour|avec|dans|est|sont|sur|nous|vous|et|ou|du|au|aux|sécurité|maison|depuis)\b/i;
const findings = [];
for (const file of walk(path.join(root, 'app')).concat(walk(path.join(root, 'components')))) {
  const source = readFileSync(file, 'utf8');
  // JSX text nodes: between > and < that are not expressions, ignoring symbols/numbers
  const matches = source.matchAll(/>([^<>{}\n]{4,})</g);
  for (const match of matches) {
    const text = match[1].trim();
    if (!text || /^[\d\s%·•→←↗✓✦◉⌂⌁▣♨◎◈▦▤×+\-–—.,:;/|()'’"“”«»&;#]+$/.test(text)) continue;
    if (/^(SafeR|RADIANT|AK|FCFA|24\/7|4K|2K|Wi-Fi|SÉLECTION|MATCH|EN LIGNE|Ⅱ|▶|☀|◐|≡|Abidjan|Cocody|Store|Support|Solutions|Smart|KleenR|CI)/.test(text) && text.split(' ').length <= 3) continue;
    if (/[àâçéèêëîïôûùüÿœÀÂÇÉÈÊËÎÏÔÛÙÜŸŒ’]/.test(text) || frenchWord.test(text)) findings.push(`${path.relative(root, file)}: "${text.slice(0, 70)}"`);
  }
  for (const match of source.matchAll(/(?:placeholder|aria-label|title|alt)="([^"{}]{4,})"/g)) {
    const text = match[1];
    if (/[àâçéèêëîïôûùüÿœ’]/i.test(text) || frenchWord.test(text)) findings.push(`${path.relative(root, file)} [attr]: "${text.slice(0, 70)}"`);
  }
}
if (findings.length) { failed = true; console.log(`✖ ${findings.length} hard-coded French text(s) found:`); findings.forEach((f) => console.log(`   ${f}`)); }
else console.log('✔ no hard-coded French copy in app/ and components/');
process.exit(failed ? 1 : 0);
