# GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1 — ROUTINE + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1`  
**Parent:** `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A` (build 251) — QA FAIL operatore caso 2  
**Categoria:** ROUTINE  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE:** **QA FINALE CHATGPT — PENDING**

## Finding (QA FAIL 251)

Con più Waypoint selezionati, **Testo (.txt)** esportava l’intera selezione; **Copia testo** lasciava negli appunti un solo Waypoint (clipboard stale / race).

**Causa:** `waypointsCopyPlainText` chiamava `copyText` async senza `await` e il dialog export veniva chiuso subito, invalidando l’user activation della Clipboard API.

## Fix (252)

- `waypointsCopyPlainText` → `async`, snapshot selezione + payload sync, `await copyText(...)`
- click `txt-clipboard`: chiude il dialog **solo dopo** il Promise della copia
- `copyText`: fallback multiline-safe (`setSelectionRange`); ritorna esito

## A — Runtime candidate

| Campo | Valore |
| --- | --- |
| Tip | `4ad3b522a0d921a4344edccfa9e01d4413e95956` |
| Build / ID | **252** / `GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1` |
| Blob | `003b40b8a3b27346ef6768239fc021cffaea2e6e` |
| Byte / SHA-256 | `10862536` / `a7cb0eb9ff0ef6789c3626ca27508099220c63dd5c200e4cd34c2116c4fa6657` |
| BASE | tip `84e3498` / **251** |

## B — Deploy GIS-only — PASS

HTTP 200 · Content-Length `10862536` · build label FIX1 · **252**  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=4ad3b52-abqa252`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1 PASS**  
JSON: [`2026-08-24_1500_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1-abqa.json`](2026-08-24_1500_GIS-WAYPOINT-TEXT-EXPORT-CLIPBOARD-A-FIX1-abqa.json)

Copertura: multi-select file↔clipboard match (2 e 3 righe); single copy; delay await full payload; MGRS; no mutation; zero rete; `await copyText` presente.

## Gate

**QA FINALE CHATGPT — PENDING**
