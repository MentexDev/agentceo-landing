// E2E de Turnstile (T58) en NAVEGADOR REAL con las claves de PRUEBA oficiales de Cloudflare
// (https://developers.cloudflare.com/turnstile/troubleshooting/testing/): el script real de Turnstile carga,
// da el token de prueba, y el Worker lo verifica contra el siteverify REAL de Cloudflare.
//   npx playwright test -c playwright.turnstile.config.js
// Dos Workers locales (D1 local, nunca producción), en puertos libres de esta Mac:
//   8794 · secreto 1x… (siempre pasa)     8793 · secreto 2x… (siempre falla)
// La bienvenida por correo va APAGADA (--var): ningún test manda correos.
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

process.env.E2E_TURNSTILE = '1'
const SITE = '1x00000000000000000000AA'
const server = (port, secret, inspector, db = '') => ({
  command: `${db}WRANGLER_SEND_METRICS=false npx wrangler dev --local --port ${port} --ip 127.0.0.1 --inspector-port ${inspector} --var WELCOME_EMAIL_ENABLED:false --var TURNSTILE_SITE_KEY:${SITE} --var TURNSTILE_SECRET_KEY:${secret}`,
  url: `http://127.0.0.1:${port}/`,
  reuseExistingServer: false,
  timeout: 120_000,
})

export default defineConfig({
  ...base,
  testMatch: /turnstile\.spec\.js$/,
  use: { ...base.use, baseURL: 'http://127.0.0.1:8794' },
  webServer: [
    server(8794, '1x0000000000000000000000000000000AA', 9243, 'npm run db:local && '),
    server(8793, '2x0000000000000000000000000000000AA', 9244),
  ],
})
