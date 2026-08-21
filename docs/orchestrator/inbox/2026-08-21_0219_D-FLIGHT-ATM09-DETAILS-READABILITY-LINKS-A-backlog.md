# Backlog registration — D-FLIGHT-ATM09-DETAILS-READABILITY-LINKS-A

**Data:** 2026-08-21  
**Tipo:** docs-only backlog registration  
**Stato:** **BACKLOG / NOT OPENED**

## Contesto

Residuo UX emerso dopo QA PASS / finito di `D-FLIGHT-DETAILS-CONTENT-CLEANUP-A-FIX2` (LIVE build **238**).  
Il blocco CLEANUP resta **CLOSED / PASS** — **non** riaperto.

## ID

`D-FLIGHT-ATM09-DETAILS-READABILITY-LINKS-A`

## Acceptance sintetica (futura, non aperta)

- Link Rule/Regola cliccabili in modo sicuro (URL estratti/validati; no raw HTML execution; no `on*`; no `javascript:`/`data:`; apertura solo opt-in utente; zero fetch automatici).
- Leggibilità pannello ATM09 migliorata (font/size/spacing/hierarchy/contrast/colori; dark/black dominante; ispirazione D-Flight senza copia obbligatoria).
- Raw/feature invariati; baseline sicuro 238 preservato.
- Fuori scope: overlay/hit-test/provider/close/minimize/waypoint/tracce/poligoni/global theme.

## Casa canonica

- [`WU-0013` §23](../../work-units/WU-0013-uas-geozone-dflight.md)
- Roadmap Map UX + D-Flight details: [`WU-0005-0009-roadmap.md`](../../work-units/WU-0005-0009-roadmap.md)

## Runtime

- Monolite **non** modificato
- LIVE resta build **238** / blob `c36109d1…`
- FRONTIER **non** aperto (idle / gate none)
