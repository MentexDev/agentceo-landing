#!/usr/bin/env bash
# PREVIEW LOCAL EN MODO LIVE para red-team (T40, Luca), en :8787.
# · El Worker corre en LOCAL: D1 y Durable Objects (cupos, tope de $5) son los LOCALES, nunca los de
#   producción. ⛔ Nada de `wrangler dev --remote`: la D1 no tiene base de preview y escribiría en la
#   de producción con cualquier alta de la lista (y compartiría cupos y gasto con producción).
# · La clave de OpenRouter viaja SOLO en memoria: se pide sin eco (o se toma de la variable de entorno
#   OPENROUTER_API_KEY) y llega al Worker por el entorno del proceso (CLOUDFLARE_INCLUDE_PROCESS_ENV),
#   nunca por fichero (.dev.vars) ni por argumentos (visibles en `ps`). wrangler la lista como «(hidden)».
# · Entorno mínimo (env -i): al Worker no le llega ninguna otra variable de esta máquina.
# Uso: scripts/preview-live.sh        (pide la clave)   ·   Parar: scripts/preview-restart.sh (vuelve a stub)
set -euo pipefail
cd "$(dirname "$0")/.."
KEY="${OPENROUTER_API_KEY:-}"
if [ -z "$KEY" ]; then read -rsp "Clave de OpenRouter (no se muestra; vacía = stub): " KEY; echo; fi
pkill -f "wrangler dev --local --port 8787" 2>/dev/null || true
sleep 1
WRANGLER_SEND_METRICS=false npx wrangler d1 migrations apply agentceo-waitlist --local >/dev/null
LOG="${TMPDIR:-/tmp}/wrangler-live.log"
(env -i PATH="$PATH" HOME="$HOME" TMPDIR="${TMPDIR:-/tmp}" CLOUDFLARE_INCLUDE_PROCESS_ENV=true WRANGLER_SEND_METRICS=false \
  CHAT_MODE=live OPENROUTER_API_KEY="$KEY" \
  nohup npx wrangler dev --local --port 8787 --ip 127.0.0.1 > "$LOG" 2>&1 &)
KEY=''
for _ in $(seq 1 40); do
  [ "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8787/ || true)" = "200" ] && break
  sleep 1
done
grep -q 'OPENROUTER_API_KEY ("(hidden)")' "$LOG" && echo "✓ :8787 en modo live (clave cargada, oculta) · D1 y cupos LOCALES" || echo "✓ :8787 levantado SIN clave: el chat responde en stub"
