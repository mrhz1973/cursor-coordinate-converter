# D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 — deploy GIS + Automated Browser QA PASS

**Gate:** `D-FLIGHT-H-AUTOLOAD-UX-A-FIX2 DEPLOYED — AUTOMATED BROWSER QA PASS — QA OPERATORE REQUIRED`

## Deploy

| Campo | Valore |
|-------|--------|
| Baseline locale | `5183c41f519186c192379c3952070f3b347477dd` |
| Candidate runtime | `2124d25c80873f11b3b86ddc410545d62975e704` |
| Monolite blob | `afcf5f8da56b9989b003cc68f1b7165f4f88cc88` (HEAD = candidate) |
| VPS PRE_HEAD | `916c08106983ebd0e571fdcd6a0cc6f44d176df0` |
| VPS POST_HEAD | `5183c41f519186c192379c3952070f3b347477dd` |
| Service | `goi-gis-app` restart → active/enabled |
| HTTP | 200 |
| Bytes | 10023980 |
| SHA256 LF live=git | `67e548a91c693d03e48ed5c7d2a8078e2ab006406d61bd6bbda952340fb3e6ca` |
| Build | `D-FLIGHT-H-AUTOLOAD-UX-A-FIX2` / **173** |
| Helper | **non** restartato/modificato — `0.1.3` READY, count 846 |

## Automated Browser QA

URL: `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=2124d25-hfix2*`

| Caso | Esito |
|------|-------|
| 1 Boot + selfTest pre-panel | PASS — zero `:8010` boot; selfTest **162/162**; netDuring=[] |
| 2 Panel autoload | PASS — 1× GET `/dataset` 200; no Carica zone; ready 846 zone; reopen **0** `/dataset` |
| 3 Offline / OPSEC | PASS — zero dataset/refresh; phase blocked |
| 4 Timer / single-flight | PASS — H_* timer + single-flight via `dflightSelfTestH` |
| 5 Lazy ATM09 legend | PASS — src null collapsed; src set on expand; OPSEC/offline src null |
| 6 UX H | PASS — Pronto; no load/retry; Aggiorna+Rivaluta; legenda nativa; ATM09 details |
| 7 Regressioni | PASS — zoom z11→z10; basemap; waypoint; layer toggle; console DF clean |

## Network summary (D-Flight)

- pre-panel: nessuna `:8010`
- panel open: GET `/dataset` ×1
- reopen: no `/dataset` (eventuale `/atm09/info` overlay — non dataset)
- offline/OPSEC: zero `:8010`
- legend: lazy `/atm09/legend.png` solo su expand; bloccata offline/OPSEC
- zero fetch browser dirette a `d-flight.it`

## Conferme

- NO patch monolite in questo intervento
- NO finito
- NO QA operatore inferita
