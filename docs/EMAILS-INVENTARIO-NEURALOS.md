# Inventario · los correos de NeuralOS (referencia para Agent CEO)

> T42 · 2026-10-20. Fuente: `~/Downloads/Correos de NeuralOS · propuestas.html` (página empaquetada de 8,6 MB).
> Se desempaquetó con un script en `/tmp` (scratchpad de la sesión): `__bundler/manifest` (base64 + gzip) →
> 31 páginas, y cada página es a su vez otro paquete con su propio `__bundler/template`. **Nada del archivo se copió
> al repo**: aquí solo va lo que se leyó en ese texto.

## Qué hay

**31 tableros** en el lienzo:
- **1 de sistema:** «El sistema · tonos, piezas y variables».
- **1 de calendario:** «Ritmo · cuándo escribimos».
- **29 plantillas** numeradas del S‑01 al S‑29.

El propio tablero «Ritmo» cuenta **28 correos vigentes**:
- el S‑21 sustituye al S‑05;
- el S‑29 es nuevo;
- 19 se pueden construir ya y 9 esperan a su función.

Todas están en español, con datos de ejemplo («Ana», «Acme», «Grupo Éxito»).

| # | Nombre | Asunto (tal cual) | Para qué | Tono |
|---|---|---|---|---|
| S‑01 | Tu día | Buenos días, {{nombre}} · cuatro líneas, una urgente | Resumen diario: firmas pendientes, una portada y filas numeradas | Edición |
| S‑02 | Urgente · una firma | {{nombre}}, Finanzas espera tu firma antes de las 8:00 p. m. | Firma que vence antes del próximo resumen | Edición |
| S‑03 | Urgente · una pregunta | {{nombre}}, Marketing necesita una respuesta antes de las 6:00 p. m. | Pregunta de un agente con opciones (una recomendada) | Edición |
| S‑04 | A los admins | {{nombre}}, una firma de Daniel vence en 1 h 40 min | Escalado a los admins si nadie firma | Edición |
| S‑05 | Estás en la beta | {{nombre}}, ya estás en la lista de NeuralOS | Alta en la lista de espera con posición (#142) | Celebración (sustituido por S‑21) |
| S‑06 | Tu cupo está listo | {{nombre}}, es tu turno: tu NeuralOS ya está listo | Acceso abierto y tres primeros pasos | Celebración |
| S‑07 | Te invitaron a un espacio | {{invitador}} te invita a trabajar en {{espacio}} | Invitación de un compañero | Celebración |
| S‑08 | Tu primer día con Atlas | {{nombre}}, tres cosas que puedo hacer hoy por ti | Activación: tres tareas para elegir | Celebración |
| S‑09 | Atlas terminó tu trabajo | {{nombre}}, tu informe de ventas de octubre está listo | Entregable de un trabajo largo | Celebración |
| S‑10 | Alguien aceptó tu invitación | {{nuevo}} ya está en {{espacio}} | El equipo crece | Celebración |
| S‑11 | Confirma tu correo | {{nombre}}, confirma tu correo para entrar a NeuralOS | Verificación del registro | Sobrio |
| S‑12 | Restablece tu contraseña | {{nombre}}, aquí tienes el enlace para tu contraseña nueva | Recuperar la contraseña | Sobrio |
| S‑13 | Confirma tu correo nuevo | {{nombre}}, confirma que este es tu correo nuevo | Cambio de correo (antes → ahora) | Sobrio |
| S‑14 | Tu contraseña cambió | {{nombre}}, tu contraseña de NeuralOS cambió | Aviso posterior al cambio | Sobrio |
| S‑15 | Nuevo inicio de sesión | {{nombre}}, entraron a tu cuenta desde un dispositivo nuevo | Alerta de seguridad con «Sí, fui yo / No fui yo» | Sobrio |
| S‑16 | Tu cuenta se eliminó | {{nombre}}, tu cuenta de NeuralOS se eliminó | Último correo: qué se borró, qué se cedió y qué se guarda | Sobrio |
| S‑17 | Ahora eres admin | {{nombre}}, ahora eres admin de {{espacio}} | Cambio de rol | Edición |
| S‑18 | Tus créditos de IA se acaban | {{nombre}}, a {{espacio}} le queda el 20 % de créditos este mes | Consumo al 80 % y quién gastó más | Edición |
| S‑19 | Tu recibo | Recibo de NeuralOS · {{espacio}} · octubre 2026 | Recibo de pago con factura | Sobrio |
| S‑20 | No pudimos cobrar | {{nombre}}, no pudimos cobrar el plan de {{espacio}} | Pago fallido, reintento y gracia | Sobrio |
| S‑21 | Tu pase de fundador | {{nombre}}, tu pase de fundador de NeuralOS | Alta en el prelanzamiento con un «pase» visual | Celebración |
| S‑22 | La bitácora de construcción | {{nombre}}, lo que construimos estas dos semanas | Novedades cada 2 semanas a quien espera | Edición |
| S‑23 | Tu ola abre mañana | {{nombre}}, mañana a las 10:00 entras a NeuralOS | Aviso 24 h antes, con cuenta atrás y .ics | Celebración |
| S‑24 | Trae a tu equipo | {{nombre}}, tu pase trae 3 sitios más | Referidos: invitaciones del prelanzamiento | Celebración |
| S‑25 | Tu semana con Atlas | {{nombre}}, tu semana: 23 tareas, 7 firmas y una propuesta de Atlas | Resumen semanal con cifras | Edición |
| S‑26 | La edición del mes | NeuralOS · Noviembre: tus agentes ya hablan entre ellos | Newsletter mensual (lanzamiento, historia, guía) | Edición |
| S‑27 | Por aquí está todo quieto | {{nombre}}, tu propuesta para Grupo Éxito sigue a medias | Win-back a los 14 días, una sola vez | Edición |
| S‑28 | Un hito | {{nombre}}, 100 tareas en tu primer mes | Celebrar hitos (como mucho uno al mes) | Celebración |
| S‑29 | Ya estás dentro | {{nombre}}, ya estás dentro de NeuralOS | Bienvenida tras confirmar el correo | Celebración |

## Recursos de estilo que vale la pena copiar

Lo que se adoptó en Agent CEO está marcado con ✅.

**El sistema de tres tonos: Edición, Celebración y Sobrio** ✅
- Una sola marca con tres energías.
- En la seguridad, calma; en lo bueno, pegatina y color.
- En Agent CEO cada plantilla declara su `tone`.

**Las piezas fijas** ✅
- Cabecera con rótulo y fecha.
- Mascota grande, o pequeña en los sobrios.
- Titular serif con la palabra clave en *itálica*.
- Burbuja del asistente.
- Portada (tarjeta de lo importante).
- Filas numeradas `01, 02…`.
- «Carta» lavanda: en Agent CEO, dorado claro.
- Nota de seguridad.
- Firma y pie.

**Las reglas que no se rompen** ✅
- Un solo botón principal.
- Los de seguridad nunca llevan baja.
- El asunto lleva el nombre o el dato, nunca «Notificación».
- 600 px, claro y oscuro.
- Los enlaces muestran su destino real («¿No funciona el botón? Copia esto»).
- El asistente firma siempre: en Agent CEO, «Tu CEO».

**«Sin nombre, “Hola” a secas; nunca “Hola, ,”»** ✅ Hay un test que lo vigila.

**Las siete reglas del «Ritmo»** (✅ en el plan, como reglas de envío para la fase B):
1. Como mucho una promoción por semana.
2. Silencio si no hay nada que contar.
3. Nada entre las 21:00 y las 7:00, salvo seguridad.
4. Baja por tipo de correo.
5. Si coinciden dos el mismo día, gana el que más importa.
6. Tras 4 promociones sin abrir, se baja el ritmo.
7. Cada cifra sale de datos reales.

**«Cuándo» y variables en cada tablero** ✅ Cada plantilla de Agent CEO lleva `when`, `required` y `sample`.

**Datos de contexto en los avisos de seguridad** ✅
- «Lo pidió Chrome en macOS · desde Bogotá (aprox.)».
- IP parcial `181.49.•••.•••`.

**Recuperación honesta en el pago fallido** ✅ «No se borra nada», condicionado al dato de gracia.

**Visuales con carácter**
- ✅ Pegatina inclinada en itálica.
- ✅ Cifra gigante para la posición en la fila.
- ⏳ Pase de fundador con número.
- ⏳ Cuenta atrás 24 h + .ics.

**Lo que no se copió**
- ⛔ El pie de NeuralOS dice «Klinworks LLC · Delaware, USA». En Agent CEO está **prohibido**, y un test (`emails/tests/legal.test.js`) falla si aparece.
- Tampoco se copió la tipografía violeta y lima: Agent CEO usa crema, tinta y dorado.
