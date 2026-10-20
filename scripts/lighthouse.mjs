#!/usr/bin/env node
// Lighthouse LOCAL (sin PageSpeed ni servicios externos) contra wrangler dev (:8787).
// Uso: node scripts/lighthouse.mjs [ruta ...]   ·   Chrome: el de Playwright.
// Imprime las 4 puntuaciones y LCP/CLS/TBT por ruta y por dispositivo (móvil y escritorio).
import lighthouse from 'lighthouse'
import { launch } from 'chrome-launcher'
import { chromium } from '@playwright/test'

const BASE = process.env.LH_BASE || 'http://127.0.0.1:8787'
const paths = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/precios/', '/noticias/', '/blog/que-es-un-agente-de-ia', '/en/']
const chrome = await launch({ chromePath: chromium.executablePath(), chromeFlags: ['--headless=new', '--no-sandbox'] })
const rows = []
for (const formFactor of ['mobile', 'desktop']) {
  for (const p of paths) {
    const cfg = formFactor === 'desktop'
      ? { extends: 'lighthouse:default', settings: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1440, height: 900, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } } }
      : { extends: 'lighthouse:default' }
    const r = await lighthouse(`${BASE}${p}`, { port: chrome.port, output: 'json', logLevel: 'error' }, cfg)
    const c = r.lhr.categories, a = r.lhr.audits
    rows.push({
      ruta: p, disp: formFactor,
      perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100),
      bp: Math.round(c['best-practices'].score * 100), seo: Math.round(c.seo.score * 100),
      LCP: a['largest-contentful-paint'].displayValue, CLS: a['cumulative-layout-shift'].displayValue, TBT: a['total-blocking-time'].displayValue,
      fallos: Object.values(a).filter((x) => x.score !== null && x.score < 0.9 && x.scoreDisplayMode === 'binary').map((x) => x.id).slice(0, 6).join(','),
    })
  }
}
await chrome.kill()
console.table(rows)
