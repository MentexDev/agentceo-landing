// Configuración de Astro · landing v2 de AgentCEO.
// - Sitio 100 % estático: cada página sale como HTML completo (lo leen buscadores y LLM sin ejecutar JS).
// - build.format 'preserve': conserva las URLs que ya existen en producción
//   (/noticias/ es índice; /noticias/<slug> y /legal/<doc> van SIN barra final).
// - Islas con PREACT + compat (≈10 KB gz frente a ≈68 KB de React 19, medido): el código del
//   prototipo (JSX de React) corre sin cambios. Solo se hidratan las secciones interactivas,
//   al hacerse visibles; las demás salen como HTML estático sin JS.
import { defineConfig } from 'astro/config'
import preact from '@astrojs/preact'

export default defineConfig({
  site: 'https://agentceo.io',
  output: 'static',
  outDir: './dist',
  trailingSlash: 'ignore',
  build: { format: 'preserve', inlineStylesheets: 'auto', assets: '_a' },
  integrations: [preact({ compat: true })],
  server: { port: 5179, host: '127.0.0.1' },
  devToolbar: { enabled: false },
  vite: { build: { cssMinify: true } },
})
