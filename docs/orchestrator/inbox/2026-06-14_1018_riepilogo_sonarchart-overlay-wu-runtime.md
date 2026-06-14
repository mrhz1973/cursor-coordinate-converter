# Riepilogo — SonarChart overlay WU-0003 (runtime + PASS locale)

**Data:** 2026-06-14  
**Tipo:** riepilogo  
**WU:** WU-0003 — SonarChart overlay  
**Stato WU:** OPEN (non chiusa)

---

## Sintesi

Implementazione SonarChart overlay nel monolite GIS completata in tre commit runtime + test manuale locale PASS. Resta pendente la verifica end-to-end dei tile `/sonar/` su VPS tailnet con proxy Planet-Clone attivo.

---

## Commit runtime (monolite)

| Commit | Contenuto |
| --- | --- |
| `a6c7741` | SonarChart base: toggle indipendente nel menu Layers, layer overlay, metadata `SONARCHART_OVERLAY`, gate OPSEC/tailnet, i18n IT/EN/FR |
| `6c0c18e` | Offline download + cached rendering: SonarChart selezionabile in `#pcLayer`, helper offline layer, hydration IndexedDB-first |
| `43d9ece` | WU runtime: cache-on-browse (tile visualizzati → IndexedDB), mutua esclusione Navionics Seachart / SonarChart overlay, contatore cache sessione stile SAS.Planet, minimizzazione/ripristino pannello Mappe offline durante selezione bbox |

---

## Test manuale locale

**Esito:** PASS

- Mutua esclusione Navionics basemap ↔ SonarChart overlay
- Contatore cache sessione (incremento solo su tile nuovi, no doppio conteggio)
- Minimizzazione e ripristino pannello Mappe offline durante selezione bbox (flusso GIS `#layersPanel`)

**BLOCKED-ENV in locale:** punti rete/consenso OPSEC e verifica endpoint `/sonar/` vs `/tiles/` — proxy `:5000` non raggiungibile nell'ambiente di test locale usato.

---

## Pendente per chiusura WU

- Deploy VPS: `git pull origin main` su `100.114.7.53` (o host tailnet runtime) e riavvio servizi `:8000` / `:5000`
- Verifica positiva tile SonarChart: Network tab o log proxy → richieste `/sonar/{z}/{x}/{y}.png` (non `/tiles/` per overlay)
- Verifica consenso Navionics + OPSEC strict su VPS con proxy attivo

---

## Governance (docs, stesso periodo)

| Commit | Contenuto |
| --- | --- |
| `0612481` | Pipeline prompt Cursor (revisione incrociata a passi fissi) in `OPERATING_MEMORY` §4 |
| `cb32c4f` | Regola chiusura blocco: «pubblicato» = pushato su `origin` e verificato sul remoto |

Read-set autorevole invariato: `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente.

---

## Riferimenti

- WU: `docs/work-units/WU-0003-sonarchart-overlay.md` (sezione «Stato esecuzione (2026-06-14)»)
- Autosync: `docs/orchestrator/latest.md` (voce in cima a «Ultimo aggiornamento»)
