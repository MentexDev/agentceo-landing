// E2E del tope GLOBAL diario del chat (T58b) en navegador real.
//   npx playwright test -c playwright.chatcap.config.js
// Un Worker local en el 8792 con el «binding de test» CHAT_DAILY_GLOBAL_CAP:0 (tope ya alcanzado), CHAT_MODE
// live y una clave de OpenRouter FALSA: si el tope fallara, la llamada daría 401 sin gastar nada.
// Bienvenida por correo apagada. D1 local; nunca producción.
import { defineConfig } from '@playwright/test'
import base from './playwright.config.js'

process.env.E2E_CHATCAP = '1'
export default defineConfig({
  ...base,
  testMatch: /chat-global-cap\.spec\.js$/,
  use: { ...base.use, baseURL: 'http://127.0.0.1:8792' },
  webServer: {
    command: 'npm run db:local && WRANGLER_SEND_METRICS=false npx wrangler dev --local --port 8792 --ip 127.0.0.1 --inspector-port 9246 --var WELCOME_EMAIL_ENABLED:false --var CHAT_MODE:live --var OPENROUTER_API_KEY:clave-FALSA-e2e --var CHAT_DAILY_GLOBAL_CAP:0',
    url: 'http://127.0.0.1:8792/',
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
