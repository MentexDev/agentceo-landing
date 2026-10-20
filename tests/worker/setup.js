// Aplica las migraciones a la D1 LOCAL del test antes de cada fichero.
import { env, applyD1Migrations } from 'cloudflare:test'
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS)
