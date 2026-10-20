// Consulta la D1 LOCAL de wrangler dev (nunca producción: --local).
import { execFileSync } from 'node:child_process'

export function queryLocal(sql) {
  const out = execFileSync('npx', ['wrangler', 'd1', 'execute', 'agentceo-waitlist', '--local', '--json', '--command', sql], {
    encoding: 'utf8',
    env: { ...process.env, WRANGLER_SEND_METRICS: 'false' },
  })
  return JSON.parse(out)[0].results
}

/** Correo único por test y navegador (siempre @example.com). */
export const testEmail = (tag, info) => `e2e-${tag}-${info.project.name}-${Date.now()}@example.com`
