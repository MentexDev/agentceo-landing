import { llmsFullTxt } from '../../lib/seo.js'
export const GET = () => new Response(llmsFullTxt('en'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
