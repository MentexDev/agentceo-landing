# LEGAL-CHECKLIST · Agent CEO (Klinworks, LLC)

> Entregable del brief §7. Estado al **2026-10-20** (rama `luca/landing-v2`, fase L).
> **Todo está en BORRADOR y requiere revisión de abogado.** Cada página lo dice en una banda
> visible (`estado: borrador` en el frontmatter; al pasar a `revisado` la banda desaparece).
>
> **Fuentes de verdad:** los textos, en `content/legal/es/*.md`. Datos compartidos, en una sola fuente:
> - `content/subprocesadores.js`, que alimenta Privacidad §5, GDPR §5, Subprocesadores y DPA;
> - `src/data/storage.js`, que alimenta Cookies §2 bis.
>
> Los `[PENDIENTE …]` salen literales en la página, resaltados en rojo. La lista de abajo se
> extrajo con un script, no de memoria. Los tests de `tests/site/legal.test.js` vigilan esto.

## 1. Estado por pieza

Leyenda: ✅ hecho · 🟡 borrador con pendientes · ⏳ falta un dato de Diego o del abogado.

| # | Pieza (brief §7) | Ruta | Versión | Estado | Pendientes |
|---|---|---|---|---|---|
| 1 | Privacidad, con todos los subprocesadores | `/legal/privacidad` | 2.1 | 🟡 borrador | Tabla viva de 15 proveedores; ver §3 (razones sociales y regiones) |
| 2 | Aviso CCPA/CPRA | `/legal/california` | 1.0 | 🟡 borrador | Información sensible en la app; plazos de conservación de la lista y de los leads |
| 3 | Enlace «Do Not Sell or Share» + GPC | `/no-vender-ni-compartir/` + pie | — | ✅ | Registra la solicitud (cookie `consent`, `d1`). GPC respetado sin preguntar. Hay tests e2e |
| 4 | Leyes estatales | `/legal/estados` | 1.0 | 🟡 borrador | Datos sensibles; plazo de las apelaciones |
| 5 | Banner de cookies con opt-in que bloquea la analítica | Panel «Preferencias de cookies» | — | ✅ | **No hay analítica** (Diego). El panel no aparece solo porque no hay nada no esencial que aceptar. Si un día se añade un proveedor (`ANALYTICS_PROVIDERS`), queda bloqueado hasta el consentimiento y nunca se activa con GPC |
| 6 | Términos | `/legal/terminos` | 2.1 | 🟡 borrador | Enlazan Uso aceptable, IA y Reembolsos |
| 7 | Uso aceptable | `/legal/uso-aceptable` | 1.0 | 🟡 borrador | Plazo de respuesta a los reportes de abuso |
| 8 | Divulgación de IA | `/legal/ia` | 1.0 | 🟡 borrador | — (incluye SB 1001 y el art. 50 del Reglamento de IA de la UE) |
| 9 | Lista de subprocesadores | `/legal/subprocesadores` | 1.0 | 🟡 borrador | Días de preaviso a clientes con DPA |
| 10 | DPA | `/legal/dpa` | 1.0 | 🟡 borrador | Preaviso de subencargados; plazo de aviso de brecha (≤ 72 h, ya prometido en Seguridad §10); mecanismo de transferencia (DPF o CCT); auditorías |
| 11 | Reembolsos y cancelación | `/legal/reembolsos` | 1.0 | ⏳ | **Primera cláusula llegó cortada** (reconstruida con Términos §3.5); si los créditos semanales se acumulan; caducidad de Chispa, Envión y Turbina; plazos de respuesta y de reembolso |
| 12 | Declaración de accesibilidad | `/legal/accesibilidad` | 1.0 | 🟡 borrador | Control de pausa visible (WCAG 2.2.2); plazo de respuesta |
| 13 | DMCA | `/legal/dmca` | 1.0 | ⏳ | **`[PENDIENTE registro dmca.copyright.gov]`**: no hay agente registrado (Diego) |
| 14 | COPPA (sin menores de 13) | Privacidad §11 + California §11 | — | ✅ | El Servicio exige 18+ (más estricto) y menciona COPPA expresamente |
| 15 | CAN-SPAM en los correos de la lista | Aviso del formulario + Uso aceptable | — | ⏳ | El formulario promete «darte de baja desde cualquier correo». El enlace de baja, la dirección física en el pie del correo y el remitente identificado (Resend desde agentceo.io) se construyen con el envío, que no está en esta rama |
| 16 | Página de contacto | `/contacto/` | — | ✅ | Buzones `@klinworks.com` por tema |
| 17 | Seguridad | `/legal/seguridad` | 2.0 | 🟡 borrador | Sin cambios de contenido |
| 18 | GDPR / RGPD | `/legal/gdpr` | 2.1 | 🟡 borrador | §5 con la tabla viva; §12 y §13 enlazan California y Estados |
| 19 | Cookies | `/legal/cookies` | 2.1 | 🟡 borrador | §2 bis: inventario de la web, una entrada por clave (hay un test que exige que esté completo) |
| 20 | Aviso en el momento de la recogida (CCPA) | Junto a cada formulario de la lista | `notice_version` 2026-10-20 | ✅ | Cada alta guarda la versión del aviso que vio |

## 2. Pendientes literales en los documentos (extraídos el 2026-10-20)

- **accesibilidad:** control visible de pausa para animaciones de más de 5 s · plazo comprometido de respuesta.
- **california:** si la app trata información personal sensible (CPRA) y para qué · plazos exactos de conservación.
- **dmca:** registro del agente en dmca.copyright.gov (2 menciones).
- **dpa:**
  - mecanismo de transferencia (Data Privacy Framework o cláusulas contractuales tipo);
  - días de preaviso de un subencargado nuevo;
  - plazo en horas del aviso de brecha;
  - frecuencia y costes de las auditorías.
- **estados:** datos sensibles y consentimiento · plazo de respuesta a las apelaciones.
- **reembolsos:**
  - confirmar la primera cláusula;
  - acumulación de los créditos semanales;
  - caducidad de los paquetes salvo Reserva;
  - plazo de respuesta;
  - plazo del reembolso.
- **subprocesadores:** días de preaviso.
- **uso-aceptable:** plazo de respuesta a los reportes.

## 3. Pendientes de datos (no están en el texto, sino en la fuente de datos)

- `content/subprocesadores.js`:
  - **la razón social exacta y la región de tratamiento de cada proveedor** se deben confirmar con sus contratos o DPA (ElevenLabs y Meta llevan `[PENDIENTE verificar]` en la región);
  - **qué proveedores están contratados hoy**: el brief los da como «reales», pero Diego no lo confirmó uno a uno.
  - PostHog y Plausible figuran como «No activo», porque no hay analítica.
- **Información sensible:** ¿guarda la app datos que la CPRA o las leyes estatales consideran sensibles? Eso decide si se ofrece el derecho a «limitar».
- **`ac_attr`** (campaña de origen en `sessionStorage`) está clasificada como **funcional**. El abogado debe decidir si para visitantes de la UE requiere consentimiento previo.

## 4. Lo que el abogado debería mirar primero

1. **Reembolsos:** la cláusula reconstruida y su encaje con el derecho de desistimiento de consumidores (Términos §12.6).
2. **DPA:** el mecanismo de transferencia internacional y el plazo de aviso de brechas.
3. **California y Estados:** la aplicabilidad por umbrales. Los textos reconocen los derechos a cualquier residente de EE. UU., aunque la ley no obligue.
4. **DMCA:** registrar al agente designado antes de publicar.
5. **IA:** la redacción de la divulgación (SB 1001, art. 50 del Reglamento de IA de la UE) y el «clon» de voz o imagen con permiso revocable.
