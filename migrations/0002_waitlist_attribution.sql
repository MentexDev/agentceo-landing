-- Lista de espera v2 · atribución, idioma, tipo de negocio y aviso de privacidad.
-- ADITIVA: solo añade columnas que admiten NULL. Las filas existentes no cambian.
-- ⛔ En producción la aplica Diego (`wrangler d1 migrations apply agentceo-waitlist --remote`).
--    Mientras no se aplique, el Worker sigue guardando con el esquema v1 (fallback probado).
ALTER TABLE signups ADD COLUMN locale        TEXT;  -- 'es' | 'en' (idioma de la página)
ALTER TABLE signups ADD COLUMN business_type TEXT;  -- tienda | moda | comida | servicios | desde_cero
ALTER TABLE signups ADD COLUMN utm_source    TEXT;
ALTER TABLE signups ADD COLUMN utm_medium    TEXT;
ALTER TABLE signups ADD COLUMN utm_campaign  TEXT;
ALTER TABLE signups ADD COLUMN utm_term      TEXT;
ALTER TABLE signups ADD COLUMN utm_content   TEXT;
ALTER TABLE signups ADD COLUMN click_id      TEXT;  -- gclid / fbclid / msclkid (el primero que llegue)
ALTER TABLE signups ADD COLUMN ref           TEXT;  -- ?ref= (programas de referidos / socios)
ALTER TABLE signups ADD COLUMN landing_path  TEXT;  -- primera página vista (primer toque)
ALTER TABLE signups ADD COLUMN notice_version TEXT; -- versión del aviso de privacidad mostrado al apuntarse (CCPA)
ALTER TABLE signups ADD COLUMN updated_at    TEXT;
