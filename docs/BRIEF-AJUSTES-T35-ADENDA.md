# Luca aquí (Diego aprobó) — Adenda URGENTE a T35. Mismo lote, commit local, NO deploy, NO push.
Nota: maté el proceso de evals contra producción (pid 28795) porque compartía IP con Diego. NO lo relances hasta que yo lo diga. Cuando se relance: gap ≥ 15 s y como mucho 20 casos live.

0. (PRIORIDAD MÁXIMA) Diego escribió «hola amigo» en el widget de agentceo.io y NO recibió respuesta. Desde curl y desde Playwright (IP de esta Mac) sí responde, y el servidor da 200.
   Causas probables:
   - las evals desde la misma IP a 6,5 s ≈ 9/min, que con RL_CHAT 10/min y los límites por hora y día dejan sin cupo a Diego;
   - un fetch colgado sin timeout deja `busy=true` y el envío bloqueado;
   - sesión o turnos guardados en `ac_chat`;
   - un stream con `done` sin texto.
   Encuentra la causa real y arréglalo:
   - el widget NUNCA se queda callado: timeout con AbortController (~15 s) y, ante 429, límite, error o timeout, un mensaje amable más la respuesta del stub/curada;
   - los saludos («hola», «hola amigo», «hi», «buenas»…) se responden al instante por la vía curada, sin LLM y sin gastar cupo;
   - la vía curada y el stub no consumen el cupo live por IP.
   e2e en los 3 navegadores: 429 simulado, timeout simulado, stream vacío y saludo.
1. Acta (S07, «se reúnen solos»): la tarjeta se corta abajo. Alinea su borde superior con el título de la sección y haz que el acta entera quepa en un viewport de 1280x800 y de 1440x900 (compáctala si hace falta). Sube un poco la ilustración de la oficina (óvalo + agentes) y céntrala mejor.
2. S03 «Así se ve tu empresa por dentro» se ve VACÍA en producción (ventana oscura sin nada dentro). Busca la causa raíz (hidratación lazy o intersection, CSP, error de JS…). Ojo: en la consola de producción el CSP bloquea https://static.cloudflareinsights.com/beacon.min.js. Revisa también eso: o se permite por CSP o se desactiva Web Analytics en el Worker; documenta qué eliges. Corrígelo, con un e2e que compruebe que hay contenido visible en S03 tras hacer scroll.
3. La Forja (landing, web, tienda, web app y móvil): el resultado final debe ser un prototipo real, pulido y bonito (mini sitio, tienda o app con UI real y una marca ficticia), no un placeholder con cara de falso.
4. Footer: rediseño más ancho y pulido, con las columnas Producto, Recursos, Empresa y Legal. En Legal, ~5 enlaces clave más «Ver todo», que lleva a una nueva página índice /legal/ (y /en/legal/) con los 14 documentos. Añade una 5.ª columna tipo «Confianza» o «Más información». Equilibrado en todo el ancho y responsive.
5. En el conocimiento y el prompt del chat (y donde el asistente cite un contacto), cambia info@klinworks.com por info@agentceo.io. NO cambies los contactos de los documentos legales.
Luego, todo lo de T35 (caché inteligente + Instrument Serif con falso negrita) y la verificación completa: build, unitarios, e2e en los 3 navegadores, Lighthouse móvil y capturas en docs/capturas-t35/, incluidas comparativas lado a lado entre Fraunces y Instrument Serif.
