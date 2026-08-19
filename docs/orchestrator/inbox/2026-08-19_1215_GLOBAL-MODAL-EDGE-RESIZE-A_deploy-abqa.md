# 2026-08-19 — GLOBAL-MODAL-EDGE-RESIZE-A · REVIEW PASS + deploy GIS + ABQA

## Fatti stabili (EXTERNAL_ONLY)

- **Categoria:** DELICATO / verify+deploy
- **BLOCK-ID:** `GLOBAL-MODAL-EDGE-RESIZE-A`
- **REVIEW GPT-SOSTITUTIVA:** **PASS** sul FULL SHA `942ab73e73fa61870ab85a72d871b35f0105e8f2`
- **Build / APP_BUILD_ID:** **232** / `GLOBAL-MODAL-EDGE-RESIZE-A`
- **Monolite blob atteso:** `ae5b4df61f76b7b16d4e889a618abf7cf1010c80`
- **Deploy GIS-only:** **PASS**
  - HTTP bytes: `10807943`
  - SHA-256 LF (HTTP file): `2FBFC107DCB370FD70CB68E792D5E517E5D7B48B376F1506CD86946BA13BBAD9`
  - Presenza `const APP_BUILD_ID = "GLOBAL-MODAL-EDGE-RESIZE-A"` e `const APP_BUILD_NUM = 232` nel monolite servito

## URL runtime esatto (LIVE)

- `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=a2a2259-abqa`

## Automated Browser QA (pre-operatore)

- Runner: `remote_global_modal_edge_resize_abqa.py` (Edge CDP headless)
- Risultato: **PASS** (`ok=true`)
- Checks: **20** / fail **0**

Check critici (sintesi):
- **Rete esterna dalla sola gesture resize = 0** (`ABQA_network_isolated_resize_delta0`)
- **Grip/handle invisibili + self-consistency edge-resize = PASS** (`ABQA_gisModalEdgeResizeSelfTest`, `ABQA_no_visible_grip_via_after_content`)
- Resize edge/corner: RIGHT/LEFT/TOP/BOTTOM + NW/NE/SW/SE: **PASS**
- Drag header non interferisce con resize: **PASS**
- Minimize/restore: **PASS**
- Close/reopen: **PASS**
- Indipendenza multi-modal (favorites vs layers): **PASS**
- Clamp viewport/min-size + controlli raggiungibili: **PASS**
- Cleanup su `pointercancel`: **PASS**
- Console errors: **nessuna rilevante** (`ABQA_console_no_errors`)
- Invarianti OPSEC/offline + arrays GIS: **unchanged** (`ABQA_state_invariants_mapWaypoints_gisPolygons_forceOffline_opsecStrict`)

## Gate

**QA FINALE CHATGPT — PENDING**

