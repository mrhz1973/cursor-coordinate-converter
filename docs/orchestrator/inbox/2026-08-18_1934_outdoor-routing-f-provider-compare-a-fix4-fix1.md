# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1 — candidate 226

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE` (override: **NON** deploy · **NON** ABQA · **NON** QA operatore · **NON** finito)  
**GATE:** **REVIEW GPT-SOSTITUTIVA — PENDING**  
**LIVE FRONTIER:** resta build **220** / `cfee0e4`

Review GPT-SOSTITUTIVA FIX4 (225): **FAIL SCOPED** — finding unico bloccante: `routingInvalidateRoutePreview()` non azzera `r.ringSemanticWarn` → possibile warning anello residuo dopo modifica punti prima del nuovo calcolo.

## Candidate

| Campo | Valore |
| --- | --- |
| **FULL SHA** | `2e616352042f63a650124efcabe704796e6042af` |
| Base 225 (FIX4) | `f1d9fc0540f8073d5e79f59164237a951e80215c` (blob `8f9a6abe…`) |
| Build / ID | **226** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX4-FIX1` |
| Blob monolite | `82ecf7d73527f12891f93cba55589c5e913cae2e` |
| Bytes LF | `10685767` |
| SHA-256 LF | `f82e56ae2f1e94da08a2320905c6958be2253aca0e512a9ea0ace1dc99706220` |
| Helper | **0.1.3** invariato |
| Diff vs 225 | `coordinate_converter Claude.html` +127 / −59 |
| Selftest globale | **801/801 PASS** (RWF1 8/8) |

Un solo runtime commit: `fix(routing): FIX4-FIX1 ring warn lifecycle reset on invalidate, build 226`.

Questo pass **non** deploya. VPS resta sul candidate **224** deployato (`d455841`).

## Fix — esclusivamente lifecycle del warning semantico Anello

`routingInvalidateRoutePreview()` (ora `84317–84351`), nel blocco di reset stato (righe 84335–84336 e 84343):

```javascript
  state._routing.roundTripWarnKey = "";
  state._routing.ringSemanticWarn = false;          // AZZERA warning route precedente
  state._routing.alternatives = [];
  state._routing.selectedAlternative = null;

  try { routingCompareOnInputInvalidated(); } catch(_){}
  try { routingRemoveRoutePreviewOverlay(); } catch(_){}
  try { if (typeof routingClearAltitudeUi === "function") routingClearAltitudeUi(); } catch(_){}
  try { if (typeof routingSetRoundTripFeedback === "function") routingSetRoundTripFeedback("", ""); } catch(_){}  // SVUOTA feedback visibile
  routingSetStatus("", false);
```

- **Acceptance 1**: stato azzerato (`ringSemanticWarn = false` accanto a `roundTripWarnKey = ""`) + feedback `#routingRoundTripFeedback` svuotato/nascosto immediatamente (`routingSetRoundTripFeedback("", "")` → `el.hidden = true; el.textContent = ""`).
- **Acceptance 2**: il nuovo calcolo continua a ricomputare — `routingApplyRingSemanticWarn(r)` invariato, richiamato a ogni apply (`87838` zero-VIA, `88767` apply generale).
- **Acceptance 3**: cambio modalità fuori Anello continua a pulire — `routingSyncRoundTripControlsUi` con `!on` → `routingSetRoundTripFeedback("", "")` (invariato, `87340–87343`).
- Entrambe le nuove righe sono guard-protected (`typeof … === "function"`) e in `try/catch`, coerenti con lo stile adiacente.

## Selftest RWF1 (8/8)

`routingRingWarnFix1SelfTest` (nuova, dopo `routingCompareFix4SelfTest`), inclusa nella suite globale via wrapper `dflightSelfTestAll`; API `GOIDflight.selfTestRingWarnFix1`.

| Check | Esito |
| --- | --- |
| `RWF1_build_226` | PASS |
| `RWF1_warn_true_after_oab` (warning true dopo route out-and-back-like) | PASS |
| `RWF1_feedback_visible_before_invalidate` (feedback visibile pre-invalidate) | PASS |
| `RWF1_invalidate_resets_warn` (invalidate → warning false) | PASS |
| `RWF1_invalidate_clears_feedback` (invalidate → feedback non più visibile) | PASS |
| `RWF1_real_loop_no_warn` (nuova route loop reale → warning false) | PASS |
| `RWF1_new_oab_warns_again` (nuova route out-and-back-like → warning true) | PASS |
| `RWF1_exit_ring_clears_feedback` (uscita da Anello → feedback vuoto) | PASS |

Restore in `finally`: routeMode, previewCoordinates, ringSemanticWarn, roundTripWarnKey, feedback svuotato — nessuno stato residuo nella suite.

## NON modificato (acceptance 4)

Criterio geometrico `routingPathLooksLikeOutAndBack` · soglia 45 m / semantica warning · payload · preview canonica · routing GH/ORS · multi-traccia · colori · elevation · layout · Tab/focus · avoid · compare identity · endpoint/rete · storage/GPS/GIS. Delta verificato riga per riga: le uniche righe funzionali sono le 2 in `routingInvalidateRoutePreview`; il resto è la nuova selftest RWF1 + wrapper/API + fixup assert build (27 occorrenze, pattern storico dei bump precedenti 220→225).

## STOP

**REVIEW GPT-SOSTITUTIVA — PENDING**  
LIVE resta **220**.  
NEXT: review FIX4-FIX1 candidate **226**.  
NON deploy. NON ABQA. NON QA operatore. NON finito.
