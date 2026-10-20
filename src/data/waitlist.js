// Datos COMPARTIDOS por el Worker y el front de la lista de espera.
// Una sola fuente: si se añade un tipo de negocio aquí, lo aceptan el Worker,
// el modal y los tests a la vez.

/** Tipos de negocio del paso 2 del modal (S21 del prototipo). */
export const BUSINESS_TYPES = ['tienda', 'moda', 'comida', 'servicios', 'desde_cero']

/** Versión del aviso de privacidad que se muestra junto al formulario (CCPA, «notice at collection»). */
export const NOTICE_VERSION = '2026-10-20'

/** Parámetros de atribución que se capturan en el primer toque. */
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']
export const CLICK_KEYS = ['gclid', 'fbclid', 'msclkid']
