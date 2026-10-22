// Textos de las islas POR IDIOMA, sin imports por idioma (T62): cada isla pide con import.meta.glob (Vite) los
// ficheros de todos los idiomas y aquí se indexan por código. Añadir un idioma = crear src/i18n/sections/<lang>.json
// y src/i18n/logic/<lang>.js; ninguna isla cambia. Con `import: 'S04'` Vite importa SOLO esa sección del JSON.
const langOf = (path) => /\/([a-z]{2})\.(json|js)$/.exec(path)[1]

/** { 'ruta/es.json': x, … } → { es: x, … } */
export const byLang = (mods) => Object.fromEntries(Object.entries(mods).map(([p, m]) => [langOf(p), m]))
