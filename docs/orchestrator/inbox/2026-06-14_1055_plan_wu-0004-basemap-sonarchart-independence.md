# Plan — WU-0004 basemap / SonarChart indipendenti

**Data:** 2026-06-14  
**Tipo:** plan  
**WU:** WU-0004 — Toggle basemap / SonarChart indipendenti  
**Stato:** OPEN

---

## Motivazione

WU-0003 CLOSED con SonarChart overlay funzionante end-to-end su VPS. La decisione
D2 originale prevedeva toggle basemap indipendente senza cambio automatico. Il
commit runtime `43d9ece` ha introdotto mutua esclusione Navionics Seachart ↔
SonarChart come workaround UX.

I tile `/sonar/` sono PNG RGBA con trasparenza reale: sotto SonarChart si vede
sempre la basemap. L’operatore chiede di poter **nascondere la basemap** e usare
Navionics Seachart + SonarChart in modo indipendente.

---

## Scope WU-0004

1. Rimuovere/rilassare mutua esclusione in `setMapLayer()` e toggle SonarChart.
2. Aggiungere controllo minimo per nascondere i tile basemap (SonarChart e overlay
   restano attivi).
3. i18n IT/EN/FR; OPSEC/consenso/forced-offline invariati.
4. QA locale + VPS tailnet prima della chiusura.

---

## Blocchi proposti

| Blocco | Contenuto |
| --- | --- |
| B0 | Apertura documentale (questo plan + WU-0004 + snapshot) |
| B1 | Rimuovere mutua esclusione |
| B2 | Toggle mostra basemap + render |
| B3 | i18n + QA |
| B4 | Chiusura WU |

---

## Riferimenti

- WU: `docs/work-units/WU-0004-navionics-basemap-sonarchart-independence.md`
- Predecessore: WU-0003 CLOSED (`cda19e6`)
- Codice mutua esclusione: `43d9ece`, `2dbb4fe` (layout GIS, ortogonale)
