// E2E en NAVEGADOR REAL contra el Worker local (wrangler dev + D1 local), nunca producción.
// Input real (clics, teclado, toques) vía Playwright: sin dispatchEvent sintéticos.
import { defineConfig, devices } from '@playwright/test'

const PORT = 8787
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  // T62: «/» redirige según Accept-Language (worker/lib/locale.js). El navegador de la suite es el visitante de
  // siempre, en español; Playwright por defecto manda en-US y la portada saltaría a /en/. Los tests de otros idiomas
  // abren su propio contexto (tests/e2e/i18n-pt.spec.js).
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure', locale: 'es-ES' },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'movil-webkit', use: { ...devices['iPhone 15'] } },
    { name: 'movil-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    // WELCOME_EMAIL_ENABLED:false (T58): wrangler.jsonc lo trae en "true" desde T57b y .dev.vars tiene la clave
    // real de Resend: sin esto, cada alta de la suite mandaría un correo REAL a un @example.com.
    command: `npm run db:local && WRANGLER_SEND_METRICS=false npx wrangler dev --local --port ${PORT} --ip 127.0.0.1 --var WELCOME_EMAIL_ENABLED:false`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
