// ─────────────────────────────────────────────────────────────────────────────
// ChatGuard · Durable Object (SQLite) para los topes del widget:
//   · por IP: mensajes por día (una instancia por IP, nombrada con un HASH de la IP:
//     la IP en claro no se guarda en ningún sitio);
//   · global: gasto en USD del modo live por día (instancia «budget»), el techo duro
//     de $5/día que decidió Diego.
// El binding nativo RL_CHAT cubre la ventana de 60 s; esto cubre el día.
// ─────────────────────────────────────────────────────────────────────────────
import { DurableObject } from 'cloudflare:workers'

export class ChatGuard extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env)
    ctx.blockConcurrencyWhile(async () => {
      ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS c (k TEXT PRIMARY KEY, n REAL NOT NULL)')
    })
  }

  /** Suma `by` a la clave si no supera `max`. Devuelve { allowed, n }. Borra días viejos. */
  bump(key, by = 1, max = Infinity) {
    const sql = this.ctx.storage.sql
    const prefix = key.split(':')[0]
    sql.exec('DELETE FROM c WHERE k LIKE ? AND k != ?', `${prefix}:%`, key)
    const cur = sql.exec('SELECT n FROM c WHERE k = ?', key).toArray()[0]?.n ?? 0
    if (cur + by > max) return { allowed: false, n: cur }
    sql.exec('INSERT INTO c (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = n + excluded.n', key, by)
    return { allowed: true, n: cur + by }
  }

  get(key) {
    return this.ctx.storage.sql.exec('SELECT n FROM c WHERE k = ?', key).toArray()[0]?.n ?? 0
  }
}

export const today = (d = new Date()) => d.toISOString().slice(0, 10)

/** Nombre de instancia por IP: SHA-256 de la IP (no reversible a efectos prácticos). */
export async function ipKey(ip) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`agentceo-chat:${ip}`))
  return `ip:${[...new Uint8Array(buf)].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')}`
}
