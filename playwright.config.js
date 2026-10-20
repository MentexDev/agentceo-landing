// E2E en NAVEGADOR REAL contra el Worker local (wrangler dev + D1 local), nunca producción.
// Input real (clics, teclado, toques) vía Playwright: sin dispatchEvent sintéticos.
import { defineConfig, devices } from '@playwright/test'

const PORT = 8787
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'movil-webkit', use: { ...devices['iPhone 15'] } },
    { name: 'movil-chromium', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run db:local && WRANGLER_SEND_METRICS=false npx wrangler dev --local --port ${PORT} --ip 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
