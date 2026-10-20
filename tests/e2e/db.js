// Consulta la D1 LOCAL de wrangler dev (nunca producción: --local).
// Con varios navegadores en paralelo SQLite puede estar ocupado: se reintenta.
import { execFileSync } from 'node:child_process'

export function queryLocal(sql, tries = 6) {
  let last
  for (let i = 0; i < tries; i++) {
    try {
      const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'agentceo-waitlist', '--local', '--json', '--command', sql], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
      })
      return JSON.parse(out)[0].results
    } catch (e) {
      last = e
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 300 * (i + 1))
    }
  }
  throw new Error(`D1 local no respondió: ${last?.stderr || last?.message}`)
}

/** Correo único por test y navegador (siempre @example.com). */
export const testEmail = (tag, info) => `e2e-${tag}-${info.project.name}-${Date.now()}@example.com`
