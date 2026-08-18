# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 — REVIEW PASS + deploy GIS + ABQA PASS

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| Build / ID | **228** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| Monolite blob | `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| Bytes LF / SHA-256 LF | `10710401` / `ba6df30dca84f31f38b80fd8d7a34f6f61d180473a78a65f2777451dde0124ce` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| Blob HEAD / candidate | `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| `APP_BUILD_NUM` / ID | **228** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| Helper | **0.1.3** invariato |
| Working tree HTML | pulito |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `f703cee` → `f326552b655e43e0a30d6df319e3c671f8c63f8c` (docs HEAD; monolite ≡ candidate `c5bc4b1`) |
| Runtime identity (candidate) | `c5bc4b11c4821e40fc6479b55a0c1ef0e90f40fc` |
| Monolite blob | `225b1a7b673bd0cfa6aa3b407993cc453402923b` |
| Bytes / SHA-256 HTTP | `10710401` / `ba6df30dca84f31f38b80fd8d7a34f6f61d180473a78a65f2777451dde0124ce` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 228` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6` |
| `goi-gis-app` | restart PID `2803204`→`2805095` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=c5bc4b1`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX6 PASS**

Viewport: desktop **1920×900** (**246/246**) · mobile **360×740** (**13/13**).  
JSON: [`2026-08-18_2203_outdoor-routing-f-provider-compare-a-fix6-abqa.json`](2026-08-18_2203_outdoor-routing-f-provider-compare-a-fix6-abqa.json).  
Screenshot: [`2026-08-18_2203_abqa_fix6_desktop_params.png`](2026-08-18_2203_abqa_fix6_desktop_params.png) · [`2026-08-18_2203_abqa_fix6_mobile_params.png`](2026-08-18_2203_abqa_fix6_mobile_params.png) · [`2026-08-18_2203_abqa_fix6_mobile.png`](2026-08-18_2203_abqa_fix6_mobile.png) · [`2026-08-18_2203_abqa_fix6_desktop.png`](2026-08-18_2203_abqa_fix6_desktop.png).  
Selftest live: **ok=true n=847 fail=0** (RPCF6 18/18 · RPCF5 28/28 · RWF1 8/8). Console desktop n=1 (`ERR_CONNECTION_REFUSED` irrilevante), **0** rilevanti. Network interceptor: **0** `api.openrouteservice.org`, **0** `Authorization` su 269 post. Boot: nessun POST routing prima dell’azione utente (`A_boot_no_compare_net` PASS, detail vuoto pre-evaluate).

### Acceptance primaria 360×740

| Check | Esito | Note |
| --- | --- | --- |
| Tre chip visibili | PASS | `Solo andata` 96×27 · `Andata e ritorno` 121×27 · `Anello` 62×27 |
| Wrap ordinato | PASS | `chipsWrap=wrap`; ordine Profilo → Percorso → Velocità → Calcola |
| Nessun truncation/ellipsis | PASS | `text-overflow: clip`; label complete |
| Planner body no overflow | PASS | `plannerOverflowTight=true` (`scrollWidth ≤ clientWidth + 8`) |
| Pagina no overflow | PASS | `document.scrollWidth ≤ innerWidth + 8` |
| Params bar integra | PASS | nessuna seconda copia Percorso; select `flex-grow:0` |

### Casi A–F (esito)

| Caso | Esito | Note |
| --- | --- | --- |
| A PARAMS COMPACT + FIX6 wrap | PASS | Desktop A6 4/4; mobile 13/13. Harness 227: `A_cta_blue` accetta `color(srgb)` + classe `btn-primary`; `A5_calc_same_row_desktop` giudica larghezza pannello (~654px) non `innerWidth`. |
| B TRACK ↔ PLANNER | PASS | 12/12 `B5_*`: auto-min; Calcola-only restore; commit alt senza restore; already-min; restore/chiusura utente. |
| C BORDI ALTERNATIVE | PASS | Compare `C5_chip_borders` n=5: GH rosso / ORS blu, border ≡ stroke, active ORS-0 `bw=3px`. Single GH `C5_single_gh_borders` n=3 dopo abort compare. `C5_active_emphasis` PASS via misura pre-click + `bordActive` (click stacca il nodo; non finding runtime). |
| D ANELLO + VIA | PASS | GH/ORS senza alternatives multipoint; zero HTTP 400; chip Principale + nota «Anello vincolato…»; compare entrambe le main; zero-VIA senza nota. |
| E REGRESSIONI FIX5/FIX4/FIX1 | PASS | GH rosso / ORS blu; Tab / Add VIA / geocoder / Avoid; identity `G4_*`; warning Anello `H4_*`; Auto GH; ORS mai Auto. |
| F SELFTEST / CONSOLE / NET | PASS | 847/847; RPCF6 18/18; RPCF5 28/28; RWF1 8/8; console rel=0; zero openrouteservice.org; zero API key. |

## STOP

**QA FINALE CHATGPT — PENDING**

- **NON** QA operatore
- **NON** finito
- LIVE FRONTIER resta **220**
- GIS VPS serve il candidate **228** (`?v=c5bc4b1`)
