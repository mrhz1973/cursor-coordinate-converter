# GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX1 — evidence

**BLOCK-ID:** `GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX1`  
**Categoria:** ROUTINE  
**Origine:** QA operatore FAIL su build 215 — solo D-Flight non si ricollocava a destra dopo hide ATM09  
**Gate:** **QA FINALE CHATGPT — PENDING**

## LIVE

| Campo | Valore |
| --- | --- |
| BASE | `7ef5c83351d76c941655d82cc8f8b2fdc0029b75` · build **215** |
| FULL SHA | `f1dd5800660017e2ea85975db978498b6727da6c` |
| Build / ID | **216** / `GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX1` |
| Blob git | `fe69bed55f8f2df7decde40c15cbe28fd9927058` |
| Bytes LF | `10501810` |
| SHA-256 LF | `388bd51978a345945be4ba3643251ea1f37e498b363d095a2d71a589c6a872ca` |
| URL | http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f1dd580 |

## Fix

Transizione `showAtm` true → false con D-Flight visibile: `enterSoloDf` in `legendWorkspaceLayout` → `legendWorkspacePlaceSingle` (slot destro), reset `touched` solo su quella transizione. Drag manuale successivo prevale; rientro in solo-D-Flight riapplica snap.

## Test A–G

| Test | Esito |
| --- | --- |
| A both sbs | PASS (`WSF1_A_both_sbs`) |
| B hide ATM09 → DF right | PASS (`WSF1_B_solo_df_right`) |
| C drag after auto | PASS (`WSF1_C_drag_stays`) |
| D re-enable ATM09 | PASS (`WSF1_D_dual_restored`) |
| E hide ATM09 again | PASS (`WSF1_E_resnap_right`) |
| F 1920 + 360 | PASS (`WSF1_F_1920`, `WSF1_F_360`) |
| G regression | PASS selftest **627/627**, `DH_*` 28/28, `WSF_*` 26/26 |

## ABQA

**AUTOMATED BROWSER QA GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX1 PASS** — LIVE 627/627 · Convert/History smoke · build 216.

## Invarianti

Oggetti GIS FROZEN · no rete/storage/GPS · helper 0.1.3 · G-D + HISTORY-A invariati.

**NON** QA operatore · **NON** finito.
