# WU-0004 — Toggle basemap / SonarChart indipendenti

**Stato:** CLOSED

**Scopo:** ripristinare l’indipendenza tra basemap Navionics Seachart e overlay
SonarChart nel monolite `coordinate_converter Claude.html`, come da decisione D2
originale in WU-0003. **Decisione finale:** i radio basemap mantengono sempre una
base attiva; nessuno stato «basemap nascosta» nel monolite.

**Predecessore:** WU-0003 CLOSED (`a6c7741`, `6c0c18e`, `43d9ece`). La mutua
esclusione Navionics/SonarChart introdotta in `43d9ece` è stata rimossa in B1.

---

## Contesto

| Fatto | Dettaglio |
| --- | --- |
| D2 WU-0003 | «Basemap: toggle indipendente; nessun cambio automatico di basemap» |
| Runtime `43d9ece` | Mutua esclusione: basemap `nav` spegne SonarChart; accendere SonarChart su `nav` ripristina l’ultima basemap non-Navionics |
| Tile SonarChart | PNG RGBA con alpha reale — basemap visibile sotto per design |
| Decisione operativa (chiusura) | Radio basemap sempre attivi; nessun toggle «mostra/nascondi basemap» |

---

## Decisioni ratificate

| Ambito | Esito |
| --- | --- |
| Mutua esclusione | **Rimossa** in B1 (`0cd3c8c`) — basemap `nav` e SonarChart possono coesistere |
| Nascondere basemap (B2) | **Rimosso per decisione** — toggle/stato «basemap visibile/nascosto» non necessario; correttivo `5201ff8` |
| Default | Una basemap radio sempre selezionata (comportamento attuale) |
| Consenso / OPSEC | Invariato — riuso consenso Navionics; fail-closed; forced-offline prevale |
| i18n toggle basemap (B3) | **Decaduto con B2** |
| Architettura | Monolite vanilla; nessuna dipendenza nuova |

---

## Sequenza blocchi

| Blocco | Contenuto | Stato |
| --- | --- | --- |
| **B0** | Docs-only: apertura WU-0004 (questo file + snapshot memoria) | PASS |
| **B1** | Rimuovere mutua esclusione `43d9ece`; verificare coesistenza `nav` + SonarChart | PASS |
| **B2** | Toggle «mostra basemap» (o equivalente) + wiring render/hydrate | RIMOSSO PER DECISIONE |
| **B3** | i18n IT/EN/FR + QA manuale (locale + VPS tailnet) | DECADUTO CON B2 |
| **B4** | Chiusura WU + autosync | CHIUSURA WU ESEGUITA |

**WU-0004 CLOSED** — B1 PASS; B2 rimosso per decisione operativa (radio basemap
sempre attivi, stato nascosto non necessario, correttivo `5201ff8`); B3 decaduto
con B2; chiusura documentale completata.

---

## Stato esecuzione B1 (2026-06-14)

- Commit runtime: `0cd3c8c` — `feat(gis): remove Navionics/SonarChart mutual exclusion (WU-0004 B1)`.
- Mutua esclusione rimossa in `setMapLayer()`, handler toggle SonarChart, seed init `_lastBaseLayerNonNav`.
- `_lastBaseLayerNonNav` rimosso (zero lettori reali).
- Persistenza invariata; reload conserva combo `nav` + SonarChart attivi.
- Test manuale locale: PASS.
- Rischio noto: doppio-fetch by-design con basemap Navionics + SonarChart overlay entrambi attivi.

---

## Chiusura WU-0004

**Data:** 2026-06-14

| Commit | Ruolo |
| --- | --- |
| `0cd3c8c` | Rimozione mutua esclusione Navionics/SonarChart (B1 PASS) |
| `5201ff8` | Rimozione B2 e artefatti basemap hidden dal monolite |

**Decisione:** nessuno stato «basemap nascosta»; i radio basemap mantengono sempre
una base attiva; artefatti `basemapHidden`, `basemap-hidden`, `basemapVisible`
assenti dal monolite. WU chiusa.

**Prossimo workstream:** da definire.

---

## Acceptance criteria (stato finale)

- Basemap Navionics (`nav`) e SonarChart possono essere **entrambi attivi** senza cambio automatico di layer. ✅
- I radio basemap mantengono **sempre una basemap attiva**; nessun toggle/stato «nascondi basemap». ✅ (decisione operativa)
- Nessuna regressione su OPSEC/consenso Navionics, forced-offline, cache-on-browse, seamarks, offline download. ✅
- Artefatti B2 (`basemapHidden`, `basemap-hidden`, `basemapVisible`) **assenti** dal monolite. ✅
- Test manuale B1 PASS su locale. ✅
- Architettura monolite vanilla invariata; nessuna nuova dipendenza runtime. ✅

---

## Riferimenti codice (post-chiusura)

- ~~Mutua esclusione basemap: `setMapLayer()`~~ — rimossa in B1
- ~~Mutua esclusione SonarChart toggle~~ — rimossa in B1
- ~~`_lastBaseLayerNonNav`~~ — rimosso in B1
- ~~Toggle basemap hidden (B2)~~ — rimosso per decisione (`5201ff8`)
