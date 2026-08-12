---
titulo: Política de seguridad
ruta: /legal/seguridad
actualizado: 2026-08-02
version: 2.0
---

# Política de seguridad

**Última actualización: 2 de agosto de 2026**

Cómo protege **Klinworks, LLC** («Klinworks») la información en el servicio
**AgentCEO**.

Klinworks es una sociedad de responsabilidad limitada de Delaware (Estados
Unidos), expediente n.º 10704723, con oficina registrada en 131 Continental
Drive, Suite 305, Newark, Delaware 19713.

**Contacto de seguridad: security@klinworks.com**

> **Una nota sobre honestidad.** Este documento describe controles que están
> implementados hoy, no aspiraciones. Cuando algo esté planificado pero no
> activo, lo decimos expresamente en la sección 8. Preferimos que sepas
> exactamente qué tienes.

---

## 1. Cifrado

**1.1 En tránsito.** Todo el tráfico viaja por TLS 1.2 o superior. No servimos
contenido por HTTP sin cifrar.

**1.2 En reposo.** Las bases de datos y el almacenamiento de archivos están
cifrados en disco por nuestros proveedores de infraestructura.

**1.3 Credenciales de integraciones.** Cuando conectas un sistema externo, sus
claves y tokens se cifran con una clave maestra que **no reside en la base de
datos**. Además, las columnas que contienen ese material están revocadas a nivel
de motor: ni siquiera una sesión autenticada legítima puede leerlas mediante una
consulta. Solo el proceso del servidor que necesita usarlas puede descifrarlas.

**1.4 Contraseñas.** No almacenamos contraseñas en claro. La autenticación la
gestiona nuestro proveedor de identidad con algoritmos de hash resistentes.

## 2. Aislamiento entre organizaciones

Cada organización solo ve sus datos. Esto se aplica en **dos capas
independientes**, de forma que un fallo en una no expone la información:

- **En la base de datos**, mediante políticas de seguridad a nivel de fila que
  filtran cada consulta según la membresía del usuario.
- **En la aplicación**, resolviendo la organización **siempre en el servidor** a
  partir de la sesión. La organización nunca se acepta desde el navegador,
  porque eso permitiría a cualquiera pedir los datos de otra empresa cambiando un
  identificador.

Este aislamiento se verifica con pruebas automatizadas que se ejecutan en cada
cambio del código.

## 3. Control de acceso

**3.1 Roles.** Dentro de una organización, los permisos dependen del rol. Las
operaciones que comprometen a la empresa —contratar, comprar, conectar
integraciones, desconectar miembros— están reservadas a la **Junta Directiva**, y
esa restricción se aplica **en el servidor**, no solo en la interfaz.

**3.2 Verificación en dos pasos (2FA).** Disponible mediante aplicación de
autenticación (TOTP). Cuando la activas, **la base de datos exige el segundo
factor** para dar acceso a los datos de la organización: no basta con superar la
pantalla de inicio de sesión.

**3.3 Sesiones.** Puedes ver los dispositivos con sesión abierta y cerrarla a
distancia. La Junta puede desconectar a un miembro de todos sus dispositivos.

**3.4 Acceso de nuestro personal.** El acceso a datos de clientes está limitado a
lo imprescindible para operar el Servicio y responder incidencias. No leemos tu
contenido salvo que nos lo pidas, lo exija la ley o sea imprescindible para
investigar un abuso grave.

## 4. Registro y auditoría

**4.1 Bitácora de cambios.** Las modificaciones sobre tus datos quedan
registradas para que puedas auditar qué hicieron tus agentes y restaurar lo que
haga falta.

**4.2 Registro de operaciones sensibles.** Conectar o desconectar integraciones,
cambios de plan y compras quedan registrados de forma **inmutable**: el registro
es de solo inserción, no se puede modificar ni borrar desde la aplicación.

**4.3 Sin datos personales en los registros técnicos.** Nuestros registros de
sistema guardan identificadores, nunca correos, teléfonos ni nombres completos.

## 5. Desarrollo seguro

Cada cambio del código pasa por comprobaciones automáticas antes de llegar a
producción:

- **Detección de secretos**: impide que una clave o token acabe en el
  repositorio.
- **Verificación de seguridad de la base de datos**: comprueba que las políticas
  de aislamiento siguen en pie.
- **Comprobación de tipos y análisis estático**.
- **Pruebas automatizadas**, incluidas las que verifican que una organización no
  puede leer los datos de otra.
- **Construcción del producto**, que debe completarse sin errores.

Ningún cambio se despliega si alguna de estas comprobaciones falla.

## 6. Copias de seguridad y continuidad

Nuestro proveedor de base de datos realiza copias automáticas con recuperación a
un punto en el tiempo. Los datos se replican en la infraestructura del proveedor.

**Lo que esto no significa:** no ofrecemos hoy un compromiso contractual de
tiempo de recuperación (RTO) ni de punto de recuperación (RPO). Si necesitas
esas garantías para tu operación, escríbenos a legal@klinworks.com y lo tratamos
por contrato específico.

## 7. Seguridad de los agentes de IA

**7.1 Ejecución aislada.** El código que generan los agentes se ejecuta en
entornos separados de la infraestructura que sostiene el Servicio.

**7.2 Política de herramientas.** Las acciones sensibles pueden requerir
aprobación explícita. Una acción sin política asignada se **bloquea por defecto**:
ante la duda, no se ejecuta.

**7.3 Límites de gasto.** El consumo se mide en créditos y se detiene al
agotarse. No hay cobro automático por exceso, de modo que un agente en bucle no
puede vaciar tu cuenta.

**7.4 Sus datos no entrenan modelos.** Contratamos con nuestros proveedores de
modelos que el contenido enviado por tu cuenta no se use para entrenamiento.

## 8. Lo que todavía no tenemos

Decimos esto expresamente porque un documento de seguridad que solo enumera
virtudes no sirve para decidir:

- **No tenemos certificación SOC 2 ni ISO 27001.** Están en nuestro plan, sin
  fecha comprometida.
- **No hemos realizado una auditoría de penetración externa** por un tercero
  independiente.
- **No ofrecemos hoy un acuerdo de nivel de servicio (SLA)** con disponibilidad
  garantizada.
- **No tenemos un programa formal de recompensas** por vulnerabilidades, aunque
  atendemos todos los reportes (sección 9).

Si alguno de estos puntos es un requisito para ti, escríbenos antes de contratar
y te diremos con honestidad si podemos cubrirlo.

## 9. Reportar una vulnerabilidad

Si encuentras un problema de seguridad, escríbenos a **security@klinworks.com** con
la descripción y los pasos para reproducirlo.

**Nuestro compromiso:**

- Acusamos recibo en **72 horas hábiles**.
- Te mantenemos informado del avance.
- No emprenderemos acciones legales contra quien investigue de buena fe,
  respete la privacidad de terceros, no degrade el Servicio y nos dé un plazo
  razonable antes de divulgar.

**Por favor, no** accedas a datos de otras organizaciones, no realices ataques de
denegación de servicio ni pruebas de ingeniería social contra nuestro personal o
nuestros clientes.

## 10. Notificación de incidentes

Ante una violación de seguridad que afecte a tus datos, te informaremos **sin
dilación indebida y en un plazo máximo de 72 horas** desde que tengamos
conocimiento, indicando qué ocurrió, qué datos se vieron afectados, qué medidas
hemos tomado y qué te recomendamos hacer. Notificaremos a las autoridades de
control cuando la normativa lo exija.

## 11. Tu parte

La seguridad es compartida. Te recomendamos:

- Activar la verificación en dos pasos.
- Usar una contraseña única y robusta.
- Conceder a cada integración **el permiso mínimo** que necesite.
- Revisar periódicamente las sesiones activas y los miembros de tu organización.
- Configurar aprobaciones para las acciones de agentes con impacto económico.
- Avisarnos de inmediato si sospechas un acceso no autorizado.

---

## Contacto

**Klinworks, LLC**
131 Continental Drive, Suite 305
Newark, Delaware 19713, Estados Unidos
Expediente de Delaware n.º 10704723

- Seguridad y vulnerabilidades: **security@klinworks.com**
- Asuntos legales: **legal@klinworks.com**
- Privacidad: **privacidad@klinworks.com**
