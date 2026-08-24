# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana residua → `QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A PASS|FAIL operatore` |
| **RUNTIME LIVE** | tip `c3bf112…` · build **250** · blob `1482ead…` |
| **RUNTIME_CANDIDATE_SHA** | `84e34986d017eae450f045d54c0ea4afd64697f6` · build **251** · blob `7ff2adbecd23bedd4b001ce368720bb279cbcc86` |
| **Result Cursor** | deploy PASS · **AUTOMATED BROWSER QA PASS 19/19** · stop a PENDING QA |
| **Working tree (pre-report-commit)** | docs dirty → this commit |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `84e34986d017eae450f045d54c0ea4afd64697f6` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync: sì — FRONTIER PENDING QA, backlog consumato/storico, WU, OM, latest, deploy-abqa, abqa.json, LAST_CURSOR_REPORT. Monolite **escluso** (già in `84e3498`).
2. BASE: origin/main build **250** coerente; implementato export TXT + clipboard Waypoint.
3. Runtime: dialog Esporta → **Testo (.txt)** / **Copia testo**; `getWaypointsForExportOrSelection`; riga `NOME | COORDINATA | TIPO | NOTE`; `formatWaypointListCoordinates`; `copyText`/`downloadBlob`; IT-only i18n (`tIt`); zero rete; schema invariato.
4. Deploy VPS PASS · URL `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=84e3498-abqa251`.
5. **AUTOMATED BROWSER QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A PASS** (19/19).
6. Sblocco funzionale limitato a questo blocco; **Oggetti GIS = FROZEN / MAINTENANCE-ONLY** altrove.
7. Lint/selftest: smoke helper locale OK; ABQA browser OK.
8. Limiti: Cursor **non** emette QA umana; attesa attestazione operatore.

### STATO FRESCO DA CURSOR
```text
STATO FRESCO DA CURSOR
origin/main HEAD: 84e34986d017eae450f045d54c0ea4afd64697f6 (pre docs commit)
working tree: docs dirty → pending docs commit
ultimo blocco PASS: GIS-POLYGON-TABLE-COL-RESIZE-A (250)
prossimo candidato: GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A (251) PENDING QA
note operative: sblocco limitato; freeze Oggetti GIS preservato
```

## C. OUTPUT GIT

```text
git log --oneline -5: (post-runtime) 84e3498 feat(waypoints)…
git rev-parse HEAD: 84e34986d017eae450f045d54c0ea4afd64697f6
git rev-parse origin/main: 84e34986d017eae450f045d54c0ea4afd64697f6
git branch: main
current_report_container: PENDING_SELF_REFERENCE
```
