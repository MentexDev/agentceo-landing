import { llmsFullTxt } from '../lib/seo.js'
export const GET = () => new Response(llmsFullTxt('es'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
