// /<lang>/llms-full.txt para cada idioma que no es el predeterminado (T62; antes, un fichero por idioma).
import { llmsFullTxt } from '../../lib/seo.js'
import { LOCALES, DEFAULT_LOCALE } from '../../i18n/meta.js'
export const getStaticPaths = () => LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((lang) => ({ params: { lang } }))
export const GET = ({ params }) => new Response(llmsFullTxt(params.lang), { headers: { 'content-type': 'text/plain; charset=utf-8' } })
