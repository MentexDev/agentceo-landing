// Tests de las plantillas de correo (Node). Los corre `npm test` desde la raíz (proyecto «emails»).
// JSX automático de React: las islas de la landing usan Preact, pero este paquete es React Email.
import { defineConfig } from 'vitest/config'

export default defineConfig({
  oxc: { jsx: { runtime: 'automatic', importSource: 'react' } },
  test: { name: 'emails', environment: 'node', include: ['tests/**/*.test.js'] },
})
