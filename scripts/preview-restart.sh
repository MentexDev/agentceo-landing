#!/usr/bin/env bash
# Reinicia `wrangler dev` (puerto 8787, D1 LOCAL). Hace falta tras `npm run build`:
# astro vacía dist/ y el vigilante de assets de wrangler se queda con el directorio viejo
# (medido: 404 en «/» tras reconstruir). Solo local; nunca toca producción.
set -euo pipefail
cd "$(dirname "$0")/.."
pkill -f "wrangler dev --local --port 8787" 2>/dev/null || true
sleep 1
WRANGLER_SEND_METRICS=false npx wrangler d1 migrations apply agentceo-waitlist --local >/dev/null
(WRANGLER_SEND_METRICS=false nohup npx wrangler dev --local --port 8787 --ip 127.0.0.1 > "${TMPDIR:-/tmp}/wrangler.log" 2>&1 &)
for _ in $(seq 1 40); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/ || true)" = "200" ] && { echo "✓ wrangler dev listo en :8787"; exit 0; }
  sleep 1
done
echo "✗ wrangler dev no respondió" >&2; exit 1
