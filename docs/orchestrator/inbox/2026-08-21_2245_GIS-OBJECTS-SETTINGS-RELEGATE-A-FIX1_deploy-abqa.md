# GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1 — REVIEW N/A (ROUTINE) + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1`  
**Parent:** `GIS-OBJECTS-SETTINGS-RELEGATE-A`  
**Categoria:** ROUTINE — FIX1 layout toolbar  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING**

## Finding QA

Caso 2 PASS (Impostazioni → Oggetti GIS). Caso 1 FAIL: barre bianche / controlli espansi dopo rimozione accesso mappa.

## Causa root

Nel template literal di `.tile-ctrls` era rimasto un commento `/* … */` come **testo HTML** (non commento JS), che diventava un nodo di testo nel flex e rompeva geometria/dimensioni.

## Fix

Rimosso il commento dal template; nessun redesign; accesso Impostazioni invariato; nessun bottone mappa Oggetti GIS.

## A — Runtime

| Campo | Valore |
| --- | --- |
| Tip | `ac4789ea420bc691f9f8de5d7f751e040d3e6dc9` |
| Build / ID | **247** / `GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1` |
| Blob | `6e10d5686eaf7d18b85380bd15b85bd3827ad01c` |
| BASE | `f0ea637` / **246** |

## B — Deploy GIS-only — PASS

CMP **PASS** · SHA-256 `e7885460987dd26e252daf0714e9af7674d5843f7a57dd8200948feb23b97a1c` · bytes `10852036` · proxy PID invariato · HTTP 200  

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ac4789e`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1 PASS** · **9/9**  
JSON: [`2026-08-21_2245_GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1-abqa.json`](2026-08-21_2245_GIS-OBJECTS-SETTINGS-RELEGATE-A-FIX1-abqa.json)

No leaked text · no map workbench btn · colonna controlli stretta · GPS/zoom/track/wp/meas presenti · Impostazioni→pannello · narrow · pageerrors 0.

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.
