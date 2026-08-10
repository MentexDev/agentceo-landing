// Worker de la landing de AgentCEO.
// - Sirve los archivos estáticos de ./public (binding ASSETS).
// - Captura la LISTA DE ESPERA (pre-lanzamiento) en D1 vía POST /api/waitlist.
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/waitlist") {
      if (request.method === "POST") return handleWaitlist(request, env);
      return json({ ok: false, error: "Método no permitido" }, 405);
    }

    if (url.pathname === "/api/lead") {
      if (request.method === "POST") return handleLead(request, env);
      return json({ ok: false, error: "Método no permitido" }, 405);
    }

    // Todo lo demás → los assets estáticos de la landing (con headers de seguridad).
    const res = await env.ASSETS.fetch(request);
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("text/html")) return res;
    const h = new Headers(res.headers);
    // CSP: complementa (no sustituye) el escape del generador. 'unsafe-inline' es
    // necesario porque el sitio usa <script>/<style>/style="" inline; el resto
    // se cierra a 'self' + Google Fonts. img data: para favicons/OG.
    h.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; media-src 'self'; connect-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'self'; form-action 'self'",
    );
    h.set("X-Content-Type-Options", "nosniff");
    h.set("Referrer-Policy", "strict-origin-when-cross-origin");
    h.set("X-Frame-Options", "SAMEORIGIN");
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
  },
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleWaitlist(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Cuerpo inválido" }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "Cuerpo inválido" }, 400);
  }

  // Campo trampa (honeypot): oculto por CSS. Una persona no lo llena, un bot sí.
  // Se responde OK a propósito, sin guardar (no le avisamos al bot que lo detectamos).
  if (typeof body.company === "string" && body.company.trim()) {
    return json({ ok: true, received: true });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Escribe un correo válido." }, 400);
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const source = String(body.source || "landing").slice(0, 60);
  const referrer = String(body.referrer || "").slice(0, 300);
  const ua = (request.headers.get("user-agent") || "").slice(0, 300);

  try {
    // INSERT OR IGNORE + índice único por email → reenviar no crea duplicados.
    await env.DB.prepare(
      "INSERT OR IGNORE INTO signups (email, name, source, referrer, user_agent) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(email, name || null, source, referrer || null, ua || null)
      .run();
    return json({ ok: true, received: true });
  } catch {
    return json({ ok: false, error: "No pudimos guardarlo. Intenta de nuevo." }, 500);
  }
}

async function handleLead(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Cuerpo inválido" }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ ok: false, error: "Cuerpo inválido" }, 400);
  }

  // Honeypot: si el campo oculto viene lleno, es un bot. Se responde OK sin guardar.
  if (typeof body.company === "string" && body.company.trim()) {
    return json({ ok: true, received: true });
  }

  const email = String(body.email || "").trim().toLowerCase().slice(0, 160);
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: "Escribe un correo válido." }, 400);
  }

  const resource = String(body.resource || "").trim().slice(0, 120);
  if (!resource) {
    return json({ ok: false, error: "Falta el recurso solicitado." }, 400);
  }

  const name = String(body.name || "").trim().slice(0, 120);
  const source = String(body.source || "recursos").slice(0, 60);
  const referrer = String(body.referrer || "").slice(0, 300);
  const ua = (request.headers.get("user-agent") || "").slice(0, 300);

  try {
    // INSERT OR IGNORE + índice único (email, resource) → reenviar no duplica.
    await env.DB.prepare(
      "INSERT OR IGNORE INTO leads (email, name, resource, source, referrer, user_agent) VALUES (?, ?, ?, ?, ?, ?)",
    )
      .bind(email, name || null, resource, source, referrer || null, ua || null)
      .run();
    return json({ ok: true, received: true });
  } catch {
    return json({ ok: false, error: "No pudimos guardarlo. Intenta de nuevo." }, 500);
  }
}
