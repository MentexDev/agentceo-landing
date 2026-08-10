---
name: crear-recurso-agentceo
description: Crea un recurso lead-magnet para la biblioteca /recursos de la landing de AgentCEO (agentceo.io), con tono para dueños de negocio (no programadores) y su guion viral opcional. Úsala cuando se pida crear, mejorar o auditar un recurso de /recursos, escribir un guion de Reel/TikTok para un recurso, o sumar un recurso a la biblioteca. Encapsula la anatomía obligatoria, los bloques tipados de content/recursos.js, el gate de correo, las reglas anti-fake y el flujo build → deploy → C-A-R.
---

# Crear un recurso de AgentCEO (la fábrica de recursos)

Esta skill destila el método con el que se construye la biblioteca `/recursos` de
la landing de AgentCEO. Cada recurso es un **lead-magnet**: la persona deja su
correo y a cambio recibe una guía/plantilla que de verdad le sirve. El público
NO es programadores: son **dueños de negocio** que quieren operar con IA.

> Inspirada en la skill `crear-recurso-neuralos` (repo NeuralOS), pero adaptada a
> nuestro público, nuestro sistema (`content/recursos.js` + generador estático) y
> nuestra honestidad de pre-lanzamiento.

**Antes de empezar, lee:** `content/recursos.js` (los recursos ya hechos, como
referencia de tono), `scripts/build-content.mjs` (cómo se genera y se aplica el
gate) y la memoria `landing-agentceo-contenido.md` del proyecto.

---

## 0 · Reglas de oro INVIOLABLES

- **Verdad 100% (anti-fake).** Cada dato, cifra o afirmación comprobable se VALIDA
  contra su fuente primaria (agent-browser / WebSearch) ANTES de escribirlo. Cero
  invención. Si no se puede verificar, no se afirma. Lo verificado va en `sources`.
- **Público = DUEÑOS DE NEGOCIO, no devs.** Tono claro y cercano, sin jerga técnica.
  Ejemplos de su mundo real: ventas, atención por WhatsApp, inventario, Shopify,
  seguimiento de clientes. Si algo suena a "para programadores", reescríbelo.
- **AgentCEO honesto.** El producto está en **pre-lanzamiento**. Nunca prometas
  funciones que no existen. La mención de AgentCEO es sutil y verídica ("un equipo
  de agentes puede sostener esto por ti"), nunca humo.
- **Valor real o nada.** Es un imán de correos: la gente lo entrega a cambio de la
  guía. Un recurso pobre quema confianza. Nada de stubs vacíos.
- **No solapar.** Antes de crear, revisa que no pise un recurso existente. Si el
  tema ya está cubierto, mejóralo o enlaza en vez de duplicar.

---

## 1 · Anatomía OBLIGATORIA de cada recurso (en este orden)

Lo que hace que un recurso CAMBIE el comportamiento del lector, no solo lo informe:

1. **El MOMENTO / caso de uso.** ¿Cuándo le surge esto a un dueño de negocio?
   Explícalo desde el principio (no solo "qué es").
2. **El DOLOR.** Qué duele si no lo hace, por qué pasa. Honesto, sin dramatizar.
3. **El HÁBITO.** Que es algo constante, no de una sola vez.
4. **Algo LISTO PARA USAR.** Una **plantilla**, **checklist** o **prompt** de
   extremo a extremo, con `[corchetes]` para que el lector rellene. Es el corazón.
5. **El CAMINO MÁS FÁCIL.** No complicar. Aclara qué puede hacer un agente por él.

- **`whatYouGet`** (3-4 viñetas) = el gancho VISIBLE antes del correo (qué incluye).
- **`body`** = el contenido completo, se REVELA tras dejar el correo (gate).
- Calidad objetivo: **~10-20 bloques** con sustancia (los 3 primeros recursos son
  la vara: checklist de automatización, guía de instrucciones, plantillas WhatsApp).

---

## 2 · Estructura técnica (`content/recursos.js`)

Cada recurso es un objeto del array `ITEMS`. El generador (`build-content.mjs`,
`renderRecurso`) lo convierte en HTML con el **gate de correo** y el botón
"Guardar como PDF". Shape:

```js
{
  slug: 'kebab-unico',            // URL: /recursos/<slug>
  title: 'Título claro',
  category: 'Checklists',         // debe estar en CATEGORIES
  dateISO: 'YYYY-MM-DD',
  featured: true,                 // 1 destacado por sección
  readMinutes: 5,
  excerpt: 'Gancho de 1-2 frases (se ve en la tarjeta y como lead).',
  whatYouGet: [                   // VISIBLE antes del correo (el anzuelo)
    'Bullet de qué incluye (usa **negrita** puntual).',
  ],
  body: [                         // OCULTO hasta dar el correo (el valor)
    { type: 'p', text: 'Párrafo. Admite **negrita**.' },
    { type: 'h', text: 'Subtítulo' },
    { type: 'ul', items: ['viñeta', 'viñeta'] },
    { type: 'quote', text: 'Plantilla/cita destacada', cite: 'opcional' },
  ],
  sources: [ { name: 'Fuente verificada', url: 'https://...' } ], // si cita datos
}
```

- `CATEGORIES` (ej. `['Checklists', 'Guías', 'Plantillas']`): agrega la nueva si hace falta.
- Bloques permitidos: `p` · `h` · `ul` · `quote`. Todo se escapa solo (seguro).
- Las URLs de `sources` deben ser http(s) reales y verificadas.

---

## 3 · El GUION viral (opcional, para redes de AgentCEO)

Si el recurso se va a promocionar en Reel/TikTok, deja el guion en
`docs/recursos/guion-<slug>.md`:

- **⚡ HOOK (3 s):** al grano, sin saludar. Rompe una creencia o ataca un dolor del
  dueño de negocio ("dejas de vender de noche porque no contestas el WhatsApp"). 2-3 hooks para A/B.
- **🎤 CUERPO (60-90 s):** hablado, una idea por bloque, una analogía fuerte. Tono
  "te cuento cómo lo hago yo". Datos con su fuente ("según una encuesta a pymes…").
- **📣 CTA:** un verbo, baja fricción: *"Comenta QUIERO LA GUÍA y te la mando."*
- **🔁 FLUJO:** comenta → DM con el enlace → deja el correo → recibe la guía → conoce AgentCEO.
- Texto en pantalla siempre (el 80% mira sin sonido). Honestidad total, nada de magia.

---

## 4 · Flujo (construir → verificar → desplegar)

1. **Validar** los datos con agent-browser/WebSearch (si el recurso cita cifras).
2. **Escribir** el recurso en `content/recursos.js` (anatomía completa: `whatYouGet` + `body`).
3. **Build:** `npm run build` → genera `public/recursos/<slug>.html` (+ sitemap).
4. **Verificar EN VIVO (local)** con agent-browser: levanta `python3 -m http.server`
   en `public/`, abre `/recursos/<slug>`, confirma que el gate muestra "Qué incluye",
   que al dejar un correo `@example.com` se revela el `body`, y que "Guardar como PDF"
   funciona. Limpia el lead de prueba de D1 (`DELETE FROM leads WHERE email LIKE '%@example.com'`).
5. **Desplegar:** `npm run deploy` (= build + `wrangler@4.86.0 deploy`, Node 20).
   Verifica en `https://agentceo.io/recursos/<slug>`.
6. **Guion viral** (opcional) en `docs/recursos/guion-<slug>.md`.
7. **Commit + push** a `main` (`MentexDev/agentceo-landing`). Si fue una tanda grande
   o tocó el generador/gate, haz el **AUDIT (C-A-R) en turno aparte** antes de sellar.

---

## 5 · Checklist final (antes de dar por hecho un recurso)

- [ ] Datos verificados con fuente primaria (o el recurso no cita cifras)
- [ ] Anatomía completa: momento · dolor · hábito · algo-listo-para-usar · camino fácil
- [ ] Tono para dueños de negocio, con ejemplos de su mundo (nada técnico)
- [ ] `whatYouGet` (gancho) + `body` (valor real, ~10-20 bloques)
- [ ] No solapa con otro recurso; `featured` coherente (1 por sección)
- [ ] Mención de AgentCEO sutil y honesta (pre-lanzamiento)
- [ ] Build OK · verificado EN VIVO (gate revela el body, PDF funciona) · lead de prueba limpiado
- [ ] Desplegado en agentceo.io/recursos · commit + push a main
- [ ] Guion viral (si se va a promocionar)
