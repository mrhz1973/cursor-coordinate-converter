# Riepilogo — D-FLIGHT-ATM09-LEGEND-UX-STYLE-META-CLOSE-A

**Data:** 2026-08-16 10:52 Europe/Rome  
**Blocco:** `D-FLIGHT-ATM09-LEGEND-UX-STYLE-META-CLOSE-A`  
**Esito:** **CLOSED / PASS** diagnostico — Caso **M2**  
**Gate:** `ATM09 STYLE METADATA SOURCE REQUIRED`

## Autosync (container)

- `real_task_commit`: `9db8c19ae0bfd932663e2169cf203395300c8912`
- Container corrente: `PENDING_SELF_REFERENCE`
- Fatti autosync: `EXTERNAL_ONLY`
- Monolite: **escluso**

## Probe (sanitizzato)

| Voce | Valore |
| --- | --- |
| SSH | `ionos-n8n` |
| Transient + LoadCredential | sì |
| Credential exposure | **NO** |
| JSON re-probe | 200 / application/json / 2828 / 9 rules |
| COSTA_STYLE_EQUIVALENCE | **IDENTICAL** |
| RULE PNG schure | 200 · 21×21 · fill visibile |
| RULE PNG italia | 200 · 21×21 · nessun pixel visibile / no bordo |
| WFS costa / italia | 200 · feature_count **0** / **0** |
| TEMP CLEANUP | **PASS** |
| Helper live | **active** |

## Mapping

- User-facing PROVEN **7/8**
- Residui: (1) costa/scure; (2) secondo Max 120 (italia esclusa come fonte PNG)

## Invarianti

- Runtime build **197** / tip `d2d3ab3…` **invariato**
- Helper **0.1.3** **invariato**
- NO runtime/helper patch · NO deploy · NO finito
