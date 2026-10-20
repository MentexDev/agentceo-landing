import React from 'react'
import { s, css } from '../lib/bind.js'
import cssText from '../styles/desktop.css?raw'
import S01Header from './S01Header.jsx'
import S02Inicio from './S02Inicio.jsx'
import S03AsiSeVePorDentro from './S03AsiSeVePorDentro.jsx'
import S04AsiEmpieza from './S04AsiEmpieza.jsx'
import S05ElEquipo from './S05ElEquipo.jsx'
import S06TrabajanSolos from './S06TrabajanSolos.jsx'
import S07ReunionDiaria from './S07ReunionDiaria.jsx'
import S08VendedorEnWhatsApp from './S08VendedorEnWhatsApp.jsx'
import S09TePidePermiso from './S09TePidePermiso.jsx'
import S10ConfianzaPasoAPaso from './S10ConfianzaPasoAPaso.jsx'
import S11Automatizaciones from './S11Automatizaciones.jsx'
import S12EstudioCreativo from './S12EstudioCreativo.jsx'
import S13LaForja from './S13LaForja.jsx'
import S14ElCerebroDeTuEmpresa from './S14ElCerebroDeTuEmpresa.jsx'
import S15Conexiones from './S15Conexiones.jsx'
import S16LoQueViene from './S16LoQueViene.jsx'
import S17Tranquilidad from './S17Tranquilidad.jsx'
import S18PreguntasFrecuentes from './S18PreguntasFrecuentes.jsx'
import S19UnirmeALaLista from './S19UnirmeALaLista.jsx'
import S20Footer from './S20Footer.jsx'
import S21VentanaUnion from './S21VentanaUnion.jsx'

export default function View({ v }) {
  return (
    <>
      <style>{cssText}</style>
      <div className="sc" ref={v.setRoot} style={{width: "100%", height: "100dvh", overflowX: "hidden", overflowY: "auto", position: "relative", background: "#F4F2ED", color: "#111113", fontFamily: "'Geist', system-ui, sans-serif"}}>
        <S01Header v={v} />
        <S02Inicio v={v} />
        <S03AsiSeVePorDentro v={v} />
        <S04AsiEmpieza v={v} />
        <S05ElEquipo v={v} />
        <S06TrabajanSolos v={v} />
        <S07ReunionDiaria v={v} />
        <S08VendedorEnWhatsApp v={v} />
        <S09TePidePermiso v={v} />
        <S10ConfianzaPasoAPaso v={v} />
        <S11Automatizaciones v={v} />
        <S12EstudioCreativo v={v} />
        <S13LaForja v={v} />
        <S14ElCerebroDeTuEmpresa v={v} />
        <S15Conexiones v={v} />
        <S16LoQueViene v={v} />
        <S17Tranquilidad v={v} />
        <S18PreguntasFrecuentes v={v} />
        <S19UnirmeALaLista v={v} />
        <S20Footer v={v} />
        <S21VentanaUnion v={v} />
      </div>
    </>
  )
}
