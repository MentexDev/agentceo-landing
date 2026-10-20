// Slug url-friendly (misma regla que la v1: sin acentos, guiones, máx. 70). Sin dependencias:
// lo usan el build de Astro y scripts de Node puro.
export function slugify(s = '') {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 70)
}
