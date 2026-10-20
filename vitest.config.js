// Dos proyectos de test:
//  · worker → corre DENTRO del runtime de Workers (workerd/Miniflare) con una D1
//             LOCAL y efímera por test (nunca la de producción).
//  · site   → Node: i18n, rutas, escapes y verificación del HTML de dist/.
import { defineConfig } from 'vitest/config'
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin'

export default defineConfig(async () => {
  const migrations = await readD1Migrations('./migrations')
  // Una segunda D1 SOLO con la migración 0001 = producción antes de aplicar la 0002.
  const migrationsV1 = migrations.filter((m) => m.name.startsWith('0001'))
  return {
    test: {
      projects: [
        {
          plugins: [
            cloudflareTest({
              wrangler: { configPath: './wrangler.jsonc' },
              miniflare: {
                bindings: { TEST_MIGRATIONS: migrations, TEST_MIGRATIONS_V1: migrationsV1 },
                d1Databases: ['DB_V1'],
              },
            }),
          ],
          test: { name: 'worker', include: ['tests/worker/**/*.test.js'], setupFiles: ['tests/worker/setup.js'] },
        },
        { test: { name: 'site', environment: 'node', include: ['tests/site/**/*.test.js'] } },
      ],
    },
  }
})
