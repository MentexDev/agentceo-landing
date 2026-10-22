# KB pública curada del chat · BORRADOR (T58b · revisado en T59-KB)

> **Estado: borrador. NO está cableado al chat.**
> - El chat sigue leyendo `worker/generated/knowledge.json`; ver la sección 5 de `/tmp/luca_t58_report.md`.
> - Este documento sirve para que Diego y Luca decidan qué entra antes de cablearlo.

**Convención**
- Lo que **está publicado en la landing** va sin marca, con la fuente entre corchetes cortos: `[web: …]`.
- Lo que **no está en la landing** sale del producto y va con **[VERIFICAR]**. Viene del repo `CRM-AI`, leído en solo lectura: rama `origin/b3-negocio`, último commit `006ca367b` del 2026-10-18. Es la instantánea local, sin `fetch`; fuente principal `docs/brain/agent-ceo-producto.md`.
- **La landing es la fuente de verdad de las capacidades** (decisión de Diego, T59). La app no se lanza hasta que todo lo prometido esté construido, así que todo lo que promete la web se describe aquí como capacidad del producto.
- Los detalles que solo están en el producto se añaden como **complemento**, nunca para negar la web, y conservan **[VERIFICAR]** porque la web no los promete.

**Excluido siempre**
- Cualquier dato societario o registral de la empresa: la lista exacta es la de `worker/chat/private.js` (T40).
- Infraestructura, proveedores y modelos de IA.
- Secretos, métricas, clientes, fechas de roadmap y precios no publicados.

**Guardia:** `tests/site/kb-publica-borrador.test.js` falla si se cuela un dato reservado.

## Índice
1. [Qué es Agent CEO](#1-qué-es-agent-ceo--what-agent-ceo-is)
2. [Cómo funciona](#2-cómo-funciona--how-it-works)
3. [El equipo: agentes y roles](#3-el-equipo-agentes-y-roles--the-team-agents-and-roles)
4. [Funciones](#4-funciones--features)
5. [Integraciones](#5-integraciones--integrations)
6. [Casos de uso por tipo de negocio](#6-casos-de-uso-por-tipo-de-negocio--use-cases-by-business-type)
7. [Cómo empezar (lista de espera y primeros pasos)](#7-cómo-empezar--getting-started)
8. [Planes y precios](#8-planes-y-precios--plans-and-pricing)
9. [Seguridad, privacidad y control](#9-seguridad-privacidad-y-control--security-privacy-and-control)
10. [Frente a hacerlo a mano](#10-frente-a-hacerlo-a-mano--versus-doing-it-by-hand)
11. [Objeciones frecuentes](#11-objeciones-frecuentes--common-objections)
12. [Glosario](#12-glosario--glossary)
13. [Preguntas frecuentes (34 es + 34 en)](#13-preguntas-frecuentes--faq)
14. [Contacto](#14-contacto--contact)
15. [Nota interna: landing ↔ producto (resuelto)](#15-nota-interna-landing--producto-resuelto)
16. [Qué se excluyó y por qué](#16-qué-se-excluyó-y-por-qué)

---

## 1. Qué es Agent CEO · What Agent CEO is

**ES**
- Agent CEO es una plataforma donde armas un **equipo de empleados de IA** que trabajan en tu negocio: venden por WhatsApp, cuidan tu tienda y crean contenido. En lo importante, te piden permiso. [web: FAQ «¿Qué es Agent CEO?»]
- Un **agente** es un asistente de IA que hace un trabajo concreto, como responder mensajes o revisar el inventario. Es un empleado digital: no te sugiere qué hacer, lo hace en tus herramientas. [web: FAQ «¿Qué es un agente?»]
- Un chatbot responde; un agente actúa. Persigue un objetivo, usa tus herramientas, trabaja solo y aprende tu contexto. [web: blog «Qué es realmente un agente de IA»]
- No es un ERP ni un CRM tradicional donde una persona llena formularios: el trabajo lo hacen los agentes, y tú diriges, apruebas y decides. **[VERIFICAR]** (producto: «Lo que Agent CEO NO es»)

**EN**
- Agent CEO is a platform where you build a **team of AI employees** that work in your business: they sell on WhatsApp, look after your store and create content. For anything important, they ask your permission. [web]
- An **agent** is an AI assistant with a specific job, like answering messages or checking inventory. Think of it as a digital employee: it doesn't suggest what to do, it does it inside your tools. [web]
- A chatbot answers; an agent acts. It pursues a goal, uses your tools, works on its own and learns your context. [web: blog]
- It isn't a traditional ERP or CRM where someone fills in forms: the agents do the work, and you direct, approve and decide. **[VERIFY]**

## 2. Cómo funciona · How it works

**ES**
1. **Una charla corta.** Le cuentas tu negocio, o tu idea si empiezas desde cero, y te arma el equipo. Si ya tienes web, la revisa mientras habláis. [web: «¿Cómo se empieza?»]
2. **Tu equipo trabaja.** Responde clientes, vigila la tienda, prepara contenido y te avisa de lo que necesita tu firma. [web]
3. **Tú apruebas lo importante.** Si algo cuesta dinero o no se puede deshacer, el agente te pregunta primero, y lo apruebas desde el celular con un botón. [web: «¿Cómo funcionan las aprobaciones?»]
4. **Reunión diaria y acta de la mañana.** Tu equipo trabaja también de noche. Cada mañana se reúne solo y tú lees el acta: qué hicieron, qué sigue y qué espera tu aprobación. A las 7:00 tienes tu reporte de ventas. Tus reuniones también pueden quedar grabadas y resumidas. [web: «Reunión diaria»]
5. **Cada tarea, con su entregable.** Las puedes lanzar ya, dejar guardadas o programar cada día, semana o mes, a la hora local de tu negocio. **[VERIFICAR]**

**EN**
1. **A short chat.** Tell it about your business, or your idea if you're starting from scratch, and it builds your team. If you already have a website, it reviews it while you talk. [web]
2. **Your team gets to work.** It answers customers, watches your store, prepares content and flags what needs your sign-off. [web]
3. **You approve what matters.** Anything that costs money or can't be undone, the agent asks first, and you approve from your phone with one tap. [web]
4. **Daily meeting and morning minutes.** Your team works overnight too. Every morning it meets on its own and you read the minutes: what they did, what's next and what's waiting for your approval. At 7:00 you get your sales report. Your own meetings can be recorded and summarized too. [web]
5. **Every task comes with a deliverable.** You can run it now, save it for later or schedule it daily, weekly or monthly, on your business's local time. **[VERIFY]**

## 3. El equipo: agentes y roles · The team: agents and roles

**ES · lo que publica la web** [web: «¿Qué empleados de IA trae el equipo?»]
- **Director General**: tu CEO, que coordina a todos.
- **Vendedor de WhatsApp**: responde a tus clientes y cierra ventas a cualquier hora.
- **Encargado de inventario**: cuenta lo que tienes y avisa antes de que algo se acabe.
- **Creador de contenido**: prepara y publica tus posts.
- **Experto en publicidad**: maneja tus anuncios y te dice cuáles funcionan.
- **Atención al cliente**: dudas, cambios y reclamos.
- **Jefe de producción**: sigue cada pedido.
- Y también diseñador, realizador de video, contador, analista de tendencias, constructor de apps y más.
- Puedes **crear el tuyo**. **No hay límite de agentes** en ningún plan.

**ES · complementos del producto** **[VERIFICAR]**
- Cada agente tiene una **ficha**: de qué se encarga y qué no lleva.
- Puedes **cambiarle el nombre** a cualquier agente.
- Cuando hace falta un puesto nuevo, tu Director General lo propone, y toda contratación pasa por tu aprobación.

**EN · published on the site** [web]
- **CEO** (coordinates everyone).
- **WhatsApp seller** (answers customers and closes sales any time).
- **Inventory manager** (warns you before anything runs out).
- **Content creator** (prepares and publishes your posts).
- **Ads expert** (runs your ads and tells you which ones work).
- **Customer care** (questions, changes and complaints).
- **Production lead** (tracks every order).
- Plus designer, video maker, accountant, trend analyst, app builder and more.
- You can **create your own**. **Unlimited agents** on every plan.

**EN · product complements** **[VERIFY]**
- Every agent has a **profile card** with what it handles and what it doesn't.
- You can **rename** any agent.
- When a new role is needed, your CEO proposes it, and every hire needs your approval.

## 4. Funciones · Features

**ES · publicadas** [web]
- **Venta por WhatsApp:**
  - responde con el tono de tu marca, cierra la venta y vigila pedidos, carritos y stock;
  - se conecta por código QR o con el número oficial;
  - todas las conversaciones quedan en una sola bandeja;
  - cada cliente avanza paso a paso hasta pagar.
- **Aprobaciones desde el celular,** con un botón.
- **Reunión diaria con su acta** y reporte de ventas a las 7:00.
- **26 automatizaciones listas,** que se encienden con un botón: resumen de ventas cada mañana, carritos abandonados, bienvenida a clientes nuevos, preparar cada reunión, aviso de inventario bajo, el contenido de la semana, cobros y reportes, entre otras.
- **Estudio creativo:**
  - fotos y portadas realistas (13 estilos);
  - videos animados y reels con guion, música y edición;
  - más de 192 plantillas de diseño;
  - **clonarte:** un presentador con tu cara y tu voz, solo con tu permiso, que puedes retirar cuando quieras.
- **Construir webs, landings, tiendas, apps y herramientas internas:**
  - la describes en el chat, sin programar;
  - la ves en vista previa y la cambias con un clic;
  - cada cambio queda como versión;
  - se lanza a **tu** GitHub y **tu** Vercel: el código es tuyo.
- **El cerebro de tu empresa:** lee tus documentos, conversaciones y tareas terminadas, y separa lo seguro de lo que solo supone.
- **Varias marcas** en un solo lugar, cada una con su equipo, un solo resumen y un tope de gasto por marca.
- **Extensión para Chrome:** el agente abre pestañas, llena formularios y aprende un proceso mirándote una vez. Lo importante te lo sigue preguntando.

**ES · del producto** **[VERIFICAR]**
- **Atajos al escribir:** diseño, documento, hoja de cálculo, imagen, vídeo, automatizar, investigar, navegar la web, preguntar a la empresa.
- **Hoja de cálculo** con fórmulas reales.
- **Documentos y presentaciones.**
- **«Muro»** para comparar referencias.
- **Vídeo de principio a fin:** storyboard, animación de los planos aprobados y reel vertical con música, voz en off y subtítulos.
- **Automatizaciones creadas hablando:**
  - nacen como borrador y no se encienden sin tu revisión;
  - se disparan por horario o por algo que pasa (un pedido, un cliente nuevo).
- **Tableros vivos** que se actualizan solos (campañas, inventario, redes).
- **Indicadores del negocio en lenguaje normal** («¿cómo vamos este mes?»).
- **Detecta trabajo repetitivo** y propone automatizarlo.
- **Agenda:** consulta tu calendario y crea eventos.
- **Graba y transcribe** una reunión mientras escribes un documento.
- **Compartir y descargar:** compartes una conversación con un enlace de solo lectura que puedes revocar, y descargas los entregables.

**EN · published** [web]
- **WhatsApp selling:**
  - answers in your brand's voice, closes the sale and watches orders, carts and stock;
  - connects via QR code or the official number;
  - every conversation lives in a single inbox;
  - each customer moves step by step to payment.
- **Approvals** from your phone with one tap.
- **Daily meeting with its minutes** and a 7:00 sales report.
- **26 ready-made automations**, switched on with one tap.
- **Creative studio:**
  - realistic photos (13 styles), animated videos and reels;
  - 192+ design templates;
  - **clone yourself** (presenter with your face and voice, only with your permission, revocable).
- **Build websites, landing pages, stores, apps and internal tools** by describing them; preview, one-click changes and versions. They ship to **your** GitHub and Vercel, and the code is yours.
- **Company brain:** reads your documents, conversations and finished tasks, and separates what's certain from what it only assumes.
- **Several brands** in one place, with a spending cap per brand.
- **Chrome extension:** opens tabs, fills forms and learns a process by watching you once. It still asks about the important stuff.

**EN · from the product** **[VERIFY]**
- Writing shortcuts.
- Spreadsheets with real formulas, documents and presentations.
- End-to-end video (storyboard → animation → vertical reel with music, voice-over and subtitles).
- Automations created by chatting (drafts until you review them).
- Live dashboards and business metrics in plain language.
- Repetitive-work detection, calendar, meeting transcription, read-only share links, deliverable downloads.

## 5. Integraciones · Integrations

**ES · publicadas** [web]
- Se conecta con **más de 70 herramientas**:
  - **Tiendas:** Shopify, WooCommerce, Wix, Squarespace, PrestaShop.
  - **Marketplaces:** MercadoLibre, Amazon, Etsy, eBay.
  - **Facturación:** Alegra, Siigo, Factus, QuickBooks.
  - **CRM:** HubSpot, Kommo, Bitrix24.
  - **Google:** Gmail, Drive, Sheets, Calendar.
  - **Canales:** WhatsApp, Telegram, TikTok, YouTube.
- Tus agentes trabajan **directamente** en ellas: no te devuelven texto para que lo pegues tú.
- **Shopify:** conectas tu tienda y vigila pedidos, carritos abandonados y stock.

**ES · complementos del producto** **[VERIFICAR]**
- Formas de conectar:
  - **con un clic**, autorizando en la página del proveedor; se guarda un permiso revocable, no tu contraseña;
  - **con una clave**;
  - **con cualquier API**;
  - **entrando con tu sesión** en sitios sin conexión oficial.

**EN · published** [web]
- **70+ tools**: stores, marketplaces, invoicing, CRMs, Google apps and channels (WhatsApp, Telegram, TikTok, YouTube).
- Agents work right inside them.
- **Shopify:** connect your store and it watches orders, abandoned carts and stock.

**EN · product complements** **[VERIFY]**
- One-click connections (a revocable permission, never your password), API keys, any API, or signing in with your own session.

## 6. Casos de uso por tipo de negocio · Use cases by business type

> **Fuentes**
> - La web no tiene una página por sector. Lo marcado `[web]` es una función publicada aplicada al sector.
> - Los ejemplos de la portada (p. ej. «ropa cómoda para mujeres») son **inventados** y así se dicen.
> - **[VERIFICAR]** marca lo que la web no dice para ese sector (ni la web ni el producto tienen casos por sector).

| Tipo | ES | EN |
|---|---|---|
| **Tienda** (`tienda`) | Vende por WhatsApp a cualquier hora, recupera carritos abandonados, avisa del inventario bajo y vigila pedidos y stock de tu Shopify. [web] | Sells on WhatsApp any time, recovers abandoned carts, warns about low stock and watches Shopify orders and stock. [web] |
| **Moda** (`moda`) | Crea fotos y portadas de producto, prepara los posts de la semana y responde «¿la tienes en mi talla?» por WhatsApp. Las fotos y el contenido son [web]; tallas y probadores, **[VERIFICAR]**. | Creates product photos, prepares the week's posts and answers "do you have it in my size?" on WhatsApp. Photos and content are [web]; size handling **[VERIFY]**. |
| **Comida** (`comida`) | Avisa a tus clientes del plato del día, responde pedidos y horarios por WhatsApp y sigue cada pedido. WhatsApp y el seguimiento son [web]; domicilios, menús y reservas, **[VERIFICAR]**. | Tells customers about today's special, answers orders and opening hours on WhatsApp and tracks every order. WhatsApp and tracking [web]; delivery, menus and bookings **[VERIFY]**. |
| **Servicios** (`servicios`) | Responde cotizaciones, hace seguimiento a quien no contestó y te deja un resumen del cliente antes de cada cita. El seguimiento de leads es [web, blog]; el resumen antes de la cita, [web, portada]; el seguimiento de cotizaciones, **[VERIFICAR]**. | Answers quote requests, follows up with people who went quiet and briefs you before each appointment. **[VERIFY]** where noted. |
| **Desde cero** (`desde_cero`) | Primero se comprueba que haya clientes y después se construye, sin gastar de más. Te ayuda a validar la idea y a montar la web o la tienda. [web] El producto investiga tu mercado, propone nombres y te ayuda con la estética: **[VERIFICAR]**. | First it checks there are customers, then it builds, without overspending. [web] Market research, name ideas and look-and-feel **[VERIFY]**. |

## 7. Cómo empezar · Getting started

**ES**
- **Hoy:**
  - Agent CEO abre **por grupos**, y quien se apunta antes entra antes. [web]
  - Deja tu correo en el formulario de la web, o en el chat, y te escribimos cuando sea tu turno. [web]
  - Puedes darte de baja desde cualquier correo. [web]
- **Al entrar** **[VERIFICAR]**:
  1. Una sola pregunta: «Ya tengo mi empresa» o «Voy a crear una desde cero».
  2. Una entrevista con tu CEO: una pregunta cada vez.
  3. Acordáis la «tesis» de tu empresa (por qué existe y para quién).
  4. El CEO te presenta al equipo.
  5. Una lista «Configura tu empresa» que se tacha sola.
  - Puedes saltarte la entrevista.

**EN**
- **Today:**
  - We open **in waves**, and the earlier you sign up, the earlier you get in.
  - Leave your email on the site or in the chat and we'll write when it's your turn.
  - You can unsubscribe from any email. [web]
- **Once you're in** **[VERIFY]**:
  1. One question: «I already have a business» or «I'm starting from scratch».
  2. An interview with your CEO, one question at a time.
  3. You agree on your company's "thesis".
  4. You meet the team.
  5. A self-ticking "set up your company" checklist.
  - You can skip the interview.

## 8. Planes y precios · Plans and pricing

Solo lo publicado. Precios en USD. [web: /precios/ · `content/precios.js`]

| Plan | Precio | Créditos por semana | Personas |
|---|---|---|---|
| Arranque | $0 (sin tarjeta) | 300 | 1 |
| Impulso | $29 al mes | 2300 | 5 |
| Motor | $99 al mes | 40.000 | 20 |
| Imperio | $249 al mes | 200.000 | sin límite |

**En todos los planes**
- **Agentes sin límite.**
- Los **créditos se renuevan cada lunes**; los no usados no se acumulan.
- Historial de 30 días.

**Paquetes de créditos (pago único)**
- **Chispa:** 1000 créditos, $5.
- **Envión:** 3000, $12.
- **Turbina:** 8000, $29.
- **Reserva:** 20.000, $65, no caduca.
- No hay cobros automáticos por exceso. Sin créditos, los agentes se detienen hasta el lunes o hasta que compres un paquete.

**Reembolsos** (detalles en la página de Reembolsos y cancelación)
- **Primera suscripción:** dentro de 7 días, si usaste menos del 10 % de los créditos.
- **Chispa, Envión y Turbina:** dentro de 14 días, si no los usaste.
- **Errores de facturación:** siempre.
- Los planes de pago se renuevan cada mes hasta que canceles.

**EN**
- Same table in USD: Arranque $0 (no card), Impulso $29/month, Motor $99, Imperio $249.
- Unlimited agents on every plan.
- Credits renew every Monday and unused ones don't roll over.
- Packs: Chispa, Envión, Turbina and Reserva (never expires).
- No automatic overage charges.
- **Refunds:** first subscription within 7 days if you used under 10% of the credits; packs within 14 days if unused; billing errors always.

## 9. Seguridad, privacidad y control · Security, privacy and control

**ES · publicado** [web]
- **Nada importante pasa sin ti:**
  - lo que cuesta dinero o no se puede deshacer te lo preguntan siempre;
  - una acción sin permiso asignado se bloquea por defecto.
- **La confianza va paso a paso:** cuando una tarea sale bien 3 veces, puede hacerla sola. Lo que cuesta dinero te lo pregunta siempre.
- **Tus datos son tuyos:**
  - cada empresa está aislada;
  - tú decides qué conectas y lo desconectas cuando quieras;
  - puedes exportarlo o pedir que lo borremos.
- **No entrenamos modelos** con tu contenido, ni propios ni de terceros.
- **Cifrado:** todo viaja y se guarda cifrado, y las claves de tus integraciones se cifran aparte. Si hubiera una brecha, te avisamos en 72 h. [web: chat curado «proteccion» → Política de seguridad]
- **Clonarte** solo con tu permiso, y lo puedes retirar.

**ES · complementos del producto** **[VERIFICAR]** (se suman a lo anterior; no lo sustituyen)
- **Tres modos de autonomía por agente,** además de la confianza paso a paso:
  - **Manual**, el de serie: apruebas cada acción.
  - **Auto:** actúa solo en lo cotidiano.
  - **Piloto automático:** solo te consulta lo que necesita un paso tuyo.
- **Lo que ningún modo salta:** enviar una campaña de correo, publicar la tienda y borrar siempre piden tu firma.
- **Los agentes nunca ven tus credenciales.**
- **Topes de gasto por agente** y avisos de saldo al 80 % y al 95 %.
- **En webs sensibles** (bancos, pagos), la extensión se detiene y espera tu permiso.
- **Lo que compartes nace privado** («Solo yo»).
- **Solo puedes clonarte a ti mismo.**

**EN · published** [web]
- **Nothing important happens without you:** money or irreversible actions always need your OK, and unassigned actions are blocked by default.
- **Trust grows step by step:** after 3 successful runs a task can run on its own.
- **Your data is yours:** each company is isolated, you choose what to connect, and you can export or delete.
- **No training** on your content.
- **Encryption** in transit and at rest, and breach notice within 72 h.
- **Self-cloning** only with your permission.

**EN · product complements** **[VERIFY]** (on top of the above, not instead of it)
- Manual / Auto / Autopilot modes per agent, alongside step-by-step trust.
- Actions that always need sign-off.
- Agents never see your credentials.
- Spending caps per agent and 80% / 95% balance alerts.
- The extension pauses on sensitive sites.
- Shares start private.

## 10. Frente a hacerlo a mano · Versus doing it by hand

**ES**
- **A mano:** contestas WhatsApp de noche, revisas el inventario en una hoja y armas los posts el domingo.
- **Con Agent CEO:** el equipo trabaja también de noche y a las 7:00 tienes tu reporte. [web]
- **Contratar persona a persona** frente a tener un equipo desde el primer minuto, con alguien a quien encargarle cada cosa. **[VERIFICAR]**
- **Encargar fuera una web o una app** frente a describirla en el chat, verla en vista previa y que el código sea tuyo. [web]
- **Productora para contenido** frente a reels con guion, música y edición, sin equipo de producción. [web: estudio]
- **Lo que no cambia:** tu criterio. «Automatiza la ejecución, conserva la decisión.» [web: blog]

**EN**
- **By hand:** answering WhatsApp at night, tracking stock in a spreadsheet, building posts on Sunday.
- **With Agent CEO:** the team works overnight and your report is ready at 7:00. [web]
- A full team from minute one instead of hiring one by one. **[VERIFY]**
- Describe a website or app instead of outsourcing it, and the code is yours. [web]
- Reels with script, music and editing without a production crew. [web]
- Your judgment stays yours: "automate the execution, keep the decision". [web: blog]

## 11. Objeciones frecuentes · Common objections

| Objeción | ES | EN |
|---|---|---|
| «¿Y si hace algo sin mi permiso?» | Solo lo que tú permitas. Lo que cuesta dinero o no se puede deshacer te lo pregunta siempre, y lo no permitido se bloquea. [web] | Only what you allow. Money or irreversible actions always ask first; anything not allowed is blocked. [web] |
| «No sé de tecnología» | No hace falta: le escribes como a una persona de tu equipo. Si sabes mandar un WhatsApp, sabes usarlo. [web] | You don't need to: write to it like you'd write to a teammate. [web] |
| «¿Me llevaré sorpresas en la factura?» | No hay cobros automáticos por exceso; tú pones el tope de gasto por marca. [web] Además ves lo que costó cada respuesta. **[VERIFICAR]** | No automatic overage charges; you set the spending cap per brand. [web] Per-reply cost shown **[VERIFY]**. |
| «Va a sonar a robot / contenido genérico» | Usa el tono de tu marca y conoce tu negocio: lee tus documentos y conversaciones. [web] | It uses your brand voice and learns your business from your documents and chats. [web] |
| «¿Y si se inventa cosas?» | Separa lo que es seguro de lo que solo supone. [web] Si no puede hacer algo, lo dice en vez de improvisar. **[VERIFICAR]** | It separates what's certain from what it assumes. [web] It says so when it can't do something **[VERIFY]**. |
| «¿Y si no me gusta lo que hizo?» | Lo rechazas o le pides cambios con tus palabras; cada corrección lo mejora. [web] | Reject it or ask for changes; every correction makes it better. [web] |
| «¿Mis datos?» | Son tuyos, aislados, exportables y borrables. No entrenamos IA con ellos. [web] | Yours, isolated, exportable and deletable. No AI training on them. [web] |
| «Es caro» | Arranque es gratis y sin tarjeta; subes de plan cuando crezcas. [web] | Arranque is free, no card; upgrade when you grow. [web] |

## 12. Glosario · Glossary

| Término | ES | EN |
|---|---|---|
| Agente | Empleado digital de IA con un trabajo concreto. [web] | Digital AI employee with a specific job. [web] |
| Créditos | Lo que consumen los agentes al trabajar; se renuevan cada lunes. [web] | What agents use as they work; renewed every Monday. [web] |
| Paquete de créditos | Créditos extra de pago único (Chispa, Envión, Turbina, Reserva). [web] | One-off extra credits. [web] |
| Aprobación | Botón para dar el visto bueno a algo que cuesta dinero o no se deshace. [web] | One-tap sign-off on money or irreversible actions. [web] |
| Reunión diaria · acta | El equipo se reúne solo cada mañana y tú lees el acta; a las 7:00, el reporte de ventas. [web] | The team meets every morning; you read the minutes; sales report at 7:00. [web] |
| Automatización | Tarea que se repite sola; hay 26 listas. [web] | A task that runs itself; 26 ready-made. [web] |
| Estudio | Donde se crean fotos, videos y diseños. [web] | Where photos, videos and designs are made. [web] |
| Cerebro | Lo que el equipo sabe de tu negocio. [web] | What the team knows about your business. [web] |
| Lista de espera | Abrimos por grupos; los primeros entran primero. [web] | We open in waves; first in line gets in first. [web] |
| Director General (tu CEO) | El agente que coordina a todo el equipo. [web] | The agent that coordinates the whole team. [web] |
| Ficha | De qué se encarga cada agente y qué no lleva. **[VERIFICAR]** | Each agent's remit. **[VERIFY]** |
| Modo de autonomía | Manual, Auto o Piloto automático. **[VERIFICAR]** | Manual, Auto or Autopilot. **[VERIFY]** |
| Forja | Donde se construyen webs, tiendas y apps. [web: FAQ] | Where websites, stores and apps are built. [web] |
| Sala | Conversación con varios agentes. **[VERIFICAR]** | A conversation with several agents. **[VERIFY]** |
| Tesis | Por qué existe tu empresa y para quién. **[VERIFICAR]** | Why your company exists and who it's for. **[VERIFY]** |

## 13. Preguntas frecuentes · FAQ

### ES (34)
1. **¿Qué es Agent CEO?** Un equipo de empleados de IA que venden por WhatsApp, cuidan tu tienda y crean tu contenido. En lo importante, te piden permiso. [web]
2. **¿Qué es un agente?** Un empleado digital con un trabajo concreto, que actúa en tus herramientas en vez de solo sugerir. [web]
3. **¿Tengo que saber programar?** No. Le escribes como a una persona de tu equipo. [web]
4. **¿Hacen cosas sin avisarme?** Solo lo que tú permitas. Lo que cuesta dinero te lo preguntan siempre. [web]
5. **¿Funciona con WhatsApp?** Sí: responde a cualquier hora con el tono de tu marca, cierra ventas y se conecta por código QR o con el número oficial de WhatsApp. [web]
6. **¿Sirve con mi tienda Shopify?** Sí. Vigila pedidos, carritos abandonados y stock. [web]
7. **¿A qué herramientas se conecta?** A más de 70: Shopify, WooCommerce, MercadoLibre, Amazon, Gmail, Drive, Sheets, WhatsApp, TikTok y más. [web]
8. **¿Puede crearme una web o una app?** Sí: webs, landings, tiendas, apps y herramientas internas, publicadas en tu GitHub y tu Vercel. [web]
9. **¿El código es mío?** Sí. [web]
10. **¿Y si no me gusta lo que hizo?** Lo rechazas o pides cambios con tus palabras. [web]
11. **¿Y si algo se atasca?** Te lo muestra en una lista, con el motivo. [web]
12. **¿Mis datos están seguros?** Son tuyos. Cada empresa está aislada, y tú decides qué conectas. [web]
13. **¿Entrenan IA con mis datos?** No, ni modelos propios ni de terceros. [web]
14. **¿Puedo exportar o borrar mis datos?** Sí. [web]
15. **¿Puedo manejar varios negocios?** Sí, con un resumen de todos. [web]
16. **¿Cuánto cuesta?** Arranque es gratis. Impulso $29, Motor $99 e Imperio $249 al mes. [web]
17. **¿Es gratis de verdad?** Sí: Arranque, 300 créditos por semana, 1 usuario, sin tarjeta. [web]
18. **¿Necesito tarjeta?** Solo para un plan de pago o un paquete de créditos. [web]
19. **¿Qué pasa si me quedo sin créditos?** Los agentes se detienen hasta el lunes o hasta que compres un paquete. Sin cobros automáticos. [web]
20. **¿Cuándo se renuevan los créditos?** Cada lunes, y no se acumulan. [web]
21. **¿Hay límite de agentes?** No, en ningún plan. [web]
22. **¿Puedo pedir un reembolso?** Sí, en los casos publicados: 7 días en la primera suscripción, 14 días en los paquetes sin usar, y siempre ante errores de facturación. [web]
23. **¿Cuándo abre?** Por grupos. Apúntate a la lista y te escribimos. [web]
24. **¿Cómo me apunto?** Deja tu correo en la web o en el chat. [web]
25. **¿Puedo darme de baja de los correos?** Sí, desde cualquier correo, con un clic. [web]
26. **¿Hace fotos y videos?** Sí: fotos y portadas en 13 estilos, videos animados y reels con guion, música y edición, y más de 192 plantillas de diseño. [web]
27. **¿Puede hablar con mi cara y mi voz?** Solo con tu permiso, y lo puedes retirar. [web]
28. **¿Qué es la reunión diaria?** Cada mañana el equipo se reúne solo y tú lees el acta: qué hicieron, qué sigue y qué espera tu aprobación. A las 7:00 tienes tu reporte de ventas. [web]
29. **¿Cuántas automatizaciones hay?** 26 listas para encender con un botón. [web]
30. **¿Puedo tener varias marcas?** Sí, cada una con su equipo y su tope de gasto. [web]
31. **¿Puedo cambiarle el nombre a un agente?** Sí. **[VERIFICAR]**
32. **¿Puedo programar tareas?** Sí: diarias, semanales o mensuales, a tu hora local. **[VERIFICAR]**
33. **¿Hay una extensión para el navegador?** Sí, para Chrome: abre pestañas, llena formularios y aprende procesos mirándote. [web]
34. **¿Con quién hablo si tengo otra duda?** Con el equipo, en info@agentceo.io. [web]

### EN (34)
1. **What is Agent CEO?** A team of AI employees that sell on WhatsApp, look after your store and create your content, and ask before anything important. [web]
2. **What's an agent?** A digital employee with a specific job that acts inside your tools. [web]
3. **Do I need to code?** No. Write to it like you'd write to a teammate. [web]
4. **Do they act without telling me?** Only what you allow. Spending money always needs your OK. [web]
5. **Does it work with WhatsApp?** Yes: it answers any time in your brand's voice, closes sales and connects via QR code or the official WhatsApp number. [web]
6. **Does it work with my Shopify store?** Yes: orders, abandoned carts and stock. [web]
7. **What tools does it connect to?** 70+, including Shopify, WooCommerce, MercadoLibre, Amazon, Gmail, Drive, Sheets, WhatsApp and TikTok. [web]
8. **Can it build me a website or an app?** Yes, published to your own GitHub and Vercel. [web]
9. **Is the code mine?** Yes. [web]
10. **What if I don't like what it did?** Reject it or ask for changes in your own words. [web]
11. **What if something gets stuck?** It shows it in a list, with the reason. [web]
12. **Is my data safe?** It's yours. Each company is isolated, and you choose what to connect. [web]
13. **Do you train AI on my data?** No. [web]
14. **Can I export or delete my data?** Yes. [web]
15. **Can I run several businesses?** Yes, with one summary of all of them. [web]
16. **How much does it cost?** Arranque is free; Impulso $29, Motor $99 and Imperio $249 per month. [web]
17. **Is it really free?** Yes: Arranque, 300 credits/week, 1 user, no card. [web]
18. **Do I need a card?** Only for a paid plan or a credit pack. [web]
19. **What if I run out of credits?** Agents pause until Monday or until you buy a pack. No overage charges. [web]
20. **When do credits renew?** Every Monday, and they don't roll over. [web]
21. **Is there an agent limit?** No, on any plan. [web]
22. **Can I get a refund?** Yes, in the published cases. [web]
23. **When does it open?** In waves. Join the waitlist and we'll write. [web]
24. **How do I join?** Leave your email on the site or in the chat. [web]
25. **Can I unsubscribe?** Yes, from any email, in one click. [web]
26. **Does it make photos and videos?** Yes: 13 photo styles, videos, reels and 192+ templates. [web]
27. **Can it speak with my face and voice?** Only with your permission, and you can withdraw it. [web]
28. **What's the daily meeting?** Every morning the team meets on its own and you read the minutes: what they did, what's next and what needs your approval. Your sales report is ready at 7:00. [web]
29. **How many automations are there?** 26, switched on with one tap. [web]
30. **Can I have several brands?** Yes, each with its own team and spending cap. [web]
31. **Can I rename an agent?** Yes. **[VERIFY]**
32. **Can I schedule tasks?** Daily, weekly or monthly, on your local time. **[VERIFY]**
33. **Is there a browser extension?** Yes, for Chrome. [web]
34. **Who do I talk to with other questions?** The team, at info@agentceo.io. [web]

## 14. Contacto · Contact

- **ES:** para hablar con una persona, escribe a **info@agentceo.io**. El asistente de la web es una IA y lo dice siempre. [web]
- **EN:** to talk to a person, email **info@agentceo.io**. The website assistant is an AI and always says so. [web]

## 15. Nota interna: landing ↔ producto (resuelto)

> **Resuelto en T59 (decisión de Diego): manda la landing.** La app no se lanza hasta que esté construido todo lo que promete la web. Por eso esta KB describe como capacidades del producto:
> - WhatsApp por QR o con el número oficial;
> - más de 70 integraciones;
> - los puestos de la web;
> - «a las 3 veces la hace sola»;
> - el acta de la mañana con el reporte de las 7:00;
> - el vídeo.
>
> Los detalles del producto que no contradicen la web van como complementos con [VERIFICAR]. *(Nota para el equipo; no se cablea al chat.)*

## 16. Qué se excluyó y por qué

- **Cualquier dato societario o registral** (la lista exacta está en `worker/chat/private.js`). Lo exige el brief, y el chat ya los bloquea (T40).
- **Infraestructura, proveedores, modelos de IA,** el selector interno de modelo, bases de datos, nombres de servicios: van contra las reglas del chat («cocina interna»).
- **Todo lo del producto que contradice la web** (canales pendientes, otros nombres de puestos, catálogo de conectores, restricciones de plan): manda la landing (T59).
- **Precios, topes y nombres de plan del producto que no coinciden con la web:** solo vale lo publicado.
- **Fechas de roadmap, funciones experimentales o sin lanzar** y conteos medidos en producción.
- **Plantillas de clientes concretos, auditorías y documentos internos de estrategia.**
- **Noticias de terceros** (la web las publica, pero el chat responde sobre Agent CEO).
