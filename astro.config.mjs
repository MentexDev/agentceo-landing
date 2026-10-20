// Configuración de Astro · landing v2 de AgentCEO.
// - Sitio 100 % estático: cada página sale como HTML completo (lo leen buscadores y LLM sin ejecutar JS).
// - build.format 'preserve': conserva las URLs que ya existen en producción
//   (/noticias/ es índice; /noticias/<slug> y /legal/<doc> van SIN barra final).
// - React solo en islas (client:visible / client:idle); una sección sin interacción no envía JS.
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  site: 'https://agentceo.io',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'ignore',
  build: { format: 'preserve', inlineStylesheets: 'auto', assets: '_a' },
  integrations: [react()],
  server: { port: 5179, host: '127.0.0.1' },
  devToolbar: { enabled: false },
  vite: { build: { cssMinify: true } },
})
