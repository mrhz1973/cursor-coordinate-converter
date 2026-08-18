# OUTDOOR-ROUTING-ORS-PROVIDER-A — deploy GIS-only + ABQA

**BLOCK-ID:** `OUTDOOR-ROUTING-ORS-PROVIDER-A`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| Build / ID | **220** / `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| Monolite blob | `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `/ors/status` | `ready` · secret **PRESENT** · `secret_name=ORS_API_KEY` · nessun valore secret |
| HTTPS client | `https://ubuntu.tailc01234.ts.net/ors/status` raggiungibile |
| LoadCredential | drop-in attivo · secret `0600 root:root` |
| Helper | **0.1.3** invariato |
| Matrice 1–10 | **non** rieseguita (fuori scope) |

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `066feba` → `f100a5a77d5ce6c52f180c8e5a992a762cfb21dc` |
| Runtime identity (candidate approvato) | `cfee0e4c1db5b6e55b07f4eda50ce085d261f54a` |
| Monolite blob | `23fe93aae3c7c2c6f32dfdcaab90f2cc827e14a1` (identico a `cfee0e4` / `2687873`) |
| Bytes / SHA-256 HTTP | `10562488` / `67d86081e7e5b590aeff01e6fc4361cff8ef62cf55d0a8e9a8434e85ad948a4d` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 220` · `OUTDOOR-ROUTING-ORS-PROVIDER-A` |
| `goi-gis-app` | restart PID `2759608`→`2766482` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=cfee0e4`

## Automated Browser QA — PASS

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-ORS-PROVIDER-A PASS**

Viewport: desktop **1920×900** (suite A–P) · mobile **360×740** (smoke N).  
JSON compatto: [`2026-08-18_0508_outdoor-routing-ors-provider-a-abqa.json`](2026-08-18_0508_outdoor-routing-ors-provider-a-abqa.json).  
Selftest: **ok=true n=649** (RAA ORS tutti PASS).

| Caso | Esito | Note |
| --- | --- | --- |
| A BOOT / OPSEC | PASS | zero POST `/ors/` al boot; nessuna `ORS_API_KEY` in DOM/src; gateway base HTTPS Tailscale; Console n=2 non rilevanti (`127.0.0.1:8989` refused in Auto local, 400 transiente via hiking fuori rete) |
| B selezione provider | PASS | OpenRouteService visibile/selezionabile; nota «Servizio: OpenRouteService»; riga GH nascosta; profili `foot-hiking` / `foot-walking` / `cycling-mountain`; GraphHopper resta nel menu |
| C Auto GraphHopper | PASS | Auto → `vps` dopo probe local; zero URL `/ors/`; solo `8989/info` (+ helper atm09) |
| D ORS hiking | PASS | POST solo `https://ubuntu.tailc01234.ts.net/ors/v2/directions/foot-hiking/geojson`; no `Authorization`; 203 pts; distanza 4713.4 m; elevation 203; A–B (retry 2-pt dopo via 400) |
| E ORS MTB | PASS | `cycling-mountain`; route OK; zero fallback GH |
| F Alternative | PASS | alts=2; selezione indice 1 coerente |
| G Andata/Ritorno | PASS | 2 POST ORS; 405 pts; zero GH |
| H Anello | PASS | chiuso; 314 pts; 8263.5 m |
| I Aree da evitare | PASS | `avoid_polygons` su normale/alt/anello; live calc OK; toggle invalida preview; delete; nessun ghost draft |
| J Forced offline | PASS | zero POST gateway; errore «Routing bloccato: modalità offline forzata.» · `routing.errorOffline` |
| K OPSEC strict | PASS | zero POST ORS; zero GH; `routing.errorOpsec`; nessun fallback |
| L Verify provider | PASS | un GET `/ors/status` su azione esplicita; no POST; no auth header |
| M Save / preview | PASS | preview valida; `routingSaveAsTrackBtn` enabled (nessun salvataggio persistente distruttivo) |
| N Responsive | PASS | 1920×900 + 360×740; controlli ORS raggiungibili; minimize/restore Routing |
| O Regression GH | PASS | route normale VPS `:8989/route`; alternatives array presente; zero ORS |
| P Regression UI | PASS | selftest 649; RAA GIS polygons untouched; dock/legende nel selftest; nessun errore Console correlato al planner |

**Network ORS:** POST solo `https://ubuntu.tailc01234.ts.net/ors/v2/directions/{foot-hiking\|cycling-mountain}/geojson` · GET `/ors/status` solo su Verify.  
**Network GH:** Auto/info + smoke `:8989/route`.  
**Secret:** mai in browser/DOM/header.

## Gate

**QA OUTDOOR-ROUTING-ORS-PROVIDER-A PASS operatore** (2026-08-18) → **CLOSED / PASS** · Regola H finito
