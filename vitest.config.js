// Dos proyectos de test:
//  · worker → corre DENTRO del runtime de Workers (workerd/Miniflare) con una D1
//             LOCAL y efímera por test (nunca la de producción).
//  · site   → Node: i18n, rutas, escapes y verificación del HTML de dist/.
import { defineConfig } from 'vitest/config'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'

export default defineConfig(async () => {
  const migrations = await readD1Migrations('./migrations')
  return {
    test: {
      projects: [
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: './wrangler.jsonc' },
              miniflare: { bindings: { TEST_MIGRATIONS: migrations } },
            }),
          ],
          test: { name: 'worker', include: ['tests/worker/**/*.test.js'], setupFiles: ['tests/worker/setup.js'] },
        },
        { test: { name: 'site', environment: 'node', include: ['tests/site/**/*.test.js'] } },
      ],
    },
  }
})
