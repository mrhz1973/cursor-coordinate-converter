# OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5 — REVIEW PASS + deploy GIS + ABQA FAIL

**BLOCK-ID:** `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5`  
**Categoria:** DELICATO  
**CLOSURE:** `STANDARD_RUNTIME_BUNDLE`

## REVIEW GPT-SOSTITUTIVA (candidate immutabile)

| Campo | Valore |
| --- | --- |
| Candidate FULL SHA | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| Build / ID | **227** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| Monolite blob | `20c09c0c23ab338082abef3b661bb079e32559d9` |
| Bytes LF / SHA-256 LF | `10702356` / `272c645dd05e58360c643e764d6edc76a96800ee20edcf20fea91d66eb8f0b3a` |
| Verdetto | **PASS** |
| Note | loggato sul FULL SHA esatto; nessuna patch runtime in questo pass |

**REVIEW GPT-SOSTITUTIVA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5 PASS.**

## Pre-deploy — PASS

| Check | Esito |
| --- | --- |
| `git log -1 --format=%H -- "coordinate_converter Claude.html"` | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| Blob HEAD / candidate | `20c09c0c23ab338082abef3b661bb079e32559d9` |
| `APP_BUILD_NUM` / ID | **227** / `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| Helper | **0.1.3** invariato |
| Working tree HTML | pulito |

Mismatch runtime/blob/build: **nessuno**.

## Deploy GIS-only — PASS

| Campo | Valore |
| --- | --- |
| VPS `git pull --ff-only origin main` | `fffe4f2` → `f703ceeef9df016eea75048112073395f3a80e5c` (docs HEAD; monolite ≡ candidate `118dc9d`) |
| Runtime identity (candidate) | `118dc9d511c547f5032a7d0fd2f81dc65091b72a` |
| Monolite blob | `20c09c0c23ab338082abef3b661bb079e32559d9` |
| Bytes / SHA-256 HTTP | `10702356` / `272c645dd05e58360c643e764d6edc76a96800ee20edcf20fea91d66eb8f0b3a` (file↔HTTP MATCH) |
| Marker | `APP_BUILD_NUM = 227` · `OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5` |
| `goi-gis-app` | restart PID `2798649`→`2803204` |
| PIDs invariati | nav `2481045` · GH `2034035` · D-Flight `2645184` · ORS gateway `2765652` · nginx `2622063` |
| Secret / Tailscale ACL | **non** toccati |
| Helper | **0.1.3** · **non** riavviato |

**URL runtime esatto:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=118dc9d`

## Automated Browser QA — FAIL

**AUTOMATED BROWSER QA OUTDOOR-ROUTING-F-PROVIDER-COMPARE-A-FIX5 FAIL**

Viewport: desktop **1920×900** (**237/241**) · mobile **360×740** (**8/9**).  
JSON: [`2026-08-18_2112_outdoor-routing-f-provider-compare-a-fix5-abqa.json`](2026-08-18_2112_outdoor-routing-f-provider-compare-a-fix5-abqa.json).  
Screenshot: [`2026-08-18_2112_abqa_fix5_desktop_params.png`](2026-08-18_2112_abqa_fix5_desktop_params.png) · [`2026-08-18_2112_abqa_fix5_mobile_params.png`](2026-08-18_2112_abqa_fix5_mobile_params.png) · [`2026-08-18_2112_abqa_fix5_mobile.png`](2026-08-18_2112_abqa_fix5_mobile.png) · [`2026-08-18_2112_abqa_fix5_desktop.png`](2026-08-18_2112_abqa_fix5_desktop.png).  
Selftest live: **ok=true n=829 fail=0** (RPCF5 28/28 · RWF1 8/8 · RPCF4 24/24). Console desktop n=1, **0** rilevanti. Network: **0** `api.openrouteservice.org`, **0** `Authorization`. Boot: nessun POST routing prima dell’azione utente (`A_boot_no_compare_net` PASS).

### Casi A–F (esito)

| Caso | Esito | Note |
| --- | --- | --- |
| A PARAMS COMPACT | **FAIL mobile overflow** | Ordine Profilo→Percorso→Velocità→Calcola PASS; nessuna seconda copia Percorso PASS; select `flex-grow:0` / `width:max-content` PASS; wrap ordinato PASS; desktop planner `sw=cw=678` PASS. **Mobile 360×740:** `plannerOverflow=false` (`P_mobile_planner_overflow`). Chip **Anello** non visibile nello screenshot params: i tre chip Percorso non wrappano, overflow orizzontale nel body planner. Computed: profile select `184px`, speed `264px`. |
| B TRACK ↔ PLANNER | PASS | Auto-min da Track aperta; Calcola-only close → restore; commit alt → close senza restore; already-min senza ownership; restore/chiusura utente durante planner senza forza incoerente. 11/11 `B5_*`. |
| C BORDI ALTERNATIVE | PASS (compare) | `C5_chip_borders` n=5: GH-0 `#ef4444` / GH-1 `#f97316` / GH-2 `#db2777` / ORS-0 `#2563eb` / ORS-1 cyan; border-color ≡ stroke; mapping vis=5; active ORS-0 `bw=3px`. Single-provider check harness sporco (vedi sotto). |
| D ANELLO + VIA | PASS | GH/ORS payload **senza** `alternative_route` / `alternative_routes`; zero HTTP 400; main valida; chip Principale + nota «Anello vincolato… non offre alternative»; compare entrambe le main; zero-VIA senza nota impropria. Identity invariata (`G4_*` PASS). |
| E REGRESSIONI FIX4/FIX1 | PASS | ORS blu / GH rosso; alt 2-point visibili; elevation solo dopo selezione; identity; warning Anello H4; Avoid dblclick; Tab; Add VIA pick; geocoder; constrained VIA; OPSEC/forcedOffline; Auto GH; ORS mai Auto. |
| F SELFTEST / CONSOLE / NET | PASS | 829/829; RPCF5 28/28; RWF1 8/8; console rel=0; zero openrouteservice.org; zero API key. |

### Finding bloccante (riproducibile) — overflow mobile barra Percorso

**Check:** `P_mobile_planner_overflow@mobile`  
**Viewport:** `360×740`  
**URL:** `http://100.114.7.53:8000/coordinate_converter%20Claude.html?v=118dc9d`  
**Sintomo:** `#routingPlannerPanelBody.scrollWidth > clientWidth + 32`. `#routingModeGroup` contiene tre chip (`Solo andata` / `Andata e ritorno` / `Anello`) con `flex: 0 0 auto`. Su larghezza planner ~296px i chip non wrappano: screenshot mobile mostra solo i primi due; **Anello** è tagliato. Accettazione A («wrap mobile ordinato; nessun overflow») violata.

**Non è** overflow della pagina (`P_mobile_overflow` PASS, `document.scrollWidth ≤ innerWidth+8`). Desktop 1920 wrap di Velocità+Calcola sotto Profilo+Percorso è coerente col pannello 654px («Calcola sulla stessa riga quando lo spazio lo consente»).

**Riproduzione:** aprire GIS URL `?v=118dc9d` → Pianifica percorso → viewport 360×740 → ispezionare `#routingParamsRow` / `#routingPlannerPanelBody`.

Candidate **227 immutabile** — nessuna patch runtime in questo pass.

### Altri FAIL harness (non bloccanti sul prodotto)

| Check | Nota |
| --- | --- |
| `A_cta_blue` | `getComputedStyle` ora `color(srgb …) none`. FIX4 passava via `box-shadow rgb(59,130,246)`. Classe `btn-primary` invariata (`A_cta` PASS). Serializzazione Chromium / gradient; **non** regressione CTA FIX5. |
| `A5_calc_same_row_desktop` | Harness richiedeva stessa riga su `innerWidth≥900`. Il pannello è **654px**: wrap ordinato (`A5_wrap_order` PASS) è il comportamento atteso. |
| `C5_single_gh_borders` | Dopo Calcola GH-only la sessione compare era ancora live → chip ORS (bordi/stroke comunque corretti, `ok:true`). Isolamento harness, non mapping rotto (`C5_chip_borders` compare PASS). |
| `C5_active_emphasis` | Click chip re-render `innerHTML` → nodo staccato, `borderTopWidth` vuoto. Lo stesso run ha già misurato active `bw=3px` su ORS-0 in `C5_chip_borders`. |

## STOP

**AUTOMATED BROWSER QA — FAIL**

- **NON** QA operatore
- **NON** finito
- LIVE FRONTIER resta **220**
- GIS VPS serve il candidate 227 (deploy già eseguito prima dell’ABQA)
