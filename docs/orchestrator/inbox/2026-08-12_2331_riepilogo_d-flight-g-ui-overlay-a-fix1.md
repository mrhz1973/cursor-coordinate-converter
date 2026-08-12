# D-FLIGHT-G-UI-OVERLAY-A-FIX1 — dopo FAIL operatore

**Data:** 2026-08-12  
**Trigger:**
```text
QA D-FLIGHT-G-UI-OVERLAY-A FAIL operatore — colori overlay ancora poco differenziati rispetto alla legenda/D-Flight; verificare mapping reale restriction→style. Inoltre la rotellina del mouse sopra i pannelli GIS propaga lo zoom alla mappa invece di restare confinata al pannello.
```

**Scope:** solo monolite. Nessuna modifica helper/CORS/OPSEC/rete.

## Root cause colori

Dataset live helper = WFS `NO_FLY_ZONE`. Per vincolo B: `restriction=null`, `restriction_known=false` (niente false equivalence ED).  
`rule`/`regola` sul feed reale sono **testo libero HTML** (non enum). Lo stile UI usava solo `zone.restriction` → **tutte** le zone in `is-unknown` (grigio), mentre la legenda mostrava le 5 voci ED fittizie → disallineamento.

Semantica osservata sul feed (`/dataset`, 853 feature):

| Campo | Distribuzione |
|-------|----------------|
| type/subtype | tutte `NO_FLY_ZONE` |
| status | ACTIVATED 562, PUBLISHED 289, EXPIRED 2 |
| testo rule (heur) | TEMP/NOTAM ~402, prohibited ~347, auth ~44, other ~60 |

## Fix style

- `dflightZoneStyleKey(zone)`: ED enum se presente; altrimenti WFS-derived (`WFS_PROHIBITED` / `WFS_REQ_AUTH` / `WFS_TEMP_NOTAM` / `WFS_EXPIRED` / `UNKNOWN`) da `restriction_raw` + `raw_properties.rule|regola|status` **senza** scrivere enum su `restriction`.
- Overlay + legenda usano le chiavi **presenti** nel dataset; etichette IT (`dflight.style.*`).
- Colori più contrastati (fill/stroke).

## Root cause wheel

Con pannello non-scrollabile, la rotella può “cadere” sulla mappa sotto (`#miniMap` riceve il target).  
Fix: in `attachWheelZoom`, se `elementFromPoint` è su `dialog.app-modal[open]` / drawer / dock → `preventDefault` e no zoom; `gisPanelTrapWheel` su floating panels.

## Commit / deploy

| SHA | Note |
|-----|------|
| `b97368e132c49f58d132c803f8ce0e0bed2f316d` | FIX1 style+wheel (build 165) |
| `ddf84f3909a63e84e56ae9c71740a0af77d8ef18` | selftest/CSS polish (build **166**, **RUNTIME LIVE**) |

Deploy GIS-only: CMP_PASS; URL `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=ddf84f39`

## Automated Browser QA

```text
AUTOMATED BROWSER QA D-FLIGHT-G-UI-OVERLAY-A-FIX1 PASS
```

Prove: class differenziate `is-prohibited` / `is-temp-notam` / `is-req-auth`; legenda WFS; `elementFromPoint` + wheel trap; `dflightSelfTestCDE` failed=[] ; B28 (restriction WFS null) invariato.

## Gate

`QA FINALE CHATGPT — PENDING`

FAIL F e FAIL G (pre-FIX1) restano in storia. Attestare FIX1 con:
```text
QA D-FLIGHT-G-UI-OVERLAY-A-FIX1 PASS operatore
```
o FAIL con dettaglio.
