import { robotsTxt } from '../lib/seo.js'
export const GET = () => new Response(robotsTxt(), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
