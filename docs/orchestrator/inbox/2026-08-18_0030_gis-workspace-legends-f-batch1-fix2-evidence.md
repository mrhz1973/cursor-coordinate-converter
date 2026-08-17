# GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX2 — evidence

**BLOCK-ID:** `GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX2`  
**Categoria:** ROUTINE  
**Origine:** QA operatore FAIL su build 216 — riapertura solo D-Flight da nessuna legenda visibile non snap a destra  
**Gate:** **QA FINALE CHATGPT — PENDING**

## LIVE

| Campo | Valore |
| --- | --- |
| BASE | `f1dd5800660017e2ea85975db978498b6727da6c` · build **216** |
| FULL SHA | `1e37e56f04ddb9e7aec2598b398739e7772cec6f` |
| Build / ID | **217** / `GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX2` |
| Blob git | `9671461e9808faf8030a9f405e94bc5b13f9da7c` |
| Bytes LF | `10508439` |
| SHA-256 LF | `232da31e10345351f9dbc028c80deb3f3ef61479ad19fc81a0aec00daee1fa85` |
| URL | http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=1e37e56 |

## Fix

`enterSoloDf` rileva qualsiasi **ingresso** nello stato `showDf && !showAtm` (`isSoloDf && !wasSoloDf`), non solo hide ATM09 da dual. Copre: dual→solo, none→solo, close/reopen solo D-Flight.

## Test 1–8

| Test | Esito |
| --- | --- |
| 1 dual→solo right | PASS (`WSF2_1_dual_off_df_right`, `WSF1_B`) |
| 2 drag stays manual | PASS (`WSF2_2_drag_stays`, `WSF1_C`) |
| 3 none→D-Flight right | PASS (`WSF2_3_none_to_df_right`) |
| 4 D-Flight OFF→ON right | PASS (`WSF2_4_reopen_right`) |
| 5 ATM09 ON dual | PASS (`WSF2_5_dual_restored`, `WSF1_D`) |
| 6 both OFF no ghost | PASS (`WSF2_6_both_off_hidden`) |
| 7 desktop + mobile smoke | PASS (`WSF2_F_1920`, `WSF2_F_360`) |
| 8 regression | PASS selftest **637/637** |

## Deploy

VPS FF `f1dd580`→`1e37e56` · blob ≡ candidato · `goi-gis-app` PID `2758269`→`2758757` · proxy/GH PID invariati · HTTP SHA match.

## ABQA

**AUTOMATED BROWSER QA GIS-WORKSPACE-LEGENDS-F-BATCH1-FIX2 PASS** — LIVE 637/637 · build 217.

## Invarianti

Oggetti GIS FROZEN · no rete/storage/GPS · helper 0.1.3 · G-D + HISTORY-A invariati.

**NON** QA operatore · **NON** finito.
