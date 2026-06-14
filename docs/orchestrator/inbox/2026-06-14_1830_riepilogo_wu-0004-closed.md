# Riepilogo — WU-0004 chiusura documentale

**Data:** 2026-06-14 18:30 Europe/Rome  
**Tipo:** riepilogo  
**WU:** WU-0004 — Basemap / SonarChart indipendenti  
**Stato WU:** CLOSED  
**Read-set autorevole:** `README.md` + `docs/OPERATING_MEMORY.md` + WU corrente

---

## Sintesi

WU-0004 chiusa per decisione operativa. B1 PASS; B2 toggle basemap hidden rimosso; B3 decaduto con B2; chiusura documentale completata.

---

## Blocchi — esito finale

| Blocco | Esito |
| --- | --- |
| B0 | PASS — apertura WU |
| B1 | PASS — mutua esclusione Navionics/SonarChart rimossa |
| B2 | RIMOSSO PER DECISIONE — toggle basemap visibile/nascosto non necessario |
| B3 | DECADUTO CON B2 — i18n/QA del controllo rimosso |
| B4 | CHIUSURA WU ESEGUITA — atto documentale, non test funzionale |

---

## Commit rilevanti

| Hash | Descrizione |
| --- | --- |
| `0cd3c8c` | B1: rimozione mutua esclusione Navionics/SonarChart |
| `5201ff8` | Correttivo: rimozione artefatti B2 dal monolite (`basemapHidden`, `basemap-hidden`, `basemapVisible`) |

---

## Decisione operativa

- Radio basemap mantengono sempre una base attiva.
- Nessuno stato «basemap nascosta» nel monolite.
- Artefatti B2 devono restare assenti.

---

## File docs aggiornati (questo intervento)

- `docs/work-units/WU-0004-navionics-basemap-sonarchart-independence.md` — stato CLOSED + sezione chiusura
- `docs/OPERATING_MEMORY.md` — §7 punto 4 + tabella §8
- `README.md` — snapshot «Unità corrente»
- `docs/orchestrator/latest.md` — autosync
- questo inbox

---

## Monolite

**Non modificato** in questo intervento docs-only.

Verifica statica attesa: zero occorrenze di `basemapHidden`, `basemap-hidden`, `basemapVisible` in `coordinate_converter Claude.html`.

---

## Prossimo workstream

Da definire (non WU-0004 B2/B3).
