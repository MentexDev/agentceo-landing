// Aplica las migraciones a las D1 LOCALES del test (nunca la de producción).
//  · DB    → esquema actual (0001 + 0002…)
//  · DB_V1 → solo 0001: simula producción antes de que Diego aplique la 0002.
import { env, applyD1Migrations } from 'cloudflare:test'
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
await applyD1Migrations(env.DB_V1, env.TEST_MIGRATIONS_V1)
