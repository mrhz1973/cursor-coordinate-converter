# Riepilogo finito sessione — UX-NEXT-RUNTIME-BUNDLE-D

**Data:** 2026-06-28  
**Blocco:** UX-NEXT-RUNTIME-BUNDLE-D (+ D-FIX1 FAIL + D-FIX2 PASS)  
**Trigger:** `QA UX-NEXT-RUNTIME-BUNDLE-D-FIX2 PASS operatore` (auto-`finito` Regola H)

## Catena runtime

| Step | SHA | Build | Subject | QA |
| --- | --- | --- | --- | --- |
| Base | `ec86b62` | 19 | `feat(gis): polish HUD and panel resize UX` | (bundle parziale) |
| D-FIX1 | `5fec693` | 20 | `fix(gis): limit wheel zoom to one step per burst` | **FAIL** — 2–5 livelli/scatto |
| D-FIX2 | `19700b6` | 21 | `fix(gis): wheel zoom one step per detent` | **PASS** |

## Commit task finale (runtime)

- **SHA:** `19700b6a2cec925ec2bca16cd6127c46b7d84202`
- **Blob git:** `65b7293ab229b2a37cb3f1ec03666f565900c73e`
- **Build:** `B5.5Z · build 21`

## Interventi runtime (sintesi)

### Base `ec86b62` (build 19)

- Polish HUD `#gisMapHud` (compact, chip status/muted, focus-visible)
- Polish resize e/w pannelli (`GIS_PANEL_EW_RESIZE_KEYS`, `gisPanelResetEwWidth` doppio-clic)
- `formatHudCenterCompact`, `mapLayerHudLabelShort`
- i18n `tip.panelResizeEW` IT/EN/FR

### D-FIX1 `5fec693` (build 20) — insufficiente

- Debounce 50 ms, ±1 per burst su `.tile-map`
- **QA FAIL:** eventi wheel dello stesso scatto fisico >50 ms → più flush → 2–5 livelli

### D-FIX2 `19700b6` (build 21) — fix finale

- `attachWheelZoom` wire-once su `#miniMap` (`_wheelZoomWired`)
- Gesture idle **140 ms** + cooldown post-step **100 ms**
- Max ±1 livello per gesto fisico; accumulo azzerato post-step

## Controlli statici (FIX2)

- `node --check` JS inline: PASS
- Un solo listener `wheel` (wire-once)
- Nessun `<script src>` / module

## Deploy GIS-only — PASS tecnico (FIX2)

- VPS HEAD: `19700b6`
- Bytes file: 2446515
- SHA-256 file: `7019c56e063659bd974e68a365a19bab2029bfef25dbd8285e78c253af90312a`
- cmp repo/servito: PASS
- `goi-gis-app.service`: active (bind `100.114.7.53:8000`)

## QA operatore

- **PASS** — attestazione: «**QA UX-NEXT-RUNTIME-BUNDLE-D-FIX2 PASS operatore**»
- URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=19700b6`
- Provenienza: operatore; wheel 1 livello/scatto; pan/±/resize/HUD OK

## Chiusura docs (`finito`)

- `docs/OPERATING_MEMORY.md` §7 aggiornato
- `docs/work-units/WU-0005-0009-roadmap.md` aggiornato
- `docs/HANDOFF.md` snapshot aggiornato
- Monolite **non** modificato nel commit docs (già in `19700b6`)

## Prossimo passo

Da scegliere da roadmap/backlog: titolo statico `<title>`.

## Limiti / backlog

- Titolo statico `<title>` resta `B6.6B` (label runtime dinamica `B5.5Z · build 21` via JS)
- Trackpad scroll molto rapido: cooldown 100 ms può richiedere ~240 ms tra passi — accettabile in QA
