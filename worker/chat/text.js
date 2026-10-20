// Utilidad NEUTRA de canal: emite un texto por trozos de palabras a través del `send` del canal
// (efecto «escribiendo» en la web; un canal que no hace streaming, p. ej. WhatsApp, junta los
// trozos al recibir «done»). No sabe de HTTP ni de SSE.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function streamText(send, text, delayMs = 18) {
  const parts = text.match(/\S+\s*/g) || [text]
  for (let i = 0; i < parts.length; i += 2) {
    await send('delta', { t: parts.slice(i, i + 2).join('') })
    if (delayMs > 0) await sleep(delayMs)
  }
}
