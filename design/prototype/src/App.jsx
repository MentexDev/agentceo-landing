import React, { useEffect, useState } from 'react'
import LandingLogic from './LandingLogic.jsx'
import DesktopView from './desktop/View.jsx'
import MobileView from './mobile/View.jsx'

const MOBILE = '(max-width: 820px)'
const DESIGN_W = 1440 // ancho para el que está diseñado el escritorio

function useIsMobile() {
  const [m, setM] = useState(() => window.matchMedia(MOBILE).matches)
  useEffect(() => {
    const mq = window.matchMedia(MOBILE)
    const on = () => setM(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return m
}

// En laptops de menos de 1440px escalamos el diseño para que se vea idéntico.
function useDesktopFit(enabled) {
  useEffect(() => {
    if (!enabled) return
    const fit = () => {
      const sc = document.querySelector('#root .sc')
      if (!sc) return
      const z = Math.min(1, window.innerWidth / DESIGN_W)
      sc.style.zoom = z < 1 ? String(z) : ''
      sc.style.width = z < 1 ? DESIGN_W + 'px' : '100%'
      sc.style.height = z < 1 ? window.innerHeight / z + 'px' : '100dvh'
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [enabled])
}

export default function App() {
  const mobile = useIsMobile()
  useDesktopFit(!mobile)
  // key: al cambiar de diseño se monta de cero (animaciones y medidas limpias)
  return mobile
    ? <LandingLogic key="m" view={MobileView} />
    : <LandingLogic key="d" view={DesktopView} />
}
