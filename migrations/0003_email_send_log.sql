-- Correos que envía el Worker (T57): el registro de cada envío y las bajas.
-- ADITIVA: solo crea tablas nuevas. No toca signups ni leads.
-- ⛔ En producción la aplica Diego/Luca (`wrangler d1 migrations apply agentceo-waitlist --remote`).
--    Mientras no se aplique, el Worker NO envía nada (y el flag WELCOME_EMAIL_ENABLED va en "false").

-- Un correo por persona y plantilla: UNIQUE(email, template) es la idempotencia (INSERT OR IGNORE antes
-- de enviar). Re-inscribirse o completar el paso 2 del modal no duplica la bienvenida.
CREATE TABLE IF NOT EXISTS email_send_log (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  email           TEXT NOT NULL,                 -- en minúsculas (cleanEmail)
  template        TEXT NOT NULL,                 -- 'waitlist-welcome'
  locale          TEXT NOT NULL DEFAULT 'es',    -- 'es' | 'en'
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'sending', 'sent', 'failed')),
  resend_id       TEXT,                          -- id que devuelve Resend al aceptar el envío
  attempts        INTEGER NOT NULL DEFAULT 0,
  last_error      TEXT,                          -- sin la clave ni el correo completo
  next_attempt_at TEXT,                          -- cuándo puede reintentarlo el barrido (backoff)
  created_at      TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
  sent_at         TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_send_log_email_template ON email_send_log(email, template);
-- El barrido del cron: los pendientes que ya tocan, y los «sending» que se quedaron colgados.
CREATE INDEX IF NOT EXISTS idx_email_send_log_status_next ON email_send_log(status, next_attempt_at);
CREATE INDEX IF NOT EXISTS idx_email_send_log_created ON email_send_log(created_at);

-- Bajas de los correos de marketing (CAN-SPAM; RFC 8058 one-click). Un token aleatorio por correo: el enlace
-- de baja no revela el correo ni se puede adivinar. unsubscribed_at no nulo = no se le vuelve a escribir.
CREATE TABLE IF NOT EXISTS email_preferences (
  email           TEXT PRIMARY KEY,
  unsub_token     TEXT NOT NULL,
  unsubscribed_at TEXT,
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_email_preferences_token ON email_preferences(unsub_token);
