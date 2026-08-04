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

    // Todo lo demás → los assets estáticos de la landing.
    return env.ASSETS.fetch(request);
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
