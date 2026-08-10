# CARTO-IGM-SERIES-EXPAND-A-UX2 — riepilogo intervento

## Esito
CARTO-IGM-SERIES-EXPAND-A-UX2 IMPLEMENTED — REVIEW GPT-SOSTITUTIVA REQUIRED

## Trigger
`QA CARTO-IGM-SERIES-EXPAND-A-UX1 FAIL operatore` — colori/CTA OK; label fogli poco visibili su basemap chiara.

## Cosa è stato fatto
1. Label più grandi: 13px (14px selected), weight 700/800.
2. Halo bianco SVG più spesso (4.5px / 5.5px selected) via CSS + `cartoIgmApplyLabelStyle`.
3. `labelColor` serie scuriti (stessa famiglia cromatica).
4. Hit/background pill: fondo bianco ~90% + bordo serie (`cartoIgmApplyLabelHitStyle`); hit box leggermente più ampia.
5. Build: `CARTO-IGM-SERIES-EXPAND-A-UX2` / `146`.

## Non toccato
- footprint fill/stroke serie (identità UX1 preservata)
- dataset / manifest / payload embedded
- query / storage / rete / proxy / Objects GIS
- contenuto/posizione/interazioni label (solo stile + hit size)

## Runtime
- FULL SHA: `ebc6752ae880d74282425e4a19483eede9f97dca`
- blob: `5424f74cc0bceda728d0b1a3eddcdca1d32d649d`
- byte: `9763304`
- SHA-256: `2a1e23041cbcc04746ec5bf80927665f10643032f073878b512f1a14d67e0eb3`
- payload count: 8204; SHA payload invariato

## Verifiche
- `node --check` PASS
- `git diff --check` PASS
- payload invariato PASS
- dataset invariati PASS

## Deploy / QA
- Deploy: NOT EXECUTED
- QA: NOT EXECUTED (attende review + deploy)

## Prossimo passo
Review GPT-sostitutiva → deploy UX2 → QA (label su basemap chiara + regressione colori/CTA).
