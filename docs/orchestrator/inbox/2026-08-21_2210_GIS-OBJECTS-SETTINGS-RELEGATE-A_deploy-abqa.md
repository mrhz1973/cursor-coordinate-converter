# GIS-OBJECTS-SETTINGS-RELEGATE-A — REVIEW N/A (ROUTINE) + deploy GIS + ABQA PASS

**BLOCK-ID:** `GIS-OBJECTS-SETTINGS-RELEGATE-A`  
**Categoria:** ROUTINE — accesso UI only  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`  
**GATE uscita:** **QA FINALE CHATGPT — PENDING**

## Scope

1. Rimosso accesso principale mappa (`.twb-btn` / `data-role="workbench-open"`) da toolbar GIS.
2. Aggiunta voce **Oggetti GIS** in `#headerSettingsMenu` (⚙ Impostazioni) → `btnSettingsOpenGisWorkbench`.
3. Click riusa `openGisWorkbenchPanel()` esistente; menu Impostazioni si chiude.
4. Nessuna modifica funzionale interna a waypoint/poligoni/tracce/import-export del workbench.
5. Nessuno schema/storage/rete/GPS/OPSEC.

## Decisione prodotto (confermata)

**Oggetti GIS = FROZEN / MAINTENANCE-ONLY**

- nessun nuovo sviluppo funzionale del modulo;
- consentiti solo bugfix / stabilità / compatibilità;
- backlog di sola espansione funzionale **non** proposti automaticamente come NEXT;
- storico preservato; backlog mai implementati **non** marcati completati.

## A — Runtime

| Campo | Valore |
| --- | --- |
| Tip | `f0ea6378bcfcdf8b9de696c849a226e09ae93273` |
| Build / ID | **246** / `GIS-OBJECTS-SETTINGS-RELEGATE-A` |
| Blob | `3c575a83ce184f79c3328134a9b62056ac818414` |
| BASE LIVE pre | `03a222e` / **245** / MAP-CENTER FIX1 |

## B — Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS HEAD | `f0ea6378bcfcdf8b9de696c849a226e09ae93273` |
| CMP | **PASS** · SHA-256 `0843e584616eeca314f5b8fd7e2a79474756fe5f0331d0078d7a7ebce4999f19` · bytes `10852142` |
| Proxy PID | `2481045` invariato |
| HTTP | **200** |

**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=f0ea637`

## C — Automated Browser QA — PASS

**AUTOMATED BROWSER QA GIS-OBJECTS-SETTINGS-RELEGATE-A PASS** · **12/12**  
JSON: [`2026-08-21_2210_GIS-OBJECTS-SETTINGS-RELEGATE-A-abqa.json`](2026-08-21_2210_GIS-OBJECTS-SETTINGS-RELEGATE-A-abqa.json)

No map access · ⚙ Impostazioni · voce Oggetti GIS · open panel · seed WP/traccia/poligono · close/reopen · narrow · pageerrors 0.

## Gate

**QA FINALE CHATGPT — PENDING**

Non attestare QA operatore. Non `finito`.
