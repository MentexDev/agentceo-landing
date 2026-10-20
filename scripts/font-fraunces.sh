#!/usr/bin/env bash
# FRAUNCES PARA TITULARES (T33, Diego: «títulos claramente más gruesos», con pesos reales).
# Parte del woff2 latino de @fontsource-variable/fraunces (ejes opsz 9–144 y wght 100–900) y
# genera las instancias ESTÁTICAS que sirve la web: eje óptico 144 (el de titular: más estrecho y
# contrastado, lo más parecido a Instrument Serif) y peso 560, normal e itálica.
# Medido el 20-oct con Lighthouse 13 móvil (LCP ≤ 2,0 s, ruta crítica):
#   · variable 400–700:     30,4 + 38,1 KB → LCP 1,82–1,97 s (es), al límite; descartada.
#   · estática 560 (esta):  17,0 + 21,5 KB → menos que Instrument Serif (20,5 + 21,6 KB).
# Las imágenes OG (src/lib/og.js, resvg) usan la misma normal; scripts/font-fallbacks.mjs mide
# sus métricas aquí mismo (normal-560.ttf / italic-560.ttf en la caché).
# Requiere fontTools + brotli (pip install fonttools brotli). Se ejecuta a mano; la salida se versiona.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=node_modules/@fontsource-variable/fraunces/files
CACHE=node_modules/.cache/fraunces
mkdir -p "$CACHE"
for st in normal italic; do
  fonttools varLib.instancer "$SRC/fraunces-latin-standard-$st.woff2" wght=560 opsz=144 -o "$CACHE/$st-560.ttf" -q
  python3 -c "from fontTools.ttLib import TTFont; f=TTFont('$CACHE/$st-560.ttf'); f.flavor='woff2'; f.save('public/fonts/fraunces-latin-560-$st.woff2')"
done
ls -la public/fonts/fraunces-latin-560-*.woff2
