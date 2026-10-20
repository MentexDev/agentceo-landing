-- Lista de espera (pre-lanzamiento) de AgentCEO.
CREATE TABLE IF NOT EXISTS signups (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  name        TEXT,
  source      TEXT,
  referrer    TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
-- Índice único por correo → evita duplicados (el Worker guarda en minúsculas).
CREATE UNIQUE INDEX IF NOT EXISTS idx_signups_email ON signups(email);

-- Leads de los recursos (lead magnet): un correo puede pedir varios recursos.
CREATE TABLE IF NOT EXISTS leads (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT NOT NULL,
  name        TEXT,
  resource    TEXT NOT NULL,      -- slug del recurso solicitado
  source      TEXT,
  referrer    TEXT,
  user_agent  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
-- Único por (correo, recurso) → reenviar el mismo recurso no duplica el lead.
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_resource ON leads(email, resource);
