# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana → `QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1 PASS|FAIL operatore` |
| **RUNTIME LIVE** | tip `c3bf112…` · build **250** |
| **RUNTIME_CANDIDATE_SHA** | `4ad3b522a0d921a4344edccfa9e01d4413e95956` · build **252** · blob `003b40b8a3b27346ef6768239fc021cffaea2e6e` |
| **Result Cursor** | deploy PASS · **AUTOMATED BROWSER QA PASS** · stop PENDING QA |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `4ad3b522a0d921a4344edccfa9e01d4413e95956` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync docs: sì (questo commit). Monolite escluso (già in `4ad3b52`).
2. Trigger: `QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A FAIL operatore` — caso 2 (Copia testo multi → 1 sola riga).
3. Fix: await clipboard prima di chiudere dialog; snapshot selezione; fallback multiline-safe.
4. Preservati: export TXT multi, copia singolo, formato coord, no mutazioni, zero rete.
5. Deploy PASS · ABQA PASS · URL `?v=4ad3b52-abqa252`.

### STATO FRESCO DA CURSOR
```text
STATO FRESCO DA CURSOR
origin/main HEAD: 4ad3b522a0d921a4344edccfa9e01d4413e95956 (pre docs)
working tree: docs dirty → pending docs commit
ultimo blocco PASS tecnico: FIX1 deploy+ABQA
prossimo: QA operatore FIX1
note: parent 251 FAIL caso 2
```

## C. OUTPUT GIT

```text
runtime tip: 4ad3b522a0d921a4344edccfa9e01d4413e95956
blob: 003b40b8a3b27346ef6768239fc021cffaea2e6e
current_report_container: PENDING_SELF_REFERENCE
```
