// Server-Sent Events: un stream de texto con eventos { meta | delta | done | error }.
export function sseStream() {
  const { readable, writable } = new TransformStream()
  const w = writable.getWriter()
  const enc = new TextEncoder()
  const send = (event, data) => w.write(enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
  return { readable, send, close: () => w.close() }
}

export const sseHeaders = {
  'content-type': 'text/event-stream; charset=utf-8',
  'cache-control': 'no-store',
  'x-content-type-options': 'nosniff',
}

// El troceo del texto es neutro de canal (text.js); se reexporta por compatibilidad.
export { streamText } from './text.js'
