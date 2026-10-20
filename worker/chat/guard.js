// ─────────────────────────────────────────────────────────────────────────────
// ChatGuard · Durable Object (SQLite) para los topes del widget:
//   · por IP: mensajes por día (una instancia por IP, nombrada con un HASH de la IP:
//     la IP en claro no se guarda en ningún sitio);
//   · global: gasto en USD del modo live por día (instancia «budget»), el techo duro
//     de $5/día que decidió Diego.
// El binding nativo RL_CHAT cubre la ventana de 60 s; esto cubre el día.
//
// TOPE DURO DE GASTO (T32), cómo funciona:
//   1. Antes de llamar al modelo se RESERVA el coste máximo posible de esa petición
//      (`bump('usd:<día>', estimado, tope)`). Un Durable Object ejecuta sus métodos de uno
//      en uno y `bump` no espera a nada: comprobar y sumar es atómico, así que N peticiones
//      simultáneas nunca pueden pasar juntas el tope (lo prueba un test con 20 a la vez).
//   2. Al terminar se AJUSTA al coste real (`adjust`, usageMetadata de Gemini); si el
//      proveedor respondió con error HTTP (no factura) se devuelve la reserva entera; si se
//      cortó por red o tiempo sin saber el consumo, la reserva se queda (pesimista).
//   3. Reinicio: la clave es el día UTC (`usd:2026-10-20`); el primer `bump` de un día nuevo
//      borra las claves de días anteriores. No hay cron.
// ¿Por qué un DO y no D1 ni KV? KV es eventualmente consistente (dos regiones podrían gastar
// a la vez sobre el mismo saldo viejo) y en D1 haría falta una transacción por mensaje con
// carreras entre lectura y escritura; el DO da una sola instancia global con estado fuerte.
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

  /**
   * Corrige una reserva ya hecha (coste real − estimado, o −estimado para devolverla).
   * Sin tope: el tope se aplicó al reservar. Nunca baja de 0.
   */
  adjust(key, delta) {
    const sql = this.ctx.storage.sql
    const cur = sql.exec('SELECT n FROM c WHERE k = ?', key).toArray()[0]?.n ?? 0
    const n = Math.max(0, cur + delta)
    sql.exec('INSERT INTO c (k, n) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET n = excluded.n', key, n)
    return { n }
  }

  get(key) {
    return this.ctx.storage.sql.exec('SELECT n FROM c WHERE k = ?', key).toArray()[0]?.n ?? 0
  }

  /**
   * Varios contadores a la vez, TODO O NADA (adenda T32: ráfaga + hora + día en una sola
   * llamada atómica). `list` = [[clave, máximo], …]. Si alguno se pasaría, no suma ninguno y
   * devuelve { allowed: false, key } con la clave que lo impidió.
   */
  hitAll(list) {
    const sql = this.ctx.storage.sql
    for (const [key] of list) sql.exec('DELETE FROM c WHERE k LIKE ? AND k != ?', `${key.split(':')[0]}:%`, key)
    for (const [key, max] of list) {
      const cur = sql.exec('SELECT n FROM c WHERE k = ?', key).toArray()[0]?.n ?? 0
      if (cur + 1 > max) return { allowed: false, key }
    }
    for (const [key] of list) sql.exec('INSERT INTO c (k, n) VALUES (?, 1) ON CONFLICT(k) DO UPDATE SET n = n + 1', key)
    return { allowed: true }
  }

  // ── Textos con caducidad (adenda T32): caché de respuestas a preguntas idénticas, marcas de
  //    «pregunta ya vista» (dedupe) y sesiones verificadas por Turnstile. Solo guarda HASHES de
  //    preguntas y respuestas generadas sobre la web pública (nunca textos con datos personales:
  //    lo filtra quien llama con hasPII) y se purga sola al leer/escribir.
  #t() {
    const sql = this.ctx.storage.sql
    sql.exec('CREATE TABLE IF NOT EXISTS t (k TEXT PRIMARY KEY, v TEXT NOT NULL, exp INTEGER NOT NULL)')
    sql.exec('DELETE FROM t WHERE exp < ?', Date.now())
    return sql
  }

  tget(key) {
    return this.#t().exec('SELECT v FROM t WHERE k = ?', key).toArray()[0]?.v ?? null
  }

  tput(key, value, ttlMs) {
    this.#t().exec('INSERT INTO t (k, v, exp) VALUES (?, ?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v, exp = excluded.exp', key, String(value), Date.now() + ttlMs)
    return true
  }

  /** ¿Ya se vio esta clave en la ventana? Si no, la marca. Atómico (dedupe). */
  seen(key, ttlMs) {
    const sql = this.#t()
    if (sql.exec('SELECT 1 FROM t WHERE k = ?', key).toArray().length) return true
    sql.exec('INSERT INTO t (k, v, exp) VALUES (?, ?, ?)', key, '1', Date.now() + ttlMs)
    return false
  }
}

export const today = (d = new Date()) => d.toISOString().slice(0, 10)
/** Ventanas de los límites (UTC): `2026-10-20T08` (hora) y `2026-10-20T08:31` (minuto). */
export const hourOf = (d = new Date()) => d.toISOString().slice(0, 13)
export const minuteOf = (d = new Date()) => d.toISOString().slice(0, 16)

const sha = async (s) => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)))].slice(0, 16).map((b) => b.toString(16).padStart(2, '0')).join('')

/** Nombre de instancia por IP: SHA-256 de la IP (no reversible a efectos prácticos). */
export async function ipKey(ip) {
  return `ip:${await sha(`agentceo-chat:${ip}`)}`
}

/** Nombre de instancia por sesión del cliente (id aleatorio, también con hash). */
export async function sessionKey(sid) {
  return `s:${await sha(`agentceo-chat-session:${sid}`)}`
}
