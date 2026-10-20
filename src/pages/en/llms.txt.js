import { llmsTxt } from '../../lib/seo.js'
export const GET = () => new Response(llmsTxt('en'), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
