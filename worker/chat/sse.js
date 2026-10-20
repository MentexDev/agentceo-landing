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

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/** Emite un texto «escribiendo» por trozos de palabras (efecto streaming del stub). */
export async function streamText(send, text, delayMs = 18) {
  const parts = text.match(/\S+\s*/g) || [text]
  for (let i = 0; i < parts.length; i += 2) {
    await send('delta', { t: parts.slice(i, i + 2).join('') })
    if (delayMs > 0) await sleep(delayMs)
  }
}
