import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { joinWaitlist } from './lib/waitlist.js'

// La lógica de la landing llama a window.agentceoWaitlist({ email, business }) al guardar un lugar.
window.agentceoWaitlist = joinWaitlist

createRoot(document.getElementById('root')).render(<App />)
