# Agent CEO · Landing (agentceo.io)

React 18 + Vite, sin dependencias extra. Mismo stack base que la app (`apps/web`).

## Arrancar
```bash
npm install
cp .env.example .env      # pon tu URL y llave pública de Supabase
npm run dev               # http://localhost:5173
npm run build             # genera dist/ listo para subir
```

## Estructura
```
src/
  main.jsx            monta la app y conecta la lista de espera
  App.jsx             elige diseño (escritorio ≥ 821px / móvil) y escala en laptops < 1440px
  LandingLogic.jsx    TODA la lógica: estado, animaciones con scroll, ojos que siguen el mouse,
                      carruseles, recorrido de la app, FAQ, formulario y ventana de registro
  desktop/            una sección = un archivo (S01Header … S21VentanaUnion) + View.jsx
  mobile/             lo mismo para celular
  styles/desktop.css  estilos y animaciones de escritorio
  styles/mobile.css   estilos y animaciones de celular
  lib/bind.js         ayudas de render (s, css)
  lib/waitlist.js     guarda correos en Supabase
supabase.sql          tabla + función segura para la lista de espera
```

Cada sección recibe `v` (los valores que calcula `renderVals()` en `LandingLogic.jsx`).
Para cambiar un texto, ábrelo en su sección (por ejemplo `src/desktop/S18PreguntasFrecuentes.jsx`
y su gemela en `src/mobile/`). Para cambiar comportamiento, `LandingLogic.jsx`.

## Lista de espera (Supabase)
1. Supabase → SQL Editor → pega `supabase.sql` → Run.
2. Settings → API: copia Project URL y la llave anon/publishable a `.env`.
3. Los registros quedan en la tabla `waitlist` (correo, tipo de negocio, origen). Desde la web nadie puede leerla.

## Publicar
- **Cloudflare Pages:** Build command `npm run build`, output `dist`. Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. Dominio: agentceo.io.
- **Vercel:** importa la carpeta; detecta Vite solo. Agrega las mismas variables.

## Pendiente conocido
La sección "Así se ve tu empresa por dentro" (`S03AsiSeVePorDentro.jsx`) muestra pantallas de la app
de la rama main. Falta actualizarla al diseño de la rama `b3-despliegue-19oct-j`.
