// Las piezas que se repiten en todos los correos (molde: «El sistema» de NeuralOS, con la marca de la landing).
// Reglas de correo: tablas (Section/Row/Column de React Email), estilos EN LÍNEA, 600 px, sin SVG, sin
// variables CSS. El único <style> es el de las fuentes, el móvil y el modo oscuro (Apple Mail / iOS / Outlook.com);
// si un cliente lo ignora, el correo sigue legible porque todo lo básico va en línea.
import { Body, Button, Column, Container, Head, Hr, Html, Img, Link, Preview, Row, Section, Text } from 'react-email'
import { COLORS as C, FONTS as F, COMPANY, ROUTES, EMAIL_ASSETS, POSTAL_PLACEHOLDER } from './brand.js'

const asset = (ctx, name) => `${ctx.assetBase}/${EMAIL_ASSETS[name].file}`
const font = (ctx, p) => `${ctx.fontBase}${p}`

// Fuentes de la landing (las mismas woff2 de public/fonts) + móvil + modo oscuro.
// [data-ogsc] = Outlook.com en oscuro; el resto, prefers-color-scheme.
function styles(ctx) {
  const dark = `
    .ac-body{background:${C.night}!important}
    .ac-card{background:${C.nightCard}!important;border-color:${C.nightLine}!important}
    .ac-tint{background:#2A2418!important;border-color:#4A3D22!important}
    .ac-tx{color:${C.nightText}!important}
    .ac-muted{color:${C.nightMuted}!important}
    .ac-gold{color:${C.gold2}!important}
    .ac-line{border-color:${C.nightLine}!important}
    .ac-btn{background:${C.gold2}!important;color:${C.ink}!important}
    .ac-plate{background:${C.ink}!important}
    .ac-light{display:none!important}
    .ac-dark{display:block!important;max-height:none!important;overflow:visible!important}`
  const scoped = (sel) => dark.replace(/\n\s+\./g, `\n${sel} .`)
  return `
  @font-face{font-family:'Instrument Serif';font-style:normal;font-weight:400;src:url(${font(ctx, '/fonts/instrument-serif-latin-400-normal.woff2')}) format('woff2')}
  @font-face{font-family:'Instrument Serif';font-style:italic;font-weight:400;src:url(${font(ctx, '/fonts/instrument-serif-latin-400-italic.woff2')}) format('woff2')}
  @font-face{font-family:Geist;font-style:normal;font-weight:100 900;src:url(${font(ctx, '/fonts/geist-latin-wght-normal.woff2')}) format('woff2')}
  @font-face{font-family:'Geist Mono';font-style:normal;font-weight:100 900;src:url(${font(ctx, '/fonts/geist-mono-latin-wght-normal.woff2')}) format('woff2')}
  :root{color-scheme:light dark;supported-color-schemes:light dark}
  a{color:inherit}
  @media (max-width:620px){
    .ac-pad{padding-left:22px!important;padding-right:22px!important}
    .ac-h1{font-size:36px!important}
    .ac-stat{font-size:64px!important}
    .ac-label{font-size:10px!important;letter-spacing:.06em!important}
    .ac-half{display:inline-block!important;width:50%!important;box-sizing:border-box;margin-bottom:14px}
    .ac-num{font-size:34px!important}
  }
  @media (prefers-color-scheme:dark){${dark}}
  ${scoped('[data-ogsc]')}`
}

// Titular serif con la «negrita falsa» de la landing (T35): Instrument Serif 400 + trazo del color del
// texto pintado DEBAJO del relleno. Solo WebKit (Apple Mail / iOS) lo pinta; el resto ve Georgia 400.
const SERIF_BOLD = { fontFamily: F.serif, fontWeight: 400, WebkitTextStrokeWidth: '0.035em', paintOrder: 'stroke fill', letterSpacing: '0.005em' }

export function Layout({ ctx, preheader, children }) {
  return (
    <Html lang={ctx.locale} dir="ltr">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
        <meta name="x-apple-disable-message-reformatting" />
        <style dangerouslySetInnerHTML={{ __html: styles(ctx) }} />
      </Head>
      <Preview>{preheader}</Preview>
      <Body className="ac-body" style={{ margin: 0, padding: '24px 0', background: C.cream, fontFamily: F.sans, color: C.ink }}>
        <Container className="ac-card" style={{ width: '100%', maxWidth: 600, background: C.paper, border: `1px solid ${C.line}`, borderRadius: 20 }}>
          {children}
        </Container>
      </Body>
    </Html>
  )
}

// Cabecera: el logotipo «agent.ceo» en texto (se invierte bien, no depende de imágenes) + rótulo y fecha.
export function Header({ label, date }) {
  return (
    <Section className="ac-pad" style={{ padding: '28px 40px 0' }}>
      <Row>
        <Column>
          <Text className="ac-tx" style={{ margin: 0, fontFamily: F.sans, fontSize: 19, fontWeight: 600, letterSpacing: '-0.02em', color: C.ink }}>
            agent<span style={{ color: C.gold }}>.</span>ceo
          </Text>
        </Column>
        <Column align="right" style={{ paddingLeft: 12 }}>
          <Text className="ac-muted ac-label" style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', whiteSpace: 'nowrap', color: C.muted }}>
            {label}{date ? ` · ${date}` : ''}
          </Text>
        </Column>
      </Row>
    </Section>
  )
}

// Un avatar (tu CEO o un agente) SIEMPRE dentro de una celda de tamaño fijo (width/height en atributo y en
// estilo): con las imágenes bloqueadas, Gmail pinta el alt DENTRO de ese cuadrado en letra pequeña, sin
// empujar la píldora de al lado ni romper la fila. La celda lleva el color de la placa como respaldo.
// Por defecto, nuestros PNG 2× con SU gemelo de noche (ceo → ceo-noche, agente-N → agente-N-noche), oculto
// salvo en modo oscuro. Si llega ceo.avatarUrl / agents[i].avatarUrl (ya validada en render), esa imagen
// sustituye a LAS DOS: también en oscuro se ve la foto de la persona, no la mascota.
export function Avatar({ ctx, size = 64, who = 'ceo', index = 0, alt, align }) {
  const es = ctx.locale === 'es'
  const a = alt || (es ? 'Tu CEO' : 'Your CEO')
  const name = who === 'agent' ? `agente-${(index % 4) + 1}` : 'ceo'
  const custom = who === 'agent' ? ctx.avatars?.agents?.[index] : ctx.avatars?.ceo
  const r = Math.round(size * 0.25)
  const img = { display: 'block', width: size, height: size, border: 0, outline: 'none', textDecoration: 'none', borderRadius: r, fontFamily: F.sans, fontSize: 10, lineHeight: '12px', color: C.muted, objectFit: 'cover' }
  return (
    <table role="presentation" width={size} height={size} cellPadding="0" cellSpacing="0" border="0" align={align} style={{ width: size, height: size, borderCollapse: 'collapse', tableLayout: 'fixed', ...(align === 'center' ? { margin: '0 auto' } : {}) }}>
      <tbody><tr>
        <td className={custom ? undefined : 'ac-plate'} width={size} height={size} align="center" valign="middle" style={{ width: size, height: size, maxWidth: size, overflow: 'hidden', borderRadius: r, background: EMAIL_ASSETS[name].plate, textAlign: 'center', verticalAlign: 'middle', fontFamily: F.sans, fontSize: 10, lineHeight: '12px', color: C.muted, wordBreak: 'break-word' }}>
          <Img className="ac-light" src={custom || asset(ctx, name)} width={size} height={size} alt={a} style={img} />
          <div className="ac-dark" style={{ display: 'none', maxHeight: 0, overflow: 'hidden', msoHide: 'all' }}>
            <Img className="ac-dark-img" src={custom || asset(ctx, EMAIL_ASSETS[name].dark)} width={size} height={size} alt={a} style={img} />
          </div>
        </td>
      </tr></tbody>
    </table>
  )
}
export const Mascot = (props) => <Avatar {...props} who="ceo" />

// Portada: mascota + pegatina opcional + rótulo + titular (la palabra clave, en itálica) + entradilla.
export function Hero({ ctx, eyebrow, sticker, title, lead, mascot = true }) {
  return (
    <Section className="ac-pad" style={{ padding: '28px 40px 4px' }}>
      {mascot && (
        <Row>
          <Column width="80" style={{ width: 80, verticalAlign: 'middle' }}><Mascot ctx={ctx} /></Column>
          <Column style={{ verticalAlign: 'middle' }}>
            {sticker && (
              <span style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 999, background: C.gold3, color: C.goldInk, fontFamily: F.serif, fontStyle: 'italic', fontSize: 20, lineHeight: '20px', transform: 'rotate(-3deg)' }}>{sticker}</span>
            )}
          </Column>
        </Row>
      )}
      {eyebrow && <Eyebrow style={{ marginTop: mascot ? 22 : 0 }}>{eyebrow}</Eyebrow>}
      <h1 className="ac-h1 ac-tx" style={{ ...SERIF_BOLD, margin: '10px 0 0', fontSize: 46, lineHeight: '1.04', color: C.ink }}>{title}</h1>
      {lead && <P style={{ marginTop: 16, fontSize: 17 }}>{lead}</P>}
    </Section>
  )
}

export const Em = ({ children }) => <span style={{ fontStyle: 'italic' }}>{children}</span>

export function Eyebrow({ children, style }) {
  return <Text className="ac-gold" style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.goldInk, ...style }}>{children}</Text>
}

export function P({ children, style, muted }) {
  return <Text className={muted ? 'ac-muted' : 'ac-tx'} style={{ margin: '12px 0 0', fontSize: 16, lineHeight: '1.6', color: muted ? C.muted : C.ink, ...style }}>{children}</Text>
}

export function Block({ children, style }) {
  return <Section className="ac-pad" style={{ padding: '20px 40px 0', ...style }}>{children}</Section>
}

// Una sola acción principal por correo: botón de tinta (en oscuro, dorado).
export function CTA({ href, children, note }) {
  return (
    <Block style={{ paddingTop: 26 }}>
      <Button className="ac-btn" href={href} style={{ display: 'inline-block', background: C.ink, color: C.cream, fontFamily: F.sans, fontSize: 16, fontWeight: 600, padding: '15px 26px', borderRadius: 999, textDecoration: 'none' }}>{children}</Button>
      {note && <P muted style={{ fontSize: 13, marginTop: 12 }}>{note}</P>}
    </Block>
  )
}

// «¿No funciona el botón? Copia esto:» con el destino REAL a la vista (regla de NeuralOS).
export function LinkFallback({ ctx, href }) {
  return (
    <Block style={{ paddingTop: 8 }}>
      <P muted style={{ fontSize: 13, margin: 0 }}>{ctx.locale === 'es' ? '¿No funciona el botón? Copia este enlace:' : "Button not working? Copy this link:"}</P>
      <Text className="ac-gold" style={{ margin: '4px 0 0', fontFamily: F.mono, fontSize: 12, lineHeight: '1.5', color: C.goldInk, wordBreak: 'break-all' }}>{href}</Text>
    </Block>
  )
}

// Tu CEO habla: mascota pequeña + burbuja. Para la frase cálida del correo.
export function Bubble({ ctx, children }) {
  return (
    <Block style={{ paddingTop: 24 }}>
      <Row>
        <Column width="52" style={{ width: 52, verticalAlign: 'top' }}><Mascot ctx={ctx} size={40} /></Column>
        <Column style={{ verticalAlign: 'top' }}>
          <div className="ac-tint" style={{ background: C.gold3, border: `1px solid ${C.gold3}`, borderRadius: '4px 16px 16px 16px', padding: '12px 16px' }}>
            <Text className="ac-tx" style={{ margin: 0, fontSize: 15, lineHeight: '1.55', color: C.ink }}>{children}</Text>
          </div>
        </Column>
      </Row>
    </Block>
  )
}

// El regalo: un prompt listo para copiar. Texto real (no imagen) para que se pueda seleccionar.
export function PromptCard({ ctx, title, prompt, hint }) {
  return (
    <Block style={{ paddingTop: 26 }}>
      <div className="ac-card" style={{ border: `1.5px dashed ${C.gold}`, borderRadius: 16, padding: '18px 20px', background: '#FFFFFF' }}>
        <Eyebrow>{ctx.locale === 'es' ? '🎁 Prompt listo para copiar' : '🎁 Ready-to-copy prompt'}</Eyebrow>
        {title && <Text className="ac-tx" style={{ ...SERIF_BOLD, margin: '8px 0 0', fontSize: 24, lineHeight: '1.15', color: C.ink }}>{title}</Text>}
        <Text className="ac-tx" style={{ margin: '12px 0 0', fontFamily: F.mono, fontSize: 13.5, lineHeight: '1.65', color: C.ink, whiteSpace: 'pre-wrap' }}>{prompt}</Text>
        {hint && <P muted style={{ fontSize: 13, marginTop: 12 }}>{hint}</P>}
      </div>
    </Block>
  )
}

// Un consejo corto, con su rótulo.
export function Tip({ ctx, title, children }) {
  return (
    <Block style={{ paddingTop: 26 }}>
      <div className="ac-line" style={{ borderLeft: `3px solid ${C.gold}`, padding: '2px 0 2px 16px' }}>
        <Eyebrow>{ctx.locale === 'es' ? '💡 Tip' : '💡 Tip'}{title ? ` · ${title}` : ''}</Eyebrow>
        <P style={{ marginTop: 6, fontSize: 15 }}>{children}</P>
      </div>
    </Block>
  )
}

// Filas numeradas 01, 02… (lo demás, de un vistazo).
export function Steps({ title, items, start = 1 }) {
  return (
    <Block style={{ paddingTop: 26 }}>
      {title && <Eyebrow>{title}</Eyebrow>}
      {items.map((it, i) => (
        <Row key={i} className="ac-line" style={{ borderTop: `1px solid ${C.line}`, marginTop: i === 0 ? 10 : 0 }}>
          <Column style={{ width: 44, verticalAlign: 'top', padding: '14px 0' }}>
            <Text className="ac-gold" style={{ margin: 0, fontFamily: F.mono, fontSize: 12, color: C.goldInk }}>{String(i + start).padStart(2, '0')}</Text>
          </Column>
          <Column style={{ verticalAlign: 'top', padding: '12px 0' }}>
            <Text className="ac-tx" style={{ margin: 0, fontSize: 16, fontWeight: 600, lineHeight: '1.4', color: C.ink }}>{it.title}</Text>
            {it.text && <Text className="ac-muted" style={{ margin: '2px 0 0', fontSize: 14, lineHeight: '1.5', color: C.muted }}>{it.text}</Text>}
          </Column>
        </Row>
      ))}
    </Block>
  )
}

// Datos clave/valor (recibos, accesos). Sin tablas anidadas raras: una fila por dato.
export function Facts({ rows, total }) {
  return (
    <Block style={{ paddingTop: 22 }}>
      <div className="ac-card" style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: '6px 18px', background: '#FFFFFF' }}>
        {rows.map(([k, v], i) => (
          <Row key={i} className="ac-line" style={{ borderTop: i ? `1px solid ${C.line}` : 'none' }}>
            <Column style={{ padding: '11px 0', width: '42%' }}><Text className="ac-muted" style={{ margin: 0, fontFamily: F.mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted }}>{k}</Text></Column>
            <Column style={{ padding: '11px 0' }}><Text className="ac-tx" style={{ margin: 0, fontSize: 15, color: C.ink }}>{v}</Text></Column>
          </Row>
        ))}
        {total && (
          <Row className="ac-line" style={{ borderTop: `1px solid ${C.ink}` }}>
            <Column style={{ padding: '14px 0', width: '42%' }}><Text className="ac-tx" style={{ margin: 0, fontFamily: F.mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.ink }}>{total[0]}</Text></Column>
            <Column style={{ padding: '14px 0' }}><Text className="ac-tx" style={{ ...SERIF_BOLD, margin: 0, fontSize: 28, lineHeight: '1', color: C.ink }}>{total[1]}</Text></Column>
          </Row>
        )}
      </div>
    </Block>
  )
}

// Cifra grande (tu lugar en la lista, créditos…).
export function Stat({ value, label, sub }) {
  return (
    <Block style={{ paddingTop: 22 }}>
      <div className="ac-tint" style={{ background: C.gold3, border: `1px solid ${C.gold3}`, borderRadius: 18, padding: '18px 22px' }}>
        <Eyebrow>{label}</Eyebrow>
        <Text className="ac-stat ac-tx" style={{ ...SERIF_BOLD, margin: '4px 0 0', fontSize: 76, lineHeight: '1', color: C.ink }}>{value}</Text>
        {sub && <P style={{ marginTop: 6, fontSize: 15 }}>{sub}</P>}
      </div>
    </Block>
  )
}

// Varias cifras en fila (en móvil se apilan).
export function Numbers({ items }) {
  return (
    <Block style={{ paddingTop: 22 }}>
      <Row>
        {items.map(([n, label], i) => (
          <Column key={i} style={{ width: `${Math.floor(100 / items.length)}%`, verticalAlign: 'top', paddingRight: 10 }}>
            <Text className="ac-tx ac-num" style={{ ...SERIF_BOLD, margin: 0, fontSize: 44, lineHeight: '1', color: C.ink }}>{n}</Text>
            <Text className="ac-muted" style={{ margin: '4px 0 10px', fontSize: 13, lineHeight: '1.4', color: C.muted }}>{label}</Text>
          </Column>
        ))}
      </Row>
    </Block>
  )
}

// Barra de progreso hecha con una tabla (sin imágenes ni CSS moderno).
export function Meter({ pct, label, sub }) {
  const p = Math.max(0, Math.min(100, Math.round(pct)))
  return (
    <Block style={{ paddingTop: 22 }}>
      <Eyebrow>{label}</Eyebrow>
      <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" style={{ marginTop: 10, borderCollapse: 'separate', borderRadius: 999, overflow: 'hidden' }}>
        <tbody><tr>
          {p > 0 && <td style={{ width: `${p}%`, height: 14, background: C.ink, borderRadius: p === 100 ? 999 : '999px 0 0 999px' }} className="ac-btn" />}
          {p < 100 && <td className="ac-tint" style={{ height: 14, background: C.gold3, borderRadius: p === 0 ? 999 : '0 999px 999px 0' }} />}
        </tr></tbody>
      </table>
      {sub && <P muted style={{ fontSize: 14, marginTop: 8 }}>{sub}</P>}
    </Block>
  )
}

// El equipo de IA en una fila: el avatar de cada agente y el puesto debajo (texto vivo, se traduce).
// El alt de cada avatar es el puesto: con imágenes bloqueadas, la fila sigue diciendo quién es quién.
export function TeamRow({ ctx, title, members }) {
  return (
    <Block style={{ paddingTop: 26 }}>
      {title && <Eyebrow>{title}</Eyebrow>}
      <Row style={{ marginTop: 12 }}>
        {members.slice(0, 4).map((m, i) => (
          <Column key={i} align="center" className="ac-half" style={{ width: '25%', verticalAlign: 'top', padding: '0 4px' }}>
            <Avatar ctx={ctx} size={56} who="agent" index={i} alt={m.name} align="center" />
            <Text className="ac-tx" style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 600, lineHeight: '1.3', color: C.ink, textAlign: 'center' }}>{m.name}</Text>
            {m.does && <Text className="ac-muted" style={{ margin: '2px 0 0', fontSize: 12, lineHeight: '1.35', color: C.muted, textAlign: 'center' }}>{m.does}</Text>}
          </Column>
        ))}
      </Row>
    </Block>
  )
}

// Recuadro de «si no fuiste tú» (seguridad) o de aviso sereno.
export function Note({ children, tone = 'calm' }) {
  return (
    <Block style={{ paddingTop: 24 }}>
      <div className="ac-card" style={{ border: `1px solid ${tone === 'alert' ? C.ink : C.line}`, borderRadius: 14, padding: '14px 18px', background: '#FFFFFF' }}>
        <Text className="ac-tx" style={{ margin: 0, fontSize: 14, lineHeight: '1.55', color: C.ink }}>{children}</Text>
      </div>
    </Block>
  )
}

// Firma: siempre «Tu CEO». Honesto: es la IA de Agent CEO, no una persona.
export function Signature({ ctx, line }) {
  const es = ctx.locale === 'es'
  return (
    <Block style={{ paddingTop: 30 }}>
      <Row>
        <Column width="52" style={{ width: 52, verticalAlign: 'middle' }}><Mascot ctx={ctx} size={40} /></Column>
        <Column style={{ verticalAlign: 'middle' }}>
          <Text className="ac-tx" style={{ ...SERIF_BOLD, margin: 0, fontSize: 22, lineHeight: '1.1', color: C.ink }}>{es ? 'Tu CEO' : 'Your CEO'}</Text>
          <Text className="ac-muted" style={{ margin: '2px 0 0', fontSize: 13, color: C.muted }}>{line || (es ? 'La IA de Agent CEO' : 'The Agent CEO AI')}</Text>
        </Column>
      </Row>
    </Block>
  )
}

/**
 * Pie. Siempre: la empresa, la dirección postal y el contacto (CAN-SPAM).
 * Marketing: enlace de baja. Servicio: explica por qué llega y que no se puede apagar (o dónde ajustar avisos).
 */
export function Footer({ ctx, kind, reason, unsubscribeUrl, preferencesUrl }) {
  const es = ctx.locale === 'es'
  const linkStyle = { color: C.muted, textDecoration: 'underline' }
  return (
    <Section className="ac-pad" style={{ padding: '30px 40px 34px' }}>
      <Hr className="ac-line" style={{ borderColor: C.line, margin: '0 0 18px' }} />
      {reason && <Text className="ac-muted" style={{ margin: 0, fontSize: 12, lineHeight: '1.6', color: C.muted }}>{reason}</Text>}
      {kind === 'marketing' ? (
        <Text className="ac-muted" style={{ margin: '8px 0 0', fontSize: 12, lineHeight: '1.6', color: C.muted }}>
          {preferencesUrl && <><Link className="ac-muted" href={preferencesUrl} style={linkStyle}>{es ? 'Elegir qué correos recibes' : 'Choose which emails you get'}</Link>{' · '}</>}
          <Link className="ac-muted" href={unsubscribeUrl} style={linkStyle} data-unsubscribe="">{es ? 'Darme de baja' : 'Unsubscribe'}</Link>
          {es ? ' (un clic, sin iniciar sesión).' : ' (one click, no sign-in).'}
        </Text>
      ) : (
        <Text className="ac-muted" style={{ margin: '8px 0 0', fontSize: 12, lineHeight: '1.6', color: C.muted }}>
          {es ? 'Es un correo de servicio sobre tu cuenta: no lleva publicidad.' : "This is a service email about your account: no ads inside."}
          {preferencesUrl && <>{' '}<Link className="ac-muted" href={preferencesUrl} style={linkStyle}>{es ? 'Ajustar tus avisos' : 'Adjust your notifications'}</Link>.</>}
        </Text>
      )}
      <Text className="ac-muted" style={{ margin: '12px 0 0', fontSize: 12, lineHeight: '1.6', color: C.muted }}>
        Agent CEO · {ctx.postalAddress.startsWith(COMPANY.legalName) ? '' : `${COMPANY.legalName} · `}{ctx.postalAddress === POSTAL_PLACEHOLDER ? <span style={{ background: '#FFE08A', color: C.ink, padding: '0 4px' }}>{ctx.postalAddress}</span> : ctx.postalAddress}
        <br />
        <Link className="ac-muted" href={`mailto:${COMPANY.email}`} style={linkStyle}>{COMPANY.email}</Link>
        {' · '}
        <Link className="ac-muted" href={`${ctx.site}${ROUTES.privacy[ctx.locale]}`} style={linkStyle}>{es ? 'Privacidad' : 'Privacy'}</Link>
      </Text>
    </Section>
  )
}
