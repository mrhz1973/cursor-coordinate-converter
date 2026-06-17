# WU-0009B B5.1 — OPSEC strict / proxy discoverability UX polish

**Data:** 2026-06-17  
**Tipo:** runtime GIS monolite + docs operative + autosync

## Cosa è stato fatto

1. **Step 1 — Label OPSEC strict (OBBLIGATORIO):** chiave i18n `set.opsec.strict` aggiornata IT/EN/FR per chiarire scope oltre geocoding (tile/proxy/chiamate rete sensibili).
2. **Step 2 — Help-line (OBBLIGATORIO):** nuova chiave `set.opsec.strictHelp` + `<p class="geo-opsec-help hint">` sotto `#setOpsecStrict` in Guida → Geocoding → Impostazioni geocoding; CSS `.geo-opsec-help`.
3. **Step 3 — Hint Layers Satellitare:** **differito consapevolmente** — menu basemap ricostruito dinamicamente (`basemapLayersHtml` / `tlayerBasemapBtn`); iniettare hint nella lista verrebbe cancellato al rebuild.
4. **Step 4 — tip gsat/bsat:** non modificati (già chiari).

## Logica OPSEC

- `#setOpsecStrict` **unico**; nessun secondo toggle.
- Listener invariato; reset `_bingConsentGranted` (e altri consensi proxy) ancora presente.
- `tileFetchAllowed`, `ensureProxyConsent`, route `/bsat/` `/gsat/` `/tiles/` `/sonar/` **non modificati**.

## File modificati

| File | Note |
| --- | --- |
| `coordinate_converter Claude.html` | label, help-line, i18n, CSS |
| `docs/OPERATING_MEMORY.md` | §7 nota B5.1 |
| `docs/work-units/WU-0005-0009-roadmap.md` | B5.1 PASS tecnico; B6 QA pending |
| `docs/runtime/LAST_CURSOR_REPORT.md` | nuova LATEST `150d6ac` |
| `docs/orchestrator/latest.md` | sintesi |
| questo inbox | riepilogo completo |

## Commit

| SHA | Messaggio |
| --- | --- |
| `150d6ac` | feat(gis): improve OPSEC strict proxy discoverability (WU-0009B B5.1) |
| `8475ff7` | docs: OM §7 — B5.1 OPSEC proxy UX polish PASS tecnico |
| *(autosync)* | docs: orchestratore + LAST_CURSOR_REPORT — B5.1 OPSEC proxy UX polish |

## Controlli eseguiti

- `node --check` su JS inline estratto: **OK**
- `#setOpsecStrict` count = 1
- `state._bingConsentGranted = false` on OPSEC change: presente
- i18n `set.opsec.strictHelp` ×3 (IT/EN/FR)
- Nessuna modifica gate/route/listener OPSEC

## QA

- **PASS operatore:** non attestato (nessun browser QA B5.1 in sessione).
- **Checklist manuale post-deploy:**
  1. Aprire app con cache-buster (hash commit runtime).
  2. Help → Geocoding → Impostazioni geocoding.
  3. Verificare label OPSEC strict ampliata.
  4. Verificare help-line sotto il toggle.
  5. Non-regressione: toggle OPSEC, consenso proxy gsat/bsat sotto OPSEC strict (già PASS B4.4).
  6. Hint Layers: non implementato in B5.1 (backlog B5.x).

## Monolite nel commit

- **Runtime commit `150d6ac`:** monolite **incluso**.
- **Autosync:** monolite **escluso** (policy default).

## Prossimo passo

- Browser QA visuale B5.1 (operatore) opzionale.
- B5.x hint statico Layers fuori rebuild dinamico, se richiesto.
- B6 QA OPSEC/proxy/offline formale.
