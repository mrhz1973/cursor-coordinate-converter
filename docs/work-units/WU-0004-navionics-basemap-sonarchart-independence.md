# WU-0004 — Toggle basemap / SonarChart indipendenti

**Stato:** OPEN

**Scopo:** ripristinare l’indipendenza tra basemap Navionics Seachart e overlay
SonarChart nel monolite `coordinate_converter Claude.html`, come da decisione D2
originale in WU-0003, e consentire di **nascondere la basemap** sotto SonarChart
(la trasparenza reale dei tile `/sonar/` fa vedere la basemap sotto — l’operatore
deve poterla spegnere visivamente).

**Predecessore:** WU-0003 CLOSED (`a6c7741`, `6c0c18e`, `43d9ece`). La mutua
esclusione Navionics/SonarChart introdotta in `43d9ece` è un workaround temporaneo
da rimuovere o rilassare in questa WU.

---

## Contesto

| Fatto | Dettaglio |
| --- | --- |
| D2 WU-0003 | «Basemap: toggle indipendente; nessun cambio automatico di basemap» |
| Runtime `43d9ece` | Mutua esclusione: basemap `nav` spegne SonarChart; accendere SonarChart su `nav` ripristina l’ultima basemap non-Navionics |
| Tile SonarChart | PNG RGBA con alpha reale — basemap visibile sotto per design |
| Esigenza operatore | Poter usare SonarChart con basemap Navionics **o** nascondere la basemap e vedere solo SonarChart (+ seamarks / UI) |

---

## Decisioni da ratificare (prima dell’implementazione)

| Ambito | Proposta |
| --- | --- |
| Mutua esclusione | **Rimuovere** la logica in `setMapLayer()` e nel toggle SonarChart che forza basemap/SonarChart mutualmente esclusivi |
| Nascondere basemap | Nuovo stato/toggle (es. «mostra basemap») o equivalente minimo: quando off, i tile basemap non vengono renderizzati ma SonarChart (e overlay ammessi) restano attivi |
| Default | Basemap visibile (comportamento attuale per chi non usa il toggle) |
| Consenso / OPSEC | Invariato — riuso consenso Navionics; fail-closed; forced-offline prevale |
| Persistenza | Valutare se il toggle «mostra basemap» va in `saveStore` (coerenza con `showSonarChart` / `showSeamarks`) |
| i18n | IT/EN/FR obbligatorio per etichetta/tip del nuovo controllo |
| Architettura | Monolite vanilla; nessuna dipendenza nuova |

---

## Sequenza blocchi proposta

| Blocco | Contenuto | Stato |
| --- | --- | --- |
| **B0** | Docs-only: apertura WU-0004 (questo file + snapshot memoria) | PASS |
| **B1** | Rimuovere mutua esclusione `43d9ece`; verificare coesistenza `nav` + SonarChart | PASS |
| **B2** | Toggle «mostra basemap» (o equivalente) + wiring render/hydrate | pending |
| **B3** | i18n IT/EN/FR + QA manuale (locale + VPS tailnet) | pending |
| **B4** | Chiusura WU + autosync | pending |

**WU-0004 resta OPEN** — B2/B3 (e B4 chiusura) ancora da fare.

---

## Stato esecuzione B1 (2026-06-14)

- Commit runtime: `0cd3c8c` — `feat(gis): remove Navionics/SonarChart mutual exclusion (WU-0004 B1)`.
- Mutua esclusione rimossa in `setMapLayer()`, handler toggle SonarChart, seed init `_lastBaseLayerNonNav`.
- `_lastBaseLayerNonNav` rimosso (zero lettori reali).
- Persistenza invariata; reload conserva combo `nav` + SonarChart attivi.
- Test manuale locale: PASS.
- B2/B3 non implementati in B1.
- Rischio noto: doppio-fetch by-design con basemap Navionics + SonarChart overlay entrambi attivi.

---

## Acceptance criteria per chiusura WU

- Basemap Navionics (`nav`) e SonarChart possono essere **entrambi attivi** senza cambio automatico di layer.
- L’operatore può **nascondere la basemap** mentre SonarChart (e altri overlay consentiti) restano visibili.
- Nessuna regressione su OPSEC/consenso Navionics, forced-offline, cache-on-browse, seamarks, offline download.
- i18n IT/EN/FR per il nuovo controllo.
- Test manuale PASS su locale e VPS tailnet (proxy attivo).
- Architettura monolite vanilla invariata; nessuna nuova dipendenza runtime.

---

## Riferimenti codice (post-B1)

- ~~Mutua esclusione basemap: `setMapLayer()`~~ — rimossa in B1
- ~~Mutua esclusione SonarChart toggle~~ — rimossa in B1
- ~~`_lastBaseLayerNonNav`~~ — rimosso in B1
