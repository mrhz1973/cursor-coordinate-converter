# QA CANDIDATA — Build 285, barra destra desktop

**Metodo:** Edge Windows con CDP, HTML candidato iniettato in memoria sull'origin HTTPS del VPS; runtime LIVE non modificato. Profilo browser isolato; richieste esterne bloccate. **28/28 PASS**, POST 0, 450 richieste accessorie bloccate.

| Viewport | Esito |
| --- | --- |
| 1440x900 | Barra grid 2 colonne; tutte 12 icone/caption nel viewport, frecce flyout nascoste — PASS |
| 1366x768 | Tutte 12 visibili, targhette sotto icone — PASS |
| 1920x1080 | Tutte 12 visibili, targhette sotto icone — PASS |
| 1024x768 | Tutte 12 visibili, targhette sotto icone — PASS |
| 390x844 | Layout mobile tradizionale, targhette nascoste e frecce menu attive — PASS |

Azioni testate: Poligoni apre direttamente il pannello, Range & Bearing apre direttamente, Nuovo punto attivabile direttamente, menu Livelli si apre come popup, modalità GIS conservata. Nessun POST. I controlli ripetuti su viewport differenti sono conteggiati nella suite 28/28; non significa 28 dialoghi distinti. Console/pageerror non acquisiti separatamente. Il test non è ABQA post-deploy e non è QA umana.

Runtime candidato: SHA-256 `8a0ac1b4a0cf688d26dc2c94f88803187db64fa75aad1abc664446b00406847d`, 11.114.653 byte. Direttiva sviluppo telefono in pausa: prove mobile solo non-regressione di viewport, non sviluppo mobile.
