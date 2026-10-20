// Imágenes OG estáticas (1200×630), una por página indexable. Ver src/lib/og.js.
import { ogPages, ogPng } from '../../lib/og.js'
export function getStaticPaths() {
  return ogPages().map((p) => ({ params: { slug: p.path.replace(/^\/og\//, '').replace(/\.png$/, '') }, props: p }))
}
export async function GET({ props }) {
  return new Response(await ogPng(props), { headers: { 'content-type': 'image/png' } })
}
