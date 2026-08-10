// ─────────────────────────────────────────────────────────────────────────────
// Generador estático de contenido de la landing de AgentCEO.
//
// Lee los datos curados (content/*.js) y escribe HTML estático premium en
// public/{noticias,blog,recursos}/, heredando el sistema de diseño champagne de
// index.html. Sin framework, sin backend: el Worker sirve el HTML tal cual.
//
// Uso:  node scripts/build-content.mjs      (o `npm run build`)
// ─────────────────────────────────────────────────────────────────────────────
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const PUBLIC = join(ROOT, 'public')
const ORIGIN = 'https://agentceo.io'
const OG_IMAGE = `${ORIGIN}/apple-touch-icon.png`

// ── Utilidades ───────────────────────────────────────────────────────────────
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

/** Escapa texto para insertarlo con seguridad en HTML (texto y atributos). */
function esc(s = '') {
  return String(s)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;')
}

/**
 * Solo deja pasar URLs http(s) SIN caracteres que rompan un atributo HTML.
 * Rechaza comillas, < > y espacios (defensa en profundidad); cualquier otra
 * cosa se vuelve '#'. La salida SIEMPRE debe pasar además por esc() en el href.
 */
function safeUrl(u = '') {
  const s = String(u)
  if (!/^https?:\/\//i.test(s)) return '#'
  if (/["'<>\s]/.test(s)) return '#'
  return s
}

/**
 * Serializa un objeto a JSON-LD seguro dentro de <script>. JSON.stringify NO
 * neutraliza `</script>` ni `<!--`, así que escapamos < > & a \uXXXX (siguen
 * siendo JSON válido) para que ningún dato pueda cerrar el <script> e inyectar.
 */
function jsonLdScript(obj) {
  const json = JSON.stringify(obj)
    .replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
  return `<script type="application/ld+json">${json}</script>`
}

/** "2026-08-07" → "7 ago 2026". Fecha larga legible en español. */
function fmtDate(iso = '') {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return ''
  const [, y, mo, d] = m
  return `${Number(d)} ${MESES[Number(mo) - 1]} ${y}`
}

/** Convierte un título en slug url-friendly (sin acentos, guiones). */
function slugify(s = '') {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 70)
}

/** URL pública LIMPIA de una pieza (sin .html; Cloudflare sirve el .html). */
function urlOf(base, slug) { return `${base}${slug}` }

// ── Bloques de cuerpo (contenido tipado, como NeuralOS) ──────────────────────
function renderBlocks(blocks = []) {
  return blocks.map((b) => {
    if (b.type === 'h') return `<h2>${esc(b.text)}</h2>`
    if (b.type === 'p') return `<p>${inline(b.text)}</p>`
    if (b.type === 'ul') return `<ul>${b.items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>`
    if (b.type === 'quote') return `<blockquote>${inline(b.text)}${b.cite ? `<cite>— ${esc(b.cite)}</cite>` : ''}</blockquote>`
    return ''
  }).join('\n')
}

/** Marcado inline mínimo y seguro: **negrita** dentro de texto escapado. */
function inline(text = '') {
  return esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}

// ── Layout compartido (head champagne + nav + footer) ────────────────────────
function navHTML(active = '') {
  const link = (href, label, key) =>
    `<a class="link${active === key ? ' is-active' : ''}" href="${href}"${active === key ? ' aria-current="page"' : ''}>${label}</a>`
  return `
    <nav>
      <a href="/" class="brand" aria-label="AgentCEO — inicio">
        <img class="a" src="/logo-agent.png" alt="Agent" />
        <span class="dot">·</span>
        <img class="b" src="/logo-ceo.png" alt="CEO" />
      </a>
      <button class="nav-toggle" type="button" aria-label="Abrir menú" aria-expanded="false" aria-controls="navlinks">
        <span></span><span></span><span></span>
      </button>
      <div class="nav-links" id="navlinks">
        <a class="link" href="/#como-funciona">Cómo funciona</a>
        <a class="link" href="/#equipo">Agentes</a>
        ${link('/noticias/', 'Noticias', 'noticias')}
        ${link('/blog/', 'Blog', 'blog')}
        ${link('/recursos/', 'Recursos', 'recursos')}
        ${link('/precios/', 'Precios', 'precios')}
      </div>
      <div class="nav-cta">
        <a class="btn btn-primary btn-sm" href="/#waitlist" data-open-waitlist>Únete a la lista</a>
      </div>
    </nav>`
}

function footerHTML() {
  return `
  <footer>
    <div class="wrap">
      <div class="foot-top">
        <div class="foot-brand">
          <a href="/" class="brand" aria-label="AgentCEO">
            <img class="a" src="/logo-agent.png" alt="Agent" />
            <span class="dot">·</span>
            <img class="b" src="/logo-ceo.png" alt="CEO" />
          </a>
          <p>La plataforma donde creas tu empresa y un equipo de agentes de IA la opera de verdad.</p>
        </div>
        <div class="foot-col">
          <h4>Producto</h4>
          <a href="/#como-funciona">Cómo funciona</a>
          <a href="/#equipo">Agentes</a>
          <a href="/precios/">Precios</a>
        </div>
        <div class="foot-col">
          <h4>Contenido</h4>
          <a href="/noticias/">Noticias</a>
          <a href="/blog/">Blog</a>
          <a href="/recursos/">Recursos</a>
        </div>
        <div class="foot-col">
          <h4>Empresa</h4>
          <a href="/#waitlist">Únete a la lista</a>
          <a href="mailto:ceo@agentceo.io">Contacto</a>
          <a href="/#faq">Preguntas</a>
        </div>
        <div class="foot-col">
          <h4>Legal</h4>
          <a href="/legal/terminos.html">Términos del servicio</a>
          <a href="/legal/privacidad.html">Política de privacidad</a>
          <a href="/legal/cookies.html">Política de cookies</a>
          <a href="/legal/seguridad.html">Seguridad</a>
          <a href="/legal/gdpr.html">GDPR</a>
        </div>
      </div>
      <div class="foot-bottom">
        <div>© <span id="year">2026</span> AgentCEO · agentceo.io — Todos los derechos reservados.</div>
        <div class="legal-links">
          <a href="/legal/terminos.html">Términos</a>
          <a href="/legal/privacidad.html">Privacidad</a>
          <a href="/legal/cookies.html">Cookies</a>
          <a href="/legal/seguridad.html">Seguridad</a>
          <a href="/legal/gdpr.html">GDPR</a>
        </div>
      </div>
    </div>
  </footer>`
}

// Modal de lista de espera (se abre desde cualquier botón [data-open-waitlist]).
const WAITLIST_MODAL = `
  <div class="wl-modal" id="wlModal" hidden>
    <div class="wl-backdrop" data-close-waitlist></div>
    <div class="wl-card" role="dialog" aria-modal="true" aria-labelledby="wlModalTitle">
      <button class="wl-close" type="button" aria-label="Cerrar" data-close-waitlist>&times;</button>
      <span class="eyebrow">Pre-lanzamiento</span>
      <h2 id="wlModalTitle">Únete a la lista</h2>
      <p class="wl-modal-sub">Déjanos tu correo y sé de los primeros en probar AgentCEO. Gratis para empezar.</p>
      <form class="wl-modal-form" id="wlModalForm" novalidate>
        <label class="sr-only" for="wl-modal-email">Tu correo</label>
        <input type="email" id="wl-modal-email" name="email" required placeholder="Tu correo" autocomplete="email" />
        <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button class="btn btn-primary" type="submit">Únete a la lista <span aria-hidden="true">→</span></button>
        <p class="wl-modal-msg" role="status" aria-live="polite"></p>
      </form>
    </div>
  </div>`

// Script común (año + menú móvil hamburguesa + modal de lista de espera). Va una vez por página.
const COMMON_SCRIPT = `
  <script>
    (function () {
      var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
      var t = document.querySelector('.nav-toggle'), n = document.getElementById('navlinks');
      if (t && n) t.addEventListener('click', function () {
        var open = n.classList.toggle('open');
        t.classList.toggle('is-open', open);
        t.setAttribute('aria-expanded', open ? 'true' : 'false');
        t.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      });
      var modal = document.getElementById('wlModal');
      if (modal) {
        var form = document.getElementById('wlModalForm'), msg = form.querySelector('.wl-modal-msg'), last = null;
        function open() { last = document.activeElement; modal.hidden = false; document.body.style.overflow = 'hidden'; var i = form.querySelector('input[type=email]'); if (i) i.focus(); }
        function close() { modal.hidden = true; document.body.style.overflow = ''; if (last && last.focus) last.focus(); }
        document.addEventListener('click', function (e) {
          if (e.target.closest('[data-open-waitlist]')) { e.preventDefault(); open(); return; }
          if (e.target.closest('[data-close-waitlist]')) close();
        });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) close(); });
        form.addEventListener('submit', async function (e) {
          e.preventDefault(); msg.textContent = ''; msg.className = 'wl-modal-msg';
          var email = form.email.value.trim();
          if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { msg.textContent = 'Escribe un correo válido.'; msg.classList.add('wl-err'); return; }
          var btn = form.querySelector('button[type=submit]'), prev = btn.innerHTML; btn.disabled = true; btn.textContent = 'Enviando…';
          try {
            var res = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, company: form.company.value.trim(), source: 'modal', referrer: document.referrer }) });
            var data = {}; try { data = await res.json(); } catch (e) {}
            if (!res.ok) throw new Error((data && data.error) || 'fail');
            form.email.value = ''; msg.textContent = '¡Listo! Te avisamos apenas abramos.'; msg.classList.add('wl-ok');
            btn.innerHTML = prev; btn.disabled = false;
          } catch (err) { msg.textContent = 'No pudimos guardarlo. Intenta de nuevo.'; msg.classList.add('wl-err'); btn.innerHTML = prev; btn.disabled = false; }
        });
      }
    })();
  </script>`

function layout({ title, description, canonical, active, body, jsonLd = null, ogType = 'website' }) {
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${esc(canonical)}" />

  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:site_name" content="AgentCEO" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />

  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#08080b" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/assets/content.css" />
  ${jsonLd ? jsonLdScript(jsonLd) : ''}
</head>
<body>
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  <header class="page-nav">${navHTML(active)}</header>
  <div id="contenido">
  ${body}
  </div>
  ${footerHTML()}
  ${WAITLIST_MODAL}
  ${COMMON_SCRIPT}
</body>
</html>`
}

// ── Tarjetas (listado) ───────────────────────────────────────────────────────
function cardHTML(item, base) {
  const href = esc(urlOf(base, item.slug))
  return `
    <a class="ccard" href="${href}" data-cat="${esc(item.category)}">
      <div class="ccard-top">
        <span class="ccard-cat">${esc(item.category)}</span>
        <time datetime="${esc(item.dateISO)}">${fmtDate(item.dateISO)}</time>
      </div>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.excerpt)}</p>
      <div class="ccard-foot">
        <span class="ccard-read">Leer <span aria-hidden="true">→</span></span>
        ${item.source?.name ? `<span class="ccard-src">${esc(item.source.name)}</span>` : ''}
      </div>
    </a>`
}

function featuredHTML(item, base) {
  const href = esc(urlOf(base, item.slug))
  return `
    <a class="feat" href="${href}" data-cat="${esc(item.category)}">
      <div class="feat-body">
        <div class="ccard-top">
          <span class="ccard-cat">${esc(item.category)}</span>
          <time datetime="${esc(item.dateISO)}">${fmtDate(item.dateISO)}</time>
        </div>
        <h2>${esc(item.title)}</h2>
        <p>${esc(item.excerpt)}</p>
        <div class="ccard-foot">
          <span class="ccard-read">Leer la nota <span aria-hidden="true">→</span></span>
          ${item.source?.name ? `<span class="ccard-src">Fuente: ${esc(item.source.name)}</span>` : ''}
        </div>
      </div>
      <div class="feat-art" aria-hidden="true"><span class="feat-ghost">${esc(item.category.charAt(0))}</span></div>
    </a>`
}

function renderListado({ meta, items, base, active, categories }) {
  const ordered = [...items].sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
  const featured = ordered.find((i) => i.featured) || ordered[0]
  const rest = ordered.filter((i) => i !== featured)

  const chips = ['Todas', ...categories]
    .map((c, i) => `<button class="chip-f${i === 0 ? ' on' : ''}" type="button" aria-pressed="${i === 0 ? 'true' : 'false'}" data-filter="${c === 'Todas' ? 'all' : esc(c)}">${esc(c)}</button>`)
    .join('')

  const body = `
  <main class="content-wrap">
    <div class="wrap">
      <div class="sec-head left">
        <span class="eyebrow">${esc(meta.eyebrow)}</span>
        <h1>${esc(meta.h1)}</h1>
        <p>${esc(meta.sub)}</p>
      </div>

      <div class="filters" role="group" aria-label="Filtrar por categoría">${chips}</div>

      ${featured ? `<div class="feat-wrap">${featuredHTML(featured, base)}</div>` : ''}

      <div class="cgrid">
        ${rest.map((i) => cardHTML(i, base)).join('')}
      </div>
      <p class="cempty" hidden>No hay notas en esta categoría todavía.</p>
    </div>
  </main>

  <script>
    (function () {
      var chips = document.querySelectorAll('.chip-f');
      var cards = document.querySelectorAll('[data-cat]');
      var empty = document.querySelector('.cempty');
      chips.forEach(function (chip) { chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('on'); c.setAttribute('aria-pressed', 'false'); });
        chip.classList.add('on'); chip.setAttribute('aria-pressed', 'true');
        var f = chip.dataset.filter, shown = 0;
        cards.forEach(function (card) {
          var ok = f === 'all' || card.dataset.cat === f;
          card.hidden = !ok; if (ok) shown++;
        });
        if (empty) empty.hidden = shown > 0;
      }); });
    })();
  </script>`

  return layout({ title: meta.title, description: meta.sub, canonical: meta.canonical, active, body, ogType: 'website' })
}

// ── Página de ARTÍCULO ───────────────────────────────────────────────────────
function articleJsonLd(item, canonical, schemaType) {
  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: item.title,
    datePublished: item.dateISO,
    dateModified: item.dateISO,
    articleSection: item.category,
    inLanguage: 'es',
    description: item.excerpt,
    image: OG_IMAGE,
    author: { '@type': 'Organization', name: 'AgentCEO', url: ORIGIN },
    publisher: {
      '@type': 'Organization', name: 'AgentCEO', url: ORIGIN,
      logo: { '@type': 'ImageObject', url: OG_IMAGE },
    },
    mainEntityOfPage: canonical,
    ...(item.source?.url && safeUrl(item.source.url) !== '#' ? { isBasedOn: safeUrl(item.source.url) } : {}),
  }
}

function renderArticulo({ item, base, active, sectionUrl, sectionName, related, schemaType = 'Article', sourcesLabel = 'Fuentes verificadas' }) {
  const canonical = `${ORIGIN}${urlOf(base, item.slug)}`
  const sourcesList = (item.sources && item.sources.length ? item.sources : (item.source ? [item.source] : []))
    .map((s) => `<li><a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer nofollow">${esc(s.name)} <span aria-hidden="true">↗</span></a></li>`)
    .join('')

  const relatedHTML = related.length ? `
    <aside class="related">
      <h3>Más de ${esc(sectionName)}</h3>
      <div class="cgrid">${related.map((i) => cardHTML(i, base)).join('')}</div>
    </aside>` : ''

  const body = `
  <main class="article-wrap">
    <div class="wrap-narrow">
      <a class="back" href="${esc(sectionUrl)}"><span aria-hidden="true">←</span> ${esc(sectionName)}</a>
      <div class="art-head">
        <div class="ccard-top">
          <span class="ccard-cat">${esc(item.category)}</span>
          <time datetime="${esc(item.dateISO)}">${fmtDate(item.dateISO)}</time>
          ${item.readMinutes ? `<span class="dotsep">·</span><span>${item.readMinutes} min de lectura</span>` : ''}
        </div>
        <h1>${esc(item.title)}</h1>
        <p class="art-lead">${esc(item.excerpt)}</p>
      </div>

      <article class="art-body">
        ${renderBlocks(item.body)}
      </article>

      ${sourcesList ? `
      <div class="sources">
        <h4>${esc(sourcesLabel)}</h4>
        <ul>${sourcesList}</ul>
        <p class="sources-note">Cada nota se contrasta con su fuente primaria antes de publicarse. Si ves algo que debamos corregir, escríbenos a <a href="mailto:ceo@agentceo.io">ceo@agentceo.io</a>.</p>
      </div>` : ''}

      <a class="back back-bottom" href="${esc(sectionUrl)}"><span aria-hidden="true">←</span> Volver a ${esc(sectionName)}</a>
    </div>
    <div class="wrap">${relatedHTML}</div>
  </main>`

  return layout({
    title: `${item.title} · AgentCEO`, description: item.excerpt, canonical, active, body,
    jsonLd: articleJsonLd(item, canonical, schemaType), ogType: 'article',
  })
}

// ── Página de RECURSO (con gate de correo · lead magnet) ─────────────────────
function renderRecurso({ item, base, active, sectionUrl, sectionName, related }) {
  const canonical = `${ORIGIN}${urlOf(base, item.slug)}`
  const whatYouGet = (item.whatYouGet || []).map((i) => `<li>${inline(i)}</li>`).join('')
  const sourcesList = (item.sources && item.sources.length ? item.sources : [])
    .map((s) => `<li><a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer nofollow">${esc(s.name)} <span aria-hidden="true">↗</span></a></li>`)
    .join('')

  const body = `
  <main class="article-wrap">
    <div class="wrap-narrow">
      <a class="back" href="${esc(sectionUrl)}"><span aria-hidden="true">←</span> ${esc(sectionName)}</a>
      <div class="art-head">
        <div class="ccard-top">
          <span class="ccard-cat">${esc(item.category)}</span>
          ${item.readMinutes ? `<span class="dotsep">·</span><span>Guía · ${item.readMinutes} min</span>` : ''}
        </div>
        <h1>${esc(item.title)}</h1>
        <p class="art-lead">${esc(item.excerpt)}</p>
      </div>

      <section class="resource-gate" id="gate">
        ${whatYouGet ? `<div class="rg-what"><h4>Qué incluye</h4><ul>${whatYouGet}</ul></div>` : ''}
        <form class="rg-form" id="leadForm" data-resource="${esc(item.slug)}" novalidate>
          <p class="rg-title" id="rg-title">Accede gratis a la guía completa</p>
          <div class="rg-row">
            <label class="sr-only" for="rg-email">Tu correo</label>
            <input type="email" id="rg-email" name="email" required placeholder="Tu correo" autocomplete="email" />
            <input type="text" name="company" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" />
            <button class="btn btn-primary" type="submit">Acceder gratis <span aria-hidden="true">→</span></button>
          </div>
          <p class="rg-msg" role="status" aria-live="polite"></p>
          <p class="rg-note">Sin spam. Te compartimos esta guía y contenido útil de vez en cuando; puedes darte de baja cuando quieras.</p>
        </form>
      </section>

      <article class="art-body gated-content" id="gatedContent" hidden>
        ${renderBlocks(item.body)}
        ${sourcesList ? `<div class="sources"><h4>Referencias</h4><ul>${sourcesList}</ul></div>` : ''}
        <div class="rg-actions">
          <button type="button" class="btn btn-ghost" onclick="window.print()">Guardar como PDF <span aria-hidden="true">↓</span></button>
        </div>
      </article>

      <a class="back back-bottom" href="${esc(sectionUrl)}"><span aria-hidden="true">←</span> Volver a ${esc(sectionName)}</a>
    </div>
    <div class="wrap">${related.length ? `<aside class="related"><h3>Más recursos</h3><div class="cgrid">${related.map((i) => cardHTML(i, base)).join('')}</div></aside>` : ''}</div>
  </main>

  <script>
    (function () {
      var form = document.getElementById('leadForm');
      var gate = document.getElementById('gate');
      var content = document.getElementById('gatedContent');
      var msg = form.querySelector('.rg-msg');
      var KEY = 'agentceo_lead_' + (form.dataset.resource || 'x');
      function reveal() { gate.hidden = true; content.hidden = false; }
      try { if (localStorage.getItem(KEY)) reveal(); } catch (e) {}
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        msg.textContent = ''; msg.className = 'rg-msg';
        var email = form.email.value.trim();
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { msg.textContent = 'Escribe un correo válido.'; msg.classList.add('rg-err'); return; }
        var btn = form.querySelector('button[type=submit]'); var prev = btn.innerHTML;
        btn.disabled = true; btn.textContent = 'Enviando…';
        try {
          var res = await fetch('/api/lead', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, company: form.company.value.trim(), resource: form.dataset.resource, referrer: document.referrer }),
          });
          var data = {}; try { data = await res.json(); } catch (e) {}
          if (!res.ok) throw new Error((data && data.error) || 'fail');
          try { localStorage.setItem(KEY, '1'); } catch (e) {}
          reveal();
          content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
          msg.textContent = 'No pudimos guardarlo. Revisa tu conexión e intenta de nuevo.';
          msg.classList.add('rg-err'); btn.disabled = false; btn.innerHTML = prev;
        }
      });
    })();
  </script>`

  return layout({
    title: `${item.title} · AgentCEO`, description: item.excerpt, canonical, active, body,
    jsonLd: articleJsonLd(item, canonical, 'Article'), ogType: 'article',
  })
}

// ── Página de PRECIOS (dedicada, estilo NeuralOS · contenido real) ───────────
const GUAR_ICONS = {
  gift: '<path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  x: '<circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>',
  lock: '<rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>',
}
const svgIcon = (paths, w = 20) =>
  `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`

function planCard(p) {
  return `
    <div class="plan${p.featured ? ' feat' : ''}">
      ${p.badge ? `<div class="plan-badge">${esc(p.badge)}</div>` : ''}
      <div class="pname">${esc(p.name)}</div>
      <div class="price">${esc(p.price)}</div>
      ${p.priceNote ? `<div class="price-note">${esc(p.priceNote)}</div>` : ''}
      <p class="pdesc">${esc(p.desc)}</p>
      <ul>${(p.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
      <a class="btn btn-${p.cta.style === 'primary' ? 'primary' : 'ghost'}" href="${esc(p.cta.href)}">${esc(p.cta.label)}</a>
    </div>`
}

function compareCell(v) {
  if (v === true) return `<td class="cok"><span class="sr-only">Incluido</span>${svgIcon('<path d="M20 6L9 17l-5-5"/>', 18)}</td>`
  if (v === false || v == null) return `<td class="cno"><span class="sr-only">No incluido</span><span aria-hidden="true">—</span></td>`
  return `<td>${esc(v)}</td>`
}

function renderPrecios(mod) {
  const { META: meta, PLANS = [], GUARANTEES = [], COMPARE = { cols: [], rows: [] }, FAQ = [] } = mod
  const canonical = `${ORIGIN}/precios/`

  const jsonLd = FAQ.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  } : null

  const body = `
  <main class="content-wrap precios-wrap">
    <div class="wrap">
      <div class="sec-head center">
        <span class="eyebrow">${esc(meta.eyebrow)}</span>
        <h1>${esc(meta.h1)}</h1>
        <p>${esc(meta.sub)}</p>
      </div>

      <div class="plans">
        ${PLANS.map(planCard).join('')}
      </div>

      <div class="guarantees">
        ${GUARANTEES.map((g) => `<div class="guar">${svgIcon(GUAR_ICONS[g.icon] || GUAR_ICONS.gift)}<span>${esc(g.text)}</span></div>`).join('')}
      </div>

      ${COMPARE.rows && COMPARE.rows.length ? `
      <div class="compare-wrap">
        <h2 class="precios-h2">Compara los planes</h2>
        <div class="compare-scroll">
          <table class="compare">
            <caption class="sr-only">Comparación de los planes de AgentCEO</caption>
            <thead><tr><th scope="col">Incluye</th>${COMPARE.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
            <tbody>
              ${COMPARE.rows.map((r) => `<tr><th scope="row">${esc(r.label)}</th>${compareCell(r.free)}${compareCell(r.team)}</tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>` : ''}

      ${FAQ.length ? `
      <div class="faq-wrap">
        <h2 class="precios-h2">Preguntas sobre precios</h2>
        <div class="faq">
          ${FAQ.map((f) => `<details><summary>${esc(f.q)} <span class="ic" aria-hidden="true">+</span></summary><div class="ans">${esc(f.a)}</div></details>`).join('')}
        </div>
      </div>` : ''}

      <div class="precios-cta">
        <h2>¿Listo para armar tu equipo?</h2>
        <p>Únete a la lista y sé de los primeros en probar AgentCEO. Gratis para empezar.</p>
        <a class="btn btn-primary" href="/#waitlist">Únete a la lista <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </main>`

  return layout({ title: meta.title, description: meta.sub, canonical, active: 'precios', body, jsonLd, ogType: 'website' })
}

async function buildPrecios() {
  const mod = await import(join(ROOT, 'content/precios.js')).catch(() => null)
  if (!mod || !mod.META) { console.log('· Precios: sin datos — se omite.'); return 0 }
  const outDir = join(PUBLIC, 'precios')
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })
  await writeFile(join(outDir, 'index.html'), renderPrecios(mod), 'utf8')
  console.log('✓ Precios → public/precios/')
  return 1
}

// ── Build de una sección ─────────────────────────────────────────────────────
async function buildSeccion({ dataFile, base, active, sectionName, schemaType, sourcesLabel, gated = false }) {
  const mod = await import(join(ROOT, dataFile)).catch(() => null)
  if (!mod || !Array.isArray(mod.ITEMS) || mod.ITEMS.length === 0) {
    console.log(`· ${sectionName}: sin datos en ${dataFile} — se omite (aún sin contenido).`)
    return { count: 0, urls: [] }
  }
  // Slug SIEMPRE normalizado (aunque venga explícito) → blinda href y writeFile
  // contra caracteres peligrosos / path traversal.
  const items = mod.ITEMS.map((it) => ({ ...it, slug: slugify(it.slug || it.title) }))
  const categories = mod.CATEGORIES || [...new Set(items.map((i) => i.category))]
  const meta = { ...mod.META, canonical: `${ORIGIN}${base}` }

  const outDir = join(PUBLIC, base)
  if (!existsSync(outDir)) await mkdir(outDir, { recursive: true })

  const urls = [urlOf(base, '')]
  await writeFile(join(outDir, 'index.html'), renderListado({ meta, items, base, active, categories }), 'utf8')

  for (const item of items) {
    const related = (gated ? items.filter((i) => i !== item) : items.filter((i) => i !== item && i.category === item.category))
      .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1))
      .slice(0, 3)
    const html = gated
      ? renderRecurso({ item, base, active, sectionUrl: base, sectionName, related })
      : renderArticulo({ item, base, active, sectionUrl: base, sectionName, related, schemaType, sourcesLabel })
    await writeFile(join(outDir, `${item.slug}.html`), html, 'utf8')
    urls.push(urlOf(base, item.slug))
  }
  console.log(`✓ ${sectionName}: ${items.length} nota(s) → public${base}`)
  return { count: items.length, urls }
}

// ── sitemap.xml + robots.txt ─────────────────────────────────────────────────
async function writeSitemap(paths) {
  const urls = ['/', '/precios/', ...paths]
  const uniq = [...new Set(urls)]
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniq.map((p) => `  <url><loc>${ORIGIN}${p}</loc></url>`).join('\n')}
</urlset>
`
  await writeFile(join(PUBLIC, 'sitemap.xml'), xml, 'utf8')
  const robots = `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
  await writeFile(join(PUBLIC, 'robots.txt'), robots, 'utf8')
  console.log(`✓ sitemap.xml (${uniq.length} URLs) + robots.txt`)
}

// ── Main ─────────────────────────────────────────────────────────────────────
const SECCIONES = [
  { dataFile: 'content/noticias.js', base: '/noticias/', active: 'noticias', sectionName: 'Noticias', schemaType: 'NewsArticle', sourcesLabel: 'Fuentes verificadas' },
  { dataFile: 'content/blog.js', base: '/blog/', active: 'blog', sectionName: 'Blog', schemaType: 'BlogPosting', sourcesLabel: 'Referencias' },
  { dataFile: 'content/recursos.js', base: '/recursos/', active: 'recursos', sectionName: 'Recursos', schemaType: 'Article', sourcesLabel: 'Referencias', gated: true },
]

let total = 0
const allUrls = []
for (const s of SECCIONES) {
  const r = await buildSeccion(s)
  total += r.count
  allUrls.push(...r.urls)
}
await buildPrecios()
await writeSitemap(allUrls)
console.log(`\n★ Build de contenido listo — ${total} pieza(s) generada(s).`)
