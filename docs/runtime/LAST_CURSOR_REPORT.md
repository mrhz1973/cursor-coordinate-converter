# LAST_CURSOR_REPORT

## A. Header

| Campo | Valore |
| --- | --- |
| **BLOCK** | `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2` |
| **GATE** | **QA FINALE CHATGPT — PENDING** |
| **NEXT** | QA umana → `QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX2 PASS|FAIL operatore` |
| **RUNTIME_CANDIDATE_SHA** | `0a4b52b9ccc2b3a230366021f51285a961798b8b` · build **255** · blob `e8f5d3c09fcd5ac0a255cf368a51daf3dfbd1a73` |
| **Result Cursor** | deploy PASS · **AUTOMATED BROWSER QA PASS 20/20** (execCommand content proof, 3 nominativi) |
| **REMOTE_HEAD_AT_EVIDENCE_TIME** | `0a4b52b9ccc2b3a230366021f51285a961798b8b` |
| **current_report_container** | `PENDING_SELF_REFERENCE` |

## B. RIEPILOGO COMPLETO

1. Autosync docs: sì (questo commit). Monolite escluso (già in `0a4b52b`).
2. Trigger: QA FAIL FIX1 — Copia testo multi ancora 1 riga su HTTP.
3. Causa: no Clipboard API su HTTP; fallback execCommand con readonly / host dialog sbagliato.
4. Fix: bundle TXT condiviso; host `#waypointExportDialog`; no readonly; body retry; Set selezione canonica.
5. ABQA: Playwright vs VPS; intercept execCommand → 3 righe AlphaXP/BetaXP/GammaXP = TXT.
6. SHA-256 monolite: `09e01fe3a5d11965e5109bedecc155ecc95693599016c8d000fa59b5147feaaa` · bytes `10867044`.

### STATO FRESCO DA CURSOR
```text
STATO FRESCO DA CURSOR
origin/main HEAD: 0a4b52b9ccc2b3a230366021f51285a961798b8b (pre docs)
working tree: docs dirty → pending docs commit
prossimo: QA operatore FIX2 (255)
```

## C. OUTPUT GIT

```text
runtime tip: 0a4b52b9ccc2b3a230366021f51285a961798b8b
blob: e8f5d3c09fcd5ac0a255cf368a51daf3dfbd1a73
current_report_container: PENDING_SELF_REFERENCE
```
