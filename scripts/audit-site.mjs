#!/usr/bin/env node
// Site quality audit: renders every route (FR) with Playwright and every route in each locale over HTTP.
// Checks: HTTP status, console errors, broken internal links, broken images, h1 count, horizontal overflow (375px),
// <html lang/dir>, residual French copy in non-FR locales, template placeholders left in text.
// Usage: node scripts/audit-site.mjs [--base http://localhost:3000] [--out audit] [--sample 14]
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : fallback; };
const BASE = opt('base', 'http://localhost:3000').replace(/\/$/, '');
const OUT = opt('out', 'audit');
const SAMPLE = Number(opt('sample', 14));
const LOCALES = ['fr', 'en', 'es', 'ar', 'zh'];
const RTL = new Set(['ar']);

const frenchMarkers = /\b(votre|vos|notre|nos|pour|avec|dans|depuis|sécurité|maison|équipements?|détection|caméras?|garantie|à partir de|sur devis|découvrir|voir|toutes?|tous)\b/gi;
const placeholderMarkers = /\{[a-zA-Z]+\}|\bundefined\b|\[object Object\]|\bNaN\b/g;

async function fetchText(url, locale) {
  const response = await fetch(url, { headers: { cookie: `safer-locale=${locale}`, 'accept-language': locale }, redirect: 'manual' });
  return { status: response.status, html: response.status === 200 ? await response.text() : '' };
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

async function routesFromSitemap() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const extra = ['/espace-client', '/store/comparer', '/partenaires/inscription', '/partenaires/tableau-de-bord', '/cette-page-n-existe-pas'];
  return Array.from(new Set([...urls, ...extra]));
}

function sampleRoutes(routes) {
  const products = routes.filter((r) => /^\/store\/[^/]+\/[^/]+\/[^/]+$/.test(r) && !r.startsWith('/store/marques'));
  const sections = routes.filter((r) => /^\/store\/[^/]+\/[^/]+\/[^/]+\/[^/]+$/.test(r));
  const others = routes.filter((r) => !products.includes(r) && !sections.includes(r));
  const step = Math.max(1, Math.floor(products.length / SAMPLE));
  const pickedProducts = products.filter((_, i) => i % step === 0).slice(0, SAMPLE);
  const pickedSections = sections.filter((s) => pickedProducts.slice(0, 3).some((p) => s.startsWith(`${p}/`)));
  return { full: others.concat(pickedProducts, pickedSections), products, sections, others };
}

const report = { base: BASE, startedAt: new Date().toISOString(), routes: 0, pages: [], locales: {}, summary: {} };
const issues = [];
const addIssue = (severity, route, locale, type, detail) => issues.push({ severity, route, locale, type, detail });

const allRoutes = await routesFromSitemap();
report.routes = allRoutes.length;
const { full, products, sections } = sampleRoutes(allRoutes);
console.log(`Audit ${BASE} · ${allRoutes.length} routes (${products.length} produits, ${sections.length} sections produit) · rendu Playwright sur ${full.length} routes`);

// ---------- 1) HTTP pass, every route × every locale
for (const locale of LOCALES) {
  const stats = { pages: 0, ok: 0, errors: 0, wrongLang: 0, residualFrench: 0, placeholders: 0 };
  for (const route of allRoutes) {
    stats.pages += 1;
    let res;
    try { res = await fetchText(`${BASE}${route}`, locale); } catch (error) { stats.errors += 1; addIssue('bloquant', route, locale, 'fetch', String(error.message)); continue; }
    // Authenticated partner pages redirect (307) to the ChatGPT sign-in when no session is present.
    const expected = route === '/cette-page-n-existe-pas' ? 404 : /^\/partenaires\/(inscription|tableau-de-bord)$/.test(route) ? 307 : 200;
    if (res.status !== expected) { stats.errors += 1; addIssue('bloquant', route, locale, 'http', `HTTP ${res.status} (attendu ${expected})`); continue; }
    if (expected !== 200) { stats.ok += 1; continue; }
    stats.ok += 1;
    const langMatch = res.html.match(/<html[^>]*\blang="([^"]+)"/);
    const dirMatch = res.html.match(/<html[^>]*\bdir="([^"]+)"/);
    const lang = langMatch?.[1] ?? '';
    if (!lang.startsWith(locale)) { stats.wrongLang += 1; addIssue('majeur', route, locale, 'lang', `<html lang="${lang}">`); }
    if (RTL.has(locale) && dirMatch?.[1] !== 'rtl') addIssue('majeur', route, locale, 'dir', `dir="${dirMatch?.[1]}"`);
    const text = visibleText(res.html);
    const placeholders = text.match(placeholderMarkers);
    if (placeholders) { stats.placeholders += 1; addIssue('majeur', route, locale, 'placeholder', placeholders.slice(0, 5).join(', ')); }
    if (locale !== 'fr') {
      const hits = text.match(frenchMarkers) ?? [];
      const words = text.split(' ').length;
      const ratio = hits.length / Math.max(words, 1);
      if (hits.length >= 8 && ratio > 0.01) { stats.residualFrench += 1; addIssue('majeur', route, locale, 'residual-fr', `${hits.length} marqueurs FR (${(ratio * 100).toFixed(1)} %) : ${Array.from(new Set(hits.map((h) => h.toLowerCase()))).slice(0, 8).join(', ')}`); }
    }
  }
  report.locales[locale] = stats;
  console.log(`  ${locale}: ${stats.ok}/${stats.pages} OK · lang KO ${stats.wrongLang} · FR résiduel ${stats.residualFrench} · placeholders ${stats.placeholders} · erreurs ${stats.errors}`);
}

// ---------- 2) Playwright pass (FR full sample, other locales key pages)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const keyPages = ['/', '/store', '/store/video', '/store/video/cameras-exterieures', products[0], '/offres', '/offres/serenite', '/solutions', '/solutions/video-intelligente', '/solutions/video-intelligente/cameras-exterieures', '/quartiers', '/partenaires', '/support', '/support/faq', '/a-propos', '/diagnostic', '/store/marques', '/store/comparer', '/plan-du-site', '/mentions-legales'].filter(Boolean);
const checkedLinks = new Map();

async function renderAudit(route, locale, viewport) {
  const context = await browser.newContext({ viewport, locale: locale === 'zh' ? 'zh-CN' : locale, reducedMotion: 'no-preference' });
  await context.addCookies([{ name: 'safer-locale', value: locale, url: BASE }]);
  const page = await context.newPage();
  // External hosts (Pexels video/images, CDNs) are outside the audit scope: block them so pages settle quickly.
  await page.route('**/*', (route) => { const url = route.request().url(); if (url.startsWith(BASE) || url.startsWith('data:')) route.continue(); else route.abort(); });
  const consoleErrors = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 160)); });
  page.on('pageerror', (error) => consoleErrors.push(`pageerror: ${String(error.message).slice(0, 160)}`));
  const started = Date.now();
  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 45000 }).catch(() => null);
  const loadMs = Date.now() - started;
  const status = response?.status() ?? 0;
  const result = { route, locale, viewport: viewport.width, status, loadMs, consoleErrors: consoleErrors.filter((e) => !/pexels|ERR_BLOCKED_BY_CLIENT|net::ERR|favicon|Failed to load resource/i.test(e)), h1: 0, overflow: false, brokenImages: [], brokenLinks: [], missingAlt: 0, title: '' };
  if (status === 200) {
    await page.waitForTimeout(400);
    const data = await page.evaluate(() => {
      const imgs = Array.from(document.images);
      return {
        h1: document.querySelectorAll('h1').length,
        title: document.title,
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        brokenImages: imgs.filter((img) => img.complete && img.naturalWidth === 0 && !img.src.startsWith('data:') && img.src.startsWith(location.origin)).map((img) => img.getAttribute('src')).slice(0, 10),
        missingAlt: imgs.filter((img) => !img.hasAttribute('alt')).length,
        links: Array.from(document.querySelectorAll('a[href]')).map((a) => a.getAttribute('href')).filter((h) => h && h.startsWith('/') && !h.startsWith('//')),
        lang: document.documentElement.lang,
        hiddenReveal: Array.from(document.querySelectorAll('[data-reveal]')).filter((el) => getComputedStyle(el).opacity === '0').length,
      };
    });
    Object.assign(result, { h1: data.h1, title: data.title, overflow: data.overflow, brokenImages: data.brokenImages, missingAlt: data.missingAlt, hiddenReveal: data.hiddenReveal });
    if (locale === 'fr' && viewport.width > 400) {
      for (const href of new Set(data.links)) {
        const clean = href.split('#')[0].split('?')[0] || '/';
        if (!checkedLinks.has(clean)) {
          const r = await fetch(`${BASE}${clean}`, { method: 'GET', redirect: 'manual' }).catch(() => ({ status: 0 }));
          checkedLinks.set(clean, r.status);
        }
        const okStatus = /^\/partenaires\/(inscription|tableau-de-bord)$/.test(clean) ? [200, 307] : [200];
        if (!okStatus.includes(checkedLinks.get(clean))) result.brokenLinks.push(`${href} → ${checkedLinks.get(clean)}`);
      }
    }
  }
  await context.close();
  if (status !== 200 && route !== '/cette-page-n-existe-pas' && !/^\/partenaires\/(inscription|tableau-de-bord)$/.test(route)) addIssue('bloquant', route, locale, 'render', `HTTP ${status}`);
  if (result.consoleErrors.length) addIssue('majeur', route, locale, 'console', result.consoleErrors.slice(0, 3).join(' | '));
  if (result.h1 !== 1 && status === 200) addIssue('mineur', route, locale, 'h1', `${result.h1} <h1>`);
  if (result.overflow) addIssue('majeur', route, locale, 'overflow', `Débordement horizontal à ${viewport.width}px`);
  if (result.brokenImages.length) addIssue('majeur', route, locale, 'image', result.brokenImages.join(', '));
  if (result.brokenLinks.length) addIssue('bloquant', route, locale, 'link', result.brokenLinks.join(', '));
  if (result.missingAlt) addIssue('mineur', route, locale, 'alt', `${result.missingAlt} image(s) sans attribut alt`);
  report.pages.push(result);
  return result;
}

let done = 0;
for (const route of full) {
  await renderAudit(route, 'fr', { width: 1366, height: 900 });
  done += 1;
  if (done % 20 === 0) console.log(`  rendu FR ${done}/${full.length}`);
}
for (const route of keyPages) await renderAudit(route, 'fr', { width: 375, height: 740 });
for (const locale of LOCALES.slice(1)) for (const route of keyPages) await renderAudit(route, locale, { width: 1366, height: 900 });
await browser.close();

// ---------- summary
const bySeverity = { bloquant: 0, majeur: 0, mineur: 0 };
for (const issue of issues) bySeverity[issue.severity] += 1;
report.summary = { issues: issues.length, ...bySeverity, rendered: report.pages.length, avgLoadMs: Math.round(report.pages.reduce((s, p) => s + p.loadMs, 0) / Math.max(report.pages.length, 1)), linksChecked: checkedLinks.size, brokenLinks: [...checkedLinks].filter(([, s]) => s !== 200).length };
report.issues = issues;
report.finishedAt = new Date().toISOString();
await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, 'audit-report.json'), `${JSON.stringify(report, null, 2)}\n`);

const md = [`# Audit SafeR — ${report.finishedAt}`, '', `Base : ${BASE} · ${report.routes} routes · ${report.pages.length} rendus navigateur · ${checkedLinks.size} liens internes vérifiés (${report.summary.brokenLinks} cassés)`, '', `**Anomalies : ${issues.length}** — bloquantes ${bySeverity.bloquant} · majeures ${bySeverity.majeur} · mineures ${bySeverity.mineur}`, '', '## Couverture par langue (HTTP, toutes les routes)', '', '| Langue | Pages OK | lang KO | FR résiduel | Placeholders | Erreurs |', '|---|---|---|---|---|---|', ...LOCALES.map((l) => { const s = report.locales[l]; return `| ${l} | ${s.ok}/${s.pages} | ${s.wrongLang} | ${s.residualFrench} | ${s.placeholders} | ${s.errors} |`; }), '', '## Anomalies', '', issues.length ? '| Sévérité | Route | Langue | Type | Détail |\n|---|---|---|---|---|\n' + issues.map((i) => `| ${i.severity} | ${i.route} | ${i.locale} | ${i.type} | ${String(i.detail).replace(/\|/g, '/')} |`).join('\n') : 'Aucune anomalie détectée.'];
await writeFile(path.join(OUT, 'audit-report.md'), `${md.join('\n')}\n`);
console.log(`\n${issues.length} anomalie(s) — bloquantes ${bySeverity.bloquant}, majeures ${bySeverity.majeur}, mineures ${bySeverity.mineur}. Rapport : ${OUT}/audit-report.md`);
